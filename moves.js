const pieceMoves = require('./pieceMoves')

const availableMoves = (color,game) => {
    const field = game.field
    const color2 = game.getOpponent(color)
    const allMoves = {}

    game[color2].check = false
    game.check = null
    game[color].check = game[color2].pieces
        .some(el => pieceMoves({x: el.position.x, y: el.position.y}, field, color2)
            .some(move => move.ate.piece === 'king'));
    if (game[color].check)  {
        const king = game[color].pieces.find(piece => piece.piece === 'king')
        game.check = {y: king.position.y, x: king.position.x}
    }
    // console.log('==========================================')
    game[color].pieces.forEach( el => {

            const moves = pieceMoves({x: el.position.x, y:el.position.y}, field, color)

            // console.log(moves)
            const moves2 = moves.filter(move => {

                const field1 = JSON.parse(JSON.stringify(field))

                field1[move.y][move.x] = field1[el.position.y][el.position.x]
                field1[move.y][move.x].position = {x: move.x, y: move.y}
                field1[el.position.y][el.position.x] = 0

                return !game[color2].pieces
                    .filter(piece => piece !== move.ate)
                    .some(el => pieceMoves({x: el.position.x, y: el.position.y}, field1, color2)
                        .some(move => move.ate.piece === 'king'))
                })

            if (el.piece === 'king' && game[color].castling && !game[color].check) {
                let shortCastling = true
                let longCastling = true
                const line = color === 'white' ? 7 : 0

                if (field[line][5] || field[line][6]) shortCastling = false
                if (field[line][2] || field[line][3]) longCastling = false

                if (shortCastling || longCastling) {
                    game[color2].pieces.forEach(el => {

                        const moves = pieceMoves({x: el.position.x, y: el.position.y}, field, color2)

                        moves.forEach(move => {

                            if (move.y === line && move.x === 5) shortCastling = false
                            if (move.y === line && move.x === 6) shortCastling = false
                            if (move.y === line && move.x === 2) longCastling = false
                            if (move.y === line && move.x === 3) longCastling = false
                        })


                    })
                }
                if (shortCastling) moves2.push({y:line, x: 6, ate: false, castling: true})
                if (longCastling) moves2.push({y:line, x: 2, ate: false, castling: true})
            }

            if (moves2.length) allMoves[el.id] = moves2
    })

    if (Object.keys(allMoves).length === 0) {
        if (game[color].check) game.setWinner = game.getOpponent(game[color].name)
        else game.setWinner ='draw'
    } else return allMoves


}


module.exports = availableMoves