// import React from "react";
import black_king from '../pieces/black_king.svg'
import black_bishop from '../pieces/black_bishop.svg'
import black_knight from '../pieces/black_knight.svg'
import black_pawn from '../pieces/black_pawn.svg'
import black_queen from '../pieces/black_queen.svg'
import black_rook from '../pieces/black_rook.svg'

import white_king from '../pieces/white_king.svg'
import white_bishop from '../pieces/white_bishop.svg'
import white_knight from '../pieces/white_knight.svg'
import white_pawn from '../pieces/white_pawn.svg'
import white_queen from '../pieces/white_queen.svg'
import white_rook from '../pieces/white_rook.svg'

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


const drawBoard = (field, color, canvas, size, lastMove, check) => {
    const ctx = canvas.getContext('2d')


    ctx.fillStyle = '#C6D5E6'
    ctx.fillRect(0, 0, 8 * size, 8 * size)
    ctx.fillStyle = '#7784A1'


    for (let i = 0; i < 8; i++) {
        for (let k = i % 2; k < 8; k += 2) {
            ctx.fillRect(i * size, k * size, size, size)
        }
    }
    if (check) {
        const X = color === 'black' ? 7 - check.x : check.x
        const Y = color === 'black' ? 7 - check.y : check.y
        ctx.fillStyle = 'rgba(256,100,100,0.2)'
        ctx.fillRect(X * size, Y * size, size, size)

    }

    if (lastMove) {
        const fromX = color === 'black' ? 7 - lastMove.piece.position.x : lastMove.piece.position.x
        const fromY = color === 'black' ? 7 - lastMove.piece.position.y : lastMove.piece.position.y
        const toX = color === 'black' ? 7 - lastMove.to.x : lastMove.to.x
        const toY = color === 'black' ? 7 - lastMove.to.y : lastMove.to.y
        ctx.fillStyle = 'rgba(130,256,130,0.2)'
        ctx.fillRect(fromX * size, fromY * size, size, size)
        ctx.fillStyle = 'rgba(130,256,130,0.3)'
        ctx.fillRect(toX * size, toY * size, size, size)
    }

    for (let y = 0; y < 8; y++){
        for (let x = 0; x < 8; x++){
            if (field[y][x]) {
                const X = color === 'white' ? x * size : (7-x) * size
                const Y = color === 'white' ? y * size : (7-y) * size

                const img = field[y][x].color + '_' + field[y][x].piece
                ctx.drawImage(pieces[img].image, X, Y, size, size)

            }
        }
    }

}

const drawMoves = (field, color, cell, moves, canvas, size, pre) => {
    const ctx = canvas.getContext('2d')
    ctx.lineWidth = 4
    ctx.strokeStyle = 'rgba(250,199,80,0.5)'
    if (color === 'black') {
        cell.x = 7 - cell.x
        cell.y = 7 - cell.y
    }
    ctx.strokeRect(cell.x * size + 2, cell.y * size + 2,size - 4,size - 4)

    moves.forEach(move => {

        ctx.fillStyle = pre ? 'rgba(200,200,200,0.7)': move.ate ? 'rgba(250,95,72,0.9)' : 'rgba(250,199,80,0.9)'

        const X = color === 'white' ? move.x : (7 - move.x)
        const Y = color === 'white' ? move.y : (7 - move.y)
        ctx.beginPath()
        ctx.arc(X * size + size / 2 , Y * size + size / 2,size / 8,0, Math.PI * 2)
        ctx.fill()

    })
}
const drawPreMove = (piece, move, field, canvas, size) => {
    const ctx = canvas.getContext('2d')


    const fromX = piece.color === 'black' ? 7 - piece.position.x : piece.position.x
    const fromY = piece.color === 'black' ? 7 - piece.position.y : piece.position.y
    const toX = piece.color === 'black' ? 7 - move.x : move.x
    const toY = piece.color === 'black' ? 7 - move.y : move.y
    ctx.fillStyle = 'rgba(216,50,119,0.3)'
    ctx.fillRect(fromX * size, fromY * size, size ,size)
    ctx.drawImage(pieces[piece.color + '_' + piece.piece].image, fromX * size, fromY * size, size, size)
    ctx.fillStyle = 'rgba(216,50,119,0.2)'
    ctx.fillRect(toX * size, toY * size, size, size)
}


export {drawBoard, drawMoves, drawPreMove}