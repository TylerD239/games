import React, {useContext, useEffect, useState} from "react"
import {useHistory} from "react-router-dom";
import {IoContext} from "../context/IoContext";
import {AuthContext} from "../context/AuthContext";


export const CrossPage = () => {

    const history = useHistory()

    const noughtRadius = 30, crossSize = 30
    const {name} = useContext(AuthContext)
    const {playSocket} = useContext(IoContext)
    const [gameId, setGameId] = useState(null)
    const [winner, setWinner] = useState(null)
    // const [opponentName, setOpponentName] = useState('')

    const getCanvas = () => {
       return document.getElementById('canvas').getContext('2d');
    }

    // const gameId = useParams().id
    // console.log(gameId)


    const drawBoard = () => {

        const ctx = getCanvas()

            ctx.beginPath();
            ctx.strokeStyle="grey";
            ctx.moveTo(0,100);
            ctx.lineTo(300,100);
            ctx.moveTo(0,200);
            ctx.lineTo(300,200);
            ctx.moveTo(100,0);
            ctx.lineTo(100,300);
            ctx.moveTo(200,0);
            ctx.lineTo(200,300);
            ctx.stroke();

    }

    function drawNought(cell) {
        const ctx = getCanvas()

        ctx.beginPath();
        ctx.strokeStyle="green";
        ctx.arc(cell%3*100+50 , Math.floor(cell/3)*100+50 , noughtRadius, 0, 2*Math.PI, false);
        ctx.stroke();
    }

    function drawCross(cell) {
        const ctx = getCanvas()
        ctx.beginPath();
        ctx.strokeStyle="red";
        ctx.moveTo(cell%3*100-crossSize+50, Math.floor(cell/3)*100-crossSize+50);
        ctx.lineTo(cell%3*100+crossSize+50, Math.floor(cell/3)*100+crossSize+50);
        ctx.moveTo(cell%3*100-crossSize+50, Math.floor(cell/3)*100+crossSize+50);
        ctx.lineTo(cell%3*100+crossSize+50, Math.floor(cell/3)*100-crossSize+50);
        ctx.stroke();
    }



    const click = (event) => {
        console.log(event.nativeEvent.offsetY,event.nativeEvent.offsetX)
        const cell = Math.floor(event.nativeEvent.offsetY/ 100)*3 + Math.floor(event.nativeEvent.offsetX/ 100)
        playSocket.emit('click', {cell, id:gameId, name})

    }

    const exit = () => {
        playSocket.emit('exit', {name, gameId})
    }


    useEffect( () => {

        playSocket.emit('connected to game', name)

        playSocket.on('game info', (id) => {
            setGameId(id)
        })

        playSocket.on('winner', (winner) => {
            setWinner(winner)
        })

        playSocket.on('draw', ({cell, type}) => {
            if (type === 'cross') drawCross(cell)
            if (type === 'nought') drawNought(cell)
        })

        playSocket.on('go away', () => {
            history.push(`/play`)
        })

        drawBoard()

        return () => playSocket.removeAllListeners()
    },[])




    return (

    <div className="row mt-5">
        {/*<div className="col-2"style={{border:'1px solid #E6E6E6', borderRadius:'5px', overflowY:'auto'}}>*/}
        {/*    <ul className="list-group list-group-flush">*/}
        {/*        <li className="list-group-item pl-0"><span className="badge badge-pill badge-success">Player1: </span> hello</li>*/}
        {/*        <li className="list-group-item"><span className="badge badge-pill badge-danger">Player2: </span> hi</li>*/}
        {/*        <li className="list-group-item"><span className="badge badge-pill badge-success">Player1: </span> 123ewqe</li>*/}
        {/*        <li className="list-group-item"><span className="badge badge-pill badge-success">Player1: </span> sdada</li>*/}

        {/*    </ul>*/}
        {/*</div>*/}

        <div className="col-2">
            {winner}
        </div>
        <div className="col-8">
            <canvas id="canvas" onClick={click} width="300" height="300" />
        </div>
        <div className="col-2">
            <button className="btn btn-outline-danger" onClick={exit} >Сдаться и выйти</button>
        </div>

    </div>
    )



}
