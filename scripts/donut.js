const donutElement = document.getElementById("donut");

const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 22;
const FRAME_DELAY_MS = 33;
const CHAR_MAP = ".,-~:;=!*#$@";
const ROTATE_SPEED_A = 0.04;
const ROTATE_SPEED_B = 0.08;

let angleA = 0;
let angleB = 0;

function createFrameBuffers() {
  const buffer = new Array(SCREEN_WIDTH * SCREEN_HEIGHT);
  const zBuffer = new Array(SCREEN_WIDTH * SCREEN_HEIGHT);
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = (i % SCREEN_WIDTH === SCREEN_WIDTH - 1) ? "\n" : " ";
    zBuffer[i] = 0;
  }
  return { buffer, zBuffer };
}

function renderFrame() {
  const { buffer, zBuffer } = createFrameBuffers();

  for (let theta = 0; theta < 2 * Math.PI; theta += 0.07) {
    for (let phi = 0; phi < 2 * Math.PI; phi += 0.02) {
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      const sinA = Math.sin(angleA);
      const cosA = Math.cos(angleA);
      const sinB = Math.sin(angleB);
      const cosB = Math.cos(angleB);
      const circleX = cosPhi + 2;
      const circleY = sinPhi;
      const invZ = 1 / (sinTheta * circleX * sinA + circleY * cosA + 5);
      const t = sinTheta * circleX * cosA - circleY * sinA;
      const x = Math.floor(SCREEN_WIDTH / 2 + 30 * invZ * (cosTheta * circleX * cosB - t * sinB));
      const y = Math.floor(SCREEN_HEIGHT / 2 + 15 * invZ * (cosTheta * circleX * sinB + t * cosB));
      const o = x + SCREEN_WIDTH * y;
      const luminance = Math.floor(
        8 * ((circleY * sinA - sinTheta * cosPhi * cosA) * cosB -
             sinTheta * cosPhi * sinA -
             circleY * cosA -
             cosTheta * cosPhi * sinB)
      );
      if (y >= 0 && y < SCREEN_HEIGHT && x >= 0 && x < SCREEN_WIDTH && invZ > zBuffer[o]) {
        zBuffer[o] = invZ;
        buffer[o] = CHAR_MAP[Math.max(0, luminance)];
      }
    }
  }

  donutElement.textContent = buffer.join("");
  angleA += ROTATE_SPEED_A;
  angleB += ROTATE_SPEED_B;
}

setInterval(renderFrame, FRAME_DELAY_MS);
