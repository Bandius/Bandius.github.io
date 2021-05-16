function correctDisplay(display) {
  switch (display) {
    case 0:
      document.getElementById("s1").style.backgroundColor = "#00FF00";
      break;
    case 1:
      document.getElementById("s2").style.backgroundColor = "#00FF00";
      break;
    case 2:
      document.getElementById("s3").style.backgroundColor = "#00FF00";
      break;
    case 3:
      document.getElementById("s4").style.backgroundColor = "#00FF00";
      break;
    case 4:
      document.getElementById("s5").style.backgroundColor = "#00FF00";
      break;
  }
}

function changeLights(inp) {
  switch (inp) {
    case "#0000FF":
      blueLights();
      break;
    case "#FF0000":
      redLights();
      break;
    case "#FFFF00":
      yellowLights();
      break;
  }
}
function offBlueLights() {
  document.getElementById("l4").style.backgroundColor = "#000000ff";
  document.getElementById("l8").style.backgroundColor = "#000000ff";
  document.getElementById("l12").style.backgroundColor = "#000000ff";
  document.getElementById("l32").style.backgroundColor = "#000000ff";
  document.getElementById("l35").style.backgroundColor = "#000000ff";
  document.getElementById("l38").style.backgroundColor = "#000000ff";
  document.getElementById("l59").style.backgroundColor = "#000000ff";
  document.getElementById("l62").style.backgroundColor = "#000000ff";
  document.getElementById("l64").style.backgroundColor = "#000000ff";
  document.getElementById("l66").style.backgroundColor = "#000000ff";
}

function blueLights() {
  document.getElementById("l4").style.backgroundColor = "#0000ffff";
  document.getElementById("l8").style.backgroundColor = "#0000ffff";
  document.getElementById("l12").style.backgroundColor = "#0000ffff";
  document.getElementById("l32").style.backgroundColor = "#0000ffff";
  document.getElementById("l35").style.backgroundColor = "#0000ffff";
  document.getElementById("l38").style.backgroundColor = "#0000ffff";
  document.getElementById("l59").style.backgroundColor = "#0000ffff";
  document.getElementById("l62").style.backgroundColor = "#0000ffff";
  document.getElementById("l64").style.backgroundColor = "#0000ffff";
  document.getElementById("l66").style.backgroundColor = "#0000ffff";
}

function redLights() {
  document.getElementById("l5").style.backgroundColor = "#ff0000ff";
  document.getElementById("l7").style.backgroundColor = "#ff0000ff";
  document.getElementById("l9").style.backgroundColor = "#ff0000ff";
  document.getElementById("l11").style.backgroundColor = "#ff0000ff";
  document.getElementById("l31").style.backgroundColor = "#ff0000ff";
  document.getElementById("l34").style.backgroundColor = "#ff0000ff";
  document.getElementById("l37").style.backgroundColor = "#ff0000ff";
  document.getElementById("l58").style.backgroundColor = "#ff0000ff";
  document.getElementById("l61").style.backgroundColor = "#ff0000ff";
  document.getElementById("l64").style.backgroundColor = "#ff0000ff";
}

function yellowLights() {
  document.getElementById("l4").style.backgroundColor = "#ffff00ff";
  document.getElementById("l6").style.backgroundColor = "#ffff00ff";
  document.getElementById("l10").style.backgroundColor = "#ffff00ff";
  document.getElementById("l30").style.backgroundColor = "#ffff00ff";
  document.getElementById("l33").style.backgroundColor = "#ffff00ff";
  document.getElementById("l36").style.backgroundColor = "#ffff00ff";
  document.getElementById("l39").style.backgroundColor = "#ffff00ff";
  document.getElementById("l60").style.backgroundColor = "#ffff00ff";
  document.getElementById("l63").style.backgroundColor = "#ffff00ff";
  document.getElementById("l65").style.backgroundColor = "#ffff00ff";
}
function takeElement(el){
  dragElement(document.getElementById(`${el}`));  
  console.log("clicked at element", el);
}


function dragElement(elmnt){
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e){
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        console.log(`X: ${pos3}, Y: ${pos4}`);
        document.onmouseup = null;
        document.onmousemove = null;
        detectLight(pos3, pos4);
    }
}

