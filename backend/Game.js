const { getRandomAnswers } = require('./cards');

class Game {
    constructor(roomManager) {
        this.roomManager = roomManager;
    }

    startGame(roomCode) {
        const room = this.roomManager.getRoom(roomCode);
        if (!room) return;

        room.players.forEach(player => {
            const cards = getRandomAnswers();  // Assign 10 random cards to each player
            player.assignCards(cards);
        });
    }

    rotateRoundMaster(roomCode) {
        const room = this.roomManager.getRoom(roomCode);
        if (room) {
            const players = room.players;
            const currentMaster = players.shift();  // Move the first player to the end
            players.push(currentMaster);
        }
    }
}

module.exports = Game;
