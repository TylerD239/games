import React, {useContext, useEffect, useRef, useState} from "react"
import {useHistory, useParams} from "react-router-dom";
import {IoContext} from "../context/IoContext";
import {AuthContext} from "../context/AuthContext";
import {drawBoard, drawMoves, drawPreMove} from "../chess/board";
// import {Time} from "../components/Time";
import {ChessInfo} from "../components/ChessInfo";
// import {Loader} from "../components/Loader";
import {availablePreMoves} from "../chess/availablePreMoves";
import {GameChat} from "../components/GameChat";
// import {Loader} from "../components/Loader";
import my_move_sound from "../sounds/self.mp3"
import eat_sound from "../sounds/eat.mp3"
import enemy_move_sound from "../sounds/enemy.mp3"


const myMoveSound = new Audio(my_move_sound)
const eatSound = new Audio(eat_sound)
eatSound.volume = 0.8
const enemyMoveSound = new Audio(enemy_move_sound)


export const ChessPage = () => {

    const {id} = useParams()
    const history = useHistory()
    const canvas = useRef(null)
    const ref = useRef({
        moved: false,
        raised: false,
        // from: {},
        raisedPiece: null,
        pieceMoves: [],
        preMoves: null,
        preMove: null
    })
    const [size, setSize] = useState(100)
    const [game, setGame] = useState(null)
    const {name} = useContext(AuthContext)
    const {chessSocket} = useContext(IoContext)

    function cellDetect(coord) {
        return game[name].color === 'white' ?
            {y : Math.floor(coord.offsetY / size), x: Math.floor(coord.offsetX / size)}
            :
            {y : 7 - Math.floor(coord.offsetY / size), x:  7 - Math.floor(coord.offsetX / size)}
    }



    const click = (evt) => {

        if (game.winner || ref.current.moved) return false

        if (ref.current.preMove) {
            ref.current.preMove = null
            drawBoard(game.field, game[name].color, canvas.current, size, game.moves[game.moves.length - 1], game.check)
        }

        const cell = cellDetect(evt.nativeEvent)

        if (!ref.current.raised) {

            const piece = game.field[cell.y][cell.x]

            if (!piece || piece.color !== game[name].color) return false
            ref.current.raisedPiece = piece
            if ( game[name].color !== game.turnColor) {
                const preMoves = availablePreMoves(piece)
                ref.current.preMoves = preMoves
                drawMoves(game.field, game[name].color, cell, preMoves, canvas.current, size, true)
            } else {
                const moves = game.availableMoves[piece.id] || []
                ref.current.pieceMoves = moves
                drawMoves(game.field, game[name].color, cell, moves, canvas.current, size)
            }

        }

        if (ref.current.raised) {

            if (game[name].color !== game.turnColor) {
                const preMove = ref.current.preMoves.find(move => move.y === cell.y && move.x === cell.x)
                drawBoard(game.field, game[name].color, canvas.current, size, game.moves[game.moves.length - 1], game.check)
                if (preMove) {
                    ref.current.preMove = {id: ref.current.raisedPiece.id, move: preMove}
                    drawPreMove(ref.current.raisedPiece, preMove,game.field, canvas.current, size)
                } else ref.current.raisedPiece = null
                ref.current.preMoves = null
            } else {
                const move = ref.current.pieceMoves.find(move => move.y === cell.y && move.x === cell.x)
                if (move) {
                    ref.current.moved = true
                    chessSocket.emit('move', {piece: ref.current.raisedPiece, to: move}, id, name)
                } else {
                    drawBoard(game.field, game[name].color, canvas.current, size, game.moves[game.moves.length - 1], game.check)
                }
                ref.current.pieceMoves = []
                ref.current.raisedPiece = null
            }

        }
        ref.current.raised = !ref.current.raised
    }

    useEffect(()=> {

        if (canvas.current) {
            const less = Math.min(window.innerHeight - 100, window.innerWidth)
            // console.log(less)
            const s = less > 800 ? 100 : Math.floor(Math.floor(less / 8) / 10) * 10
            setSize(s)

            canvas.current.width = s * 8
            canvas.current.height = s * 8
            canvas.current.style.height = s * 8 + 'px'
            canvas.current.style.width = s * 8 + 'px'
        }
    },[])

    useEffect(() => {
        chessSocket.emit('connected to game', id, name)
    }, [chessSocket, id, name])

    useEffect( () => {
        chessSocket.on('endGame', game => {
            setGame(game)
            drawBoard(game.field, game[name].color, canvas.current,size, game.moves[game.moves.length - 1], game.check)

        })

        chessSocket.on('game', (game, connect) => {

            if (!game) history.push('/playChess')
            if (game._id !== id) return false

            // if (!connect) {
            //         const lastMove = game.moves[game.moves.length - 1]
            //         if (lastMove.to.ate) eatSound.play().catch(e => console.info('Sorry for the quiet move'))
            //         else if (game[name].color === lastMove.piece.color) myMoveSound.play().catch(e => console.info('Sorry for the quiet move'))
            //         else enemyMoveSound.play().catch(e => console.info('Sorry for the quiet move'))
            // }


            ref.current.moved = false
            setGame(game)


            if (ref.current.preMove) {
                if (game.availableMoves[ref.current.preMove.id]) {
                    const preMove = ref.current.preMove.move
                    const move = game.availableMoves[ref.current.preMove.id].find(move => move.x === preMove.x && move.y === preMove.y)
                    // console.log(preMove, moves)
                    if (move) {
                        ref.current.moved = true
                        chessSocket.emit('move', {piece: ref.current.raisedPiece, to: move, pre: true}, id, name)
                    } else {
                        drawBoard(game.field, game[name].color, canvas.current, size, game.moves[game.moves.length - 1], game.check)
                    }
                } else drawBoard(game.field, game[name].color, canvas.current, size, game.moves[game.moves.length - 1], game.check)
                ref.current.preMove = null
                ref.current.raisedPiece = null
            } else {


                drawBoard(game.field, game[name].color, canvas.current, size, game.moves[game.moves.length - 1], game.check)
                if (ref.current.raisedPiece) {
                    const piece = ref.current.raisedPiece
                    const moves = game.availableMoves[piece.id] || []
                    ref.current.pieceMoves = moves
                    drawMoves(game.field, game[name].color, {
                        y: piece.position.y,
                        x: piece.position.x
                    }, moves, canvas.current, size)
                }
            }
        })
        //
        chessSocket.on('go away', () => {
            history.push(`/playChess`)
        })

        return () => chessSocket.removeAllListeners()
    },[chessSocket, history, name, id, size])


    // if (!game) return

    return (
    <div className="row mt-3">

        <div className="col-auto">
            <div id="cont" className={game ? 'visible' : 'invisible'}>
                <canvas id="canvasChess" ref={canvas} onClick={click}/>
            </div>
            {/*<div className={game && 'invisible'}><Loader/></div>*/}
        </div>
        <div className="col align-self-center mb-3">
            {game && <ChessInfo game={game} name={name} />}

        </div>
        {game &&
            <div className="col-xl-3 order-xl-first">
                <GameChat id={game.winner ? null : game._id} size={size}/>
            </div>
            // :
            // <Loader/>
        }
    </div>
    )

}
