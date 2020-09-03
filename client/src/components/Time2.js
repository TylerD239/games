import React, {useEffect, useState} from "react"

export const Time = ({white, black, color})=> {

    const [whiteTime, setWhiteTime] = useState(0)
    const [blackTime, setBlackTime] = useState(0)
    useEffect(()=>{
        const timer = setInterval(()=> {
            if (color === 'white') setWhiteTime(prev => prev - 100)
            if (color === 'black') setBlackTime(prev => prev - 100)

        },100)
        return () => {clearInterval(timer)}
    },[color])

    useEffect(()=>{
       setBlackTime(black)
       setWhiteTime(white)
    },[white, black])

    const showTime = (time) => {
        const min = Math.floor(time/60000)
        const sec = Math.floor(time - min * 60000) / 1000
        return min.toString().padStart(2,'0') + ':' + sec.toString().padStart(2,'0')

    }

    return (
        <div>
            <p>White time: {showTime(whiteTime)}</p>
            <p>Black time: {showTime(blackTime)}</p>
        </div>

    )
}