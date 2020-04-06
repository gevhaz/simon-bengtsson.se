// four chains of interconnected springs.
// Each handles a certain frequency range.
// They move up if amplitude in that frequency range rises. 
// But only above a certain amplitude.
// They jump up with heavy beats. Lerp just a little.
// They wiggle when they rise. 
// They wiggle more strongly if they rise faster
// The  chain as a whole falls with gravity.
//
// What do the springs look like?
// Maybe play with bezier curves? Start with just straight lines between
// points.

let song;
let length = 9;
let n = 4;
let ffts = [];
let chains = [];
let peakDetect;
let fs = false;
let glower;
let spectrum = [];

function preload() {
  song = loadSound("empty-cut.mp3");
}

function setup() {
  canvasWidth = 650 < displayWidth ? 650 : displayWidth;
  canvasHeight = 800;
  createCanvas(canvasWidth, canvasHeight);
  song.setVolume(0.5);

  glower = makeGlow();
  imageMode(CENTER);
  rectMode(CENTER);

  fft1 = new p5.FFT();
  ffts.push(fft1);
  peakDetect = new p5.PeakDetect();

  chains = new Array(n);
  for (let i = 0; i < n; i++) {
    chain = new Chain(i, ffts[0]);
    chains[i] = chain;
  }

  stroke(255, 50);
}

function draw() {
  background(0);

  spectrum = ffts[0].analyze();
  peakDetect.update(ffts[0]);
  if(peakDetect.isDetected) {
    for(let i = 0; i < chains.length; i++) {
      let rising = map(spectrum[int(i / n * (1024 - 200))], 
        0, 255, 100, height + 100);
      chains[i].rise(rising);
    }
  }

  for (let i = 0; i < n; i++) {
    chains[i].update();
    chains[i].show();
  }
}

function mouseClicked() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

function keyTyped() {
  if (key === 'p') {
    if (song.isPlaying()) {
      song.pause();
    } else {
      song.play();
    }
  } else if (key === 'n') {
    let timenow = song.currentTime();
    song.jump(timenow + 15);
  } else if (key === 's') {
    song.stop();
  } else if (key === 'f') {
    var fs = fullscreen();
    fullscreen(!fs);
  }
}

function Spring2D(xpos, ypos) {
  this.x = xpos;// The x- and y-coordinates
  this.y = ypos;
  this.vx = 0; // The x- and y-axis velocities
  this.vy = 0;
  this.mass = 2;
  this.gravity = 9;
  this.radius = 30;
  this.stiffness = 0.2;
  this.damping = 0.7;
  
  this.update = function(targetX, targetY) {
    var forceX = (targetX - this.x) * this.stiffness;
    var ax = forceX / this.mass;
    this.vx = this.damping * (this.vx + ax);
    this.x += this.vx;
    var forceY = (targetY - this.y) * this.stiffness;
    forceY += this.gravity;
    var ay = forceY / this.mass;
    this.vy = this.damping * (this.vy + ay);
    this.y += this.vy;
  }
  
  this.display = function(nx, ny) {
    noStroke();
    ellipse(this.x, this.y, this.radius*2, this.radius*2);
    stroke(255);
    line(this.x, this.y, nx, ny);
  }
}

class Chain {

  constructor(stringNo, fft) {
    this.x = (stringNo + 0.5) / n * width;
    this.y = 100;
    this.fft = fft;
    this.dist = 40;
    this.springs = [];
    this.target = this.y;

    for (let i = 0; i < length; i++) {
      let spring = new Spring2D(this.x, this.y + this.dist * i);
      this.springs.push(spring);
    }

  }

  update() {
    this.y = lerp(this.y, this.target, 0.1);
    this.springs[0].y = this.y;
    for (let i = 1; i < this.springs.length; i++) {

      let x = this.springs[i-1].x + random(-9, 9);
      let y = this.springs[i-1].y + random(-9, 9);
      this.springs[i].update(x, y);
    }
  }

  show() {
    for(let i = 0; i < this.springs.length; i++) {
      let x = this.springs[i].x;
      let y = this.springs[i].y;
      if (spectrum[3] + spectrum[4] < 440) {
        fill(255, 25 + i * 5, 255 - i / this.springs.length * 200);
        rect(x, y,width/n-2 - (i * 5),20);
        image(glower, x, y,width/n-2 - (i * 5),20);
      } else {
        fill(255, 25 + i * 6, 255 - i / this.springs.length * 300);
        rect(x, y,width/n-2 - (i * 5),20 + i);
        image(glower, x, y,width/n-2 - (i * 5),20 + i);
      } 
    }
  }

  rise(target) {
    this.target = height - target;
  }
}

function makeGlow() {
  let xSize = 400;
  let ySize = 400;

  let img =  createImage(xSize, ySize);
  img.loadPixels();

  for (let x = 0; x < xSize; x++) {
    for (let y = 0; y < ySize; y++) {
      let xGrad = map(sq(xSize / 2 - x), 0, sq(xSize/2), 0, 255);
      let yGrad = map(sq(ySize / 2 - y), 0, sq(ySize/2), 0, 255);
//       let xGrad -= map(sq(xSize / 2 - x), 0, sq(xSize/2), 0, 255);
//       let yGrad -= map(sq(ySize / 2 - y), 0, sq(ySize/2), 0, 255);

      let a;
      if (xGrad > yGrad) {
        a = xGrad;
      } else {
        a = yGrad;
      }

      a /= 2;

      img.set(x, y, [255,255,255,a]);
    }
  }
  img.updatePixels();

  return img;
}
