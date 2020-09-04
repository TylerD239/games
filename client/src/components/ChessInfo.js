import React, {useContext, useEffect, useState} from 'react'
import {IoContext} from "../context/IoContext";
import {useHistory} from "react-router-dom";
import {Loader} from "./Loader";


export const ChessInfo = ({game,name}) => {

    const [whiteTime, setWhiteTime] = useState(0)
    const [blackTime, setBlackTime] = useState(0)
    const {chessSocket} = useContext(IoContext)
    const history = useHistory()
    const exit = () => history.push('/playChess')
    const giveUp = () => chessSocket.emit('giveUp', name, game._id)


    const showTime = (time) => {
        const min = Math.floor(time/60000)
        const sec = Math.floor((time - min * 60000) / 1000)
        return min.toString().padStart(2,'0') + ':' + sec.toString().padStart(2,'0')

    }
    useEffect(()=>{
        // console.log(game)
        setBlackTime(game.black.time)
        setWhiteTime(game.white.time)

        if (!game.winner) {
            const timer = setInterval(() => {
                if (game.turnColor === 'white') setWhiteTime(game.white.time - Date.now() + game.lastTime)
                if (game.turnColor === 'black') setBlackTime(game.black.time - Date.now() + game.lastTime)

            }, 1000)
            return () => clearInterval(timer)

        }
    },[game])



    return (
        game ?
    <div className="chessInfo">
        {game.winner &&
            <span className="d-block h1 bg-secondary text-white">
                winner: {game.winner}
            </span>
        }

        <span className="d-block p-2 bg-dark text-white">
            {game.creator === name ? game.player : game.creator}({game[game.creator === name ? game.player : game.creator].rating})
        </span>
        <span className="d-block h2 p-2 bg-dark text-white">{showTime(game[name].color === 'white' ? blackTime : whiteTime)}</span>
        <table className="table table-dark table-hover table-bordered">
            <tbody>
            {game.white.moves.map((move, i,arr) => {
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
        <span
            className="d-block h2 p-2 bg-dark text-white">{showTime(game[name].color === 'white' ? whiteTime : blackTime)}</span>
        <span className="d-block p-2 bg-dark text-white">{name}({game[name].rating})</span>
        {game.winner
            ?
            <button id='exit' onClick={exit} className="d-block p-2 bg-dark text-white">выйти</button>
            :
            <button id='giveUp' onClick={giveUp} className="d-block p-2 bg-dark text-white">сдаться</button>
        }

    </div>
        :
    <Loader />
    )

}