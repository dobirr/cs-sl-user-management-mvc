import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

dotenv.config();
const { MONGO_URI } = process.env;

const app = express();


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


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port' ${PORT})`);
  console.log(`http://localhost:${PORT}`);
  console.log('================================');
})
