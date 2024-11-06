const Player = require('../models/Player');
const User = require('../models/User');

const getPlayers = async (req, res) => {
    console.log('getPlayers function invoked');
    try {
        const players = await Player.find({ user: req.userId }, 'name');
        res.setHeader('Content-Type', 'application/json');
        res.json(players);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const addPlayer = async (req, res) => {
    console.log('addPlayer function invoked');
    try {
        const { name } = req.body;

        const newPlayer = new Player({
            name,
            user: req.userId
        });

        const savedPlayer = await newPlayer.save();

        await User.findByIdAndUpdate(
            req.userId,
            { $push: { players: savedPlayer._id } },
            { new: true }
        );

        res.status(201).json(savedPlayer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getPlayerById = async (req, res) => {
    console.log('getPlayerById function invoked');
    try {
        const player = await Player.findById(req.params.playerId);
        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }
        res.setHeader('Content-Type', 'application/json');
        res.json(player);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { getPlayers, addPlayer, getPlayerById };