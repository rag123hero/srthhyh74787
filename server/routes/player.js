const express = require('express');
const mongodb = require('mongodb');
require('dotenv/config');

const router = express.Router();

// Get players data
router.get('/', async(req, res) => {

    const playersData = await loadPlayerCollection();
    res.send(await playersData.find({}).toArray());

});

// Add players data
router.post('/', async (req, res) => {

    const players = await loadPlayerCollection();

    await players.insertOne({
        name: req.body.name,
        score: req.body.score,
        createdDate: new Date()
    });

    res.status(201).send();

});

// Connect to db
async function loadPlayerCollection() {

    const client = await mongodb.MongoClient.connect(process.env.DB_CRED, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    return client.db('blaster').collection('players');

}

//Export
module.exports = router;