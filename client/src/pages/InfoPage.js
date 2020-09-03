import React, {useCallback, useContext, useEffect, useState} from "react"
import {AuthContext} from "../context/AuthContext"
import {useHttp} from "../hooks/http.hook"
import {Loader} from "../components/Loader";

export const InfoPage = () => {
    const {token, logout} = useContext(AuthContext)
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
                <tbody>
                {games.map((game, i) => (
                        <tr key = {game._id}>
                            <th scope="row">{i + 1}</th>
                            <td>{game.creator}</td>
                            <td>{game.player}</td>
                            <td>{game.winner}</td>
                        </tr>
                    )
                )}
                </tbody>
            </table>
        </div>
    )
}

