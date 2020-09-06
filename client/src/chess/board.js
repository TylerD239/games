// import React from "react";
import black_king from '../pieces/black_king.png'
import black_bishop from '../pieces/black_bishop.png'
import black_knight from '../pieces/black_knight.png'
import black_pawn from '../pieces/black_pawn.png'
import black_queen from '../pieces/black_queen.png'
import black_rook from '../pieces/black_rook.png'

import white_king from '../pieces/white_king.png'
import white_bishop from '../pieces/white_bishop.png'
import white_knight from '../pieces/white_knight.png'
import white_pawn from '../pieces/white_pawn.png'
import white_queen from '../pieces/white_queen.png'
import white_rook from '../pieces/white_rook.png'

const PieceImage = function (piece) {
    this.image = new Image()
    this.image.src = piece
}

const pieces = {
    black_king: new PieceImage(black_king),
    black_bishop: new PieceImage(black_bishop),
    black_knight: new PieceImage(black_knight),
    black_pawn: new PieceImage(black_pawn),
    black_queen: new PieceImage(black_queen),
    black_rook: new PieceImage(black_rook),
    white_king: new PieceImage(white_king),
    white_bishop: new PieceImage(white_bishop),
    white_knight: new PieceImage(white_knight),
    white_pawn: new PieceImage(white_pawn),
    white_queen: new PieceImage(white_queen),
    white_rook: new PieceImage(white_rook),
}

// console.log(black_king)

const drawBoard = (field, color, canvas, size) => {
    const ctx = canvas.getContext('2d')


    ctx.fillStyle = 'rgb(130,130,130)'
    ctx.fillRect(0, 0, 8 * size, 8 * size)
    ctx.fillStyle = 'rgb(240,240,240)'
    //
    // ctx.fillStyle = '#D7A887'
    // ctx.fillRect(0, 0, 800, 800)
    // ctx.fillStyle = '#F4E7DE'

    for (let i = 0; i < 8; i++) {
        for (let k = i % 2; k < 8; k += 2) {
            ctx.fillRect(i * size, k * size, size, size)
        }
    }
    for (let y = 0; y < 8; y++){
        for (let x = 0; x < 8; x++){
            if (field[y][x]) {
                const X = color === 'white' ? x * size : (7-x) * size
                const Y = color === 'white' ? y * size : (7-y) * size

                const img = field[y][x].color + '_' + field[y][x].piece
                ctx.drawImage(pieces[img].image, X, Y, size,size);

            }
        }
    }
}

const drawMoves = (field, color, cell, moves, canvas, size) => {
    const ctx = canvas.getContext('2d')
    ctx.lineWidth = 4
    ctx.strokeStyle = 'rgba(250,199,80,0.8)'
    if (color === 'black') {
        cell.x = 7 - cell.x
        cell.y = 7 - cell.y
    }
    ctx.strokeRect(cell.x * size + 2, cell.y * size + 2,size - 4,size - 4)

    moves.forEach(move => {
        ctx.strokeStyle = move.ate ? 'rgba(250,95,72,0.8)' : 'rgba(250,199,80,0.8)'

        const X = color === 'white' ? move.x * size : (7 - move.x) * size
        const Y = color === 'white' ? move.y * size : (7 - move.y) * size

        ctx.strokeRect(X + 2, Y + 2,size - 4,size - 4)
    })
}

// const drawMoves = (field, color, cell, moves, canvas) => {
//     const ctx = canvas.getContext('2d')
//     ctx.lineWidth = 20
//     ctx.strokeStyle = 'rgba(209,255,168,0.4)'
//     if (color === 'black') {
//         cell.x = 7 - cell.x
//         cell.y = 7 - cell.y
//     }
//     ctx.strokeRect(cell.x * size + 10, cell.y * size + 10,80,80)
//
//     moves.forEach(move => {
//         ctx.strokeStyle = move.ate ? 'rgba(250,95,72,0.4)' : 'rgba(250,199,80,0.4)'
//
//         const X = color === 'white' ? move.x * size : (7 - move.x) * size
//         const Y = color === 'white' ? move.y * size : (7 - move.y) * size
//
//         ctx.strokeRect(X + 10, Y + 10,80,80)
//     })
// }

// const drawMoves = (field, color, cell, moves, canvas) => {
//     const ctx = canvas.getContext('2d')
//
//     ctx.fillStyle = 'rgba(209,255,168,0.4)'
//     if (color === 'black') {
//         cell.x = 7 - cell.x
//         cell.y = 7 - cell.y
//     }
//     ctx.fillRect(cell.x * size, cell.y * size,size,size)
//
//     moves.forEach(move => {
//         ctx.fillStyle = move.ate ? 'rgba(250,95,72,0.4)' : 'rgba(250,199,80,0.4)'
//
//         const X = color === 'white' ? move.x * size : (7 - move.x) * size
//         const Y = color === 'white' ? move.y * size : (7 - move.y) * size
//
//         ctx.fillRect(X, Y,size,size)
//     })
// }


export {drawBoard, drawMoves}