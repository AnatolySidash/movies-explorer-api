require('dotenv').config();
const express = require('express');

const { PORT = 4000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
// const { limiter } = require('./middlewares/rateLimiter');

const app = express();
const { requestLogger, errorLogger } = require('./middlewares/logger');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const signinRouter = require('./routes/signin');
const signupRouter = require('./routes/signup');
const signoutRouter = require('./routes/signout');
const { errorHandler } = require('./middlewares/errorHandler');
const { auth } = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-error');

app.use(cors({
  origin: ['http://localhost:3000', 'http://movies.sidash.nomoredomainsicu.ru', 'https://movies.sidash.nomoredomainsicu.ru'],
  credentials: true,
  maxAge: 30,
}));

app.use(helmet());
// app.use(limiter);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use('/users', auth, userRouter);
app.use('/movies', auth, movieRouter);
app.use('/signup', signupRouter);
app.use('/signin', signinRouter);
app.use('/signout', signoutRouter);

app.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница по указанному маршруту не найдена'));
});

app.use(errorLogger);

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Приложение запущено на порте ${PORT}`);
});
