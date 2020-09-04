const createField = () => {
    const field = new Array(8)
    for (let i = 8; i--;) field[i] = new Array(8).fill(0)

    let id = 0

    const Piece = function (player, piece, position) {
        this.color = player
        this.piece = piece
        this.position = position
        this.id = id++

    }
    const pieces = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook', 'pawn']

    for (let i = 0; i < 8; i++) {
        field[0][i] = new Piece('black', pieces[i], {x: i, y: 0})
        field[1][i] = new Piece('black', pieces[8], {x: i, y: 1})

        field[7][i] = new Piece('white', pieces[i], {x: i, y: 7})
        field[6][i] = new Piece('white', pieces[8], {x: i, y: 6})

    }

    return field
}
<<<<<<< Updated upstream
module.exports = createField
=======
module.exports = createField
>>>>>>> Stashed changes
