const User = require('../models/User')
const Game = require('../models/Game')
const jwt = require("jsonwebtoken")
const config = require('config')

const getGames = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const verify = jwt.verify(token, config.get('jwtSecret'))
        const user = await User.findById(verify.userId)
        const games = await Game.find({'_id': {$in: user.games}})
        res.json(games)
    } catch (e) {res.status(401).json({message: 'no authorization'})}
}
module.exports = getGames