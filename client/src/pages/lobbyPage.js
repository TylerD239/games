import React, {useContext, useEffect, useState} from "react"
import {useHistory} from 'react-router-dom'
import {Game} from '../components/Game'
import {AuthContext} from "../context/AuthContext"
import {IoContext} from "../context/IoContext";
import {GameSettings} from "../components/GameSettings";
import {Loader} from "../components/Loader";
// import {PlayersInLobby} from "../components/PlayersInLobby";


export const LobbyPage = () => {


    const {chessSocket} = useContext(IoContext)
    const {name} = useContext(AuthContext)
    const [games, setGames] = useState([])
    const [leaders, setLeaders] = useState([])
    const [rating, setRating] = useState(null)
    const [players,  setPlayers] = useState([])
    const history = useHistory()

    useEffect( () => {

        if (name) chessSocket.emit('ready', name)
        chessSocket.on('playersInLobby', players => setPlayers(players))
        chessSocket.on('baseGames', bGames => setGames(bGames))
        chessSocket.on('leaders', leaders => setLeaders(leaders))
        chessSocket.on('rating', rate => setRating(rate))
        chessSocket.on('game connect', id => history.push(`chess/${id}`))

        return () => chessSocket.removeAllListeners()
    },[history, name, chessSocket])

    // useEffect(()=> {
    //     if (games.some(game => game.creator === name && !game.full)) setCreatedGame(true)
    // },[games, name])




    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-3">
                    <ul className="list-group mt-3">
                        <li className="list-group-item list-group-item-action  bg-dark text-light">Игроки онлайн</li>
                        {players.map(player => <li key={player} className="list-group-item">{player}</li>)}
                    </ul>
                    <ul className="list-group mt-3">
                        <li className=" list-group-item list-group-item-action bg-dark text-light">Текущие партии</li>
                        {!games.some(game =>game.full) && <li className="list-group-item">В данный момент никто не играет</li>}
                        {games.map(game => game.full && <button
                            key={game._id}
                            className="btn list-group-item"
                            onClick={()=>{
                                game[name] ? history.push(`chess/${game._id}`) : history.push(`spectateChess/${game._id}`)
                            }}
                        >
                            <span>{game.creator} vs {game.player}   </span>
                            <span className="align-self-center badge badge-success">
                                {game[name] ? 'Вернуться' : 'Смотреть'}
                            </span>
                        </button>)}
                    </ul>
                </div>

                <div className="col-lg-6 order-first order-lg-0">
                    <button
                        className="btn btn-outline-success bg-dark btn-block btn-lg mt-3"
                        type="button"
                        data-toggle="collapse"
                        data-target="#collapse"
                        aria-expanded="false"
                        aria-controls="collapse">
                        Новая игра
                    </button>
                    <div className="collapse mt-3" id="collapse">
                        <GameSettings  rating = {rating}/>
                    </div>

                    <div>
                        {games.map(game => {
                            return(
                                !game.full &&
                                <Game
                                    key={game._id}
                                    game = {game}
                                    rating={rating}
                                />
                            )
                        })
                        }
                    </div>
                </div>
                <div className="col-lg-3">
                    <button type="button" className="btn btn-dark btn-lg btn-block mt-3" onClick={()=>{history.push('/info')}}>
                        <span className="font-weight-bold">{name}</span>
                        <span className="font-weight-light">({rating || <span className="spinner-grow spinner-grow-sm text-warning" role="status" aria-hidden="true"/>})
                    </span>
                    </button>
                    {leaders.length === 0
                        ?
                        <Loader />
                        :
                    <table className="table table-hover mt-3">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Имя</th>
                                <th scope="col">Рейтинг</th>
                            </tr>
                        </thead>
                        <tbody>

                        {leaders.map((leader, i) => (
                            <tr className="table-light" key={leader.name}>
                                <th scope="row">{i + 1}</th>
                                <td>{leader.name}</td>
                                <td>{leader.rating}</td>
                            </tr>))}

                        </tbody>
                    </table>
                    }
                </div>
            </div>
        </div>
    )
}

