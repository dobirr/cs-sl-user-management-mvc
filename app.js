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

// Logging Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.redirect('/users');
});

// 404 Handler
app.use((req, res) => {
  res.status(404).send(`
  <h1>404 Not Found</h1><p>The page you are looking for does not exist</p><a href="/users">Go to Users</a>`);
});


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  console.log('================================');

  // Available Routes
  console.log('Available Routes:');
  console.log(`GET http://localhost:${PORT}/users - List all users`);
  console.log(`GET http://localhost:${PORT}/users/new - Form to create a new user`);
  console.log(`POST http://localhost:${PORT}/users - Create a new user`);
  console.log(`GET http://localhost:${PORT}/users/:id - View user details`);
  console.log(`GET http://localhost:${PORT}/users/:id/edit - Form to edit user`);
  console.log(`POST http://localhost:${PORT}/users/:id - Update user`);
  console.log(`POST http://localhost:${PORT}/users/:id/delete - Delete user`);
});
