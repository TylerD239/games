import React, {useContext} from "react"
// import {useHistory} from 'react-router-dom'
// import {IoContext} from "../context/IoContext";
import {AuthContext} from "../context/AuthContext"
import {IoContext} from "../context/IoContext";

export const Game = ({game, socket, rating, setCreatedGame}) => {

    // console.log(game, typeof game._id)

    // const {playSocket} = useContext(IoContext)
    // const history = useHistory()
    const {name} = useContext(AuthContext)
    const {chessSocket} = useContext(IoContext)
    const joinGame = () => {
        chessSocket.emit('join game', game._id, name, rating)
        // history.push(`cross/${game._id}`)
    }

    const deleteGame = () => {
        setCreatedGame(false)
        chessSocket.emit('delete game', game._id)
    }

    return(
        <div className="card text-center mb-2">
            <div className="card-header">
                <strong>{game.creator}({game[game.creator].rating})</strong>
            </div>
            <div className="card-body">
                <h5 className="card-title">Game #{game._id}</h5>
                {name !== game.creator && <button className="btn btn-outline-success" onClick={joinGame}>Присоединиться</button>}
                {name === game.creator && <button className="btn btn-outline-success" onClick={deleteGame}>Отменить</button>}
            </div>
            <div className="card-footer text-muted">
                {Math.ceil((Date.now() - game.time)/1000)} sec ago
            </div>
        </div>
    )
}