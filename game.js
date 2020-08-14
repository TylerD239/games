
class Game {
    constructor(name, creatorSocketId, type) {
        this.type = type
        this.creator = name
        this.time = Date.now()
        this.creatorSocketId = creatorSocketId
        this.socketsId.push(creatorSocketId)
    }
    player = ''
    socketsId = []
    full = false
    turn = 0
    field = []
    winner = ''

    connect(name, playerSocketId) {
        this.full = true
        this.player = name
        this.socketsId.push(playerSocketId)
        this.turn = 1
    }
}

module.exports = Game