class Player {
    constructor(socketId) {
        this.socketId = socketId;
        this.cards = [];
        this.score = 0;
    }

    assignCards(cards) {
        this.cards = cards;
    }

    updateScore(points) {
        this.score += points;
    }
}

module.exports = Player;
