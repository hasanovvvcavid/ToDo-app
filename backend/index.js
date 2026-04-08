import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';

dotenv.config();

// Env dəyişənlərini yoxlayaq (Debug üçün)
console.log('--- Env Check ---');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'YÜKLƏNDİ' : 'YÜKLƏNMƏDİ');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'YÜKLƏNDİ' : 'YÜKLƏNMƏDİ');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'YÜKLƏNDİ' : 'YÜKLƏNMƏDİ');
console.log('-----------------');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true
}));



app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