function detectLight(x, y){
  let startX_rows1_3 = 840;
  let startX_row2 = 820;
  let startY_row1 = 560;
  let endY_row1 = 640;
  let startY_row2 = 680;
  let endY_row2 = 760;
  let startY_row3 = 800;
  let endY_row3 = 880;
  let horizotal_gap = 10;
  let horizontal_width = 30;

  if(y >= startY_row2 && y <= endY_row2){
    // this is second row of lights
    if(x >= startX_row2 && x <= startX_row2 + horizontal_width){
      console.log("Light 39");
    }else if(x >= startX_row2 + horizotal_gap + horizontal_width && x <= startX_row2 + horizotal_gap + 2*horizontal_width){
      console.log("Light 38");
    }else if(x >= startX_row2 + 2*horizotal_gap + 2*horizontal_width && x <= startX_row2 + 2*horizotal_gap + 3*horizontal_width){
      console.log("Light 37");
    }else if(x >= startX_row2 + 3*horizotal_gap + 3*horizontal_width && x <= startX_row2 + 3*horizotal_gap + 4*horizontal_width){
      console.log("Light 36");
    }else if(x >= startX_row2 + 4*horizotal_gap + 4*horizontal_width && x <= startX_row2 + 4*horizotal_gap + 5*horizontal_width){
      console.log("Light 35");
    }else if(x >= startX_row2 + 5*horizotal_gap + 5*horizontal_width && x <= startX_row2 + 5*horizotal_gap + 6*horizontal_width){
      console.log("Light 34");
    }else if(x >= startX_row2 + 6*horizotal_gap + 6*horizontal_width && x <= startX_row2 + 6*horizotal_gap + 7*horizontal_width){
      console.log("Light 33");
    }else if(x >= startX_row2 + 7*horizotal_gap + 7*horizontal_width && x <= startX_row2 + 7*horizotal_gap + 8*horizontal_width){
      console.log("Light 32");
    }else if(x >= startX_row2 + 8*horizotal_gap + 8*horizontal_width && x <= startX_row2 + 8*horizotal_gap + 9*horizontal_width){
      console.log("Light 31");
    }else if(x >= startX_row2 + 9*horizotal_gap + 9*horizontal_width && x <= startX_row2 + 9*horizotal_gap + 10*horizontal_width){
      console.log("Light 30");
    }
  }else if(y >= startY_row1 && y <= endY_row1){
    // row 1
    if(x >= startX_rows1_3 && x <= startX_rows1_3 + horizontal_width){
      console.log("Light 12");
    }else if(x >= startX_rows1_3 + horizotal_gap + horizontal_width && x <= startX_rows1_3 + horizotal_gap + 2*horizontal_width){
      console.log("Light 11");
    }else if(x >= startX_rows1_3 + 2*horizotal_gap + 2*horizontal_width && x <= startX_rows1_3 + 2*horizotal_gap + 3*horizontal_width){
      console.log("Light 10");
    }else if(x >= startX_rows1_3 + 3*horizotal_gap + 3*horizontal_width && x <= startX_rows1_3 + 3*horizotal_gap + 4*horizontal_width){
      console.log("Light 9");
    }else if(x >= startX_rows1_3 + 4*horizotal_gap + 4*horizontal_width && x <= startX_rows1_3 + 4*horizotal_gap + 5*horizontal_width){
      console.log("Light 8");
    }else if(x >= startX_rows1_3 + 5*horizotal_gap + 5*horizontal_width && x <= startX_rows1_3 + 5*horizotal_gap + 6*horizontal_width){
      console.log("Light 7");
    }else if(x >= startX_rows1_3 + 6*horizotal_gap + 6*horizontal_width && x <= startX_rows1_3 + 6*horizotal_gap + 7*horizontal_width){
      console.log("Light 6");
    }else if(x >= startX_rows1_3 + 7*horizotal_gap + 7*horizontal_width && x <= startX_rows1_3 + 7*horizotal_gap + 8*horizontal_width){
      console.log("Light 5");
    }else if(x >= startX_rows1_3 + 8*horizotal_gap + 8*horizontal_width && x <= startX_rows1_3 + 8*horizotal_gap + 9*horizontal_width){
      console.log("Light 4");
    }
  }
  else if(y >= startY_row3 && y <= endY_row3){
    // row 1
    if(x >= startX_rows1_3 && x <= startX_rows1_3 + horizontal_width){
      console.log("Light 66");
    }else if(x >= startX_rows1_3 + horizotal_gap + horizontal_width && x <= startX_rows1_3 + horizotal_gap + 2*horizontal_width){
      console.log("Light 65");
    }else if(x >= startX_rows1_3 + 2*horizotal_gap + 2*horizontal_width && x <= startX_rows1_3 + 2*horizotal_gap + 3*horizontal_width){
      console.log("Light 64");
    }else if(x >= startX_rows1_3 + 3*horizotal_gap + 3*horizontal_width && x <= startX_rows1_3 + 3*horizotal_gap + 4*horizontal_width){
      console.log("Light 63");
    }else if(x >= startX_rows1_3 + 4*horizotal_gap + 4*horizontal_width && x <= startX_rows1_3 + 4*horizotal_gap + 5*horizontal_width){
      console.log("Light 62");
    }else if(x >= startX_rows1_3 + 5*horizotal_gap + 5*horizontal_width && x <= startX_rows1_3 + 5*horizotal_gap + 6*horizontal_width){
      console.log("Light 61");
    }else if(x >= startX_rows1_3 + 6*horizotal_gap + 6*horizontal_width && x <= startX_rows1_3 + 6*horizotal_gap + 7*horizontal_width){
      console.log("Light 60");
    }else if(x >= startX_rows1_3 + 7*horizotal_gap + 7*horizontal_width && x <= startX_rows1_3 + 7*horizotal_gap + 8*horizontal_width){
      console.log("Light 59");
    }else if(x >= startX_rows1_3 + 8*horizotal_gap + 8*horizontal_width && x <= startX_rows1_3 + 8*horizotal_gap + 9*horizontal_width){
      console.log("Light 58");
    }
  }

}

