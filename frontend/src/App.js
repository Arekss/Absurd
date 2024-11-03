import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        socket.on('connect', () => {
            setConnected(true);
            console.log('Connected to the server');
        });

        socket.on('disconnect', () => {
            setConnected(false);
            console.log('Disconnected from the server');
        });

        return () => socket.disconnect();
    }, []);

    return (
        <div className="App">
            <header>
                <h1>Cards Against Humanity Game</h1>
            </header>
            <section>
                <div>
                    <h2>Lobby</h2>
                    <p>Waiting for players...</p>
                </div>
                <div>
                    <h2>Game Area</h2>
                    <p>Game will start soon...</p>
                </div>
                <div>
                    <h2>Scoreboard</h2>
                    <p>Score details will be displayed here...</p>
                </div>
            </section>
            <footer>
                <p>Connection Status: {connected ? 'Connected' : 'Disconnected'}</p>
            </footer>
        </div>
    );
}

export default App;