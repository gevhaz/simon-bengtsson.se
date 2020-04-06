function Ball(mag, angle, angspeed, rad, col) {

  this.mag = mag;
  this.angle = angle;
  this.angularSpeed = angspeed;

  this.rad = rad;

  this.r = red(col);
  this.g = green(col);
  this.b = blue(col);

  this.spin = function() {
    this.angle += this.angularSpeed;
    if (this.angle > TWO_PI) {
      this.angle -= TWO_PI;
    }
  }

  this.updateMag = function(len) {
    let goal = constrain((len - 140) * 2, 0, 300);
    if (this.mag < goal) {
      this.mag = lerp(this.mag, goal, 0.6);
    } else {
      this.mag = lerp(this.mag, goal, 0.1);
    }
  }

  this.setAngularSpeed = function(angspeed) {
    this.angularSpeed = angspeed;
  }

  this.draw = function() {
    push();
    translate(width / 2, height / 2);
    rotate(this.angle);

    noStroke();
    image(glow, this.mag, 0, this.rad * 4, this.rad * 4);
    
    fill(this.r, this.g, this.b, 90);
    ellipse(this.mag, 0, this.rad, this.rad);

    pop();
  }

}