function detectDisplay(x, y) {
  let startX = 740;
  let detected = 0;
  let lightFlash = 0;

  if (y >= 50 && y <= 950) {
    if (x <= startX + 80 && x >= startX) {
      detected = 5;
      // console.log("display 5");
      return 5;
    } else if (x <= startX + 180 && x >= startX + 100) {
      detected = 4;
      // console.log("display 4");
      return 4;
    } else if (x <= startX + 280 && x >= startX + 200) {
      detected = 3;
      // console.log("display 3");
      return 3;
    } else if (x <= startX + 380 && x >= startX + 300) {
      detected = 2;
      // console.log("display 2");
      return 2;
    } else if (x <= startX + 480 && x >= startX + 400) {
      detected = 1;
      // console.log("display 1");
      return 1;
    }
    // if(detected === display+1){
    //     console.log("YESSSSS");
    //     setInterval(function (){
    //         if(lightFlash === 0){
    //            blueLights();
    //            lightFlash = 1;
    //         }else{
    //             offBlueLights();
    //             lightFlash = 0;
    //         }

    //     }, 500);
    // }else{
    //     console.log("TRY AGAIN NOOB");
    // }
  }
}

var element;
var inter;
function moveSelection(evt) {
  if (inter) {
    clearTimeout(inter);
  }

  inter = setInterval(move, 10, evt);
}

function move(evt) {
  element = document.getElementById("drag");
  if (element.style.left > 500) {
    console.log("hello");
  }
  var display = detectDisplay(
    parseInt(element.style.left),
    parseInt(element.style.top)
  );
  // detect correct display after 3 seconds
  // !!! REFACTOR -> multiple console logs!!!
  var int = setInterval(function () {
    if (
      detectDisplay(
        parseInt(element.style.left),
        parseInt(element.style.top)
      ) === display &&
      display !== undefined
    ) {
      clearInterval(int);
      console.log("You are at display " + display);
    }
  }, 3000);

  switch (evt.keyCode) {
    case 65:
      element.style.left = parseInt(element.style.left) - 2 + "px";
      break;
    case 68:
      element.style.left = parseInt(element.style.left) + 2 + "px";
      break;
    case 87:
      element.style.top = parseInt(element.style.top) - 2 + "px";
      break;
    case 83:
      element.style.top = parseInt(element.style.top) + 2 + "px";
      break;
  }
}

function moving(evt) {
  clearInterval(inter);
  inter = null;
}

window.addEventListener("keydown", moveSelection);
window.addEventListener("keyup", moving);
