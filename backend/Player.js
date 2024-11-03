class Player {
    constructor(socketId, nickname) {
        this.socketId = socketId;
        this.cards = [];
        this.score = 0;
        this.nickname = nickname;
    }

    assignCards(cards) {
        this.cards = cards;
    }

    updateScore(points) {
        this.score += points;
    }
}

module.exports = Player;
