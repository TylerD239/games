const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
const path = require('path')
// const {clearModel} = require('./models/mongoFunctions')
const User = require('./models/User')
const Game = require('./models/Game')

const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)

const playChess = io.of('/playChess')
const chat = io.of('/chat')

require('./socket.io/playChess')(playChess)
require('./socket.io/chat')(chat)

const PORT = config.get('port') || 5000;

app.use(express.json({extended:true}))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/checkToken', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    // console.log(token)
    try {
        const verify = jwt.verify(token, config.get('jwtSecret'))
        res.json(verify)
    } catch (e) {
        res.json(false)
    }
})

app.get('/api/getGames', async (req, res) => {
    try {
    const token = req.headers.authorization.split(' ')[1]
    const verify = jwt.verify(token, config.get('jwtSecret'))
    const user = await User.findById(verify.userId)
    const games = await Game.find({'_id': {$in: user.games}})
    res.json(games)
    } catch (e) {res.status(401).json({message: 'no authorization'})}
})

// clearModel(User)
// clearModel(Game)

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))
    app.get('*',(req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

// clearModel(Game)

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

