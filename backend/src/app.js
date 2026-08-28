const express = require('express');
const cors = require('cors');
const studentRoutes = require('./modules/student/studentRoutes');
const reportRoutes = require('./modules/report/reportRoutes');
const seedRoutes = require('./modules/seed/seedRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/students', studentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/seed', seedRoutes);


app.use(errorHandler);

module.exports = app;
