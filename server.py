import socketio
from engineio.payload import Payload
import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    stream=sys.stderr,
)
logger = logging.getLogger(__name__)
Payload.max_decode_packets = 1024

# Create a Socket.IO server
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",
)

connections = []


@sio.event
async def connect(sid, environ):
    logger.info(f"Player connected: {sid}")


@sio.event
async def disconnect(sid):
    connections[:] = [c for c in connections if c["sid"] != sid]
    logger.info(f"Player disconnected: {sid}")
    await sio.emit(
        "player_position_to_client",
        {"serverSocketId": sid, "posX": 0, "posY": 0, "dirX": 0, "dirY": 0, "lives": 0},
    )


@sio.event
async def start(sid, data):
    server_socket_id = sid
    players = [
        {"serverSocketId": player["sid"], **player["data"]}
        for player in connections
        if player["data"]["lives"] > 0
    ]

    data["serverSocketId"] = server_socket_id

    await sio.emit("new_player", data, skip_sid=sid)
    connections.append({"sid": sid, "data": data})
    return {"serverSocketId": server_socket_id, "players": players}


@sio.event
async def player_position_to_server(sid, data):
    lives = data["lives"]

    for player in connections:
        if player["sid"] == sid:
            player["data"] = data
            break

    if lives == 0:
        data["posX"] = 0
        data["posY"] = 0

    await sio.emit("player_position_to_client", data)


@sio.event
async def shoot_other_player(sid, data):
    player = data["player"]

    if player["lives"] == 0:
        player["posX"] = 0
        player["posY"] = 0
        await sio.emit("player_position_to_client", player)

        for player_data in connections:
            if player_data["sid"] == player["serverSocketId"]:
                player_data["data"] = player
                break
    else:
        await sio.emit("player_position_to_client", player)


app = socketio.ASGIApp(sio)
