const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const path = require('path')
// const {clearModel} = require('./models/mongoFunctions')


const app = express()
app.use(express.json({extended:true}))

const server = require('http').Server(app)
const io = require('socket.io')(server)

const playChess = io.of('/playChess')
const chat = io.of('/chat')

require('./socket.io/playChess')(playChess)
require('./socket.io/chat')(chat)

const PORT = config.get('port') || 5000;




app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/checkToken', require('./routes/checkToken'))
app.get('/api/getGames', require('./routes/getGames'))


if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))
    app.get('*',(req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

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

