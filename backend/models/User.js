import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      'Please use a valid email address'
    ]
  },
  password: {
    type: String,
    required: function() {
      // Yalnız google auth olmayanlar üçün şifrə tələb olunur
      return !this.googleId;
    },
    minlength: 6,
    select: false // Sorğularda default olaraq password qayıtmasın
  },
  googleId: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String
  }
}, {
  timestamps: true
});

// Şifrə yadda saxlanmamışdan əvvəl hash-lənsin
userSchema.pre('save', async function() {
  if (!this.isModified('password') || !this.password) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Şifrənin yoxlanması üçün metod
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
