const express = require("express");
const playerRoute = require('./routes/player');
const cors = require('cors');

const app = express();

// Allow CORS
app.use(cors());

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routing
app.use('/players', playerRoute);

// Listening server on port
const port = 3000;

app.listen(port, () => {
    console.log('Server running on port:', port);
})