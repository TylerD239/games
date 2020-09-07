import React, {useContext, useEffect, useRef, useState} from 'react'
import {IoContext} from "../context/IoContext";
import {useHistory} from "react-router-dom";
import {Loader} from "./Loader";


export const ChessInfo = ({game,name}) => {

    const [whiteTime, setWhiteTime] = useState(0)
    const [blackTime, setBlackTime] = useState(0)
    const {chessSocket} = useContext(IoContext)
    const history = useHistory()
    const cancel = () => chessSocket.emit('cancel', game._id)
    const exit = () => history.push('/playChess')
    const giveUp = () => chessSocket.emit('giveUp', name, game._id)
    const moves = useRef(null)

    const showTime = (time) => {
        const min = Math.floor(time/60000)
        const sec = Math.floor((time - min * 60000) / 1000)
        return min.toString().padStart(2,'0') + ':' + sec.toString().padStart(2,'0')

    }
    useEffect(()=>{
        console.log(window.innerWidth)
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

        // if (moves) moves.scrollTop = moves.scrollHeight


    },[game])


    return (
        game ?
    <div className="chessInfo">
        {game.winner &&
            <span className="d-block display-4 lead bg-secondary text-white">
                {game.winner === 'draw' ? 'Ничья' :
                    game.winner === 'cancel' ? 'Игра отменена' :
                    `Победа: ${game.winner}`}
            </span>
        }

        {window.innerWidth < 765 &&
        <div className=" d-flex justify-content-between bg-dark">
            <span className="d-inline-flex text-center  align-items-center ml-1 lead text-white">
                {game.creator === name ? game.player : game.creator}<br/>({game[game.creator === name ? game.player : game.creator].rating})
            </span>
            <span className="d-inline-flex lead text-white" style={{fontSize: '1.5rem'}}>
                {showTime(game[name].color === 'white' ? blackTime : whiteTime)}
            </span>

            <span className="d-inline-flex lead text-white" style={{fontSize: '1.5rem'}}>
                {showTime(game[name].color === 'white' ? whiteTime : blackTime)}
            </span>
            <span className="d-inline-flex lead text-center align-items-center mr-1 text-white">
                {name}<br/>({game[name].rating})
             </span>
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
        <div className="table-container" ref = {moves} style={{height: '100px'}}>
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
        {game.moves.length === 0 && !game.winner?
            <button id='exit' onClick={cancel} className="btn btn-outline-secondary rounded-0">Отменить игру</button>
            :
            game.winner
            ?
            <button id='exit' onClick={exit} className="btn btn-outline-secondary rounded-0">выйти</button>
            :
            <button id='giveUp' type="button" onClick={giveUp} className="btn btn-outline-secondary rounded-0">сдаться</button>
        }

    </div>
        :
    <Loader />
    )

}