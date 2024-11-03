class RoomManager {
    generateRoomCode() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return Array.from({ length: 5 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
    }
}

module.exports = RoomManager;
