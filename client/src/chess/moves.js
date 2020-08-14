const availableMoves = (cell, field) => {
    const check = (i, k) => {
        if (y + i >= 0 && x + k >= 0 && y + i < 8 && x + k < 8) {
            if (!field[y + i][x + k]) {
                moves.push({y: y + i, x: x + k, ate: false})
            } else if (field[y + i][x + k].player !== player) {
                moves.push({y: y + i, x: x + k, ate: field[y + i][x + k].piece})
            }
        }
    }
    const y = cell.y
    const x = cell.x
    const player = field[y][x].player
    const moves = []
    switch (field[y][x].piece) {
        case 'rook':
            for (let i = 1; y + i < 8; i++) {
                if (!field[y + i][x]) {
                    moves.push({y: y + i, x, ate: false})
                } else if (field[y + i][x].player === player) {
                    break
                } else {
                    moves.push({y: y + i, x, ate: field[y + i][x].piece})
                    break
                }
            }
            for (let i = 1; y - i >= 0; i++) {
                if (!field[y - i][x]) {
                    moves.push({y: y - i, x, ate: false})
                } else if (field[y - i][x].player === player) {
                    break
                } else {
                    moves.push({y: y - i, x, ate: field[y - i][x].piece})
                    break
                }
            }
            for (let i = 1; x + i < 8; i++) {
                if (!field[y][x + i]) {
                    moves.push({y: y, x: x + i, ate: false})
                } else if (field[y][x + i].player === player) {
                    break
                } else {
                    moves.push({y, x: x + i, ate: field[y][x + i].piece})
                    break
                }
            }
            for (let i = 1; x - i >= 0; i++) {
                if (!field[y][x - i]) {
                    moves.push({y: y, x: x - i, ate: false})
                } else if (field[y][x - i].player === player) {
                    break
                } else {
                    moves.push({y, x: x - i, ate: field[y][x - i].piece})
                    break
                }
            }
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
            for (let i = 1; y + i < 8 && x + i < 8; i++) {
                if (!field[y + i][x + i]) {
                    moves.push({y: y + i, x: x + i, ate: false})
                } else if (field[y + i][x + i].player === player) {
                    break
                } else {
                    moves.push({y: y + i, x: x + i, ate: field[y + i][x + i].piece})
                    break
                }
            }
            for (let i = 1; y - i >= 0 && x - i >= 0; i++) {
                if (!field[y - i][x - i]) {
                    moves.push({y: y - i, x: x -i, ate: false})
                } else if (field[y - i][x - i].player === player) {
                    break
                } else {
                    moves.push({y: y - i, x: x -i, ate: field[y - i][x - i].piece})
                    break
                }
            }
            for (let i = 1; y + i < 8 && x - i >= 0; i++) {
                if (!field[y + i][x - i]) {
                    moves.push({y: y + i, x: x - i, ate: false})
                } else if (field[y + i][x - i].player === player) {
                    break
                } else {
                    moves.push({y: y + i, x: x - i, ate: field[y + i][x - i].piece})
                    break
                }
            }
            for (let i = 1; y - i >= 0 && x + i < 8; i++) {
                if (!field[y - i][x + i]) {
                    moves.push({y: y - i, x: x + i, ate: false})
                } else if (field[y - i][x + i].player === player) {
                    break
                } else {
                    moves.push({y: y - i, x: x + i, ate: field[y - i][x + i].piece})
                    break
                }
            }
            break
        case 'queen':
            for (let i = 1; y + i < 8 && x + i < 8; i++) {
                if (!field[y + i][x + i]) {
                    moves.push({y: y + i, x: x + i, ate: false})
                } else if (field[y + i][x + i].player === player) {
                    break
                } else {
                    moves.push({y: y + i, x: x + i, ate: field[y + i][x + i].piece})
                    break
                }
            }
            for (let i = 1; y - i >= 0 && x - i >= 0; i++) {
                if (!field[y - i][x - i]) {
                    moves.push({y: y - i, x: x -i, ate: false})
                } else if (field[y - i][x - i].player === player) {
                    break
                } else {
                    moves.push({y: y - i, x: x -i, ate: field[y - i][x - i].piece})
                    break
                }
            }
            for (let i = 1; y + i < 8 && x - i >=  0; i++) {
                if (!field[y + i][x - i]) {
                    moves.push({y: y + i, x: x - i, ate: false})
                } else if (field[y + i][x - i].player === player) {
                    break
                } else {
                    moves.push({y: y + i, x: x - i, ate: field[y + i][x - i].piece})
                    break
                }
            }
            for (let i = 1; y - i >= 0 && x + i < 8; i++) {
                if (!field[y - i][x + i]) {
                    moves.push({y: y - i, x: x + i, ate: false})
                } else if (field[y - i][x + i].player === player) {
                    break
                } else {
                    moves.push({y: y - i, x: x + i, ate: field[y - i][x + i].piece})
                    break
                }
            }
            for (let i = 1; y + i < 8; i++) {
                if (!field[y + i][x]) {
                    moves.push({y: y + i, x, ate: false})
                } else if (field[y + i][x].player === player) {
                    break
                } else {
                    moves.push({y: y + i, x, ate: field[y + i][x].piece})
                    break
                }
            }
            for (let i = 1; y - i >= 0; i++) {
                if (!field[y - i][x]) {
                    moves.push({y: y - i, x, ate: false})
                } else if (field[y - i][x].player === player) {
                    break
                } else {
                    moves.push({y: y - i, x, ate: field[y - i][x].piece})
                    break
                }
            }
            for (let i = 1; x + i < 8; i++) {
                if (!field[y][x + i]) {
                    moves.push({y: y, x: x + i, ate: false})
                } else if (field[y][x + i].player === player) {
                    break
                } else {
                    moves.push({y, x: x + i, ate: field[y][x + i].piece})
                    break
                }
            }
            for (let i = 1; x - i >= 0; i++) {
                if (!field[y][x - i]) {
                    moves.push({y: y, x: x - i, ate: false})
                } else if (field[y][x - i].player === player) {
                    break
                } else {
                    moves.push({y, x: x - i, ate: field[y][x - i].piece})
                    break
                }
            }
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
            if (player === 'black') {
                if (y + 1 < 8 && !field[y + 1][x]) moves.push({y: y + 1, x, ate: false})
                if (y + 2 < 8 && y === 1 && !field[y + 1][x] && !field[y + 2][x]) moves.push({y: y + 2, x, ate: false})
                if (y + 1 < 8 && x + 1 < 8 && field[y + 1][x + 1] && field[y + 1][x + 1].player !== player) moves.push({y: y + 1, x: x + 1, ate: field[y + 1][x + 1].piece})
                if (y + 1 < 8 && x - 1 >= 0 && field[y + 1][x - 1] && field[y + 1][x - 1].player !== player) moves.push({y: y + 1, x: x - 1, ate: field[y + 1][x - 1].piece})
            }
            if (player === 'white') {
                if (y - 1 >= 0 && !field[y - 1][x]) moves.push({y: y - 1, x, ate: false})
                if (y - 2 >= 0 && y === 6 && !field[y - 1][x] && !field[y - 2][x]) moves.push({y: y - 2, x, ate: false})
                if (y - 1 >= 0 && x + 1 < 8 && field[y - 1][x + 1] && field[y - 1][x + 1].player !== player) moves.push({y: y - 1, x: x + 1, ate: field[y - 1][x + 1].piece})
                if (y - 1 >= 0 && x - 1 >= 0 && field[y - 1][x - 1] && field[y - 1][x - 1].player !== player) moves.push({y: y - 1, x: x - 1, ate: field[y - 1][x - 1].piece})
            }
            break
    }
    return moves
}


const move = (from, to, field) => {
    const available = availableMoves({y: from.y, x: from.x}, field)
    if (available.find(move => move.y === to.y && move.x === to.x)) {
        field[to.y][to.x] = field[from.y][from.x]
        field[from.y][from.x] = 0
    }
}

export {availableMoves}