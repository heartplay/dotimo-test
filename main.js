const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const field = document.getElementById('field')
const purpleBtn = document.getElementById('purple')
const greenBtn = document.getElementById('green')
const orangeBtn = document.getElementById('orange')
const disconnectBtn = document.getElementById('disconnect')

canvas.width = 800
canvas.height = 800
ctx.lineWidth = 1

let currentElement, otherElement
let offsetX, offsetY
let newX, newY
let dx, dy
let isConnected = false
let isConnecting = false
let isDragging = false
let fieldCords = getCoords(field)

let elements = [
    createElement(200, 200, 50, 'rgb(120,24,196)', 'rgba(120,24,196,0.3)'),
    createElement(400, 200, 70, 'rgb(42,176,163)', 'rgba(42,176,163,0.3)')
]

function createElement(x, y, size, borderColor, color) {
    return {
        x: x,
        y: y,
        size: size,
        borderColor: borderColor,
        color: color,
        connectedElements: []
    }
}

canvas.addEventListener('mousedown', (event) => {
    let startX = event.clientX - fieldCords.x
    let startY = event.clientY - fieldCords.y

    currentElement = elements.find(element => isMouseOnElement(startX, startY, element))
    elements.forEach(elem => {
        if (elem == currentElement) {
            return
        }
        otherElement = elem
    })
    if (currentElement) {
        isDragging = true
        offsetX = startX - currentElement.x
        offsetY = startY - currentElement.y
        newX = startX - offsetX
        newY = startY - offsetY
    } else {
        isDragging = false
    }
})

document.addEventListener('mousemove', (event) => {
    if (!isDragging) {
        return 
    }
    // if (isConnecting == true) {
    //     return
    // }
    let mouseX = event.clientX - fieldCords.x
    let mouseY = event.clientY - fieldCords.y
    newX = mouseX - offsetX
    newY = mouseY - offsetY
})

document.addEventListener('mouseup', (event) => {
    if (!isDragging) {
        return
    }
    isDragging = false
})

drawAll()

function drawAll() {
    clear()
    if (isDragging) {
        updateElementsPosition()
    }
    if (currentElement && !isIntersecting(currentElement, otherElement)) {
        connectElements()
    }
    // if (!isConnected) {
    //     connectElements()
    // }
    drawElements()
    window.requestAnimationFrame(drawAll)
}

function updateElementsPosition() {
    if (!currentElement) {
        return
    }
    newX = Math.max(0, Math.min(newX, canvas.width - currentElement.size))
    newY = Math.max(0, Math.min(newY, canvas.height - currentElement.size))
    if (isIntersecting(currentElement, otherElement)) {
        isConnected = true
        disconnectBtn.style.visibility = `visible`
    }
    if (isConnected) {
        dx = currentElement.x - otherElement.x
        dy = currentElement.y - otherElement.y
        otherElement.x = newX - dx
        otherElement.y = newY - dy
    }
    currentElement.x = newX
    currentElement.y = newY
}

