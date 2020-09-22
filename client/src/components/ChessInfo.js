import React, {useContext, useEffect, useRef, useState} from 'react'
import {IoContext} from "../context/IoContext";
import {useHistory} from "react-router-dom";
import {Loader} from "./Loader";


export const ChessInfo = ({game,name, spectate}) => {

    const [whiteTime, setWhiteTime] = useState(0)
    const [blackTime, setBlackTime] = useState(0)
    const {chessSocket} = useContext(IoContext)
    const history = useHistory()
    const cancel = () => chessSocket.emit('cancel', game._id)
    const exit = () => history.push('/playChess')
    const giveUp = () => chessSocket.emit('giveUp', name, game._id)
    // const exitSpectate =  useCallback(() => {
    //     history.push('/playChess')
    // },[chessSocket,history, game._id])

    const moves = useRef(null)
    const showTime = (time) => {
        const min = Math.floor(time/60000)
        const sec = Math.floor((time - min * 60000) / 1000)
        return min.toString().padStart(2,'0') + ':' + sec.toString().padStart(2,'0')

    }
    useEffect(()=>{
        setBlackTime(game.black.time)
        setWhiteTime(game.white.time)
        if (moves.current) moves.current.scrollTop = moves.current.scrollHeight
        if (!game.winner && game.moves.length !== 0) {
            const timer = setInterval(() => {
                if (game.turnColor === 'white') setWhiteTime(game.white.time - Date.now() + game.lastTime)
                if (game.turnColor === 'black') setBlackTime(game.black.time - Date.now() + game.lastTime)

            }, 1000)
            return () => clearInterval(timer)

        }
    },[game])
    //
    useEffect(()=>{
        return () => chessSocket.emit('leave room', game._id)
        },[chessSocket, game._id])

    return (
        game ?
    <div className="chessInfo">
        {game.winner &&
            <span className="d-block p-1 lead bg-secondary text-white">
                {game.winner === 'draw' ? 'Ничья' :
                    game.winner === 'cancel' ? 'Игра отменена' :
                    `Победа: ${game.winner}`}
            </span>
        }

        {window.innerWidth < 765 &&
        <div className="d-flex bg-dark">
            <div className="d-inline w-50" >
                <span className="d-block text-left mx-1 lead text-white" style={{fontSize: '2rem'}}>
                    {showTime(game[name].color === 'white' ? blackTime : whiteTime)}
                </span>
                <span className="lead d-block text-left mx-1 text-white">
                    {game.creator === name ? game.player : game.creator}({game[game.creator === name ? game.player : game.creator].rating})
                </span>

            </div>
            <div className="d-inline w-50" >
                <span className="lead d-block text-right mx-1 text-white" style={{fontSize: '2rem'}}>
                    {showTime(game[name].color === 'white' ? whiteTime : blackTime)}
                </span>
                <span className="lead d-block text-right mx-1 text-white">
                    {name}({game[name].rating})
                 </span>

            </div>
        </div>
        }
        {window.innerWidth >= 765 &&
            <>
            <span className="d-block bg-dark text-center lead text-white">
                {game.creator === name ? game.player : game.creator}({game[game.creator === name ? game.player : game.creator].rating})
            </span>
            <span className="d-block display-4 p-2 bg-dark text-white">{showTime(game[name].color === 'white' ? blackTime : whiteTime)}</span>
            </>
        }
        <div className="table-container" ref = {moves} style={{maxHeight: '100px', minHeight: '30px'}}>
            <table className="table table-sm mb-0">
                <tbody>
                {game.white.moves.map((move, i) => {
                    const blackMoves = game.black.moves
                    const blackMove = blackMoves[i]
                        ?
                        'ABCDEFGH'[blackMoves[i].piece.position.x]
                        + (8 - blackMoves[i].piece.position.y).toString()
                        + ' - '
                        + 'ABCDEFGH'[blackMoves[i].to.x]
                        + (8 - blackMoves[i].to.y).toString()
                        : null
                    const whiteMove = 'ABCDEFGH'[move.piece.position.x]
                        + (8 - move.piece.position.y).toString()
                        + ' - '
                        +'ABCDEFGH'[move.to.x]
                        + (8 - move.to.y).toString()
                    return (<tr key = {i}>
                        <th scope="row">{i + 1}</th>
                        <td>{whiteMove}</td>
                        <td>{blackMove}</td>
                    </tr>)

                })}
                </tbody>
            </table>
        </div>
        {window.innerWidth >= 765 &&
            <>
            <span className="d-block display-4 p-2 bg-dark text-white">
                {showTime(game[name].color === 'white' ? whiteTime : blackTime)}
            </span>
            <span className="d-block bg-dark lead text-center text-white">
                {name}({game[name].rating})
            </span>
            </>
        }
        {spectate || game.winner ?
            <button onClick={exit} className="btn btn-outline-secondary rounded-0">выйти</button>
            :
            game.moves.length === 0 && !game.winner ?
            <button onClick={cancel} className="btn btn-outline-secondary rounded-0">Отменить игру</button>
            :
            <button type="button" onClick={giveUp} className="btn btn-outline-secondary rounded-0">сдаться</button>
        }

    </div>
        :
    <Loader />
    )

}