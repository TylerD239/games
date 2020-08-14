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

const drawBoard = (field, color, ctx) => {
    // console.log(field)
    // ctx.font = "30px Arial"
    // ctx.textAlign = "center"
    ctx.lineWidth = 4
    ctx.fillStyle = '#D7A887'
    ctx.fillRect(0, 0, 800, 800)
    ctx.fillStyle = '#F4E7DE'

    for (let i = 0; i < 8; i++) {
        for (let k = i % 2; k < 8; k += 2) {
            ctx.fillRect(i * 100, k * 100, 100, 100)
        }
    }
    for (let y = 0; y < 8; y++){
        for (let x = 0; x < 8; x++){
            if (field[y][x]) {
                const X = color === 'white' ? x * 100 : (7-x) * 100
                const Y = color === 'white' ? y * 100 : (7-y) * 100
                // ctx.fillStyle = field[y][x].player
                const img = field[y][x].player + '_' + field[y][x].piece
                ctx.drawImage(pieces[img].image, X, Y, 100,100);
                // ctx.fillText(field[y][x].piece, X, Y);
            }
        }
    }
}

const drawMoves = (field, color, cell, moves, ctx) => {
    ctx.strokeStyle = 'green'
    if (color === 'black') {
        cell.x = 7 - cell.x
        cell.y = 7 - cell.y
    }
    ctx.strokeRect(cell.x * 100, cell.y * 100,100,100)

    moves.forEach(move => {
        ctx.strokeStyle = move.ate ? '#F75C47' : '#EF7C2B'

        const X = color === 'white' ? move.x * 100 : (7 - move.x) * 100
        const Y = color === 'white' ? move.y * 100 : (7 - move.y) * 100

        ctx.strokeRect(X, Y,100,100)
    })
}

export {drawBoard, drawMoves}