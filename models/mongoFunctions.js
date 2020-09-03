const Message = require('./Message')
const Game_db = require('./Game')
const User = require('./User');
const getMessages = async (messages) => {
    const data = await Message.find()
    messages.push(...data)
}

// const getGames = async (messages) => {
//     const data = await Message.find()
//     messages.push(...data)
// }
//
// const newGame = async (game) => {
//     await Message.find()
//     messages.push(...data)
// }

const saveGame = game => {
    Game_db.findByIdAndUpdate(game._id, {...game},  (err,user)=>{
        if(err) return console.log(err);
    })

    const player1 = game.creator
    const player2 = game.player
    let rating1 = game[player1].rating
    let rating2 = game[player2].rating
    const score = 1 / (1 + Math.pow(10, ((rating2 - rating1)/400)))
    // console.log(game, score)
    if (game.winner === 'draw') {
        rating1 += Math.round(30 * (0.5 - score))
        rating2 -= Math.round(30 * (0.5 - score))
    } else {
        if (game.winner === player1) {
            rating1 += Math.round(30 * (1 - score))
            rating2 += Math.round(30 * (0 - (1-score)))
        }
        if (game.winner === player2) {
            rating1 += Math.round( 30 * (0 - score))
            rating2 += Math.round( 30 * (1 - (1-score)))
        }
    }



    User.updateMany({$or: [{login: player1}, {login: player2}]}, {$push: {games: game._id}}, (e,r) => {})
    User.updateOne({login: player1}, {$set: {rating: rating1}}, (e,r) => {})
    User.updateOne({login: player2}, {$set: {rating: rating2}}, (e,r) => {})
}


const clearModel = (model) => {
    model.remove({},()=>{})
}


module.exports = {getMessages, clearModel, saveGame}