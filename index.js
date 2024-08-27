const canvas = document.querySelector('canvas'); //document searches entire document, and element is the canvas

canvas.width = innerWidth //inner width is actually a property from the .window object
canvas.height = innerHeight

const context = canvas.getContext('2d') //taps into canvas API

//OOP way in Java using constructor
class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    //player needs to be drawn on canvas, create own arbitrarily named function

    draw() {
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2 /* full circle*/, false)
        context.fillStyle = this.color
        //needs to be actually drawn with fill
        context.fill()
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y 
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw () {
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        context.fillStyle = this.color
        context.fill()
    }

    update() {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
        
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        context.fillStyle = this.color
        context.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

const x = canvas.width / 2
const y = canvas.height / 2

const player = new Player(x, y, 30, 'red')
const projectiles = []
const enemies = []

//sets a timer of 1000ms for enemy spawn
//Math.random() generates number between 0 and 1
//ternary operator if condition is met then execute after "?" or returns true, else execute after ":"
function spawnEnemies() {
    setInterval(() => {
        const radius = Math.random() * (30 - 10) + 10

        let x
        let y

        if (Math.random() < 0.5) {

            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        }

        else {
            (Math.random() > 0.5) 
            x = Math.random() * canvas.width
            y = Math.random() <0.5 ? 0 -radius : canvas.height + radius
        }
        const color = 'green'
        
        //to make enemies go towards player, subtract from DESTINATION
        const angle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x

        )
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1000)
}

let animationId;
//calls window animation function and loops over itself
function animate() {
    animationId = requestAnimationFrame(animate)
    context.fillStyle = 'rgba(0,0,0,0.1)'
    context.fillRect(0, 0, canvas.width, canvas.height)
    player.draw();
    projectiles.forEach((projectile, index) => {
        projectile.update()
        //remove from edges of screen
        if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        }
    })

    

    enemies.forEach((enemy, index) => {
        enemy.update()

        //enemy and player distance
        const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        if (distance - enemy.radius - player.radius < 1)
        //ends game on the frame specified above
            cancelAnimationFrame(animationId)


        //Math hypot gets distance between two points
        projectiles.forEach((projectile, projectileIndex) => {
            const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            
            if (distance - enemy.radius - projectile.radius < 1)
                //removes flashing on collision
                {
                setTimeout(() => {
                    enemies.splice(index, 1)
                    projectiles.splice(projectileIndex, 1)
                }, 0)
                    
            }
        })
    })
    
}

const colors = ['red', 'blue', 'green', 'pink', 'yellow']



//adds EventListener and passes in type of Event
//arrow function is a shorthand way of saying function () {console.log('go');}
//log out "event" to see what the mouse does and gives out clientX coordinates etc. and are passed into where projectiles spawn
window.addEventListener('click', (event) => {
    //atan 2 takes y for first argument, calculates angle between mouse click and centre point
    const angle = Math.atan2(
        event.clientY - canvas.height / 2, event.clientX - canvas.width / 2
    )
    //x angle uses cos, y uses sin
    const velocity = {
        x: Math.cos(angle), 
        y: Math.sin(angle)
    }

    const random = Math.floor(Math.random() * colors.length)

  projectiles.push(
    new Projectile(
    canvas.width / 2,
    canvas.height / 2, 
    5, 
    colors[random],
    velocity
  ))
})
animate()
spawnEnemies()
