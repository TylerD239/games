import React, {useContext, useEffect, useState} from "react"
import {useHistory} from 'react-router-dom'
import {Game} from '../components/Game'
import {AuthContext} from "../context/AuthContext"
import {IoContext} from "../context/IoContext";


export const PlayPage = () => {

    const {playSocket} = useContext(IoContext)

    const [games, setGames] = useState([])

    // const refGames = useRef(games)
    // refGames.current = games

    const history = useHistory()
    const {name} = useContext(AuthContext)

    const createGame = () => {
        if (games.some((game) => game.creator === name)) return false
        playSocket.emit('send game', name)

    }


    useEffect( () => {

        playSocket.emit('ready', name)
        playSocket.on('baseGames', (bGames) => {
            setGames(bGames)
        })
        playSocket.on('game connect', (id) => {
            history.push(`cross/${id}`)

        })

        return () => playSocket.removeAllListeners()
    },[])



    return (
        <div>
            <button type="button" onClick={createGame} className="btn btn-primary btn-lg btn-block mt-5" >Создать игру</button>
            <div>

                {games.map((game) => {
                    return(
                        <Game key={game.id} game = {game} />
                        )
                    })
                }
            </div>
        </div>
    )
}

