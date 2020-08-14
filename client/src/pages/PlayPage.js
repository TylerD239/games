import React, {useContext, useEffect, useState} from "react"
import {useHistory} from 'react-router-dom'
import {Game} from '../components/Game'
import {AuthContext} from "../context/AuthContext"
import {IoContext} from "../context/IoContext";


export const PlayPage = ({type}) => {

    // const {playSocket} = useContext(IoContext)
    const sockets = useContext(IoContext)
    const socket = type === 'chess' ? sockets.chessSocket : type === 'cross' ? sockets.crossSocket : null
    const {name} = useContext(AuthContext)
    const [games, setGames] = useState([])
    const history = useHistory()

    const createGame = () => {if (games.every((game) => game.creator !== name)) socket.emit('send game', name)}

    useEffect( () => {
        console.log(1)
        socket.emit('ready', name)
        socket.on('baseGames', (bGames) => {setGames(bGames)})
        socket.on('game connect', (id) => {history.push(`${type}/${id}`)})
        return () => socket.removeAllListeners()
    },[history, name, socket])



    return (
        <div>
            <h1>{type}</h1>
            <button type="button" onClick={createGame} className="btn btn-primary btn-lg btn-block mt-5" >Создать игру</button>
            <div>

                {games.map((game) => {
                    return(
                        <Game key={game._id} game = {game} socket = {socket}/>
                    )
                })
                }
            </div>
        </div>
    )
}

