const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');

const testJwtRouter = require('./controllers/test-jwt')
const authRouter = require('./controllers/auth')
const userRouter = require('./controllers/users')
const moviesRouter = require('./controllers/movies')

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors({ origin: process.env.FRONTEND_URI }));
app.options("*", cors());
app.use(express.json());
app.use(logger('dev'));

// Routes go here
app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/movies', moviesRouter)
app.use('/test-jwt', testJwtRouter)


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`The express app is ready on port ${PORT}!`);
});
