import React, {useContext, useEffect, useRef, useState} from "react"
import {useHistory, useParams} from "react-router-dom";
import {IoContext} from "../context/IoContext";
import {AuthContext} from "../context/AuthContext";
import {drawBoard, drawMoves} from "../chess/board";
// import {Time} from "../components/Time";
import {ChessInfo} from "../components/ChessInfo";
import {Loader} from "../components/Loader";



export const ChessPage = () => {

    const {id} = useParams()
    const history = useHistory()
    const canvas = useRef(null)
    const ref = useRef({
        moved: false,
        gameId: id,
        raised: false,
        from: {},
        raisedPiece: {},
        pieceMoves: []
    })

    const [game, setGame] = useState(null)
    // const [winner, setWinner] = useState(null)
    const {name} = useContext(AuthContext)
    const {chessSocket} = useContext(IoContext)

    function cellDetect(coord) {
        return game[name].color === 'white' ?
            {y : Math.floor(coord.offsetY / 100), x: Math.floor(coord.offsetX / 100)}
            :
            {y : 7 - Math.floor(coord.offsetY / 100), x:  7 - Math.floor(coord.offsetX / 100)}
    }



    const click = (evt) => {

        if (game.winner || game[name].color !== game.turnColor || ref.current.moved) return false

        const cell = cellDetect(evt.nativeEvent)

        if (!ref.current.raised) {

            const piece = game.field[cell.y][cell.x]

            if (piece && piece.color === game[name].color) {

                ref.current.raisedPiece = piece
                const moves = game.availableMoves[piece.id] || []
                ref.current.pieceMoves = moves
                drawMoves(game.field, game[name].color, cell, moves, canvas.current)
            }
        }

        if (ref.current.raised) {
            const move = ref.current.pieceMoves.find(move => move.y === cell.y && move.x === cell.x)
            if (move) {
                ref.current.moved = true
                ref.current.pieceMoves = []
                chessSocket.emit('move', {piece: ref.current.raisedPiece, to: move}, id, name)
            } else {
                drawBoard(game.field, game[name].color, canvas.current)
            }
            ref.current.raisedPiece = {}
        }
        ref.current.raised = !ref.current.raised
    }




    useEffect( () => {

        chessSocket.emit('connected to game', id, name)

        chessSocket.on('endGame', game => {
            setGame(game)
            drawBoard(game.field, game[name].color, canvas.current)
            // setWinner(game.winner)
            // alert(game.winner)
        })

        chessSocket.on('game', game => {
            // if (!game) history.push('/playChess')
            ref.current.moved = false
            setGame(game)
            drawBoard(game.field, game[name].color, canvas.current)
        })
        //
        chessSocket.on('go away', () => {
            history.push(`/playChess`)
        })

        return () => chessSocket.removeAllListeners()
    },[chessSocket, history, name, id])


    if (!game) return <Loader/>

    return (
    <div className="row mt-5">

        <div className="col-3">
        </div>
        <div className="col-6 justify-content-md-center">
            <div id="cont">
                <canvas id="canvasChess" ref={canvas} onClick={click} width="800" height="800"/>
            </div>
        </div>
        <div className="col-3 align-self-center">
            <ChessInfo game={game} name={name}/>

        </div>

    </div>
    )



}
