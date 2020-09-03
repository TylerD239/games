const createField = require('./createChessField')
const availableMoves = require('./moves')

class Game {
    constructor(name, rating, creatorSocketId, type, time) {
        this[name] = {rating}
        this.timeFormat = time
        this.white.time = time
        this.black.time = time
        this.type = type
        this.creator = name
        this.time = Date.now()
        this.creatorSocketId = creatorSocketId
    }

    get id() {
        return this._id.toString()
    }

    full = false
    moves = []
    set setWinner (val) {
        this.winner = val
    }

    getOpponent(value) {
        if (value === 'white') return 'black'
        if (value === 'black') return 'white'
        if (value === this.creator) return this.player
        if (value === this.player) return this.creator
    }

    white = {
        eaten: [],
        castling : true,
        pieces : [],
        moves: []
    }

    black = {
        eaten: [],
        castling : true,
        pieces : [],
        moves: []
    }

    get turnColor() {
        return this.turn % 2 === 0 ? 'black' : 'white'
    }

    move(move) {

        const color = move.piece.color
        const color2 = color === 'white' ? 'black' : 'white'



        this[color].time -= Date.now() - this.lastTime
        this.lastTime = Date.now()

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
        this.availableMoves = availableMoves(this.turnColor, this)

    }
    connect(name, rating) {
        this.lastTime = Date.now()
        this.full = true
        this.player = name
        this.turn = 1
        this[name] = {
            color: 'black',
            rating
        }
        this[this.creator].color = 'white'
        this.white.name = this.creator
        this.black.name = this.player
        this.field = createField()
        this.field.forEach(el => el.forEach(piece => {if (piece) this[piece.color].pieces.push(piece)}))
        this.availableMoves = availableMoves('white', this)
    }
}

module.exports = Game