function connectElements() {
    if (!currentElement || isConnected) {
        return
    }
    if (isIntersecting(currentElement, otherElement)) {
        isConnecting = false
        return
    }
    let distance = getDistanceBetween(currentElement, otherElement)
    let connectionDistance = currentElement.size + otherElement.size + ctx.lineWidth
    let speed = Math.pow(connectionDistance / distance, 2)
    if (distance <= connectionDistance && !isIntersecting(currentElement, otherElement)) {
        isConnecting = true
        // let leftToRight = (currentElement.x - currentElement.size / 2 - ctx.lineWidth) - (otherElement.x + otherElement.size / 2 + ctx.lineWidth)
        // let rightToLeft = (currentElement.x + currentElement.size / 2 + ctx.lineWidth) - (otherElement.x - otherElement.size / 2 - ctx.lineWidth)
        // let topToBottmom = (currentElement.y - currentElement.size / 2 - ctx.lineWidth) - (otherElement.y + otherElement.size / 2 + ctx.lineWidth)
        // let bottomToTop = (currentElement.y + currentElement.size / 2 + ctx.lineWidth) - (otherElement.y - otherElement.size / 2 - ctx.lineWidth)
        // console.log(leftToRight, rightToLeft, topToBottmom, bottomToTop)
        // let a = Math.abs(leftToRight) < Math.abs(rightToLeft) ? leftToRight : rightToLeft
        // let b = Math.abs(topToBottmom) < Math.abs(bottomToTop) ? topToBottmom : bottomToTop
        let dx = currentElement.x - otherElement.x
        let dy = currentElement.y - otherElement.y
        if (Math.abs(dx) > Math.abs(dy)) {
            otherElement.x += dx / distance * speed
        } else if ((Math.abs(dy) > Math.abs(dx))) {
            otherElement.y += dy / distance * speed
        }
            
        

        // if (dx < dy) {

        // }

        // console.log('a',a,'b',b)

        // if (Math.abs(a) > Math.abs(b) && Math.abs(currentElement.y - otherElement.y) < currentElement.size) {
        //     let c = a 
        //     otherElement.x += c / distance * speed
        // } 
        // else if (Math.abs(a) < Math.abs(b) && Math.abs(currentElement.x - otherElement.x) < currentElement.size) {
        //     let c = b
        //     otherElement.y += c / distance * speed
        // }
        // else {
        //     otherElement.x += a / distance * speed
        //     otherElement.y += b / distance * speed
        // }
        isConnecting = true
        // otherElement.x -= (otherElement.x - currentElement.x) / distance * speed
        // otherElement.y -= (otherElement.y - currentElement.y) / distance * speed
    }
}

function isIntersecting(element1, element2) {
    return !(element1.x + ctx.lineWidth + element1.size / 2 < element2.x - ctx.lineWidth - element2.size / 2 || 
             element1.x - ctx.lineWidth - element1.size / 2 > element2.x + ctx.lineWidth + element2.size / 2 || 
             element1.y + ctx.lineWidth + element1.size / 2 < element2.y - ctx.lineWidth - element2.size / 2 || 
             element1.y - ctx.lineWidth - element1.size / 2 > element2.y + ctx.lineWidth + element2.size / 2 )
}

function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

function drawElements() {
    elements.forEach(element => {
        ctx.beginPath()
        ctx.strokeStyle = element.borderColor
        ctx.fillStyle = element.color
        if (isConnected && currentElement) {
            ctx.setLineDash([15, 5])
        } else if (element == currentElement) {
            ctx.setLineDash([15, 5])
        } else {
            ctx.setLineDash([])
        }
        ctx.rect(element.x - element.size / 2, element.y - element.size / 2, element.size, element.size)
        ctx.fill()
        ctx.stroke()
        ctx.strokeStyle = null
        ctx.fillStyle = null
    })
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function isMouseOnElement(x, y, element) {
    if (x > element.x - element.size / 2 && x < element.x + element.size / 2 && y > element.y - element.size / 2 && y < element.y + element.size / 2) {
        return true
    } else {
        return false
    }
}

function getCoords(element) {
    var coords = element.getBoundingClientRect()
    return {
        x: coords.left,
        y: coords.top,
        r: coords.right,
        b: coords.bottom
    }
}

function getDistanceBetween(element1, element2) {
    return Math.hypot(element1.x - element2.x, element1.y - element2.y)
}

function changeColor(borderColor, color) {
    if (currentElement == null) {
        alert('Элемент не выбран!')
        return
    }
    elements.forEach(element => {
        if (isConnected) {
            elements.forEach(elem => {
                elem.borderColor = borderColor
                elem.color = color
            })
        } else {
            if (element !== currentElement) {
                return
            }
            element.borderColor = borderColor
            element.color = color
        }
    })
}

purpleBtn.onclick = function () {
    changeColor(`rgb(120,24,196)`, 'rgba(120,24,196,0.3)')
}

greenBtn.onclick = function () {
    changeColor(`rgb(42,176,163)`, 'rgba(42,176,163,0.3)')
}

orangeBtn.onclick = function () {
    changeColor(`rgb(231,142,76)`, 'rgba(231,142,76,0.3)')
}

disconnectBtn.onclick = function () {
    alert('Пока не готово')
}

