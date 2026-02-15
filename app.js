import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import './models/user.model.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();
const { MONGO_URI } = process.env;

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// MONGODB connection
const MongoURI = MONGO_URI;
mongoose.connect(MongoURI)
  .then(() => {
    console.log('MongoDB connected');
    console.log('Database: ', mongoose.connection.name);
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB', err);
    process.exit(1);
  });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('/users');
});

app.use('/users', userRoutes);


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  console.log('================================');
});
