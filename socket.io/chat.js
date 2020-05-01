const Message = require('../models/Message')
const {clearModel, getMessages}  = require('../models/mongoFunctions')
const messages = []
getMessages(messages)


module.exports = (chat) => {

    chat.on('connection', function (socket) {

        socket.on('ready', function () {
            socket.emit('baseMessages', messages)
        })

        socket.on('send mess', function (data) {
            const mess = new Message(data)
            mess.save()
            messages.push(data)
            chat.emit('add mess', data)
        })
    })
}