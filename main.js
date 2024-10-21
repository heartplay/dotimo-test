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
    createElement(400, 200, 100, 'rgb(42,176,163)', 'rgba(42,176,163,0.3)')
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
    if (currentElement && !isIntersecting(currentElement, otherElement))
    connectElements()
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
    if (isConnected) {
        dx = currentElement.x - otherElement.x
        dy = currentElement.y - otherElement.y
        otherElement.x = newX - dx
        otherElement.y = newY - dy
    }
    currentElement.x = newX
    currentElement.y = newY
}

// function connectElements() {
//     if (!currentElement || !otherElement) {
//         return
//     }
//     if (isIntersecting(currentElement, otherElement)) {
//         isConnecting = false
//         isConnected = true
//         disconnectBtn.style.visibility = `visible`
//         return
//     }
//     let distance = getDistanceBetween(currentElement, otherElement)
//     let connectionDistance = currentElement.size + otherElement.size + ctx.lineWidth + 10
//     if (distance <= connectionDistance && !isIntersecting(currentElement, otherElement)) {
//         isConnecting = true
//         isDragging = false
//         otherElement.x = lerp(otherElement.x, currentElement.x, 0.08)
//         otherElement.y = lerp(otherElement.y, currentElement.y, 0.08)
//     }
// }

function connectElements() {
    if (!currentElement || isConnected) {
        return
    }
    let distance = getDistanceBetween(currentElement, otherElement)
    let connectionDistance = currentElement.size + otherElement.size + ctx.lineWidth
    if (isIntersecting(currentElement, otherElement)) {
        isConnecting = false
        isConnected = true
        disconnectBtn.style.visibility = `visible`
        return
    }
    if (distance <= connectionDistance && !isIntersecting(currentElement, otherElement)) {
        isConnecting = true
        // isDragging = false
        otherElement.x = lerp(otherElement.x, currentElement.x, 0.01)
        otherElement.y = lerp(otherElement.y, currentElement.y, 0.01)
        if (isIntersecting(currentElement, otherElement)) {
            isConnecting = false
            isConnected = true
            disconnectBtn.style.visibility = `visible`
            return
        }
    }
}

// function connectElements() {
//     if (!currentElement || isConnected) {
//         return
//     }
//     let distance = getDistanceBetween(currentElement, otherElement)
//     let connectionDistance = currentElement.size + otherElement.size + ctx.lineWidth
//     let speed = Math.pow(connectionDistance / distance, 2)
//     if (isIntersecting(currentElement, otherElement)) {
//         isConnecting = false
//         isConnected = true
//         disconnectBtn.style.visibility = `visible`
//         return
//     } else if (distance <= connectionDistance) {
//         isConnecting = true
//         otherElement.x -= (otherElement.x - currentElement.x) / distance * speed
//         otherElement.y -= (otherElement.y - currentElement.y) / distance * speed
//     }
//     // if (distance <= connectionDistance && !isIntersecting(currentElement, otherElement)) {
//     //     isConnecting = true
//     //     otherElement.x -= (otherElement.x - currentElement.x) / distance * speed
//     //     otherElement.y -= (otherElement.y - currentElement.y) / distance * speed
//     //     if (isIntersecting(currentElement, otherElement)) {
//     //         isConnecting = false
//     //         isConnected = true
//     //         disconnectBtn.style.visibility = `visible`
//     //         return
//     //     }
//     // }
// }

function isIntersecting(element1, element2) {
    return !(element1.x + ctx.lineWidth + element1.size < element2.x - ctx.lineWidth || 
             element1.x - ctx.lineWidth > element2.x + element2.size + ctx.lineWidth || 
             element1.y + ctx.lineWidth + element1.size < element2.y - ctx.lineWidth || 
             element1.y - ctx.lineWidth > element2.y + element2.size + ctx.lineWidth )
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
        ctx.rect(element.x, element.y, element.size, element.size)
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
    if (x > element.x && x < element.x + element.size && y > element.y && y < element.y + element.size) {
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

function getCenterCoords(element) {
    return {
        centerX: element.x + element.size / 2,
        centerY: element.y + element.size / 2
    }
}

function getDistanceBetween(element1, element2) {
    let centerCords1 = getCenterCoords(element1)
    let centerCords2 = getCenterCoords(element2)
    return Math.hypot(centerCords1.centerX - centerCords2.centerX, centerCords1.centerY - centerCords2.centerY)
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
    // Сделать разъединение
}

