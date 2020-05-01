
class Game {
    constructor(name, id, creatorSocketId) {
        this.creator = name
        this.id = id + 1
        this.time = Date.now()
        this.creatorSocketId = creatorSocketId
        this.socketsId.push(creatorSocketId)
    }
    player = null
    socketsId = []
    full = false
    turn = 0
    field = new Array(9).fill(0)
    winner = null

    connect(name, playerSocketId) {
        this.full = true
        this.player = name
        this.socketsId.push(playerSocketId)
        this.turn = 1
    }
}

module.exports = Game