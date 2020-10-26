const pieceMoves = require('./pieceMoves')

const availableMoves = (color, game) => {
    const field = game.field
    const color2 = game.getOpponent(color)
    const allMoves = {}

    /////Проверка шаха
    game[color2].check = false
    game.check = null
    game[color].check = game[color2].pieces
        .some(el => pieceMoves({x: el.position.x, y: el.position.y}, field, color2)
            .some(move => move.ate.piece === 'king'));
    if (game[color].check)  {
        const king = game[color].pieces.find(piece => piece.piece === 'king')
        game.check = {y: king.position.y, x: king.position.x}
    }

    //////Доступные ходы
    game[color].pieces.forEach( el => {

        let moves = pieceMoves({x: el.position.x, y:el.position.y}, field, color)

        if (game.moves.length) {

            //////Взятие на проходе

            if (color === 'white') {
                if (el.piece === 'pawn' && el.position.y === 3) {
                    const lastMove = game.moves[game.moves.length - 1]
                    if (lastMove.piece.piece === 'pawn' && lastMove.to.y - lastMove.piece.position.y === 2) {
                        if (lastMove.to.x === el.position.x + 1 || lastMove.to.x === el.position.x - 1) {
                            moves.push({y: 2, x: lastMove.to.x, ate: game.field[3][lastMove.to.x], enPassant: true})
                        }
                    }
                }
            }
            if (color === 'black') {
                if (el.piece === 'pawn' && el.position.y === 4) {
                    const lastMove = game.moves[game.moves.length - 1]
                    if (lastMove.piece.piece === 'pawn' && lastMove.to.y - lastMove.piece.position.y === -2) {
                        if (lastMove.to.x === el.position.x + 1 || lastMove.to.x === el.position.x - 1) {
                            moves.push({y: 5, x: lastMove.to.x, ate: game.field[4][lastMove.to.x], enPassant: true})
                        }
                    }
                }
            }

            moves = moves.filter(move => {
                const field1 = JSON.parse(JSON.stringify(field))
                field1[move.y][move.x] = field1[el.position.y][el.position.x]
                field1[move.y][move.x].position = {x: move.x, y: move.y}
                field1[el.position.y][el.position.x] = 0
                return !game[color2].pieces
                    .filter(piece => piece !== move.ate)
                    .some(el => pieceMoves({x: el.position.x, y: el.position.y}, field1, color2)
                        .some(move => move.ate.piece === 'king'))
            })

            /////Рокировка
            if (el.piece === 'king' && !game[color].check && (game[color].shortCastling || game[color].longCastling)) {
                let shortCastling = game[color].shortCastling
                let longCastling = game[color].longCastling
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
                if (shortCastling) moves.push({y: line, x: 6, ate: false, castling: true})
                if (longCastling) moves.push({y: line, x: 2, ate: false, castling: true})
            }



        }
            if (moves.length) allMoves[el.id] = moves
    })

    if (Object.keys(allMoves).length === 0) {
        if (game[color].check) game.setWinner = game.getOpponent(game[color].name)
        else game.setWinner ='draw'
    } else return allMoves
}
module.exports = availableMoves