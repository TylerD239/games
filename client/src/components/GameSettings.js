import React, {useContext, useState} from 'react'
import {IoContext} from "../context/IoContext";
import {AuthContext} from "../context/AuthContext";

export const GameSettings = ({setCreatedGame, rating}) => {
    const {chessSocket} = useContext(IoContext)
    const {name} = useContext(AuthContext)
    const createGame = () => {

        setCreatedGame(true)
        chessSocket.emit('send game', name, rating, {color,min,sec})
    }
    const [color, setColor] = useState('random')
    const [min, setMin] = useState(5)
    const [sec, setSec] = useState(5)
    return (
        <div className="card card-body">
                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                    <label className="btn btn-secondary">
                        <input type="radio" onClick={() => setColor('white')} name="options" id="option1"/>Белые
                    </label>
                    <label className="btn btn-secondary active">
                        <input type="radio" onClick={() => setColor('random')} name="options" id="option2"/> Случайно
                    </label>
                    <label className="btn btn-secondary">
                        <input type="radio" onClick={() => setColor('black')} name="options" id="option3"/> Черные
                    </label>
                </div>
                <label htmlFor="customRange1" className="mt-2">Минут на партию: <span className="lead font-weight-bold">{min}</span></label>
                <input
                    type="range"
                    onChange={event => setMin(parseInt(event.target.value))}
                    className="custom-range" step="0.5"
                    value={min}
                    min="0"
                    max="30"
                    id="customRange1"
                />
                <label htmlFor="customRange2" className="mt-2">Добавление секунд на ход: <span className="lead font-weight-bold">{sec}</span></label>
                <input
                    type="range"
                    onChange={event => setSec(parseInt(event.target.value))}
                    className="custom-range"
                    min="0"
                    value={sec}
                    max="30"
                    id="customRange2"
                />
            {rating && (min !== 0 || sec !== 0) && <button type="button" onClick={createGame} className="btn btn-outline-success mt-3 btn-lg" >Создать</button>}
        </div>

    )
}