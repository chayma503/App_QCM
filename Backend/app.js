const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const qcmRoutes = require("./routes/qcmRoutes");
const reponsesRoutes = require('./routes/reponsesRoutes');

const testRoutes = require('./routes/testRoutes');



const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use("/api/qcm", qcmRoutes);
app.use('/api/reponses', reponsesRoutes);
app.use('/api/tests', testRoutes);


// Pour servir les fichiers générés
const path = require('path');
app.use('/generated', express.static(path.join(__dirname, 'generated')));






module.exports = app;
