const field = document.getElementById('field')
const elements = document.querySelectorAll('.element')
const elementSize = 50

let dx
let dy



let movedElement = null
let selectedElement = null
let mouseMoveHelper = null
let otherElement = null
let connectedElement = null

elements[1].style.left = `600px`
elements[0].style.borderColor = `red`
elements[1].style.borderColor = `blue`

elements.forEach(element => {
    element.style.width = `${elementSize}px`
    element.style.height = `${elementSize}px`
    element.style.zIndex = `500`   // zIndex используется только при наличии контекста наложения(элемент - корневой, элемент имеет position: absolute или relative, opacity < 1)
    element.style.backgroundColor = `black`
})

let distanceConnection = Math.sqrt(elementSize ** 2 + elementSize ** 2)
console.log(distanceConnection)


// function getCoords(elem) {
//     var coords = elem.getBoundingClientRect()
//     return {
//         x: coords.left,
//         y: coords.top,
//         r: coords.right,
//         b: coords.bottom
//     }
// }
// let coords = getCoords(elem)
//     dx = mouseX - coords.x
//     dy = mouseY - coords.y



let distance = distanceBetween(elements[0], elements[1])
// console.log('расстояние между элементами', distance)
if (distance <= distanceConnection) {
    console.log('connected')
} else {
    console.log('disconnected')
}





// console.log(`zindex 1 elem  ${elements[0].zIndex}, zindex 2 elem ${elements[1].zIndex}`)

document.addEventListener('mousedown', (event) => {
    const target = event.target.getAttribute("id");
    if (target == "field" && selectedElement) {
        selectedElement.style.borderStyle = `solid`
        selectedElement = null
        console.log('target', target, ' selectedElement',selectedElement)
    }
})

elements.forEach(element => {
    element.addEventListener('mousedown', event => mouseDown(event, element)) 
})

function mouseDown(e, elem) {
    if (e.which !== 1) return
    if (selectedElement) {
        selectedElement.style.zIndex = `500`
        selectedElement.style.borderStyle = 'solid'
        selectedElement = null
    }
    selectedElement = elem
    selectedElement.style.zIndex = `1000`
    selectedElement.style.borderStyle = `dashed`
    
    // console.log('elements ',elements)
    // console.log('selectedElement ', selectedElement)
    
    movedElement = elem
    elements.forEach(element => {
        if (element !== movedElement) {
            otherElement = element
        }
    })
    // console.log('неподвижный элемент', otherElement)
    // console.log('выбранный ', selectedElement)
    // console.log('передвигаемый ', movedElement)

    movedElement.ondragstart = function() {
        return false;
      };
    
    var mouseX = e.clientX
    var mouseY = e.clientY
    let coords = getCoords(elem)
    dx = mouseX - coords.x
    dy = mouseY - coords.y
    mouseMoveHelper = event => mouseMove(event, movedElement)
    document.addEventListener('mousemove', mouseMoveHelper)
    document.addEventListener('mouseup', mouseUp)

    // console.log('кнопка зажата, выбранный ', selectedElement)
    // console.log('кнопка зажата, передвигаемый', movedElement)
}

function mouseMove(event, movedElement) {
    elements.forEach(element => {
        if (element !== movedElement) {
            otherElement = element
        }
    })

    // console.log('неподвижный элемент при mouseMove', otherElement)
    var mouseX = event.clientX 
    var mouseY = event.clientY
    let fieldCoords = getCoords(field)
    let x = mouseX - dx
    let y = mouseY - dy
    if (x <= fieldCoords.x) {
        x = fieldCoords.x
    }
    if (x + elementSize >= fieldCoords.r) {
        x = fieldCoords.r - elementSize
    }
    if (y <= fieldCoords.y) {
        y = fieldCoords.y
    }
    if (y + elementSize >= fieldCoords.b - 1) {
        y = fieldCoords.b - elementSize
    } 
    movedElement.style.left = `${x - fieldCoords.x}px`
    movedElement.style.top = `${y - fieldCoords.y}px`

    let distance = distanceBetween(movedElement, otherElement)
    console.log('расстояние между элементами', distance)
    if (distance <= distanceConnection) {
    console.log('connected')
    connectedElement = otherElement
    console.log(connectedElement)
    } else {
    console.log('disconnected')
    connectedElement = null
    console.log(connectedElement)
    }

    // console.log('движение, выбранный ', selectedElement)
    // console.log('движение, передвигаемый', movedElement)
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
    
    // console.log('кнопка отпущена, выбранный ', selectedElement)
    // console.log('кнопка отпущена, передвигаемый', movedElement)
}

function getCoords(elem) {
    var coords = elem.getBoundingClientRect()
    return {
        x: coords.left,
        y: coords.top,
        r: coords.right,
        b: coords.bottom
    }
}

function distanceBetween(elem1, elem2) {
    var coords1 = getCoords(elem1)
    var coords2 = getCoords(elem2)
    return Math.sqrt((coords1.x - coords2.x) ** 2 + (coords1.y - coords2.y) ** 2)
}

// function moveConnectedElement(movedElement, connectedElement) {


// }
