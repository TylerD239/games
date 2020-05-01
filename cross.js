function checkWinner(field){
    for (let i=0; i<3; i++) {
        if (field[i] + field[i+3] + field[i+6] === 3 || field[i*3] + field[i*3+1] + field[i*3+2] === 3) return 'cross'
        if (field[i] + field[i+3] + field[i+6] === -3 || field[i*3] + field[i*3+1] + field[i*3+2] === -3) return 'nought'
    }
    if (field[0] + field[4] + field[8] === 3 || field[2] + field[4] + field[6] === 3) return 'cross'
    if (field[0] + field[4] + field[8] === -3 || field[2] + field[4] + field[6] === -3) return 'nought'
    // return false;
}

module.exports = checkWinner