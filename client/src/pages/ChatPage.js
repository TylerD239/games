import React, {useContext, useEffect, useState} from "react"
import {AuthContext} from "../context/AuthContext";
import {Loader} from "../components/Loader";
import {IoContext} from "../context/IoContext";


export const ChatPage = () => {

    const {chatSocket} = useContext(IoContext)
    const [messages, setMessages] = useState([])
    const [text, setText] = useState('')
    const {name} = useContext(AuthContext)


    const textHandle = (e) => {if (text.length < 75) setText(e.target.value) }

    const sendMessage = (e) => {if (text) {
        chatSocket.emit('send mess', {author: name, text: text, date: Date.now()})
        setText('')
    }}


    useEffect( () => {

        chatSocket.emit('ready')
        chatSocket.on('baseMessages', (bMessages) => {
            setMessages(bMessages)
        })
        chatSocket.on('add mess', (message) => {
            setMessages((prevMessages) => [...prevMessages, message])
        })
        return () => chatSocket.removeAllListeners()
    },[])



    useEffect(()=>{
        const scroll = document.getElementById("scroll")
        scroll.scrollTop = scroll.scrollHeight
    },[messages])

    return (
        <div className="container">
            <div className="input-group mb-3 mt-3">
                <input type="text" value={text} onChange={textHandle} className="form-control" placeholder="Введите сообщение"
                       />
                    <div className="input-group-append">
                        <button onClick={sendMessage} className="btn btn-outline-secondary" type="button" id="button-addon2">Отправить</button>
                    </div>
            </div>
            <hr/>
            {!messages.length && <Loader />}

            <div id="scroll" style={{maxHeight: "450px", overflowY: "auto"}}>
                {messages.map((message, i) => {
                    const color = i % 2 === 0 ? 'dark' : 'secondary'
                    return (
                        <div key={message.date} className= {`alert alert-${color}`} role="alert">
                            <strong>{message.author}: </strong>
                            {message.text}
                        </div>
                    )
                })}
            </div>

        </div>
    )
}

