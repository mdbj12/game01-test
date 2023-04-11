const canvas = document.querySelector('canvas')
// context
const cxt = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const collisionsMap = []
for(let i = 0; i < collisions.length; i+= 70){
    collisionsMap.push(collisions.slice(i, 70 + i))
}

class Boundary {
    static width = 48
    static height = 48
    constructor({position}){
        this.position = position
        this.width = 48
        this.height = 48
    }
    draw(){
        cxt.fillStyle = 'rgba(255, 0, 0, 0)'
        cxt.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const boundaries = []
const offset = {
    x: -65,
    y: -550
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
        boundaries.push(
            new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
        }}))
    })
})
console.log(boundaries)

const mapImg = new Image()
mapImg.src = './img/game-map01.png'

const playerDownImg = new Image()
playerDownImg.src = './img/playerDown.png'

class Sprite{
    constructor({ position, velocity, image, frames = {max: 1} }){
        this.position = position
        this.image = image
        this.frames = frames

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
    }

    // what is being drawn out using canvas
    draw(){
        cxt.drawImage(
            this.image,
            // first 4 values are for cropping
            0,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            // last 4 values are actual coordinates and width/height of rendered image
            this.image.width / this.frames.max,
            this.image.height
        )
    }
}

const player = new Sprite({
    position: {
        x: ((canvas.width / 2) - (192 / 4) / 2),
        y: ((canvas.height / 2) - (68 / 2)) 
    },
    image: playerDownImg,
    frames: {
        max: 4
    }
})
const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: mapImg
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

const moveables = [background, ...boundaries]

function rectangularCollision({rectangle1, rectangle2}){
    return(
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}

function ani(){
    // creates an infinite loop to get an animation
    window.requestAnimationFrame(ani)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    player.draw()
    // moving position based on which key is pressed and only based on specific key
    let moving = true
    if (keys.w.pressed && lastKey === 'w') {
        for(let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if(
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 3
                        }
                    }
                })
            ){
                moving = false
                break
            }
        }
        if(moving)
            moveables.forEach(moveable => {
                moveable.position.y += 3
            })
        }else if (keys.a.pressed && lastKey === 'a') {
            for(let i = 0; i < boundaries.length; i++){
                const boundary = boundaries[i]
                if(
                    rectangularCollision({
                        rectangle1: player,
                        rectangle2: {
                            ...boundary,
                            position: {
                                x: boundary.position.x + 3,
                                y: boundary.position.y
                            }
                        }
                    })
                ){
                    moving = false
                    break
                }
            }
            if(moving)
            moveables.forEach(moveable => {
                moveable.position.x += 3
            })
        }else if (keys.s.pressed && lastKey === 's') {
            for(let i = 0; i < boundaries.length; i++){
                const boundary = boundaries[i]
                if(
                    rectangularCollision({
                        rectangle1: player,
                        rectangle2: {
                            ...boundary,
                            position: {
                                x: boundary.position.x,
                                y: boundary.position.y - 3
                            }
                        }
                    })
                ){
                    moving = false
                    break
                }
            }
            if(moving)
            moveables.forEach(moveable => {
            moveable.position.y -= 3
            })
        }else if (keys.d.pressed && lastKey === 'd') {
            for(let i = 0; i < boundaries.length; i++){
                const boundary = boundaries[i]
                if(
                    rectangularCollision({
                        rectangle1: player,
                        rectangle2: {
                            ...boundary,
                            position: {
                                x: boundary.position.x - 3,
                                y: boundary.position.y
                            }
                        }
                    })
                ){
                    moving = false
                    break
                }
            }
            if(moving)
            moveables.forEach(moveable => {
                moveable.position.x -= 3
            })
    }
}
ani()

// keeps track of last key pressed down
let lastKey = ''
// creating a listener event to each key, (W A S D)
window.addEventListener('keydown', (e) => {
    switch(e.key){
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
})
// when key is released, will return false
window.addEventListener('keyup', (e) => {
    switch(e.key){
        case 'w':
            keys.w.pressed = false
        case 'a':
            keys.a.pressed = false
        case 's':
            keys.s.pressed = false
        case 'd':
            keys.d.pressed = false
    }
})