const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let mouse = {
    x: 500,
    y: 500
}
window.addEventListener("mousemove", (event) => {
    mouse.x = event.x,
        mouse.y = event.y
})
function getDistance(x1, y1, x2, y2) {
    xDistance = x2 - x1
    yDistance = y2 - y1
    return Math.sqrt(xDistance ** 2 + yDistance ** 2)
}
function randomIntFrom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function Circle(x, y, r, dx = 5, dy = 5, color = "hsl(255,50%,50%)") {
    this.x = x
    this.y = y
    this.r = r
    this.mass = 1
    this.radians = 0;
    this.velocity = {
        x: dx,
        y: dy,
    };

    this.color = color
    this.draw = () => {
        c.beginPath()
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
        c.strokeStyle = "#FFFFFF"
        c.fillStyle = this.color
        c.stroke()
        c.fill()
    }

    this.update = (particles) => {
        c.fillStyle = "rgba(0,0,0,0.08)"
        c.fillRect(0, 0, innerWidth, innerHeight)
        if (this.x > canvas.width - this.r || this.x < 0 + this.r) {
            this.velocity.x = -this.velocity.x
        } else if (this.y > canvas.height - this.r || this.y < 0 + this.r) {
            this.velocity.y = -this.velocity.y
        }

        for (let i = 0; i < particles.length; i++) {
            if (this != particles[i]) {
                if (getDistance(this.x, this.y, particles[i].x, particles[i].y) < this.r + particles[i].r) {
                    resolveCollision(this, particles[i])
                    this.color=`hsl(${randomIntFrom(0,255)},100%,50%)`
                    c.fill()
                }
            }
        }
        this.radians += 0.01;
        // this.x += (2 * Math.cos(this.radians / 2)) / 2
        // this.y += (2 * Math.sin(this.radians / 2)) / 2
        this.y += this.velocity.y
        this.x += this.velocity.x
        this.draw()
    }

}
const particles = []
function init() {
    let x, y, r;
    for (let i = 0; i < 5; i++) {
        x = randomIntFrom(100, innerWidth - 110)
        y = randomIntFrom(100, innerHeight - 110)
        if (i != 0) {
            for (j = 0; j < particles.length; j++) {
                if (getDistance(x, y, particles[j].x, particles[j].y) - 200 < 0) {
                    x = randomIntFrom(100, innerWidth - 100)
                    y = randomIntFrom(100, innerHeight - 100)
                    j -= 1  
                }
            }
        }
        particle = new Circle(x + 100, y, 100)
        particles.push(particle)
        particle.update(particles)
    }
}
function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };
    return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.r;
        const m2 = otherParticle.r;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}
function animate() {
    requestAnimationFrame(animate)
    for (i = 0; i < particles.length; i++) {
        particles[i].update(particles)
    }
}
init()
animate()
