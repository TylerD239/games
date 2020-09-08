export const availablePreMoves = piece => {
        const check = (i, k) => {
            if (y + i >= 0 && x + k >= 0 && y + i < 8 && x + k < 8) moves.push({y: y + i, x: x + k})
        }
        const y = piece.position.y
        const x = piece.position.x
        const moves = []
        switch (piece.piece) {
            case 'rook':
                for (let i = 1; y + i < 8; i++) {moves.push({y: y + i, x})}
                for (let i = 1; y - i >= 0; i++) {moves.push({y: y - i, x})}
                for (let i = 1; x + i < 8; i++) {moves.push({y, x: x + i})}
                for (let i = 1; x - i >= 0; i++) {moves.push({y, x: x - i})}
                break
            case 'knight':
                check(-1, -2)
                check(-1, 2)
                check(1, -2)
                check(1, 2)
                check(-2, -1)
                check(-2, 1)
                check(2, -1)
                check(2, 1)
                break
            case 'bishop':
                for (let i = 1; y + i < 8 && x + i < 8; i++) { moves.push({y: y + i, x: x + i})}
                for (let i = 1; y - i >= 0 && x - i >= 0; i++) {moves.push({y: y - i, x: x -i})}
                for (let i = 1; y + i < 8 && x - i >= 0; i++) {moves.push({y: y + i, x: x - i})}
                for (let i = 1; y - i >= 0 && x + i < 8; i++) {moves.push({y: y - i, x: x + i})}
                break
            case 'queen':
                for (let i = 1; y + i < 8 && x + i < 8; i++) {moves.push({y: y + i, x: x + i})}
                for (let i = 1; y - i >= 0 && x - i >= 0; i++) {moves.push({y: y - i, x: x -i})}
                for (let i = 1; y + i < 8 && x - i >=  0; i++) {moves.push({y: y + i, x: x - i})}
                for (let i = 1; y - i >= 0 && x + i < 8; i++) { moves.push({y: y - i, x: x + i})}
                for (let i = 1; y + i < 8; i++) {  moves.push({y: y + i, x})}
                for (let i = 1; y - i >= 0; i++) { moves.push({y: y - i, x})}
                for (let i = 1; x + i < 8; i++) {  moves.push({y: y, x: x + i})}
                for (let i = 1; x - i >= 0; i++) {moves.push({y: y, x: x - i})}
                break
            case 'king':
                check(-1, -1)
                check(-1, 1)
                check(-1, 0)
                check(0, -1)
                check(0, 1)
                check(1, 1)
                check(1, -1)
                check(1, 0)
                break
            case 'pawn':
                if (piece.color === 'black') {
                    if (y + 1 < 8) moves.push({y: y + 1, x})
                    if (y + 2 < 8 && y === 1 ) moves.push({y: y + 2, x})
                    if (y + 1 < 8 && x + 1 < 8 ) moves.push({y: y + 1, x: x + 1})
                    if (y + 1 < 8 && x - 1 >= 0) moves.push({y: y + 1, x: x - 1})
                }
                if (piece.color === 'white') {
                    if (y - 1 >= 0 ) moves.push({y: y - 1, x})
                    if (y - 2 >= 0 && y === 6) moves.push({y: y - 2, x})
                    if (y - 1 >= 0 && x + 1 < 8) moves.push({y: y - 1, x: x + 1})
                    if (y - 1 >= 0 && x - 1 >= 0) moves.push({y: y - 1, x: x - 1})
                }
                break
            default:

                break;
        }
        return moves
    }


