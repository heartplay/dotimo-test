const field = document.getElementById('field');
// const elements = document.querySelectorAll('.element');
const greenBtn = document.getElementById('green');
const purpleBtn = document.getElementById('purple');
const orangeBtn = document.getElementById('orange');
const element1 = document.getElementById('element1');
const element2 = document.getElementById('element2');
const elements = [element1, element2];
// const width = field.width;
// const height = field.height;
console.log(field.width);

// const xy1 = 'left:800px; top:500px;'
// const xy2 = 'left:700px; top:700px;'\\




// console.log(elements);
let movedElement;
let selectedElement;


let isMoved = false;
let isSelected = false;




elements.forEach(element => {
  element.addEventListener('click', (e) => {
    if (selectedElement) {
      selectedElement.style.borderStyle = 'solid';
      selectedElement = null;
    }
    selectedElement = element;
    // movedElement = element;
    // selectedElement.style.top = element.style.top
    
    isSelected = true;
    
    selectedElement.style.borderStyle = 'dashed';
    

    // selectedElement.style = selectedElement.style + 'border-style: dashed;';
    // console.log(selectedElement.style.top);
    // console.log(elements);
    
  });
  element.addEventListener('mousedown', (e) => {
    movedElement = element;
    // selectedElement = element;
    
   
    document.addEventListener('mousemove', move);
    
  });
    document.addEventListener('mouseup', mouseUp);
});
// function mouseDown() {
//   document.addEventListener('mousemove', move)
// }
function mouseUp() {
  document.removeEventListener('mousemove', move);
  
}
function move(event) {
    // let x = event.clientX;
    // let y = event.clientY;
    let x = `${event.clientX - 25}px`;
    let y = `${event.clientY - 25}px`;

    let movingArea = field.getBoundingClientRect();
    // console.log(field.getBoundingClientRect().);
    if (event.clientX <= movingArea.left) {
      x = movingArea.left;
    }
    if (event.clientY <= movingArea.top) {
      y = movingArea.top;
    }
    if (event.clientX >= movingArea.right) {
      x = movingArea.right;
    }
    if (event.clientY >= movingArea.bottom) {
      y = movingArea.bottom;
    }
    // if (event.clientX <= movingArea.left || event.clientX >= movingArea.left + field.width) {
    //   x = movingArea.left;
    // }
    // if (event.clientY <= movingArea.top || event.clientY >= movingArea.top + field.height) {
    //   y = movingArea.top;
    // }
    movedElement.style.left = x;
    movedElement.style.top = y;


    


    
    // let movingArea = field.getBoundingClientRect();
    // if (x <= movingArea.left) {
    //   event.clientX = movingArea.left;
    // }
    // if (event.clientY <= movingArea.top) {
    //   event.clientY = movingArea.top;
    // }
    // movedElement.style.left = `${event.clientX - 25}px`;
    // movedElement.style.top = `${event.clientY - 25}px`;


}
    
greenBtn.onclick = function () {
  if (selectedElement) {
    selectedElement.className = 'element-green';
  }  
  
}

purpleBtn.onclick = function () {  
  if (selectedElement) {
    selectedElement.className = 'element-purple';
  }
}

orangeBtn.onclick = function () {  
  if (selectedElement) {
    selectedElement.className = 'element-orange';
  };
}

// greenBtn.onclick = function () {  
//   selectedElement.style = 'background-color: rgba(62, 184, 171, 0.3)';
// }

// function move(event) {
//   if (isMoved) {
//     movedElement.style.left = event.clientX + 'px';
//     movedElement.style.top = event.clientY + 'px';
//   }
    
// }

// function stop() {
//   document.removeEventListener('mousemove', move());
//   isMoved = false;
// }



















// element1.addEventListener('mousedown', onMouseDown);
// element1.addEventListener('mouseup', onMouseUp);




// ПЕРЕМЕЩЕНИЕ

// function onMouseDown() {
//   document.addEventListener('mousemove', onMouseMove);
// }
// function onMouseUp() {
//   document.removeEventListener('mousemove', onMouseMove);
// }
// function onMouseMove(event) {
//   element1.style.left = event.clientX + 'px';
//   element1.style.top = event.clientY + 'px';
// }





