"use strict";

const SCREEN_WIDTH = 640;
const SCREEN_HEIGHT = 480;
const TEX_WIDTH = 64;
const TEX_HEIGHT = 64;

const YELLOW = '#ffff00';
const RED = '#ff0000';
const BLUE = '#0000ff';
const GREEN = '#008000';
const BLACK = '#000000';
const WHITE = '#ffffff';

const worldMap = [
  [8,8,8,8,8,8,8,8,8,8,8,4,4,6,4,4,6,4,6,4,4,4,6,4],
  [8,0,0,0,0,0,0,0,0,0,8,4,0,0,0,0,0,0,0,0,0,0,0,4],
  [8,0,3,3,0,0,0,0,0,8,8,4,0,0,0,0,0,0,0,0,0,0,0,6],
  [8,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],
  [8,0,3,3,0,0,0,0,0,8,8,4,0,0,0,0,0,0,0,0,0,0,0,4],
  [8,0,0,0,0,0,0,0,0,0,8,4,0,0,0,0,0,6,6,6,0,6,4,6],
  [8,8,8,8,0,8,8,8,8,8,8,4,4,4,4,4,4,6,0,0,0,0,0,6],
  [7,7,7,7,0,7,7,7,7,0,8,0,8,0,8,0,8,4,0,4,0,6,0,6],
  [7,7,0,0,0,0,0,0,7,8,0,8,0,8,0,8,8,6,0,0,0,0,0,6],
  [7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,6,0,0,0,0,0,4],
  [7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,6,0,6,0,6,0,6],
  [7,7,0,0,0,0,0,0,7,8,0,8,0,8,0,8,8,6,4,6,0,6,6,6],
  [7,7,7,7,0,7,7,7,7,8,8,4,0,6,8,4,8,3,3,3,0,3,3,3],
  [2,2,2,2,0,2,2,2,2,4,6,4,0,0,6,0,6,3,0,0,0,0,0,3],
  [2,2,0,0,0,0,0,2,2,4,0,0,0,0,0,0,4,3,0,0,0,0,0,3],
  [2,0,0,0,0,0,0,0,2,4,0,0,0,0,0,0,4,3,0,0,0,0,0,3],
  [1,0,0,0,0,0,0,0,1,4,4,4,4,4,6,0,6,3,3,0,0,0,3,3],
  [2,0,0,0,0,0,0,0,2,2,2,1,2,2,2,6,6,0,0,5,0,5,0,5],
  [2,2,0,0,0,0,0,2,2,2,0,0,0,2,2,0,5,0,5,0,0,0,5,5],
  [2,0,0,0,0,0,0,0,2,0,0,0,0,0,2,5,0,5,0,5,0,5,0,5],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
  [2,0,0,0,0,0,0,0,2,0,0,0,0,0,2,5,0,5,0,5,0,5,0,5],
  [2,2,0,0,0,0,0,2,2,2,0,0,0,2,2,0,5,0,5,0,0,0,5,5],
  [2,2,2,2,1,2,2,2,2,2,2,1,2,2,2,5,5,5,5,5,5,5,5,5],
];


const sprite = [
  [20.5, 11.5, 10], //green light in front of playerstart
  //green lights in every room
  [18.5,4.5, 10],
  [10.0,4.5, 10],
  [10.0,12.5,10],
  [3.5, 6.5, 10],
  [3.5, 20.5,10],
  [3.5, 14.5,10],
  [14.5,20.5,10],

  //row of pillars in front of wall: fisheye test
  [18.5, 10.5, 9],
  [18.5, 11.5, 9],
  [18.5, 12.5, 9],

  //some barrels around the map
  [21.5, 1.5, 8],
  [15.5, 1.5, 8],
  [16.0, 1.8, 8],
  [16.2, 1.2, 8],
  [3.5,  2.5, 8],
  [9.5, 15.5, 8],
  [10.0, 15.1,8],
  [10.5, 15.8,8],
];

const SHOTGUN_SPRITE = [21.5, 11.5, 11];

//sort algorithm
//sort the sprites based on distance
function sortSprites(order, dist, amount) {
  let sprites = new Array(amount);
  for(let i = 0; i < amount; i++) {
    sprites[i] = [dist[i], order[i]];
  }
  sprites.sort((a, b) => a[0]-b[0]);
  // restore in reverse order to go from farthest to nearest
  for(let i = 0; i < amount; i++) {
    dist[i] = sprites[amount - i - 1][0];
    order[i] = sprites[amount - i - 1][1];
  }
}

