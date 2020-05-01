const {Schema, model} = require('mongoose')

const schema = new Schema ({
	id:{type:Number, required: true, unique: true},
	player: {type: String, required: true},
	creator: {type: String, required: true},
	field: {type: Array, required: true},
	winner: {type:String, required: true}
})
module.exports = model('Game_db', schema)