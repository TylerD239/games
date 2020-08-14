const Game = require('../game')
const Game_db = require('../models/Game')

const availableMoves = require('../moves')
const games = []

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
            const game = new Game(name, socket.id, 'chess')
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

            if (game.field.length === 0) {


                game.whiteTime = 180000
                game.blackTime = 180000
                game.timer = setInterval(()=> {

                    game.turn % 2 === 1 ? game.whiteTime -= 1000 : game.blackTime -= 1000
                }, 1000)
                // game.lastTime = Date.now()

                const field = new Array(8)
                for (let i = 8;i--;) field[i] = new Array(8).fill(0)

                let id = 0

                const Piece = function (player, piece, position) {
                    this.player = player
                    this.piece = piece
                    this.position = position
                    this.id = id++
                    // this.image = new Image()
                    // this.image.src = `pieces/${player}_${piece}.png`
                }
                const pieces = ['rook','knight','bishop','queen','king','bishop','knight','rook','pawn']

                for (let i = 0; i < 8; i++){
                    field[0][i] = new Piece('black', pieces[i], {x: i, y: 0})
                    field[1][i] = new Piece('black', pieces[8], {x: i, y: 1})
                    field[7][i] = new Piece('white', pieces[i], {x: i, y: 7})
                    field[6][i] = new Piece('white', pieces[8], {x: i, y: 6})
                }
                game.field = field
            }

            const color = name === game.creator ? 'white' : 'black'

            const room = game._id.toString()
            socket.join(room)
            socket.emit('game info', game._id, color)
            const moves = availableMoves(color, game.field)
            // console.log(moves)
            socket.emit('field', game.field, game.turn, moves, {wt: game.whiteTime, bt: game.blackTime})
            // play.to(room).emit('game info', game._id)
            // play.to(room).emit('field', game.field, 'white')

        })

        socket.on('exit', ({name, gameId}) => {
            games.splice(games.findIndex(game => game._id == gameId), 1)
            play.to(gameId.toString()).emit('go away')
        })

        socket.on('move', (move, gameId, name) => {
            const game = games.find(game => game._id == gameId)
            // const room = gameId.toString()
            // const time = Math.floor((Date.now() - game.lastTime) / 1000)

            // game.turn % 2 === 1 ?


            game.field[move.to.y][move.to.x] = game.field[move.from.y][move.from.x]
            game.field[move.to.y][move.to.x].position = {x:move.to.x, y:move.to.y}
            game.field[move.from.y][move.from.x] = 0


            play.to(gameId.toString()).emit('field', game.field, ++game.turn, availableMoves(game.turn % 2 === 1 ? 'white' : 'black', game.field), {wt: game.whiteTime, bt: game.blackTime})

        })
    })
}