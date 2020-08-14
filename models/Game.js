const {Schema, model} = require('mongoose')

const schema = new Schema ({
	time: {type: Number, required: true},
	player: {type: String},
	creator: {type: String, required: true},
	field: {type: Array, required: true},
	type: {type: String, required: true},
	winner: {type:String}
})
module.exports = model('Game_db', schema)