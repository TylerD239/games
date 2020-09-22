import React, {useContext} from "react"
// import {useHistory} from 'react-router-dom'
// import {IoContext} from "../context/IoContext";
import {AuthContext} from "../context/AuthContext"
import {IoContext} from "../context/IoContext";
import white_king from '../pieces/white_king.svg'
import black_king from '../pieces/black_king.svg'

export const Game = ({game, rating}) => {

    const {name} = useContext(AuthContext)
    const {chessSocket} = useContext(IoContext)
    const joinGame = () => chessSocket.emit('join game', game._id, name, rating)


    const deleteGame = () => {
        // setCreatedGame(false)
        chessSocket.emit('delete game', game._id)
    }

    return(
        <div className="card text-center mt-3">
            <div className="card-header">
                <span className="lead font-weight-bold">{game.creator}</span><span className="lead">({game[game.creator].rating}) </span>

            </div>
            <div className="card-body">
                <span className="d-block card-title text-secondary">#{game._id}</span>
                {game.colorFormat === 'random' ?
                    <span className="d-block h4">
                        <img height="40px" width="40px" alt="" src={white_king}/>/<img  height="40px" width="40px" alt="" src={black_king}/>
                    </span>
                    :
                    <img
                        src={
                            game.colorFormat === 'white'
                            ?
                            white_king
                            :
                            black_king}
                        alt={game.colorFormat}
                        height="50px"
                        width="50px"
                    />}
                    <span className="d-block h5 font-weight-bold">
                        {game.timeFormat / 60000} + {game.addTime / 1000}
                    </span>

                {name !== game.creator && rating && <button className="btn btn-outline-success" onClick={joinGame}>Присоединиться</button>}
                {name === game.creator && <button className="btn btn-outline-success" onClick={deleteGame}>Отменить</button>}
            </div>
            <div className="card-footer text-muted">
                {Math.ceil((Date.now() - game.time)/1000)} sec ago
            </div>
        </div>
    )
}