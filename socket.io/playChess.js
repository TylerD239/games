const Game = require('../game')
const Game_db = require('../models/Game')
const User = require('../models/User')
const {saveGame} = require("../models/mongoFunctions");

// const availableMoves = require('../moves')
const games = []

module.exports = (play) => {


    play.on('connection', socket => {

        socket.on('ready', name => {
            const game = games.find(game => game[name])
            if (game && game.full) {
                socket.emit('game connect', game.id)
                } else {
                if (game) game.creatorSocketId = socket.id
                User.findOne({login: name}, (er, user) => socket.emit('rating', user.rating))
                socket.emit('baseGames', games)
            }

        })

        socket.on('send game', (name, rating) => {
            const game = new Game(name, rating, socket.id, 'chess', 100000)
            const gameDb = new Game_db(game)
            game._id = gameDb._id
            gameDb.save()
            games.push(game)
            play.emit('baseGames', games)
        })

        socket.on('delete game', id => {
            const game = games.find(game => game.id === id)
            if (!game) return false
            games.splice(games.indexOf(game), 1)
            play.emit('baseGames', games)
        })

        socket.on('join game', (id, name, rating) => {
            const selfGame = games.find(game => game.creator === name)
            if (selfGame) games.splice(games.indexOf(selfGame), 1)
            const game = games.find(game => game.id === id)
            if (!game) return false
            game.connect(name, rating, socket.id)
            socket.emit('game connect', id)
            play.to(game.creatorSocketId).emit('game connect', id)

        })

        socket.on('connected to game', (id, name) => {
            const game = games.find(game => game.id === id)
            if (!game) socket.emit('go away')
            else {
                socket.join(id)
                socket.emit('game', {...game, turnColor: game.turnColor, loseTime: null})
            }

        })

        socket.on('giveUp', (name, id) => {
            const game = games.find(game => game.id === id)
            if (!game) return false
            // console.log(id, game)
            clearTimeout(game.loseTime)
            game.setWinner = game.getOpponent(name)
            games.splice(games.indexOf(game), 1)
            game.loseTime = null

            // setTimeout(()=>{play.to(id).emit('endGame', game)}, 1500)
            play.to(id).emit('endGame', game)
            saveGame(game)
        })

        socket.on('move', (move, id, name) => {
            const game = games.find(game => game.id === id)
            if (!game) return false
            clearTimeout(game.loseTime)
            game.move(move)
            if (game.winner) {
                games.splice(games.indexOf(game), 1)
                game.loseTime = null
                play.to(id).emit('endGame', game)
                saveGame(game)
            } else {
                game.loseTime = setTimeout(() => {
                    game.setWinner = name
                    game[game.turnColor].time = 0
                    game.loseTime = null
                    play.to(id).emit('endGame', game)
                    games.splice(games.indexOf(game), 1)
                    saveGame(game)
                }, game[game.turnColor].time)
                // setTimeout(()=>{play.to(id).emit('game', {...game, turnColor: game.turnColor, loseTime: null})}, 1500)
                play.to(id).emit('game', {...game, turnColor: game.turnColor, loseTime: null})
            }

        })
    })
}