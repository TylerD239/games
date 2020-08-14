import React, {useContext, useEffect, useRef, useState} from "react"
import {useHistory} from "react-router-dom";
import {IoContext} from "../context/IoContext";
import {AuthContext} from "../context/AuthContext";
import {drawBoard, drawMoves} from "../chess/board";



export const ChessPage = () => {

    const history = useHistory()
    const ref = useRef({
        ctx: null,
        gameId: '',
        field: [],
        raised: false,
        from: {},
        winner: '',
        availableMoves: {},
        color: '',
        turn:'',
        raisedPiece: {},
        pieceMoves: []
    })
    const {name} = useContext(AuthContext)
    const {chessSocket} = useContext(IoContext)

    function cellDetect(coord) {
        // console.log(coord)
        return ref.current.color === 'white' ?
            {y : Math.floor(coord.offsetY / 100), x: Math.floor(coord.offsetX / 100)}
            :
            {y : 7 - Math.floor(coord.offsetY / 100), x:  7 - Math.floor(coord.offsetX / 100)}
    }





    const click = (evt) => {

        // const i = new Image()
        // i.src = black
        // ref.current.ctx.drawImage(i, 2 * 100, 2 * 100, 100,100);
        if (ref.current.color !== ref.current.turn) return false
        // const ctx = ref.current.ctx
        const cell = cellDetect(evt.nativeEvent)

        if (!ref.current.raised) {

            const piece = ref.current.field[cell.y][cell.x]

            if (!piece) return false
            if (piece.player !== ref.current.turn) return false

            ref.current.raisedPiece = piece
            const moves = ref.current.availableMoves[piece.id] || []
            ref.current.pieceMoves = moves

            drawMoves(ref.current.field, ref.current.color, cell, moves, ref.current.ctx)



        }
        if (ref.current.raised) {
            // const to = cell
            if (ref.current.pieceMoves.find(move => move.y === cell.y && move.x === cell.x)) {
                chessSocket.emit('move', {from: ref.current.raisedPiece.position, to: cell}, ref.current.gameId, name)
            } else {
                drawBoard(ref.current.field, ref.current.color, ref.current.ctx)
            }

        }
        ref.current.raised = !ref.current.raised
    }

    const exit = () => {
        chessSocket.emit('exit', {name, gameId: ref.current.gameId})
    }


    useEffect( () => {

        ref.current.ctx = document.getElementById('canvasChess').getContext('2d')
        chessSocket.emit('connected to game', name)

        chessSocket.on('game info', (id, color) => {
            ref.current.gameId = id
            ref.current.color = color
            // ref.current.field = field
            // console.log(field)
            // drawBoard(field, ref.current.ctx())
        })

        chessSocket.on('winner', (winner) => {
            // setWinner(winner)
        })

        chessSocket.on('field', (field, turn, moves, time) => {
            console.log(time)
            ref.current.availableMoves = moves

            ref.current.turn = turn % 2 === 1 ? 'white' : 'black'
            // console.log(turn, ref.current.turn)
            ref.current.field = field
            drawBoard(field, ref.current.color, ref.current.ctx)
        })


        chessSocket.on('go away', () => {
            history.push(`/play`)
        })

        // drawBoard()

        return () => chessSocket.removeAllListeners()
    },[chessSocket, history, name])




    return (

    <div className="row mt-5">

        <div className="col-1">
        </div>
        <div className="col-10">
            <div id="cont">
                <canvas id="canvasChess" onClick={click} width="800" height="800"/>
            </div>
        </div>
        <div className="col-1">
            <button className="btn btn-outline-danger" onClick={exit} >Сдаться и выйти</button>
        </div>

    </div>
    )



}
