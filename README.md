# Raycasting Multiplayer Game

## Description
This project is a multiplayer first-person shooter game implemented using raycasting techniques. It features a 3D-like environment rendered in a 2D canvas, multiplayer functionality, and basic shooting mechanics.

## Features
- 3D-like rendering using raycasting
- Multiplayer support with real-time player positions
- Texture mapping for walls, floors, and ceilings
- Sprite rendering for objects and other players
- Basic shooting mechanics
- Player health system
- Simple AI-controlled bots

## Technologies Used
- JavaScript
- HTML5 Canvas
- FastAPI
- Socket.io for real-time multiplayer functionality

## Prerequisites
- Docker

## Installation
1. Clone the repository
   ```
   git clone https://github.com/mliezun/raycasting
   cd raycasting
   ```
2. Install dependencies
   ```
   docker build -t raycasting .
   ```

## How to Run
1. Start the server:
   ```
   docker run --rm raycasting
   ```
2. Open a web browser and go to `http://localhost:8032`
3. To play multiplayer, open the game in multiple browser windows or on different computers on the same network

## Server Details
- The server runs on port 8032 by default
- It serves static files (HTML, JS, CSS, images, etc.) from the project directory
- Socket.io is used for real-time communication between clients and the server

## Controls
- W / Up Arrow: Move forward
- S / Down Arrow: Move backward
- A / Left Arrow: Turn left
- D / Right Arrow: Turn right
- Spacebar: Shoot
- Escape: Pause/Unpause the game

## Game Elements
- The game world is defined by a 2D array (`worldMap`)
- Textures are loaded for walls, sprites, and the player's weapon
- Players can shoot and damage other players or AI-controlled bots
- The game includes a simple bot AI system

## Performance
The game uses various optimization techniques:
- Raycasting for efficient 3D-like rendering
- Sprite sorting and culling
- Frame time-based movement for consistent speed across different frame rates

## Multiplayer Functionality
- Players' positions are synced in real-time across all connected clients
- Shooting mechanics work across the network
- Player health is synced across all clients

## Future Improvements
- Add more varied environments and textures
- Implement advanced AI behaviors for bots
- Add power-ups and different weapon types
- Improve multiplayer features (e.g., chat, scoreboards)
- Optimize performance for larger maps and more players

## Credits
This project is based on raycasting techniques popularized by games like Wolfenstein 3D. The implementation draws inspiration from various raycasting tutorials and resources available online.

## License

[ISC](./LICENSE) License.

