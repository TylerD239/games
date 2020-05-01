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
                if (name === game.creator || name === game.player) game.socketsId.push(socket.id)

                socket.join(game.id.toString())

                socket.emit('game connect', game.id)

            } else {
                socket.emit('baseGames', games)
            }

        })

        socket.on('send game', function (name) {
            const game = new Game(name, games.length, socket.id)
            games.push(game)
            play.emit('baseGames', games)

        })

        socket.on('join game', function ({id, name}) {
            const game = games.find((game) => (game.id === id))
            const creatorId = game.creatorSocketId

            game.connect(name, socket.id)

            play.to(creatorId).emit('game connect', game.id)


        })


        socket.on('delete game', function (id) {
            games.splice(games.indexOf(games.find((game) => game.id === id)), 1)
            play.emit('baseGames', games)
        })

        socket.on('connected to game', (name) => {
            const game = games.find((game) => (game.creator === name || game.player === name))
            if (!game) {
                socket.emit('go away')
            } else {
                game.field.forEach((el, i) => {
                    if (el === 1) play.to(socket.id).emit('draw', {cell: i, type: 'cross'})
                    if (el === -1) play.to(socket.id).emit('draw', {cell: i, type: 'nought'})
                })
                socket.join(game.id)
                socket.join('hi')
                // console.log(play.adapter.rooms)
                play.to(game.id).emit('game info', game.id)
            }
        })

        socket.on('exit', ({name, gameId}) => {
            const game = games.find(game => game.id === gameId)
            games.splice(games.indexOf(game), 1)
            play.to(gameId).emit('go away')
        })
        socket.on('click', ({cell, id, name}) => {
            const game = games.find((game) => (game.id === id))
            const room = id.toString()
            console.log(cell, id, name)
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
                //////////
                const g = new Game_db(game)
                g.save()
                //////////
                play.to(room).emit('winner', winner)
            }

        })

    })
}