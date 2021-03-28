const WIDTH = 15
const HEIGHT = 15
// lower = faster
const INVADER_SPEED = 700
const BULLET_SPEED = 100
const SHOOT_COOLDOWN = 600

const gridElement = document.querySelector('#grid')
const scoreElement = document.querySelector('#score')
const squareElements = setupGrid()

// start on second-to-last 'row' in the middle 'column'
let currentShipIndex = (WIDTH * HEIGHT) - Math.round(WIDTH * 1.5)
let isShooting = false
let shootingInterval = null
let goingRight = true
let results = 0

const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
]
const aliensRemoved = []

function setupGrid() {
    let squares = []
    for (let i = 0; i < WIDTH * HEIGHT; i++) {
        const square = document.createElement('div')
        gridElement.appendChild(square)
        squares.push(square)
    }
    return squares
}

function setupGame() {
    squareElements[currentShipIndex].classList.add('ship')
    document.addEventListener('keydown', moveShip)
    document.addEventListener('keydown', startShooting)
    document.addEventListener('keyup', stopShooting)
    addInvaders()
    setTimeout(moveInvaders, INVADER_SPEED)
}

function addInvaders() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if(!aliensRemoved.includes(i)) {
            squareElements[alienInvaders[i]].classList.add('invader')
        }
    }
}

function removeInvaders() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squareElements[alienInvaders[i]].classList.remove('invader')
    }
}

function moveInvaders() {
    if (checkEndCondition()) {
        return
    }

    removeInvaders()
    const atLeftEdge = alienInvaders[0] % WIDTH === 0
    const atRightEdge = alienInvaders[alienInvaders.length - 1] % WIDTH === WIDTH - 1

    let movement = 0;
    if (goingRight) {
        if (atRightEdge) {
            movement += WIDTH
            goingRight = false
        } else {
            movement += 1
        }
    } else {
        if (atLeftEdge) {
            movement += WIDTH
            goingRight = true
        } else {
            movement -= 1
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += movement
    }

    addInvaders()
    setTimeout(moveInvaders, INVADER_SPEED)
}

function moveShip(event) {
    squareElements[currentShipIndex].classList.remove('ship')
    switch (event.key) {
        case 'ArrowLeft':
            if (currentShipIndex % WIDTH !== 0)
                currentShipIndex -= 1
            break
        case 'ArrowRight' :
            if (currentShipIndex % WIDTH < WIDTH - 1)
                currentShipIndex += 1
            break
    }
    squareElements[currentShipIndex].classList.add('ship')
}

function startShooting(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (isShooting === false) {
                isShooting = true
                shoot()
                shootingInterval = setInterval(shoot, SHOOT_COOLDOWN)
            }
            break
    }
}

function stopShooting(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (isShooting === true) {
                isShooting = false
                clearInterval(shootingInterval)
            }
            break
    }
}

function shoot() {
    let currentBulletIndex = currentShipIndex
    moveBullet()

    function moveBullet() {
        if (currentBulletIndex - WIDTH >= 0) {
            squareElements[currentBulletIndex].classList.remove('bullet')
            currentBulletIndex -= WIDTH
            squareElements[currentBulletIndex].classList.add('bullet')

            if (squareElements[currentBulletIndex].classList.contains('invader')) {
                squareElements[currentBulletIndex].classList.remove('bullet')
                squareElements[currentBulletIndex].classList.remove('invader')
                squareElements[currentBulletIndex].classList.add('explosion')
    
                setTimeout(()=> squareElements[currentBulletIndex].classList.remove('explosion'), 200)
    
                const alienRemoved = alienInvaders.indexOf(currentBulletIndex)
                aliensRemoved.push(alienRemoved)
                results++
                scoreElement.innerHTML = results
                
            } else { // continue to move if no invader hit or not at edge
                setTimeout(moveBullet, BULLET_SPEED)
            }
        } else {
            squareElements[currentBulletIndex].classList.remove('bullet')
        }
    }
}

function checkEndCondition() {
    let end = false
    if (squareElements[currentShipIndex].classList.contains('invader', 'ship')) {
        scoreElement.innerHTML = 'GAME OVER'
        end = true
    }
    if (alienInvaders[alienInvaders.length - 1] + 1 >= squareElements.length) {
        scoreElement.innerHTML = 'GAME OVER'
        end = true
    }
    if (aliensRemoved.length === alienInvaders.length) {
        scoreElement.innerHTML = 'YOU WIN'
        end = true
    }
    return end
}

setupGame()
