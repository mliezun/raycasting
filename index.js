"use strict";

const SCREEN_HEIGHT = 480;
const SCREEN_WIDTH = 640;

const YELLOW = '#ffff00';
const RED = '#ff0000';
const BLUE = '#0000ff';
const GREEN = '#008000';
const BLACK = '#000000';
const WHITE = '#ffffff';

const worldMap = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 3, 0, 3, 0, 3, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 2, 2, 0, 2, 2, 0, 0, 0, 0, 3, 0, 3, 0, 3, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 4, 0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 4, 0, 0, 0, 0, 5, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 4, 0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 4, 0, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,]
];

function verLine(ctx, x, y1, y2, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y1);
  ctx.lineTo(x, y2);
  ctx.stroke();
}


(async () => {
  const gameCanvas = document.getElementById("game");
  const ctx = gameCanvas.getContext("2d");

  gameCanvas.width = SCREEN_WIDTH;
  gameCanvas.height = SCREEN_HEIGHT;


  let posX = 22, posY = 12; //x and y start position
  let dirX = -1, dirY = 0; //initial direction vector
  let planeX = 0, planeY = 0.66; //the 2d raycaster version of camera plane

  let time = 0;
  let oldTime = 0;

  const gameState = {
    player: {
      movingBackward: false,
      movingForward: false,
      turningLeft: false,
      turningRight: false,
    }
  };

  window.addEventListener("keydown", (e) => {
    if (!e.repeat) {
      switch (e.code) {
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
      }
    }
  });


  const drawFrame = (frame) => {
    ctx.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    ctx.fillStyle = BLACK;
    ctx.fill();

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

      let color = BLACK;
      switch (worldMap[mapX][mapY]) {
        case 1: color = RED; break; //red
        case 2: color = GREEN; break; //green
        case 3: color = BLUE; break; //blue
        case 4: color = WHITE; break; //white
        default: color = YELLOW; break; //yellow
      }

      //give x and y sides different brightness
      // if (side == 1) {
      //   color = DARKER[color];
      // }

      //draw the pixels of the stripe as a vertical line
      verLine(ctx, x, drawStart, drawEnd, color);
    }

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
      if (worldMap[Math.floor(posX + dirX * moveSpeed)][Math.floor(posY)] == false) {
        posX += dirX * moveSpeed;
      }
      if (worldMap[Math.floor(posX)][Math.floor(posY + dirY * moveSpeed)] == false) {
        posY += dirY * moveSpeed;
      }
    }
    //move backwards if no wall behind you
    if (gameState.player.movingBackward) {
      if (worldMap[Math.floor(posX - dirX * moveSpeed)][Math.floor(posY)] == false) posX -= dirX * moveSpeed;
      if (worldMap[Math.floor(posX)][Math.floor(posY - dirY * moveSpeed)] == false) posY -= dirY * moveSpeed;
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
    }

    window.requestAnimationFrame(drawFrame);
  };

  window.requestAnimationFrame(drawFrame);
})();
