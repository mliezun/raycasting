import os
import socketio
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

# Create a Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=['http://localhost:8032'],
)
app = FastAPI()

# Mount static files
app.mount("/pics", StaticFiles(directory="pics"), name="pics")
app.mount("/sounds", StaticFiles(directory="sounds"), name="sounds")

print(app.routes)

# CORS settings
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

connections = []

@app.get("/{file_path:path}")
async def serve_file(file_path: str):
    if file_path == "":
        file_path = "index.html"
    print(file_path)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Not found")
    return FileResponse(file_path)

@sio.event
async def connect(sid, environ):
    print(f"Player connected: {sid}")

@sio.event
async def disconnect(sid):
    connections[:] = [c for c in connections if c['sid'] != sid]
    print(f"Player disconnected: {sid}")
    await sio.emit('player_position_to_client', {"serverSocketId": sid, "posX": 0, "posY": 0, "dirX": 0, "dirY": 0, "lives": 0})

@sio.event
async def start(sid, data):
    server_socket_id = sid
    players = [
        {
            "serverSocketId": player['sid'],
            **player['data']
        }
        for player in connections if player['data']['lives'] > 0
    ]
    
    data["serverSocketId"] = server_socket_id

    await sio.emit('new_player', data, skip_sid=sid)
    connections.append({"sid": sid, "data": data})
    return {"serverSocketId": server_socket_id, "players": players}

@sio.event
async def player_position_to_server(sid, data):
    lives = data["lives"]

    for player in connections:
        if player['sid'] == sid:
            player['data'] = data
            break

    if lives == 0:
        data["posX"] = 0
        data["posY"] = 0

    await sio.emit('player_position_to_client', data)

@sio.event
async def shoot_other_player(sid, data):
    player = data["player"]

    if player["lives"] == 0:
        player["posX"] = 0
        player["posY"] = 0
        await sio.emit('player_position_to_client', player)

        for player_data in connections:
            if player_data['sid'] == player["serverSocketId"]:
                player_data['data'] = player
                break
    else:
        await sio.emit('player_position_to_client', player)


app = socketio.ASGIApp(sio, other_asgi_app=app)
