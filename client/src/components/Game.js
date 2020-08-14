import React, {useContext} from "react"
// import {useHistory} from 'react-router-dom'
// import {IoContext} from "../context/IoContext";
import {AuthContext} from "../context/AuthContext"

export const Game = ({game, socket}) => {

    // const {playSocket} = useContext(IoContext)
    // const history = useHistory()
    const {name} = useContext(AuthContext)

    const joinGame = () => {
        socket.emit('join game', {id: game._id, name})
        // history.push(`cross/${game._id}`)
    }

    const deleteGame = () => {
        socket.emit('delete game', game._id)
    }

    return(
        <div className="card text-center mt-3">
            <div className="card-header">
                <strong>{game.creator}</strong>
            </div>
            <div className="card-body">
                <h5 className="card-title">Game #{game._id}</h5>
                {name !== game.creator && <button className="btn btn-primary" onClick={joinGame}>Присоединиться</button>}
                {name === game.creator && <button className="btn btn-primary" onClick={deleteGame}>Отменить</button>}
            </div>
            <div className="card-footer text-muted">
                {Math.ceil((Date.now() - game.time)/1000)} sec ago
            </div>
        </div>
    )
}