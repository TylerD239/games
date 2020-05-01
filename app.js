const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
// const User = require('./models/User')

const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)

const play = io.of('/play')
const chat = io.of('/chat')

require('./socket.io/playCross')(play)
require('./socket.io/chat')(chat)

const PORT = config.get('port') || 5000;

app.use(express.json({extended:true}))


app.use('/api/auth', require('./routes/auth.routes'))


async function start() {
    try {
        await mongoose.connect(config.get('db_uri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        server.listen(PORT, ()=> console.log ("started..."))
    } catch (e) {
        console.log('server error', e.message)
        process.exit(1)
    }
}

start()

