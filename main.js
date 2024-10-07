const field = document.getElementById('field')
const elements = document.querySelectorAll('.element')
const purpleBtn = document.getElementById('purple')
const greenBtn = document.getElementById('green')
const orangeBtn = document.getElementById('orange')
const disconnectBtn = document.getElementById('disconnect')
const fieldSize = 800

elements[0].size = 50
elements[0].style.width = `${elements[0].size}px`
elements[0].style.height = `${elements[0].size}px`
elements[0].style.zIndex = `500`
elements[0].style.backgroundColor = `rgba(120,24,196,0.3)`
elements[0].style.borderColor = `rgb(120,24,196)`
elements[0].style.transform = `translate(250px, 300px)`

elements[1].size = 100
elements[1].style.width = `${elements[1].size}px`
elements[1].style.height = `${elements[1].size}px`
elements[1].style.zIndex = `500`   
elements[1].style.backgroundColor = `rgba(107,202,191,0.3)`
elements[1].style.borderColor = `rgb(107,202,191)`
elements[1].style.transform = `translate(500px, 400px)`

field.style.width = `${fieldSize}px`
field.style.height = `${fieldSize}px`

let fieldCoords = getCoords(field)
let selectedElement = null
let otherElement = null
let movedElement = null
let connectedElement = null
let mouseMoveHelper = null
let isConnected = false
let newX, newY, dx, dy, dxm, dym, size1, size2

elements.forEach(element => {
    element.addEventListener('mousedown', event => mouseDown(event, element)) 
})

document.addEventListener('mousedown', (event) => {
    if (event.target == field) {
        selectedElement = null
        movedElement = null
        otherElement = null
        isConnected = false
        elements.forEach(element => {
            element.style.borderStyle = `solid`
        })
    }
})

function mouseDown(event, element) {
    if (event.which !== 1) return
    element.ondragstart = function() {
        return false
    }
    if (selectedElement) {
        selectedElement.style.borderStyle = `solid`
        selectedElement = null
    }
    selectedElement = element
    elements.forEach(element => {
        if (element !== selectedElement) {
            otherElement = element
        }
    })
    if (isOverlapping(selectedElement,otherElement) == true) {
        selectedElement.style.borderStyle = `dashed`
        otherElement.style.borderStyle = `dashed`
        isConnected = true
        selectedElement = null
    } else {
        selectedElement.style.borderStyle = `dashed`
        isConnected = false
    }
    movedElement = element
    let mouseX = event.clientX
    let mouseY = event.clientY
    let coords = getCoords(element)
    const dxm = mouseX - coords.x
    const dym = mouseY - coords.y
    elements.forEach(element => {
        if (element !== movedElement) {
            otherElement = element
        }
    })
    mouseMoveHelper = event => mouseMove(dxm, dym, event, movedElement, otherElement, element.size)
    document.addEventListener('mousemove', mouseMoveHelper)
    document.addEventListener('mouseup', mouseUp)
}

function mouseMove(dxm, dym, event, movedElement, otherElement) {
    fieldCoords = getCoords(field)
    let mouseX = event.clientX 
    let mouseY = event.clientY
    let x = mouseX - dxm
    let y = mouseY - dym
    let movedElementCoords = getCoords(movedElement)
    let otherElementCoords = getCoords(otherElement)
    dx = movedElementCoords.x - otherElementCoords.x
    dy = movedElementCoords.y - otherElementCoords.y
    let newX = Math.max(fieldCoords.x, Math.min(x, fieldCoords.r - movedElement.size))
    let newY = Math.max(fieldCoords.y, Math.min(y, fieldCoords.b - movedElement.size))
    // Сделать новое условие для соединения и способ соединения
    let distance = getDistance(movedElement, otherElement)
    
    if (isOverlapping(movedElement, otherElement) == true) {
        isConnected = true
        disconnectBtn.style.visibility = `visible`
        let connectedX = newX - dx;
        let connectedY = newY - dy;
        if (connectedX < fieldCoords.x || connectedX + otherElement.size > fieldCoords.r) {
            newX = movedElementCoords.x;
        }
        if (connectedY < fieldCoords.y || connectedY + otherElement.size > fieldCoords.b) {
            newY = movedElementCoords.y;
        }
        moveConnected(newX, newY, dx, dy, movedElement, otherElement)
        elements.forEach(element => {
            element.style.borderStyle = `dashed`
        })
    } else {
        movedElement.style.transform = `translate(${newX - fieldCoords.x}px, ${newY - fieldCoords.y}px)`
    }   
}

function mouseUp() {
    if (mouseMoveHelper) {
        document.removeEventListener('mousemove', mouseMoveHelper);
        mouseMoveHelper = null
    }
    if (movedElement) {
        movedElement = null
    }
    document.removeEventListener('mouseup', mouseUp)
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

function moveConnected(newX, newY, dx, dy, movedElement, otherElement) {
    let connectedX = newX - dx
    let connectedY = newY - dy
    let otherElementSize = otherElement.size
    connectedX = Math.max(fieldCoords.x, Math.min(connectedX, fieldCoords.r - otherElementSize))
    connectedY = Math.max(fieldCoords.y, Math.min(connectedY, fieldCoords.b - otherElementSize))
    movedElement.style.transform = `translate(${newX - fieldCoords.x}px, ${newY - fieldCoords.y}px)`
    otherElement.style.transform = `translate(${connectedX - fieldCoords.x}px, ${connectedY - fieldCoords.y}px)`
}

function isOverlapping(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}

function getDistance (element1, element2) {
    var cords1 = getCoords(element1)
    var cords2 = getCoords(element2)

    return Math.sqrt((cords1.x - cords2.x) ** 2 + (cords1.y - cords2.y) ** 2)
}

purpleBtn.onclick = function () {
    if (isConnected == true) {
        elements.forEach(element => {
            element.style.backgroundColor = 'rgba(120,24,196,0.3)'
            element.style.borderColor = `rgb(120,24,196)`
        })
    } else if (selectedElement) {
        selectedElement.style.backgroundColor = 'rgba(120,24,196,0.3)'
        selectedElement.style.borderColor = `rgb(120,24,196)`
    } else {
        alert('Элементы не выбраны!')
    }
}

greenBtn.onclick = function () {
    if (isConnected == true) {
        elements.forEach(element => {
            element.style.backgroundColor = 'rgba(107,202,191,0.3)'
            element.style.borderColor = `rgb(107,202,191)`
        })
    } else if (selectedElement) {
        selectedElement.style.backgroundColor = 'rgba(107,202,191,0.3)'
        selectedElement.style.borderColor = `rgb(107,202,191)`
    } else {
        alert('Элементы не выбраны!')
    }
}

orangeBtn.onclick = function () {
    if (isConnected == true) {
        elements.forEach(element => {
            element.style.backgroundColor = 'rgba(244,202,172,0.3)'
            element.style.borderColor = `rgb(244,202,172)`
        })
    } else if (selectedElement) {
        selectedElement.style.backgroundColor = 'rgba(244,202,172,0.3)'
        selectedElement.style.borderColor = `rgb(244,202,172)`
    } else {
        alert('Элементы не выбраны!')
    }
}

disconnectBtn.onclick = function () {
    alert('Пока не готово')
    // Сделать разъединение
}




