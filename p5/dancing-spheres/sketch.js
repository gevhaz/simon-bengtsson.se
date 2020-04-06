let song;
let fft;
let amplitude;

let glow;

let nBass = 5;
let bassBalls = new Array(nBass);
let rBass = 24;

let nTreble = 7;
let trebleBalls = new Array(nTreble);
let rTreble = 12;

let bgCol = 0;

function preload() {
  song = loadSound("life-universe.mp3");
  glow = createImage(80,80);
  makeGlow(glow);
}

function setup() {
  canvasWidth = 640 < displayWidth ? 640 : displayWidth;
  canvasHeight = canvasWidth;
  createCanvas(canvasWidth, canvasHeight);
  song.setVolume(0.5);

  fft = new p5.FFT(0.8, 256);
  amplitude = new p5.Amplitude();

  ellipseMode(RADIUS);
  imageMode(CENTER);

  for(let i = 0; i < nBass; i++) {
    let angle = i / nBass * TWO_PI;
    bassBalls[i] = new Ball(0, angle, 0.01, rBass, color(220,242,244));
  }

  for(let i = 0; i < nTreble; i++) {
    let angle = i / nTreble * TWO_PI;
    trebleBalls[i] = new Ball(0, angle, -0.01, rTreble, color(252,243,118));
  }
}

function draw() {
  background(0);

  drawRings();

  let spectrum = fft.analyze();

  let bass = 0;
  for(let i = 2; i < 4; i++) {
    bass += spectrum[i];
  }
  bass /= 2 * 20; // mean value then prepare round to 10
  bass = 20 * floor(bass);

  let trebleArray = spectrum.splice(28,);
  let treble = max(trebleArray);

  let amp = amplitude.getLevel();

  for (let i = 0; i < nTreble; i++) {
    trebleBalls[i].spin();
    trebleBalls[i].setAngularSpeed(-0.3 * amp);
    trebleBalls[i].updateMag(treble);
    trebleBalls[i].draw();
  }

  for (let i = 0; i < nBass; i++) {
    bassBalls[i].spin();
    bassBalls[i].updateMag(1.15 * bass);
    bassBalls[i].draw();
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
  } else if (key === 'f') {
    let timenow = song.currentTime();
    song.jump(timenow + 15);
  } else if (key === 's') {
    song.stop();
  }
}

function drawRings() {
  noFill();
  stroke(70,30,30);
  strokeWeight(4);


  for (let i = 1; i * rBass < width; i++) {
    let rRing = i * rBass * 4;
    ellipse(width / 2, height / 2, rRing, rRing);
  }

  strokeWeight(1);
}

function makeGlow(img) {
  img.loadPixels();
  let center = img.width / 2;
  for(let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      let distance = dist(x, y, center, center);
      let value = distance * distance;
      let a = map(distance, img.width / 4, img.width / 2, 255, 0);
      //let a = min(127,map(distance, 0, img.width / 2, 255, 0));
      img.set(x, y, [255, 255, 255, a]);
    }
  }
  img.updatePixels();
}
