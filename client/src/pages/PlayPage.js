import React, {useContext, useEffect, useState} from "react"
import {useHistory} from 'react-router-dom'
import {Game} from '../components/Game'
import {AuthContext} from "../context/AuthContext"
import {IoContext} from "../context/IoContext";
import {GameSettings} from "../components/GameSettings";
import {Loader} from "../components/Loader";
// import {PlayersInLobby} from "../components/PlayersInLobby";


export const PlayPage = ({type}) => {


    const {chessSocket} = useContext(IoContext)
    const {name} = useContext(AuthContext)
    const [games, setGames] = useState([])
    const [createdGame, setCreatedGame] = useState(false)
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
        chessSocket.on('game connect', id => history.push(`${type}/${id}`))

        return () => chessSocket.removeAllListeners()
    },[history, name, chessSocket, type])

    useEffect(()=> {
        if (games.some(game => game.creator === name && !game.full)) setCreatedGame(true)
    },[games,name])




    return (
        <div className="container-fluid">
            <div className="row mt-3">
                <div className="col-lg-3">
                    <ul className="list-group">
                        <li className="list-group-item list-group-item-action  bg-dark text-light">Игроки онлайн</li>
                        {players.map(player => <li key={player} className="list-group-item">{player}</li>)}
                    </ul>
                    <ul className="list-group mt-5">
                        <li className="list-group-item list-group-item-action bg-dark text-light">Текущие партии</li>
                        {!games.some(game =>game.full) && <li className="list-group-item">В данный момент никто не играет</li>}
                        {games.map(game => game.full && <button key={game._id} className="list-group-item list-group-item-action">{game.creator} vs {game.player}</button>)}
                    </ul>
                </div>
                <div className="col-lg-6 order-first order-lg-0">

                    {!createdGame &&
                        <>
                            <button
                            className="btn btn-outline-success bg-dark btn-block btn-lg mb-3"
                            type="button" data-toggle="collapse"
                            data-target="#collapseExample"
                            aria-expanded="false"
                            aria-controls="collapseExample">
                            Новая игра
                        </button>
                            <div className="collapse mb-3" id="collapseExample">
                                <GameSettings setCreatedGame = {setCreatedGame} rating = {rating}/>
                            </div>
                        </>
                    }
                    {/*<button type="button" onClick={createGame} className="btn btn-outline-success bg-dark btn-block btn-lg" >Создать игру</button>*/}
                    {/*<button type="button" onClick={() => setSettings(prev => !prev)} className="btn btn-outline-success bg-dark btn-block btn-lg">Новая игра</button>*/}
                    {/*{settings && <GameSettings />}*/}
                    <div>
                        {games.map(game => {
                            return(
                                !game.full && <Game key={game._id} game = {game} rating={rating} setCreatedGame = {setCreatedGame}/>
                            )
                        })
                        }
                    </div>
                </div>
                <div className="col-lg-3">
                    <button type="button" className="btn btn-dark btn-lg btn-block" onClick={()=>{history.push('/info')}}>
                        <span className="font-weight-bold">{name}</span><span className="font-weight-light">({rating || '...'})</span>
                    </button>
                    {leaders.length === 0
                        ?
                        <Loader />
                        :
                    <table className="table table-hover mt-5">
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

