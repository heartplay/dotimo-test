const field = document.getElementById('field')
const elements = document.querySelectorAll('.element')
const fieldSize = 800

field.style.width = `${fieldSize}px`
field.style.height = `${fieldSize}px`
let fieldCoords = getCoords(field)

elements[0].size = 50
elements[0].style.width = `${elements[0].size}px`
elements[0].style.height = `${elements[0].size}px`
elements[0].style.zIndex = `500`
elements[0].style.backgroundColor = `black`
elements[0].style.borderColor = `red`
elements[0].style.left = `0px`
elements[0].style.top = `0px`

elements[1].size = 100
elements[1].style.width = `${elements[1].size}px`
elements[1].style.height = `${elements[1].size}px`
elements[1].style.zIndex = `500`   
elements[1].style.backgroundColor = `red`
elements[1].style.borderColor = `blue`
elements[1].style.left = `500px`
elements[1].style.top = `100px`

let maxSize = Math.max(elements[0].size, elements[1].size)

let otherElement = null
let movedElement = null
let connectedElement = null
let mouseMoveHelper = null

let dx
let dy
let dxm
let dym
let size1
let size2

elements.forEach(element => {
    element.addEventListener('mousedown', event => mouseDown(event, element)) 
})

function mouseDown(event, element) {
    if (event.which !== 1) return
    element.ondragstart = function() {
        return false
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

function mouseMove(dxm, dym, event, movedElement, otherElement, size) {
    
    fieldCoords = getCoords(field)
    let mouseX = event.clientX 
    let mouseY = event.clientY
    let x = mouseX - dxm
    let y = mouseY - dym
    let movedElementCoords = getCoords(movedElement)
    let otherElementCoords = getCoords(otherElement)
    dx = movedElementCoords.x - otherElementCoords.x
    dy = movedElementCoords.y - otherElementCoords.y
    // x = Math.max(fieldCoords.x, Math.min(x, fieldCoords.r - movedElement.size))
    // y = Math.max(fieldCoords.y, Math.min(y, fieldCoords.b - movedElement.size))

    let newX = Math.max(fieldCoords.x, Math.min(x, fieldCoords.r - movedElement.size))
    let newY = Math.max(fieldCoords.y, Math.min(y, fieldCoords.b - movedElement.size))
    
    
    
    
    // if (
    //     connectedX < fieldCoords.x || 
    //     connectedX > fieldCoords.r - otherElement.size ||
    //     connectedY < fieldCoords.y || 
    //     connectedY > fieldCoords.b - otherElement.size
    // ) {
    //     return; // Если соединенный элемент выходит за границы, прекращаем движение
    // }




    if (isOverlapping(movedElement, otherElement) == true) {
        let connectedX = newX - dx;
        let connectedY = newY - dy;

        if (connectedX < fieldCoords.x || connectedX + otherElement.size > fieldCoords.r) {
            newX = movedElementCoords.x; // Останавливаем по X
        }
        if (connectedY < fieldCoords.y || connectedY + otherElement.size > fieldCoords.b) {
            newY = movedElementCoords.y; // Останавливаем по Y
        }

        moveConnected(newX, newY, dx, dy, movedElement, otherElement)
        elements.forEach(element => {
            element.style.borderStyle = `dashed`
        })
    }
    movedElement.style.left = `${newX - fieldCoords.x}px` 
    movedElement.style.top = `${newY - fieldCoords.y}px`
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

    
    
    movedElement.style.left = `${newX - fieldCoords.x}px`
    movedElement.style.top = `${newY - fieldCoords.y}px`
    otherElement.style.left = `${connectedX - fieldCoords.x}px`
    otherElement.style.top = `${connectedY - fieldCoords.y}px`
    
    
}

function isOverlapping(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}