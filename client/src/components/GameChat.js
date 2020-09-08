import React, {useCallback, useContext, useEffect, useRef, useState} from "react"
import {IoContext} from "../context/IoContext";
import {AuthContext} from "../context/AuthContext";

export const GameChat = ({id})=> {

    const [text, setText] = useState('')
    const [messages, setMessages] = useState([])
    const {chessSocket} = useContext(IoContext)
    const {name} = useContext(AuthContext)
    const chatContainer = useRef(null)

    const textHandle = (e) => setText(e.target.value)
    const send = useCallback(evt => {
        if (evt.keyCode === 13) {
            chessSocket.emit('message', text, name, id)
            setText('')
        }
    },[chessSocket, name, text, id])

    useEffect( () => {
        window.addEventListener('keydown', send)
        chessSocket.on('new message', message => setMessages(prev => [...prev, message]))
        chessSocket.on('prev message', messages => setMessages(messages))

        return () => {
            window.removeEventListener('keydown', send)
            chessSocket.removeListener('new message')
            chessSocket.removeListener('prev message')
        }
    },[chessSocket, send])

    useEffect(()=> {
        chessSocket.emit('connected to chat', id)
        chatContainer.current.style.height = window.innerHeight - 150 + 'px'
    },[id,chessSocket])

    useEffect(()=>{
        chatContainer.current.scrollTop = chatContainer.current.scrollHeight
    },[messages, chessSocket])

    return (
        <div className="w-100">
            <input className="form-control" type="text" value={text} onChange={textHandle} placeholder="Введите сообщение"/>
            <div ref={chatContainer} id="chatContainer" >
                {messages.map((message,i) =>
                    (<div className={`card mt-2 ${message.author === name ? 'border-success' : 'border-info'}`} key={i}>
                            <div className="card-body">
                                <span className="lead">{message.author}: </span><span>{message.text}</span>
                            </div>
                        </div>)
                )}
            </div>
        </div>

    )
}