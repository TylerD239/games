const createField = require('./createChessField')
const availableMoves = require('./moves')

class Game {
    constructor(name, rating, creatorSocketId, type, settings) {
        this.colorFormat = settings.color
        this[name] = {rating}
        this.timeFormat = settings.min * 60000
        this.addTime = settings.sec
        this.type = type
        this.creator = name
        this.time = Date.now()
        this.creatorSocketId = creatorSocketId
        this.full = false
        this.moves = []
        this.white = {
            time: this.timeFormat,
            eaten: [],
            castling : true,
            pieces : [],
            moves: []
        }
        this.black = {
            time: this.timeFormat,
            eaten: [],
            castling : true,
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

        this[color].time -= Date.now() - this.lastTime
        this.lastTime = Date.now()

        // console.log(move)
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


        if (move.to.castling) {
            if (move.to.x === 6) {
                this.field[move.piece.position.y][5] = this.field[move.piece.position.y][7]
                this.field[move.piece.position.y][5].position.x = 5
                this.field[move.piece.position.y][7] = 0

            }
            else if (move.to.x === 2) {
                this.field[move.piece.position.y][3] = this.field[move.piece.position.y][0]
                this.field[move.piece.position.y][3].position.x = 3
                this.field[move.piece.position.y][0] = 0
            }
            this[color].castling = false
        }

        if (move.piece.piece === 'king' || move.piece.piece === 'rook' ) this[color].castling = false
        this.moves.push(move)
        this[color].moves.push(move)
        this.turn++
        this[color].time += this.addTime * 1000
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
        this.lastTime = Date.now()
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