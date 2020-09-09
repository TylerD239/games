import React, {useCallback, useContext, useEffect, useRef, useState} from "react"
import {AuthContext} from "../context/AuthContext"
import {useHttp} from "../hooks/http.hook"
import {Loader} from "../components/Loader";

export const InfoPage = () => {
    const {token, logout, name} = useContext(AuthContext)
    const {request, loading} = useHttp()
    const [games, setGames] = useState([])
    const tableContainer = useRef(null)
    const getGames = useCallback(async () => {
        try {
            const d = await request('/api/getGames', 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            setGames(d.reverse())
        } catch (e) {logout()}
    }, [logout, request, token])

    useEffect(()=>{getGames()}, [getGames])
    useEffect(()=> {
        tableContainer.current.style.height = window.innerHeight - 86 + 'px'
        console.log(tableContainer.current.style.height, window.innerHeight - 86 + 'px')
    },[games])

    if (loading) {
        return <Loader />
    }

    return (
        <div className="container" >
            <div ref={tableContainer} className="table-container border-secondary border rounded-bottom">
                <table className="table table-hover " >
                    <thead className="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Дата</th>
                        <th scope="col">Противник</th>
                        <th scope="col">Результат</th>

                    </tr>
                    </thead>
                    <tbody>
                    {games.map((game, i,array) => (
                            <tr key = {game._id}>
                                <th scope="row">{array.length - i}</th>
                                <td>{new Date(game.time).toLocaleDateString()}</td>
                                <td>{game.creator === name ? game.player : game.creator}</td>
                                <td className={game.winner === name ? 'text-success' : game.winner === 'draw' || game.winner === 'cancel' ? 'text-info' : 'text-danger'}>
                                    {game.winner === name ? 'победа' : game.winner === 'draw' ? 'ничья' : game.winner === 'cancel' ? 'Отменена' : 'поражение'}
                                </td>
                            </tr>
                        )
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

