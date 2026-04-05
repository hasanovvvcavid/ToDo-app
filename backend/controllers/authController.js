import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';

// Google Client-in qurulması
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// JWT Token yaratmaq üçün köməkçi funksiya
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    İstifadəçinin qeydiyyatdan keçməsi
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      if (!userExists.password && userExists.googleId) {
        return res.status(400).json({ message: 'Bu e-poçt artıq Google ilə qeydiyyatdan keçib.' });
      }
      return res.status(400).json({ message: 'İstifadəçi artıq mövcuddur' });
    }

    // Təsdiqləmə tokeninin yaradılması
    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
      isVerified: false
    });

    if (user) {
      // Təsdiqləmə URL-si
      // QEYD: Əgər linki birbaşa frontendlə idarə edəcəksinizsə FRONTEND_URL istifadə edin.
      const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${verificationToken}`;

      const message = `
        <h2>Hesabınızı təsdiqləyin</h2>
        <p>Aşağıdakı linkə klikləyərək ToDo tətbiqindəki hesabınızı təsdiq edin:</p>
        <a href="${verifyUrl}" clicktracking=off>${verifyUrl}</a>
      `;

      try {
        await sendEmail({
          email: user.email,
          subject: 'Hesabın Təsdiqlənməsi',
          html: message
        });

        res.status(201).json({
          message: 'Qeydiyyat uğurludur. Təsdiq üçün e-poçtunuza baxın.'
        });
      } catch (error) {
        console.error('Mail Göndərilmədi:', error);
        user.verificationToken = undefined;
        await user.save();
        return res.status(500).json({ message: 'E-poçt göndərilə bilmədi' });
      }
    } else {
      res.status(400).json({ message: 'Eksik və ya səhv məlumatlar' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Email Təsdiqi
// @route   GET /api/auth/verify/:token
export const verifyEmail = async (req, res) => {
  try {
    const verificationToken = req.params.token;

    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(400).json({ message: 'Yanlış və ya istifadə edilmiş təsdiq tokeni' });
    }

    // İstifadəçini təsdiqlə
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // Frontend-ə yönləndirmək yerinə json da qaytara bilərsiniz
    // Əgər anasəhifəyə qaytarmaq istəyirsinizsə:
    // res.redirect('http://localhost:5173/login?verified=true');
    res.json({ message: 'E-poçt uğurla təsdiqləndi! İndi daxil ola bilərsiniz.' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    İstifadəçinin daxil olması (Login)
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Şifrəni də select etmək lazımdır çünki yuxarıda {select: false} etmişdik
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Belə bir e-poçt tapılmadı' });
    }

    if (user.googleId && !user.password) {
      return res.status(401).json({ message: 'Siz Google vasitəsilə qeydiyyatdan keçmisiniz. Zəhmət olmasa "Google ilə daxil ol" düyməsini sıxın.' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Zəhmət olmasa e-poçtunuzu təsdiqləyin' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Şifrə yanlışdır' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Google ilə Login / Register
export const googleAuth = async (req, res) => {
  const { idToken } = req.body; // Bu indi həm idToken, həm də access_token ola bilər

  try {
    let email, name, googleId;
    console.log('Gələn Google Token:', idToken.substring(0, 20) + '...');

    // 1. Token-in növünü yoxlayaq (JWT-dirsə idToken-dir)
    if (idToken.startsWith('eyJ')) {
      console.log('Növ: idToken (JWT)');
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      const payload = ticket.getPayload();
      email = payload.email;
      name = payload.name;
      googleId = payload.sub;
    } else {
      console.log('Növ: access_token');
      // access_token-dirsə Google API-dən məlumatları alaq
      const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${idToken}`);
      const data = await response.json();
      
      console.log('Google API-dən gələn cavab:', data);

      if (!data.email) {
        console.error('Google API email qaytarmadı:', data);
        return res.status(401).json({ message: 'Google ilə giriş uğursuz oldu' });
      }
      
      email = data.email;
      name = data.name;
      googleId = data.sub;
    }

    // 2. İstifadəçi bazada varmı?
    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerified = true;
        await user.save();
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        isVerified: true
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    console.error('Google Auth xətası:', error);
    res.status(401).json({ message: 'Google ilə giriş uğursuz oldu' });
  }
};
