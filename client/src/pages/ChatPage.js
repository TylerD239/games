import React, {useCallback, useContext, useEffect, useState} from "react"
import {AuthContext} from "../context/AuthContext";
import {Loader} from "../components/Loader";
import {IoContext} from "../context/IoContext";


export const ChatPage = () => {

    const {chatSocket} = useContext(IoContext)
    const [messages, setMessages] = useState([])
    const [text, setText] = useState('')
    const {name} = useContext(AuthContext)


    const textHandle = (e) => {if (text.length < 75) setText(e.target.value) }


    const sendMessage = useCallback(() => {

        if (text) {
            chatSocket.emit('send mess', {author: name, text: text, date: Date.now()})
            setText('')
        }
    },[chatSocket, name, text])

    const send = useCallback((evt) => {
        if (evt.keyCode === 13) sendMessage()
    }, [sendMessage])

    useEffect( () => {

        window.addEventListener('keydown', send)


        chatSocket.emit('ready')
        chatSocket.on('baseMessages', (bMessages) => {
            setMessages(bMessages)
        })
        chatSocket.on('add mess', (message) => {
            setMessages((prevMessages) => [...prevMessages, message])
        })
        return () => {
            window.removeEventListener('keydown', send)
            chatSocket.removeAllListeners()
        }
    },[chatSocket, send])



    useEffect(()=>{
        const scroll = document.getElementById("scroll")
        scroll.scrollTop = scroll.scrollHeight
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
            {!messages.length && <Loader />}

            <div id="scroll" style={{maxHeight: "450px", overflowY: "auto"}}>
                {messages.map((message, i) => {
                    const color = i % 2 === 0 ? 'dark' : 'secondary'
                    const time = new Date(message.date)
                    const h = time.getHours().toString().padStart(2,'0')
                    const m = time.getMinutes().toString().padStart(2,'0')
                    const s = time.getSeconds().toString().padStart(2,'0')
                    return (
                        <div key={message.date} className= {`alert alert-${color}`} role="alert">
                            <span>{h}:{m}:{s} </span>
                            <strong>{message.author}: </strong>
                            {message.text}
                        </div>
                    )
                })}
            </div>

        </div>
    )
}

