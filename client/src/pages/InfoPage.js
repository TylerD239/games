import React, {useCallback, useContext, useEffect, useState} from "react"
import {AuthContext} from "../context/AuthContext"
import {useHttp} from "../hooks/http.hook"
import {Loader} from "../components/Loader";

export const InfoPage = () => {
    const {token, logout, name} = useContext(AuthContext)
    const {request, loading} = useHttp()
    const [games, setGames] = useState([])
    const getGames = useCallback(async () => {
        try {
            const d = await request('/api/getGames', 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            setGames(d)
        } catch (e) {logout()}
    }, [logout, request, token])

    useEffect(()=>{getGames()}, [getGames])

    if (loading) {
        return <Loader />
    }
    return (
        <div className="container">
            <table className="table table-dark table-hover table-bordered">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Противник</th>
                    <th scope="col">Результат</th>

                </tr>
                </thead>
                <tbody>
                {games.map((game, i) => (
                        <tr key = {game._id}>
                            <th scope="row">{i + 1}</th>
                            <td>{game.creator === name ? game.player : game.creator}</td>
                            <td className={game.winner === name ? 'text-success' : game.winner === 'draw' ? 'text-info' : 'text-danger'}>{game.winner === name ? 'победа' : game.winner === 'draw' ? 'ничья' : 'поражение'}</td>
                        </tr>
                    )
                )}
                </tbody>
            </table>
        </div>
    )
}

