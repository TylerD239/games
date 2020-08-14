const Game = require('../game')
const checkWinner = require('../cross')
const Game_db = require('../models/Game')
const availableGames = []
const activeGames = []
const endedGames = []
const games = []

let totalAmount = endedGames.length

module.exports = (play) => {

    play.on('connection', function (socket) {

        socket.on('ready', function (name) {
            const game = games.find((game) => (game.creator === name || game.player === name))

            if (game && game.full) {

                game.socketsId.push(socket.id)

                socket.join(game._id.toString())

                socket.emit('game connect', game._id)

            } else {
                socket.emit('baseGames', games)
            }

        })

        socket.on('send game', function (name) {
            const game = new Game(name, socket.id, 'cross')
            const gameDb = new Game_db(game)
            game._id = gameDb._id
            gameDb.save()
            games.push(game)
            play.emit('baseGames', games)
        })

        socket.on('delete game', function (id) {
            games.splice(games.findIndex(game => game._id == id), 1)
            play.emit('baseGames', games)
        })

        socket.on('join game', function ({id, name}) {
            const game = games.find((game) => (game._id == id))
            game.connect(name, socket.id)

            socket.emit('game connect', game._id)
            play.to(game.creatorSocketId).emit('game connect', game._id)

        })




        socket.on('connected to game', (name) => {
            const game = games.find((game) => (game.creator === name || game.player === name))
            // game.field = new Array(9).fill(0)
            const room = game._id.toString()
            socket.join(room)
            // console.log(game)
            // const room = game._id.toString()
            // if (!game) {
            //     socket.emit('go away')
            // } else {
                game.field.forEach((el, i) => {
                    if (el === 1) play.to(socket.id).emit('draw', {cell: i, type: 'cross'})
                    if (el === -1) play.to(socket.id).emit('draw', {cell: i, type: 'nought'})
                })
            //     socket.join(room)
                // socket.join('hi')
                // console.log(play.adapter.rooms)
                play.to(room).emit('game info', game._id)
            // }
        })

        socket.on('exit', ({name, gameId}) => {
            // const game = games.find(game => game._id == gameId)
            games.splice(games.findIndex(game => game._id == gameId), 1)
            play.to(gameId.toString()).emit('go away')
        })

        socket.on('click', ({cell, name, gameId}) => {
            const game = games.find(game => game._id == gameId)
            const room = gameId.toString()
            if (game.field[cell]) return

            if (name === game.creator && game.turn % 2 === 1) {
                game.field[cell] = 1
                game.turn++
                play.to(room).emit('draw', {cell, type: 'cross'})

            } else if (name === game.player && game.turn % 2 === 0) {
                game.field[cell] = -1
                game.turn++
                play.to(room).emit('draw', {cell, type: 'nought'})
            }
            const winner = checkWinner(game.field)
            if (winner) {
                game.winner = winner
                play.to(room).emit('winner', winner)
            }

        })

    })
}