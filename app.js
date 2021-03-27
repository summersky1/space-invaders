const WIDTH = 15
const HEIGHT = 15
// lower = faster
const INVADER_SPEED = 800
const BULLET_SPEED = 100

const gridElement = document.querySelector('.grid')
const resultsDisplay = document.querySelector('.results')
const squareElements = setupGrid()

// start on second-to-last 'row' in the middle 'column'
let currentShooterIndex = (WIDTH * HEIGHT) - Math.round(WIDTH * 1.5)
let direction = 1
let invadersId
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
    squareElements[currentShooterIndex].classList.add('shooter')
    document.addEventListener('keydown', moveShooter)
    document.addEventListener('keydown', shoot)
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
    const leftEdge = alienInvaders[0] % WIDTH === 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % WIDTH === WIDTH -1

    if (rightEdge && goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += WIDTH + 1
            direction = -1
            goingRight = false
        }
    }

    if (leftEdge && !goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += WIDTH - 1
            direction = 1
            goingRight = true
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }

    addInvaders()
    setTimeout(moveInvaders, INVADER_SPEED)
}

function moveShooter(event) {
    squareElements[currentShooterIndex].classList.remove('shooter')
    switch (event.key) {
        case 'ArrowLeft':
            if (currentShooterIndex % WIDTH !== 0)
                currentShooterIndex -= 1
            break
        case 'ArrowRight' :
            if (currentShooterIndex % WIDTH < WIDTH - 1)
                currentShooterIndex += 1
            break
    }
    squareElements[currentShooterIndex].classList.add('shooter')
}

function shoot(event) {
    let currentBulletIndex = currentShooterIndex

    switch (event.key) {
        case 'ArrowUp':
            moveBullet()
            break
    }

    function moveBullet() {
        if (currentBulletIndex - WIDTH >= 0) {
            squareElements[currentBulletIndex].classList.remove('bullet')
            currentBulletIndex -= WIDTH
            squareElements[currentBulletIndex].classList.add('bullet')

            if (squareElements[currentBulletIndex].classList.contains('invader')) {
                squareElements[currentBulletIndex].classList.remove('bullet')
                squareElements[currentBulletIndex].classList.remove('invader')
                squareElements[currentBulletIndex].classList.add('boom')
    
                setTimeout(()=> squareElements[currentBulletIndex].classList.remove('boom'), 200)
    
                const alienRemoved = alienInvaders.indexOf(currentBulletIndex)
                aliensRemoved.push(alienRemoved)
                results++
                resultsDisplay.innerHTML = results
                
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
    if (squareElements[currentShooterIndex].classList.contains('invader', 'shooter')) {
        resultsDisplay.innerHTML = 'GAME OVER'
        end = true
    }

    if (alienInvaders[alienInvaders.length - 1] + 1 >= squareElements.length) {
        resultsDisplay.innerHTML = 'GAME OVER'
        end = true
    }
    
    if (aliensRemoved.length === alienInvaders.length) {
        resultsDisplay.innerHTML = 'YOU WIN'
        end = true
    }
    return end
}

setupGame()
