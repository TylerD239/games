const Message = require('./Message')

const getMessages = async (messages) => {
    const data = await Message.find()
    messages.push(...data)
}

const getGames = async (messages) => {
    const data = await Message.find()
    messages.push(...data)
}

const newGame = async (game) => {
    await Message.find()
    messages.push(...data)
}


const clearModel = (model) => {
    model.remove({},()=>{})
}


module.exports = {getMessages, clearModel}