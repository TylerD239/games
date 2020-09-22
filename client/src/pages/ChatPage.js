import React, {useCallback, useContext, useEffect, useRef, useState} from "react"
import {AuthContext} from "../context/AuthContext";
import {Loader} from "../components/Loader";
import {IoContext} from "../context/IoContext";

const dateConstructor = time => {
    const date = new Date(time)
    const h = date.getHours().toString().padStart(2,'0')
    const m = date.getMinutes().toString().padStart(2,'0')
    const s = date.getSeconds().toString().padStart(2,'0')
    return h + ':' + m + ':' + s
}

export const ChatPage = () => {

    const {chatSocket} = useContext(IoContext)
    const [messages, setMessages] = useState([])
    const [text, setText] = useState('')
    const {name} = useContext(AuthContext)
    const chatContainer = useRef(null)
    const textHandle = evt => setText(evt.target.value)

    const sendMessage = useCallback(() => {
        if (!text) return false
            chatSocket.emit('send mess', {author: name, text: text, date: Date.now()})
            setText('')
    },[chatSocket, name, text])



    useEffect( () => {
        const keyPush = (evt) => {if (evt.keyCode === 13) sendMessage()}
        window.addEventListener('keydown', keyPush)
        chatSocket.emit('ready')
        chatSocket.on('baseMessages', (bMessages) => {
            setMessages(bMessages)
        })
        chatSocket.on('add mess', (message) => {
            setMessages((prevMessages) => [...prevMessages, message])
        })
        return () => {
            window.removeEventListener('keydown', keyPush)
            chatSocket.removeAllListeners()
        }
    },[chatSocket, sendMessage])

    useEffect(()=> {
        // chatContainer.current.style.maxHeight = window.innerHeight - 200 + 'px'
        console.log(chatContainer.current)

            chatContainer.current.style.height = window.innerHeight - 200 + 'px'

    },[])

    useEffect(()=>{
            chatContainer.current.scrollTop = chatContainer.current.scrollHeight

    },[messages])

    return (
        <div className="container">
            <div className="input-group mb-3 mt-3">
                <input type="text" value={text} onChange={textHandle} className="form-control" placeholder="Введите сообщение"/>
                    <div className="input-group-append">
                        <button onClick={sendMessage} className="btn btn-outline-secondary" type="button" id="button-addon2">Отправить</button>
                    </div>
            </div>
            <hr/>
                <div ref={chatContainer} className="chatContainer ">
                    {messages.length ?
                        messages.map((message, i) => (
                            <div className='card mb-2 border-info' key={i}>
                                <div className="card-body message p-2">
                                        <span>{dateConstructor(message.date)} </span>
                                        <strong>{message.author}: </strong>
                                        {message.text}
                                </div>
                            </div>
                        )
                    )
                    :
                    <Loader />}
                </div>

        </div>
    )
}

