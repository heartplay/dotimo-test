const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const field = document.getElementById('field')
const purpleBtn = document.getElementById('purple')
const greenBtn = document.getElementById('green')
const orangeBtn = document.getElementById('orange')

canvas.width = 800
canvas.height = 800
ctx.lineWidth = `2`

let currentElement, mouseX, mouseY, offsetX, offsetY, newX, newY
let isDragging = false
let fieldCords = getCoords(field)

let elements = [
    createElement(200, 200, 50, `rgb(120,24,196)`, 'rgba(120,24,196,0.3)'),
    createElement(400, 200, 50, 'rgb(107,202,191)', 'rgba(107,202,191,0.3)')
]

const connectDistance = elements[0].size + elements[1].size + parseInt(ctx.lineWidth) + 10
console.log(connectDistance)

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
    currentElement = elements.find(element => isMouseOnElement(startX, startY, element) == true)
    
    if (currentElement) {
        isDragging = true
        offsetX = startX - currentElement.x
        offsetY = startY - currentElement.y
        newX = currentElement.x
        newY = currentElement.y
    } else {
        isDragging = false
    }
})

document.addEventListener('mousemove', (event) => {
    if (!isDragging) {
        return 
    } else {
        mouseX = event.clientX - fieldCords.x
        mouseY = event.clientY - fieldCords.y
        newX = Math.max(0, Math.min(mouseX - offsetX, canvas.width - currentElement.size))
        newY = Math.max(0, Math.min(mouseY - offsetY, canvas.height - currentElement.size))
        
    }
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
    elementPosition()
    connectElements()
    drawElements()
    window.requestAnimationFrame(drawAll)
}

 function connectElements() {
        if (!currentElement) {
            return
        }
        elements.forEach(element => {
            if (element == currentElement) {
                return
            }
            let distance = getDistanceBetween(currentElement, element) + parseInt(ctx.lineWidth)
            console.log(distance)
            if (distance <= connectDistance && isOverlapping(currentElement, element) !== true) {
                    element.x = lerp(element.x, currentElement.x, 0.1)
                    element.y = lerp(element.y, currentElement.y, 0.1)

            }
    
            // if (isOverlapping(currentElement, element)) {
            //     console.log('коннект')
                
            // }
            
    
    
    
        })
    }

function elementPosition () {
    if (currentElement && isDragging) {
        currentElement.x = lerp(currentElement.x, newX, 0.1)
        currentElement.y = lerp(currentElement.y, newY, 0.1)
    }
}


function isOverlapping(element1, element2) {
    return !(element1.x + element1.size < element2.x || 
             element1.x > element2.x + element2.size || 
             element1.y + element1.size < element2.y || 
             element1.y > element2.x + element2.size)
}

function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}


function drawElements() {
    elements.forEach(element => {
        ctx.beginPath()
        ctx.strokeStyle = element.borderColor
        ctx.fillStyle = element.color
        if (element == currentElement) {
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
    let elementX = element.x
    let elementR = element.x + element.size
    let elementY = element.y
    let elementB = element.y + element.size
    if (x > elementX && x < elementR && y > elementY && y < elementB) {
        return true
    }
    return false
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

purpleBtn.onclick = function () {
    if (currentElement == null) {
        alert('Элемент не выбран!')
        return
    }
    elements.forEach(element => {
        if (element !== currentElement) {
            return
        } else {
            element.borderColor = `rgb(120,24,196)`
            element.color = 'rgba(120,24,196,0.3)'
        }
        drawElements()
    })
}

greenBtn.onclick = function () {
    if (currentElement == null) {
        alert('Элемент не выбран!')
        return
    }
    elements.forEach(element => {
        if (element !== currentElement) {
            return
        } else {
            element.borderColor = `rgb(107,202,191)`
            element.color = 'rgba(107,202,191,0.3)'
        }
        drawElements()
    })
}

orangeBtn.onclick = function () {
    if (currentElement == null) {
        alert('Элемент не выбран!')
        return
    }
    elements.forEach(element => {
        if (element !== currentElement) {
            return
        } else {
            element.borderColor = `rgb(244,202,172)`
            element.color = 'rgba(244,202,172,0.3)'
        }
        drawElements()
    })
}


