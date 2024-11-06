const socket = io();

function getNickname() {
    const nickname = document.getElementById('nicknameInput').value.trim();
    if (!nickname) {
        alert('Please enter a nickname');
        return null;
    }
    return nickname;
}

function switchView(viewID) {
    // Select all elements with the class 'container' and set them to 'none'
    document.querySelectorAll('.container').forEach(view => {
        view.style.display = 'none';
    });

    // Set the specified container to 'block'
    document.getElementById(viewID).style.display = 'block';
}


// Connection status
socket.on('connect', () => {
    document.getElementById('status').textContent = 'Connected to server';
});
socket.on('disconnect', () => {
    document.getElementById('status').textContent = 'Disconnected from server';
});

// Create room button event
document.getElementById('createRoomBtn').addEventListener('click', () => {

    const nickname = getNickname();
    if (nickname){
        switchView('newView2');
        document.getElementById('playersInRoom').textContent = `Players in Room: ${nickname}`;
        socket.emit('createRoom', nickname );
    }
});

// Join room button event
document.getElementById('joinRoomBtn').addEventListener('click', () => {
    const roomCode = prompt("Enter 5-letter Room Code:");
    const nickname = getNickname();
    if (roomCode && nickname) {
        socket.emit('joinRoom', roomCode.toUpperCase(), nickname );

    }
});

document.getElementById('GetNumOfPlayers').addEventListener('click', () => {
    socket.emit('getNumOfPlayers', socket.roomCode.toUpperCase());
});

// Handle room creation and joining responses
socket.on('roomCreated', (roomCode) => {
    socket.roomCode = roomCode;
    document.getElementById('roomcode').textContent = `ROOM CODE: ${roomCode}`;

});

socket.on('roomJoined', (roomCode) => {
    socket.roomCode = roomCode;
    switchView('newView2');
    document.getElementById('roomcode').textContent = `ROOM CODE: ${roomCode}`;

});

socket.on('updatePlayers', (players) => {
    // Extract nicknames from each player object
    const playerNames = players.map(player => player.nickname).join(', ');
    
    // Display the list of player names
    document.getElementById('playersInRoom').textContent = `Players in Room: ${playerNames}`;
});

socket.on('error', (message) => {
    alert(message);
});