function drawBuffer(screen_buffer, buffer) {   
  for (let y = 0; y < SCREEN_HEIGHT; y++) {
    for (let x = 0; x < SCREEN_WIDTH; x++) {
      let color = buffer[y][x];
      let base = (x+y*SCREEN_WIDTH)*4;
      screen_buffer[base] = (color & 0xFF0000) >> 16;
      screen_buffer[base + 1] = (color & 0xFF00) >> 8;
      screen_buffer[base + 2] = color & 0xFF;
      screen_buffer[base + 3] = 0xFF;
      buffer[y][x] = 0;
    }
  }
}

function loadImage(imgPath) {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.getElementById("image-loader");
    const ctx = canvas.getContext("2d");
    img.crossOrigin = "anonymous";
    img.src = imgPath;
    img.onload = function() {
      // Set canvas size to match the image
      canvas.width = img.width;
      canvas.height = img.height;
      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);
      // Get the image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      // Convert data to array of RGBA values
      const rgbaArray = new Uint32Array(imageData.data.length/4);
      for (let i = 0; i < rgbaArray.length; i++) {
        rgbaArray[i] = (imageData.data[i*4] << 16) + (imageData.data[i*4+1] << 8) + (imageData.data[i*4+2]);
      }
      resolve(rgbaArray);
    };
  });
}

function MoveBots(botsPosition, botsDirection, botsState, frameTime) {
  for (let index = 0; index < botsState.length; index++) {
    const state = botsState[index]
    const pos = botsPosition[index]
    const dir = botsDirection[index]
    //speed modifiers
    let moveSpeed = frameTime * 5.0; //the constant value is in squares/second
    let rotSpeed = frameTime * 3.0; //the constant value is in radians/second
    if (state.movingForward) {
      const moveX = Math.floor(pos[0] + dir[0] * moveSpeed)
      if (moveX >= 0 && moveX < worldMap.length && worldMap[moveX][Math.floor(pos[1])] == false) {
        pos[0] += dir[0] * moveSpeed;
      }
      const moveY = Math.floor(pos[1] + dir[0] * moveSpeed)
      if (moveY >= 0 && moveY < worldMap[Math.floor(pos[0])].length && worldMap[Math.floor(pos[0])][moveY] == false) {
        pos[1] += dir[0] * moveSpeed;
      }
    }
    //move backwards if no wall behind you
    if (state.movingBackward) {
      const moveX = Math.floor(pos[0] - dir[0] * moveSpeed)
      if (moveX >= 0 && moveX < worldMap.length && worldMap[moveX][Math.floor(pos[1])] == false) pos[0] -= dir[0] * moveSpeed;
      const moveY = Math.floor(pos[1] - dir[1] * moveSpeed)
      if (moveY >= 0 && moveY < worldMap[Math.floor(pos[0])].length && worldMap[Math.floor(pos[0])][moveY] == false) pos[1] -= dir[1] * moveSpeed;
    }
    //rotate to the right
    if (state.turningRight) {
      //both camera direction and camera plane must be rotated
      let oldDirX = dir[0];
      dir[0] = dir[0] * Math.cos(-rotSpeed) - dir[1] * Math.sin(-rotSpeed);
      dir[1] = oldDirX * Math.sin(-rotSpeed) + dir[1] * Math.cos(-rotSpeed);
    }
    //rotate to the left
    if (state.turningLeft) {
      //both camera direction and camera plane must be rotated
      let oldDirX = dir[0];
      dir[0] = dir[0] * Math.cos(rotSpeed) - dir[1] * Math.sin(rotSpeed);
      dir[1] = oldDirX * Math.sin(rotSpeed) + dir[1] * Math.cos(rotSpeed);
    }
    botsPosition[index] = pos
    botsDirection[index] = dir
  }
}

let oldBotTime = window.performance.now();

function BotsControl(botsState) {
  const currentBotTime = window.performance.now();
  if (currentBotTime - oldBotTime > 500) {
    oldBotTime = currentBotTime
    const max = 10
    const min = 0
    for (let index = 0; index < botsState.length; index++) {
      botsState[index].movingForward = Math.floor(Math.random() * (max - min + 1) + min) > 5
      botsState[index].movingBackward = Math.floor(Math.random() * (max - min + 1) + min) > 5
      botsState[index].turningLeft = Math.floor(Math.random() * (max - min + 1) + min) > 5
      botsState[index].turningRight = Math.floor(Math.random() * (max - min + 1) + min) > 5
    }
  }
}


