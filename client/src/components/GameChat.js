import React, {useCallback, useContext, useEffect, useRef, useState} from "react"
import {IoContext} from "../context/IoContext";
import {AuthContext} from "../context/AuthContext";
import new_message from "../sounds/new_message.mp3"
import {PaperAirplaneIcon} from '@primer/octicons-react'
const newMessage = new Audio(new_message)


export const GameChat = ({id, size})=> {

    const [text, setText] = useState('')
    const [messages, setMessages] = useState([])
    const {chessSocket} = useContext(IoContext)
    const {name} = useContext(AuthContext)
    const chatContainer = useRef(null)

    const textHandle = (e) => setText(e.target.value)
    const send = useCallback(evt => {

        if (!text) return false
        if (!evt.keyCode || evt.keyCode === 13) {
            chessSocket.emit('message', text, name, id)
            setText('')
        }
    },[chessSocket, name, text, id])

    useEffect( () => {
        window.addEventListener('keydown', send)
        chessSocket.on('new message', message => {
            setMessages(prev => [...prev, message])
            if (message.author !== name) newMessage.play().catch(e => console.info('New Message'))
        })
        chessSocket.on('prev message', messages => setMessages(messages))

        return () => {
            window.removeEventListener('keydown', send)
            chessSocket.removeListener('new message')
            chessSocket.removeListener('prev message')
        }
    },[chessSocket, send, name])

    useEffect(()=> {
        chessSocket.emit('connected to chat', id)
        // chatContainer.current.style.maxHeight = window.innerHeight - 200 + 'px'
        chatContainer.current.style.height = size * 8 - 86 + 'px'
    },[id,chessSocket, size])

    useEffect(()=>{
        chatContainer.current.scrollTop = chatContainer.current.scrollHeight
    },[messages, chessSocket])

    return (
        <div className="w-100 border rounded bg-light p-3 border-secondary">
            {/*<input className="form-control mb-3" type="text" value={text} onChange={textHandle} placeholder="Введите сообщение"/>*/}

            <div className="input-group  mb-3">
                <input
                    type="text"
                    className="form-control"
                    value={text} onChange={textHandle}
                    placeholder="Введите сообщение"
                    aria-describedby="button"
                    disabled={!id}
                />
                    <div className="input-group-append">
                        <button
                            onClick={send}
                            className="btn btn-outline-secondary"
                            type="button"
                            id="button"
                            disabled={!id}
                        ><PaperAirplaneIcon size={22}/></button>
                    </div>
            </div>



            <div ref={chatContainer} className="border-top pt-3 border-secondary" id="chatContainer" >
                {messages.map((message,i) =>
                    (<div className={`card mb-2 w-75 ${message.author === name ? 'border-success ml-auto ' : 'border-info mr-auto '}`} key={i}>
                            <div className="card-body message p-2">
                                <span >{message.author}: </span><span className="lead">{message.text}</span>
                            </div>
                        </div>)
                )}
            </div>
        </div>

    )
}