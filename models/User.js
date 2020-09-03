const {Schema, model, Types} = require('mongoose')

const schema = new Schema ({
	login : {type: String, required: true, unique: true},
	password : {type: String, required: true},
	rating : {type: Number, required: true},
	games: [{type:Types.ObjectId, ref: 'game_db'}]
})
module.exports = model('User', schema)