(async () => {
  const gameCanvas = document.getElementById("game");
  const ctx = gameCanvas.getContext("2d");

  gameCanvas.width = SCREEN_WIDTH;
  gameCanvas.height = SCREEN_HEIGHT;


  let posX = 22.5, posY = 11.5; //x and y start position
  let dirX = -1, dirY = 0; //initial direction vector
  let planeX = 0, planeY = 0.66; //the 2d raycaster version of camera plane
  let lives = 3;

  const socket = io.connect()
  let serverSocketId
  let players = []
  
  let botsPos = [
    // [20, 11.5, 16, () => gameState.bots[0]],
  ];
  let botsDir = [
    // [-1, 0]
  ]
  
  const ZBuffer = new Float64Array(SCREEN_WIDTH);
  let spriteOrder = new Uint32Array(sprite.length + botsPos.length + players.length);
  let spriteDistance = new Float64Array(sprite.length + botsPos.length + players.length);

  socket.emit('start', { posX, posY, dirX, dirY, lives }, data => {
    serverSocketId = data.serverSocketId;
    players = data.players;
    spriteOrder = new Uint32Array(sprite.length + botsPos.length + players.length);
    spriteDistance = new Float64Array(sprite.length + botsPos.length + players.length);
  });
  
  socket.on('player_position_to_client', (data) => {
    const i = players.findIndex(player => player.serverSocketId === data.serverSocketId);
    
    if (i >= 0) {
      players[i] = data;
    } else if (data.serverSocketId === serverSocketId) {
      lives = data.lives;
    }
  });
  
  let time = 0;
  let oldTime = 0;
  
  const buffer = [];
  for (let i = 0; i < SCREEN_HEIGHT; i++) {
    buffer.push(new Uint32Array(SCREEN_WIDTH));
  }

  socket.on('new_player', (data) => {
    const itsAMeMario = serverSocketId === data.serverSocketId
    
    if (!itsAMeMario) {
      players.push(data)
      spriteOrder = new Uint32Array(sprite.length + botsPos.length + players.length);
      spriteDistance = new Float64Array(sprite.length + botsPos.length + players.length);
    }
  })
  
  const texture = await Promise.all([
    //load some textures
    loadImage("pics/eagle.png"),
    loadImage("pics/redbrick.png"),
    loadImage("pics/purplestone.png"),
    loadImage("pics/greystone.png"),
    loadImage("pics/bluestone.png"),
    loadImage("pics/mossy.png"),
    loadImage("pics/wood.png"),
    loadImage("pics/colorstone.png"),

    //load some sprite textures
    loadImage("pics/barrel.png"),
    loadImage("pics/pillar.png"),
    loadImage("pics/greenlight.png"),
    loadImage("pics/handshotgun1.gif"),
    loadImage("pics/handshotgun2.gif"),
    loadImage("pics/handshotgun3.gif"),
    loadImage("pics/handshotgun4.gif"),
    loadImage("pics/handshotgun5.gif"),
    // load bot sprites
    loadImage("pics/bot1.png"),
  ]);

  const gameState = {
    player: {
      pause: false,
      movingBackward: false,
      movingForward: false,
      turningLeft: false,
      turningRight: false,
      shooting: {
        keypressed: false,
        keyraised: true,
        animationPlaying: false,
        animationStartTime: 0,
        animationEndTime: 0,
        processedHit: false,
      },
    },
    bots: [
      // {
      //   movingBackward: false,
      //   movingForward: false,
      //   turningLeft: false,
      //   turningRight: false,
      //   lives: 3,
      // }
    ]
  };

  window.addEventListener("keydown", (e) => {
    if (!e.repeat) {
      switch (e.code) {
        case 'Escape':
          gameState.player.pause = !gameState.player.pause;
          if (!gameState.player.pause) window.requestAnimationFrame(drawFrame);
          break;
        case 'ArrowUp':
        case 'KeyW':
          gameState.player.movingForward = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          gameState.player.movingBackward = true;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          gameState.player.turningLeft = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          gameState.player.turningRight = true;
          break;
        case 'Space':
          gameState.player.shooting.keypressed = true;
          break;
      }
    }
  });
  window.addEventListener("keyup", (e) => {
    if (!e.repeat) {
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          gameState.player.movingForward = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
          gameState.player.movingBackward = false;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          gameState.player.turningLeft = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          gameState.player.turningRight = false;
          break;
        case 'Space':
          gameState.player.shooting.keypressed = false;
          gameState.player.shooting.keyraised = true;
          break;
      }
    }
  });

  const screen = ctx.createImageData(SCREEN_WIDTH, SCREEN_HEIGHT); // only do this once per page
  const screen_buffer  = screen.data;                        // only do this once per page


  const drawFrame = (frame) => {
    //FLOOR CASTING
    for (let y = 0; y < SCREEN_HEIGHT; y++) {
      // rayDir for leftmost ray (x = 0) and rightmost ray (x = w)
      let rayDirX0 = dirX - planeX;
      let rayDirY0 = dirY - planeY;
      let rayDirX1 = dirX + planeX;
      let rayDirY1 = dirY + planeY;

      // Current y position compared to the center of the screen (the horizon)
      let p = Math.floor(y - SCREEN_HEIGHT / 2);

      // Vertical position of the camera.
      let posZ = 0.5 * SCREEN_HEIGHT;

      // Horizontal distance from the camera to the floor for the current row.
      // 0.5 is the z position exactly in the middle between floor and ceiling.
      let rowDistance = posZ / p;

      // calculate the real world step vector we have to add for each x (parallel to camera plane)
      // adding step by step avoids multiplications with a weight in the inner loop
      let floorStepX = rowDistance * (rayDirX1 - rayDirX0) / SCREEN_WIDTH;
      let floorStepY = rowDistance * (rayDirY1 - rayDirY0) / SCREEN_WIDTH;

      // real world coordinates of the leftmost column. This will be updated as we step to the right.
      let floorX = posX + rowDistance * rayDirX0;
      let floorY = posY + rowDistance * rayDirY0;

      for(let x = 0; x < SCREEN_WIDTH; ++x) {
        // the cell coord is simply got from the integer parts of floorX and floorY
        let cellX = Math.floor(floorX);
        let cellY = Math.floor(floorY);

        // get the texture coordinate from the fractional part
        let tx = Math.floor(TEX_WIDTH * (floorX - cellX)) & (TEX_WIDTH - 1);
        let ty = Math.floor(TEX_HEIGHT * (floorY - cellY)) & (TEX_HEIGHT - 1);

        floorX += floorStepX;
        floorY += floorStepY;

        // choose texture and draw the pixel
        let floorTexture = 3;
        let ceilingTexture = 6;
        let color;

        // floor
        color = texture[floorTexture][TEX_WIDTH * ty + tx];
        color = (color >> 1) & 8355711; // make a bit darker
        buffer[y][x] = color;

        //ceiling (symmetrical, at screenHeight - y - 1 instead of y)
        color = texture[ceilingTexture][TEX_WIDTH * ty + tx];
        color = (color >> 1) & 8355711; // make a bit darker
        buffer[SCREEN_HEIGHT - y - 1][x] = color;
      }
    }


    //WALL CASTING
    for (let x = 0; x < SCREEN_WIDTH; x++) {
      //calculate ray position and direction
      let cameraX = 2 * x / SCREEN_WIDTH - 1; //x-coordinate in camera space
      let rayDirX = dirX + planeX * cameraX;
      let rayDirY = dirY + planeY * cameraX;

      //which box of the map we're in
      let mapX = Math.floor(posX);
      let mapY = Math.floor(posY);

      //length of ray from current position to next x or y-side
      let sideDistX, sideDistY;

      //length of ray from one x or y-side to next x or y-side
      //these are derived as:
      //deltaDistX = sqrt(1 + (rayDirY * rayDirY) / (rayDirX * rayDirX))
      //deltaDistY = sqrt(1 + (rayDirX * rayDirX) / (rayDirY * rayDirY))
      //which can be simplified to abs(|rayDir| / rayDirX) and abs(|rayDir| / rayDirY)
      //where |rayDir| is the length of the vector (rayDirX, rayDirY). Its length,
      //unlike (dirX, dirY) is not 1, however this does not matter, only the
      //ratio between deltaDistX and deltaDistY matters, due to the way the DDA
      //stepping further below works. So the values can be computed as below.
      let deltaDistX = Math.abs(1 / rayDirX);
      let deltaDistY = Math.abs(1 / rayDirY);

      let perpWallDist;

      //what direction to step in x or y-direction (either +1 or -1)
      let stepX;
      let stepY;

      let hit = 0; //was there a wall hit?
      let side; //was a NS or a EW wall hit?
      if (rayDirX < 0) {
        stepX = -1;
        sideDistX = (posX - mapX) * deltaDistX;
      } else {
        stepX = 1;
        sideDistX = (mapX + 1.0 - posX) * deltaDistX;
      }
      if (rayDirY < 0) {
        stepY = -1;
        sideDistY = (posY - mapY) * deltaDistY;
      } else {
        stepY = 1;
        sideDistY = (mapY + 1.0 - posY) * deltaDistY;
      }

      //perform DDA
      while (hit == 0) {
        //jump to next map square, either in x-direction, or in y-direction
        if (sideDistX < sideDistY) {
          sideDistX += deltaDistX;
          mapX += stepX;
          side = 0;
        } else {
          sideDistY += deltaDistY;
          mapY += stepY;
          side = 1;
        }
        //Check if ray has hit a wall
        if (worldMap[mapX][mapY] > 0) {
          hit = 1;
        }
      }

      //Calculate distance projected on camera direction. This is the shortest distance from the point where the wall is
      //hit to the camera plane. Euclidean to center camera point would give fisheye effect!
      //This can be computed as (mapX - posX + (1 - stepX) / 2) / rayDirX for side == 0, or same formula with Y
      //for size == 1, but can be simplified to the code below thanks to how sideDist and deltaDist are computed:
      //because they were left scaled to |rayDir|. sideDist is the entire length of the ray above after the multiple
      //steps, but we subtract deltaDist once because one step more into the wall was taken above.
      if (side == 0) {
        perpWallDist = (sideDistX - deltaDistX);
      } else {
        perpWallDist = (sideDistY - deltaDistY);
      }

      //Calculate height of line to draw on screen
      let lineHeight = Math.floor(SCREEN_HEIGHT / perpWallDist);

      //calculate lowest and highest pixel to fill in current stripe
      let drawStart = Math.floor(-lineHeight / 2 + SCREEN_HEIGHT / 2);
      if (drawStart < 0) {
        drawStart = 0;
      }
      let drawEnd = Math.floor(lineHeight / 2 + SCREEN_HEIGHT / 2);
      if (drawEnd >= SCREEN_HEIGHT) {
        drawEnd = SCREEN_HEIGHT - 1;
      }

      //texturing calculations
      let texNum = worldMap[mapX][mapY] - 1;  //1 subtracted from it so that texture 0 can be used!

      //calculate value of wallX
      let wallX;  //where exactly the wall was hit
      if (side === 0) {
        wallX = posY + perpWallDist * rayDirY;
      } else {
        wallX = posX + perpWallDist * rayDirX;
      }
      wallX -= Math.floor(wallX);

      //x coordinate on the texture
      let texX = Math.floor(wallX * TEX_WIDTH);
      if (side == 0 && rayDirX > 0) {
        texX = TEX_WIDTH - texX - 1;
      }
      if (side == 1 && rayDirY < 0) {
        texX = TEX_WIDTH - texX - 1;
      }

      let step = 1.0 * TEX_HEIGHT / lineHeight;
      // Starting texture coordinate
      let texPos = (drawStart - SCREEN_HEIGHT / 2 + lineHeight / 2) * step;
      for (let y = drawStart; y<drawEnd; y++) {
        // Cast the texture coordinate to integer, and mask with (texHeight - 1) in case of overflow
        let texY = Math.floor(texPos) & (TEX_HEIGHT - 1);
        texPos += step;
        let color = texture[texNum][TEX_HEIGHT * texY + texX];
        //make color darker for y-sides: R, G and B byte each divided through two with a "shift" and an "and"
        if (side == 1) {
          color = (color >> 1) & 8355711;
        }
        buffer[y][x] = color;
      }
      //SET THE ZBUFFER FOR THE SPRITE CASTING
      ZBuffer[x] = perpWallDist; //perpendicular distance is used
    }

    //SPRITE CASTING
    let spritePlayers = players.map(player => {
      return [player.posX, player.posY, 16, player.lives]
    });
    let spritesAndBots = [...sprite, ...botsPos, ...spritePlayers];
    //sort sprites from far to close
    for (let i = 0; i < spritesAndBots.length; i++) {
      spriteOrder[i] = i;
      spriteDistance[i] = ((posX - spritesAndBots[i][0]) * (posX - spritesAndBots[i][0]) + (posY - spritesAndBots[i][1]) * (posY - spritesAndBots[i][1])); //sqrt not taken, unneeded
    }
    sortSprites(spriteOrder, spriteDistance, spritesAndBots.length);
  
    //after sorting the sprites, do the projection and draw them
    for (let i = 0; i < spritesAndBots.length; i++) {
      //translate sprite position to relative to camera
      let spriteX = spritesAndBots[spriteOrder[i]][0] - posX;
      let spriteY = spritesAndBots[spriteOrder[i]][1] - posY;

      //transform sprite with the inverse camera matrix
      // [ planeX   dirX ] -1                                       [ dirY      -dirX ]
      // [               ]       =  1/(planeX*dirY-dirX*planeY) *   [                 ]
      // [ planeY   dirY ]                                          [ -planeY  planeX ]

      let invDet = 1.0 / (planeX * dirY - dirX * planeY); //required for correct matrix multiplication

      let transformX = invDet * (dirY * spriteX - dirX * spriteY);
      let transformY = invDet * (-planeY * spriteX + planeX * spriteY); //this is actually the depth inside the screen, that what Z is in 3D

      let spriteScreenX = Math.floor((SCREEN_WIDTH / 2) * (1 + transformX / transformY));

      //calculate height of the sprite on screen
      let spriteHeight = Math.abs(Math.floor(SCREEN_HEIGHT / (transformY))); //using 'transformY' instead of the real distance prevents fisheye
      //calculate lowest and highest pixel to fill in current stripe
      let drawStartY = Math.floor(-spriteHeight / 2 + SCREEN_HEIGHT / 2);
      if (drawStartY < 0) {
        drawStartY = 0;
      }
      let drawEndY = Math.floor(spriteHeight / 2 + SCREEN_HEIGHT / 2);
      if (drawEndY >= SCREEN_HEIGHT) {
        drawEndY = SCREEN_HEIGHT - 1;
      }

      //calculate width of the sprite
      let spriteWidth = Math.abs(Math.floor(SCREEN_HEIGHT / (transformY)));
      let drawStartX = Math.floor(-spriteWidth / 2 + spriteScreenX);
      if (drawStartX < 0) {
        drawStartX = 0;
      }
      let drawEndX = Math.floor(spriteWidth / 2 + spriteScreenX);
      if (drawEndX >= SCREEN_WIDTH) {
        drawEndX = SCREEN_WIDTH - 1;
      }

      //loop through every vertical stripe of the sprite on screen
      for (let stripe = drawStartX; stripe < drawEndX; stripe++) {
        let texX = Math.floor(Math.floor(256 * (stripe - (-spriteWidth / 2 + spriteScreenX)) * TEX_WIDTH / spriteWidth) / 256);
        //the conditions in the if are:
        //1) it's in front of camera plane so you don't see things behind you
        //2) it's on the screen (left)
        //3) it's on the screen (right)
        //4) ZBuffer, with perpendicular distance
        if (transformY > 0 && stripe > 0 && stripe < SCREEN_WIDTH && transformY < ZBuffer[stripe]) {
          //for every pixel of the current stripe 
          for (let y = drawStartY; y < drawEndY; y++) {
            let d = Math.floor((y) * 256 - SCREEN_HEIGHT * 128 + spriteHeight * 128); //256 and 128 factors to avoid floats
            let texY = Math.floor(((d * TEX_HEIGHT) / spriteHeight) / 256);
            let texNum = spritesAndBots[spriteOrder[i]][2];
            let color = texture[texNum][TEX_WIDTH * texY + texX]; //get current color from the texture
            //paint pixel if it isn't black, black is the invisible color
            if ((color & 0x00FFFFFF) != 0) {
              buffer[y][stripe] = color;
              if (spritesAndBots[spriteOrder[i]].length === 4) {
                const botState = spritesAndBots[spriteOrder[i]][3];
                let other_lives;
                if (typeof botState === "number") {
                  other_lives = botState;
                } else {
                  other_lives = botState().lives;
                }
                switch (other_lives) {
                    case 1:
                      buffer[y][stripe] |= 0x470000;
                      break;
                    case 2:
                      buffer[y][stripe] |= 0x300000;
                      break;
                    default:
                      break;
                }
              }
            }
          }
        }
      }
    }

    // SHOTGUN SPRITE RENDERING
    {
      //translate sprite position to relative to camera
      let spriteX = SHOTGUN_SPRITE[0] - posX;
      let spriteY = SHOTGUN_SPRITE[1] - posY;

      //transform sprite with the inverse camera matrix
      // [ planeX   dirX ] -1                                       [ dirY      -dirX ]
      // [               ]       =  1/(planeX*dirY-dirX*planeY) *   [                 ]
      // [ planeY   dirY ]                                          [ -planeY  planeX ]

      let invDet = 1.0 / (planeX * dirY - dirX * planeY); //required for correct matrix multiplication

      let transformX = invDet * (dirY * spriteX - dirX * spriteY);
      let transformY = invDet * (-planeY * spriteX + planeX * spriteY); //this is actually the depth inside the screen, that what Z is in 3D

      let spriteScreenX = Math.floor((SCREEN_WIDTH / 2) * (1 + transformX / transformY));

      const scaleDown = 1.5;

      //calculate height of the sprite on screen
      let spriteHeight = Math.abs(Math.floor(SCREEN_HEIGHT / (transformY) / scaleDown)); //using 'transformY' instead of the real distance prevents fisheye
      //calculate lowest and highest pixel to fill in current stripe
      let drawStartY = Math.floor(-spriteHeight / 2 + SCREEN_HEIGHT / 2);
      if (drawStartY < 0) {
        drawStartY = 0;
      }
      let drawEndY = Math.floor(spriteHeight / 2 + SCREEN_HEIGHT / 2);
      if (drawEndY >= SCREEN_HEIGHT) {
        drawEndY = SCREEN_HEIGHT - 1;
      }

      //calculate width of the sprite
      let spriteWidth = Math.abs(Math.floor(SCREEN_HEIGHT / (transformY) / scaleDown));
      let drawStartX = Math.floor(-spriteWidth / 2 + spriteScreenX);
      if (drawStartX < 0) {
        drawStartX = 0;
      }
      let drawEndX = Math.floor(spriteWidth / 2 + spriteScreenX);
      if (drawEndX >= SCREEN_WIDTH) {
        drawEndX = SCREEN_WIDTH - 1;
      }

      //loop through every vertical stripe of the sprite on screen
      for (let stripe = drawStartX; stripe < drawEndX; stripe++) {
        let texX = Math.floor(Math.floor(256 * (stripe - (-spriteWidth / 2 + spriteScreenX)) * TEX_WIDTH / spriteWidth) / 256);
        //the conditions in the if are:
        //1) it's in front of camera plane so you don't see things behind you
        //2) it's on the screen (left)
        //3) it's on the screen (right)
        //4) ZBuffer, with perpendicular distance
        for (let y = drawStartY; y < drawEndY; y++) {
          let d = Math.floor((y) * 256 - SCREEN_HEIGHT * 128 + spriteHeight * 128); //256 and 128 factors to avoid floats
          let texY = Math.floor(((d * TEX_HEIGHT) / spriteHeight) / 256);
          let texNum = SHOTGUN_SPRITE[2];
          let color = texture[texNum][TEX_WIDTH * texY + texX]; //get current color from the texture
          //paint pixel if it isn't black, black is the invisible color
          if ((color & 0x00FFFFFF) != 0) {
            buffer[y+80][stripe] = color;
          }
        }
      }
    }

    drawBuffer(screen_buffer, buffer);
    ctx.putImageData(screen, 0, 0);

    //timing for input and FPS counter
    oldTime = time;
    time = window.performance.now();
    let frameTime = (time - oldTime) / 1000.0; //frameTime is the time this frame has taken, in seconds
    ctx.font = "24px bold";
    ctx.fillStyle = "white";
    ctx.fillText(`${Math.floor(1 / frameTime)}`, 15, 35);

    //speed modifiers
    let moveSpeed = frameTime * 5.0; //the constant value is in squares/second
    let rotSpeed = frameTime * 3.0; //the constant value is in radians/second
    if (gameState.player.movingForward) {
      const moveX = Math.floor(posX + dirX * moveSpeed)
      if (moveX >= 0 && moveX < worldMap.length && worldMap[moveX][Math.floor(posY)] == false) {
        posX += dirX * moveSpeed;
        SHOTGUN_SPRITE[0] += dirX * moveSpeed;
      }
      const moveY = Math.floor(posY + dirY * moveSpeed)
      if (moveY >= 0 && moveY < worldMap[Math.floor(posX)].length && worldMap[Math.floor(posX)][moveY] == false) {
        posY += dirY * moveSpeed;
        SHOTGUN_SPRITE[1] += dirY * moveSpeed;
      }

      socket.emit('player_position_to_server', { serverSocketId, posX, posY, dirX, dirY, lives })
    }
    //move backwards if no wall behind you
    if (gameState.player.movingBackward) {
      const moveX = Math.floor(posX - dirX * moveSpeed)
      if (moveX >= 0 && moveX < worldMap.length && worldMap[moveX][Math.floor(posY)] == false) {
        posX -= dirX * moveSpeed;
        SHOTGUN_SPRITE[0] -= dirX * moveSpeed;
      }
      const moveY = Math.floor(posY - dirY * moveSpeed)
      if (moveY >= 0 && moveY < worldMap[Math.floor(posX)].length && worldMap[Math.floor(posX)][moveY] == false) {
        posY -= dirY * moveSpeed;
        SHOTGUN_SPRITE[1] -= dirY * moveSpeed;
      }

      socket.emit('player_position_to_server', { serverSocketId, posX, posY, dirX, dirY, lives })
    }
    //rotate to the right
    if (gameState.player.turningRight) {
      //both camera direction and camera plane must be rotated
      let oldDirX = dirX;
      dirX = dirX * Math.cos(-rotSpeed) - dirY * Math.sin(-rotSpeed);
      dirY = oldDirX * Math.sin(-rotSpeed) + dirY * Math.cos(-rotSpeed);
      let oldPlaneX = planeX;
      planeX = planeX * Math.cos(-rotSpeed) - planeY * Math.sin(-rotSpeed);
      planeY = oldPlaneX * Math.sin(-rotSpeed) + planeY * Math.cos(-rotSpeed);

      SHOTGUN_SPRITE[0] = posX + dirX;
      SHOTGUN_SPRITE[1] = posY + dirY;

      socket.emit('player_position_to_server', { serverSocketId, posX, posY, dirX, dirY, lives })
    }
    //rotate to the left
    if (gameState.player.turningLeft) {
      //both camera direction and camera plane must be rotated
      let oldDirX = dirX;
      dirX = dirX * Math.cos(rotSpeed) - dirY * Math.sin(rotSpeed);
      dirY = oldDirX * Math.sin(rotSpeed) + dirY * Math.cos(rotSpeed);
      let oldPlaneX = planeX;
      planeX = planeX * Math.cos(rotSpeed) - planeY * Math.sin(rotSpeed);
      planeY = oldPlaneX * Math.sin(rotSpeed) + planeY * Math.cos(rotSpeed);

      SHOTGUN_SPRITE[0] = posX + dirX;
      SHOTGUN_SPRITE[1] = posY + dirY;

      socket.emit('player_position_to_server', { serverSocketId, posX, posY, dirX, dirY, lives })
    }

    const hitSprite = () => {
      let raySize = 0.01;
      let rayPosX, rayPosY;
      const increment = raySize;
      while (raySize < Math.max(worldMap.length, worldMap[0].length)) {
        rayPosX = posX+dirX*raySize;
        rayPosY = posY+dirY*raySize;
        const hittedSprite = sprite.find(s => Math.abs(s[0]-rayPosX)<=0.2 && Math.abs(s[1]-rayPosY)<=0.2);
        if ( 
          hittedSprite
        ) {
          hittedSprite[0] = 0;
          hittedSprite[1] = 0;
          break;
        } else if (
          Math.floor(rayPosX) <= 0 || Math.floor(rayPosX) >= SCREEN_WIDTH-1 ||
          Math.floor(rayPosY) <= 0 || Math.floor(rayPosY) >= SCREEN_HEIGHT-1
        ) {
          break;
        }
        raySize += increment;
      }
    }

    const hitPlayer = () => {
      let raySize = 0.01;
      let rayPosX, rayPosY;
      const increment = raySize;
      const hitPrecission = 0.2;
      while (raySize < Math.max(worldMap.length, worldMap[0].length)) {
        rayPosX = posX+dirX*raySize;
        rayPosY = posY+dirY*raySize;
        const hittedBot = botsPos.findIndex(p => Math.abs(p[0]-rayPosX)<=hitPrecission && Math.abs(p[1]-rayPosY)<=hitPrecission);
        const hittedPlayer = players.findIndex(p => Math.abs(p.posX-rayPosX)<=hitPrecission && Math.abs(p.posY-rayPosY)<=hitPrecission);
        if (hittedPlayer !== -1) {
          const pl = players[hittedPlayer];
          pl.lives--;
          socket.emit("shoot_other_player", { serverSocketId, player: pl });
          const audio = document.getElementById("monster-player");
          audio.play();
          break;
        } else if ( 
          hittedBot !== -1
        ) {
          if (--gameState.bots[hittedBot].lives <= 0) {
            botsPos[hittedBot][0] = 0;
            botsPos[hittedBot][1] = 0;
            botsDir[hittedBot] = [0, 0];
            gameState.bots[hittedBot].movingBackward = false;
            gameState.bots[hittedBot].movingForward = false;
            gameState.bots[hittedBot].turningLeft = false;
            gameState.bots[hittedBot].turningRight = false;
          }
          const audio = document.getElementById("monster-player");
          audio.play();
          break;
        } else if (
          Math.floor(rayPosX) <= 0 || Math.floor(rayPosX) >= SCREEN_WIDTH-1 ||
          Math.floor(rayPosY) <= 0 || Math.floor(rayPosY) >= SCREEN_HEIGHT-1
        ) {
          break;
        }
        raySize += increment;
      }
    }

    //show shooting animation
    if (gameState.player.shooting.keypressed && gameState.player.shooting.keyraised && !gameState.player.shooting.animationPlaying) {
      gameState.player.shooting.animationPlaying = true;
      gameState.player.shooting.animationStartTime = time;
      gameState.player.shooting.keyraised = false;
      gameState.player.shooting.processedHit = false;
      const audio = document.getElementById("shoot-gun");
      audio.play();
    }
    if (gameState.player.shooting.animationPlaying) {
      const timeDiff = time-gameState.player.shooting.animationStartTime;
      if (timeDiff > 200 && timeDiff <= 300) {
        SHOTGUN_SPRITE[2] = 12;
      } else if (timeDiff > 300 && timeDiff <= 500) {
        SHOTGUN_SPRITE[2] = 13;
        if (!gameState.player.shooting.processedHit) {
          hitPlayer();
          gameState.player.shooting.processedHit = true;
        }
      } else if (timeDiff > 500 && timeDiff <= 600) {
        SHOTGUN_SPRITE[2] = 14;
      } else if (timeDiff > 600 && timeDiff <= 800) {
        SHOTGUN_SPRITE[2] = 15;
      } else if (timeDiff > 800) {
        SHOTGUN_SPRITE[2] = 11;
        gameState.player.shooting.animationPlaying = false;
        gameState.player.shooting.animationEndTime = time;
        const audio = document.getElementById("shoot-gun");
        audio.pause();
        audio.currentTime = 0;
      }
    }

    BotsControl(gameState.bots)
    MoveBots(botsPos, botsDir, gameState.bots, frameTime)

    if (!gameState.player.pause && lives > 0) {
      window.requestAnimationFrame(drawFrame);
    }
  };

  window.requestAnimationFrame(drawFrame);
})();
