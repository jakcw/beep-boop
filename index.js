class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        return new Vec(this.x + other.x, this.y + other.y);
    }

    subtract(other) {
        return new Vec(this.x - other.x, this.y - other.y);
    }

    get len() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    dist(other) {
        return this.subtract(other).len;
    }

    normalise() {
        const mag = this.len;
        return new Vec(this.x / mag, this.y / mag);
    }

    scale(s) {
        return new Vec(s * this.x, s * this.y);
    }     
}


class Particle {
    constructor(x, y) {
        this.pos = new Vec(x, y);
        this.velocity = new Vec(2, 2);
        this.lifespan = 100;
    }

    update() {
        this.pos = this.pos.add(this.velocity);
        this.lifespan -= 1;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, 10, 0, 2 * Math.PI);
        ctx.fill();
    }

    isAlive() {
        return this.lifespan > 0;
    }
}


const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

let circlePos = new Vec(canvas.width / 2, canvas.height / 2);
let radius = 30;
let velocity = new Vec(0, 0);

const directionMap = {
    'W': new Vec(0, -1),
    'A': new Vec(-1, 0),
    'S': new Vec(0, 1),
    'D': new Vec(1, 0)
};

let keysPressed = {};

document.addEventListener('keydown', function(e) {
    keysPressed[e.key.toUpperCase()] =  true;
    updateVelocity();    
})

document.addEventListener('keyup', function(e) {
    delete keysPressed[e.key.toUpperCase()];
    updateVelocity();
})



function updateVelocity() {

    let newVelocity = new Vec(0, 0);
    for (const key in keysPressed) {
        if (directionMap[key]) {
            newVelocity = newVelocity.add(directionMap[key].scale(3));
        }        
    }

    velocity = newVelocity;
}

let particles = [];
let lastParticleTime = 0;
const fireRate = 100;

document.addEventListener('mousemove', function(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    mousePos = new Vec(mouseX, mouseY);

})

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        const currentTime = Date.now();
        if (currentTime - lastParticleTime > fireRate) {
            
            const direction = mousePos.subtract(circlePos).normalise();
            const speed = 2;
        
            const newParticle = new Particle(circlePos.x, circlePos.y);
            newParticle.velocity = direction.scale(speed);
            particles.push(newParticle);
    
            lastParticleTime = currentTime;
        }
    }
   
 

})

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
    })

    if (circlePos.x + radius >= canvas.width) {
        circlePos.x = canvas.width - radius;
        if (velocity.x > 0) velocity.x = 0; 
    } else if (circlePos.x - radius <= 0) {
        circlePos.x = radius;
        if (velocity.x < 0) velocity.x = 0; 
    }

    if (circlePos.y + radius >= canvas.height) {
        circlePos.y = canvas.height - radius;
        if (velocity.y > 0) velocity.y = 0;
    } else if (circlePos.y - radius <= 0) {
        circlePos.y = radius;
        if (velocity.y < 0) velocity.y = 0;
    }

    circlePos = circlePos.add(velocity);
    ctx.beginPath();
    ctx.arc(circlePos.x, circlePos.y, radius, 0, 2 * Math.PI);
    ctx.fill();
    requestAnimationFrame(update);
}

update();



