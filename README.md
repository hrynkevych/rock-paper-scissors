# Rock-Paper-Scissors Backend API

## Overview

This is the backend for the "Rock-Paper-Scissors" game built with TypeScript and NestJS using WebSocket for real-time communication.

### Features:

- Register with a username
- Choose between rock, paper, or scissors
- View opponent status (in-game, made a choice, out-of-game)
- Get game results in real-time
- Reset game state after a round or player disconnection

## Tech Stack

- **TypeScript**
- **NestJS**
- **WebSocket**
- **Jest** for testing the game logic

## Architecture

The application follows a simple and modular structure, follows SOLID principles. The architecture ensures separation of concerns between the WebSocket handling and game logic. 

- **GameModule**: Main module to tie together services and controllers.
- **GameService**: Handles all game logic.
- **WebSocketController**: Manages WebSocket communication. Handles WebSocket events for player actions (e.g., joining, making a move).

## Running the Project

Setup

Clone the repository:

git clone <repo-url>
cd rock-paper-scissors-backend

Install dependencies:

npm install

Run the project:

npm run start

The server will start on port 3001, and the WebSocket will listen on port 3005.

## Running Tests

This project includes unit tests for the game logic service using Jest.

npm run test

## Testing with WebSocket

You can test WebSocket communication using wscat or any WebSocket client, or Postman.

Using wscat:

1. Install wscat:

npm install -g wscat

2. Connect to the WebSocket server:

wscat -c ws://localhost:3005

3. Test Join Game:

{"event": "joinGame", "data": {"username": "Player1"}}

4. Test Player Choice:

{"event": "playerChoice", "data": {"choice": "rock"}}
