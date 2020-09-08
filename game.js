const createField = require('./createChessField')
const availableMoves = require('./moves')

class Game {
    constructor(name, rating, creatorSocketId, type, settings) {
        this.messages = []
        this.colorFormat = settings.color
        this[name] = {rating}
        this.timeFormat = settings.min * 60000
        this.addTime = settings.sec * 1000
        this.type = type
        this.creator = name
        this.time = Date.now()
        this.creatorSocketId = creatorSocketId
        this.full = false
        this.moves = []
        this.white = {
            time: this.timeFormat,
            eaten: [],
            longCastling : true,
            shortCastling : true,
            pieces : [],
            moves: []
        }
        this.black = {
            time: this.timeFormat,
            eaten: [],
            longCastling : true,
            shortCastling : true,
            pieces : [],
            moves: []
        }
    }

    get id() {
        return this._id.toString()
    }


    set setWinner (val) {
        this.winner = val
    }

    getOpponent(value) {
        if (value === 'white') return 'black'
        if (value === 'black') return 'white'
        if (value === this.creator) return this.player
        if (value === this.player) return this.creator
    }



    get turnColor() {
        return this.turn % 2 === 0 ? 'black' : 'white'
    }

    move(move) {

        const color = move.piece.color
        const color2 = color === 'white' ? 'black' : 'white'

        if (this.moves.length) {
            if (!move.pre) this[color].time -= Date.now() - this.lastTime
            this[color].time += this.addTime
        }
        this.lastTime = Date.now()

        if (move.piece.piece === 'pawn' && (move.to.y === 0 || move.to.y === 7)) {
            this[color].pieces.find(piece => piece.id === move.piece.id).piece = 'queen'
        }

        if (move.to.ate) {
            const eatenPiece = this.field[move.to.y][move.to.x]
            this[color].eaten.push(eatenPiece)
            this[color2].pieces.splice(this[color2].pieces.findIndex(piece => piece === eatenPiece), 1)
        }
        this.field[move.to.y][move.to.x] = this.field[move.piece.position.y][move.piece.position.x]
        this.field[move.to.y][move.to.x].position = {x:move.to.x, y:move.to.y}
        this.field[move.piece.position.y][move.piece.position.x] = 0

        const line = color === 'white' ? 7 : 0

        if (move.to.castling) {
            if (move.to.x === 6) {
                this.field[line][5] = this.field[line][7]
                this.field[line][5].position.x = 5
                this.field[line][7] = 0
            }
            else if (move.to.x === 2) {
                this.field[line][3] = this.field[line][0]
                this.field[line][3].position.x = 3
                this.field[line][0] = 0
            }
        }
        if (move.piece.piece === 'king') {
            this[color].longCastling = false
            this[color].shortCastling = false

        }

        if (move.piece.piece === 'rook' && move.piece.position.x === 7 && move.piece.position.y === line) this[color].shortCastling = false
        if (move.piece.piece === 'rook' && move.piece.position.x === 1 && move.piece.position.y === line) this[color].shortCastling = false

        this.moves.push(move)
        this[color].moves.push(move)
        this.turn++
        this.availableMoves = availableMoves(this.turnColor, this)

    }
    connect(name, rating) {
        if (this.colorFormat === 'random') {
            if ( Math.random() > 0.5) {
                this[this.creator].color = 'white'
                this[name] = {
                    color: 'black',
                    rating
                }
                this.white.name = this.creator
                this.black.name = this.player

            } else {
                this[this.creator].color = 'black'
                this[name] = {
                    color: 'white',
                    rating
                }
                this.white.name = this.player
                this.black.name = this.creator
            }
        } else {
            this[this.creator].color = this.colorFormat
            this[name] = {
                color: this.getOpponent(this.colorFormat),
                rating
            }
            this[this.colorFormat].name = this.creator
            this[this.getOpponent(this.colorFormat)].name = this.player
        }
        // this.lastTime = Date.now()
        this.full = true
        this.player = name
        this.turn = 1


        this.time = Date.now()

        this.field = createField()
        this.field.forEach(el => el.forEach(piece => {if (piece) this[piece.color].pieces.push(piece)}))
        this.availableMoves = availableMoves('white', this)
    }
}

module.exports = Game