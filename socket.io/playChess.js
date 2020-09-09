const Game = require('../game')
const Game_db = require('../models/Game')
const User = require('../models/User')
const {saveGame} = require("../models/mongoFunctions");

// const availableMoves = require('../moves')
const games = []
const loseTimers = {}
const playersInLobby = {}

module.exports = (play) => {


    play.on('connection', socket => {

        socket.on('disconnect', () => {
            delete playersInLobby[socket.id]
            play.emit('playersInLobby', Object.values(playersInLobby))

        })

        socket.on('ready', name => {
            User.find({}, (err, users)=>{
                if (err) console.log(err)
                socket.emit('leaders', users.map(user => ({name:user.login, rating:user.rating})))
            }).sort({rating: -1})
                .limit(10)
            playersInLobby[socket.id] = name
            play.emit('playersInLobby', [...new Set(Object.values(playersInLobby))])
            const game = games.find(game => game[name])
            if (game && game.full) {
                socket.emit('game connect', game.id)
                } else {
                if (game) game.creatorSocketId = socket.id
                User.findOne({login: name}, (err, user) => {
                    if (err) console.log(err)
                    else socket.emit('rating', user.rating)
                })
                socket.emit('baseGames', games)

            }

        })

        socket.on('send game', (name, rating, settings) => {
            const game = new Game(name, rating, socket.id, 'chess', settings)
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
            const game = games.find(game => game.id === id)
            if (!game || game.full) return false
            const selfGame = games.find(game => game.creator === name)
            if (selfGame) games.splice(games.indexOf(selfGame), 1)
            game.connect(name, rating)
            socket.emit('game connect', id)
            play.to(game.creatorSocketId).emit('game connect', id)
            play.emit('baseGames', games)
        })

        socket.on('connected to game', (id, name) => {
            console.log(id,name)
            const game = games.find(game => game.id === id)
            if (!game) socket.emit('go away')
            else if (game.creator !== name && game.player !== name) socket.emit('go away')
            else {

                socket.join(id)
                socket.emit('game', {...game, turnColor: game.turnColor}, true)
            }

        })

        socket.on('giveUp', (name, id) => {
            const game = games.find(game => game.id === id)
            if (!game) return false
            clearTimeout(loseTimers[id])
            delete loseTimers[id]
            game.setWinner = game.getOpponent(name)
            games.splice(games.indexOf(game), 1)
            play.to(id).emit('endGame', game)
            play.emit('baseGames', games)
            saveGame(game)

        })
        socket.on('cancel', id => {
            const game = games.find(game => game.id === id)
            if (!game) return false
            if (game.moves.length !== 0) return false

            game.setWinner = 'cancel'
            games.splice(games.indexOf(game), 1)
            play.to(id).emit('endGame', game)
            play.emit('baseGames', games)
            saveGame(game)

        })

        socket.on('move', (move, id, name) => {
            const game = games.find(game => game.id === id)
            if (!game) return false
            clearTimeout(loseTimers[id])
            game.move(move)
            if (game.winner) {
                delete loseTimers[id]
                games.splice(games.indexOf(game), 1)
                play.to(id).emit('endGame', game)
                play.emit('baseGames', games)
                saveGame(game)
            } else {
                loseTimers[id] = setTimeout(() => {
                // game.loseTime = setTimeout(() => {
                    delete loseTimers[id]
                    game.setWinner = name
                    game[game.turnColor].time = 0
                    play.to(id).emit('endGame', game)
                    games.splice(games.indexOf(game), 1)
                    play.emit('baseGames', games)
                    saveGame(game)
                }, game[game.turnColor].time)
                play.to(id).emit('game', {...game, turnColor: game.turnColor})
            }

        })

        socket.on('message',(text,name,id) => {
            const game = games.find(game => game.id === id)
            if (!game) return false
            const message = {author: name, text}
            game.messages.push(message)
            play.to(id).emit("new message", message)
        })
        socket.on('connected to chat', id => {
            const game = games.find(game => game.id === id)
            if (!game) return false
            if (game.messages.length) socket.emit("prev message", game.messages)

        })

    })
}