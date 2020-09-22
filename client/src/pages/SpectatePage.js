import React, {useContext, useEffect, useRef, useState} from "react"
import {useHistory, useParams} from "react-router-dom";
import {IoContext} from "../context/IoContext";
// import {AuthContext} from "../context/AuthContext";
import {drawBoard} from "../chess/board";
import {ChessInfo} from "../components/ChessInfo";
import my_move_sound from "../sounds/self.mp3"
import eat_sound from "../sounds/eat.mp3"
import enemy_move_sound from "../sounds/enemy.mp3"


const myMoveSound = new Audio(my_move_sound)
const eatSound = new Audio(eat_sound)
eatSound.volume = 0.8
const enemyMoveSound = new Audio(enemy_move_sound)


export const SpectatePage = () => {

    const {id} = useParams()
    const history = useHistory()
    const canvas = useRef(null)
    const [size, setSize] = useState(100)
    const [game, setGame] = useState(null)
    // const {name} = useContext(AuthContext)
    const {chessSocket} = useContext(IoContext)

    useEffect(()=> {
        if (canvas.current) {
            const less = Math.min(window.innerHeight - 100, window.innerWidth)
            const s = less > 800 ? 100 : Math.floor(Math.floor(less / 8) / 10) * 10
            setSize(s)
            canvas.current.width = s * 8
            canvas.current.height = s * 8
            canvas.current.style.height = s * 8 + 'px'
            canvas.current.style.width = s * 8 + 'px'
        }
    },[])

    useEffect(() => {

        chessSocket.emit('connected to spectate game', id)
    }, [chessSocket, id])

    useEffect( () => {
        chessSocket.on('endGame', game => {
            setGame(game)
            drawBoard(game.field, 'white', canvas.current,size, game.moves[game.moves.length - 1], game.check)
        })

        chessSocket.on('game', (game, connect) => {
            if (!game) history.push('/playChess')
            if (game._id !== id) return false
            if (!connect) {
                    const lastMove = game.moves[game.moves.length - 1]
                    if (lastMove.to.ate) eatSound.play().catch(e => console.info('Sorry for the quiet move'))
                    else if (lastMove.piece.color === 'white') myMoveSound.play().catch(e => console.info('Sorry for the quiet move'))
                    else enemyMoveSound.play().catch(e => console.info('Sorry for the quiet move'))
            }
            setGame(game)
            drawBoard(game.field, 'white', canvas.current, size, game.moves[game.moves.length - 1], game.check)
        })

        chessSocket.on('go away', () => {
            history.push(`/playChess`)
        })

        return () => chessSocket.removeAllListeners()
    },[chessSocket, history, id, size])


    return (
    <div className="row mt-3">
        <div className="col-auto offset-md-3">
            <div id="cont" className={game ? 'visible' : 'invisible'}>
                <canvas id="canvasChess" ref={canvas}/>
            </div>
        </div>
        <div className="col align-self-center mb-3">
            {game && <ChessInfo game={game} name={game.white.name} spectate={true}/>}
        </div>
    </div>
    )

}
