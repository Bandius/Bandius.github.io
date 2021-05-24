MQTTclient = new Paho.MQTT.Client(
  "openlab.kpi.fei.tuke.sk",
  80,
  "/mqtt",
  "ib149cd_testing_" + new Date() + Math.random() * 1000
);
MQTTclient.onConnectionLost = onConnectionLost;
MQTTclient.onMessageArrived = onMessage;
MQTTclient.connect({ onSuccess: onConnect });

// testing topics
const TOPIC_POS_9 = "experiments/mapPositions/ib149cd/0";
const TOPIC_VOICE = "experiments/voice/recognition/ib149cd";

// topics for openlab
// const TOPIC_POS_9 = 'openlab/mapPositions/9';
// const TOPIC_POS_11= 'openlab/mapPositions/11';
// const TOPIC_VOICE = 'openlab/voice/recognition';

var started = false;
var finished = false;

function onConnect() {
  console.log("connected to MQTT");
  intro();
}

function intro(){
  const info1 =
    "V tejto hre vám poviem farbu. Vašou úlohou bude hľadať svetlo rovnakej farby a postaviť sa na neho. Ak budete pripravení povedzte mi, Chceme hrať";
  // olaSay(info1);
  listen();
}

var start = ["chceme hrať", "chcem hrať", "Chceme hrať", "Chcem hrať"];

function onMessage(message) {
  msg = JSON.parse(message.payloadString);
  if (message.destinationName == "experiments/voice/recognition/ib149cd") {
    if (msg.status == "recognized") {
      console.log(msg.recognized);
      if (!started && start.includes(msg.recognized)) {
        started = true;
        changeScreen();
      }
    }
  } else {
    position = msg.positions[0];
    // console.log(position);
    if (!finished){
      detectLight(position[0], position[1]);
    }
  }
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
  MQTTclient.connect({ onSuccess: onConnect });
}

// Subscribing and unsubscribing topics
function listen() {
  console.log("I am listening");
  MQTTclient.subscribe(TOPIC_VOICE);
}

function doNotListen() {
  console.log("Paused listening");
  MQTTclient.unsubscribe(TOPIC_VOICE);
}

function track(){
  console.log("Started tracking");
  MQTTclient.subscribe(TOPIC_POS_9);
  // MQTTclient.subscribe(TOPIC_POS_11);
}

function doNotTrack(){
  console.log("Stopped tracking");
  MQTTclient.unsubscribe(TOPIC_POS_9);
  // MQTTclient.unsubscribe(TOPIC_POS_11);
}

function unsubscribe() {
  MQTTclient.unsubscribe(TOPIC_POS_9);
  MQTTclient.unsubscribe(TOPIC_VOICE);
  // MQTTclient.unsubscribe(TOPIC_POS_9);
}
//---------------------------------------------------------------------

const correctMessages = ["Super, našiel si ho", "Jupí, si jednotka"];
const incorrectMessages = [
  "Toto nie je tá správna farba",
  "Skús ju nájsť ešte raz",
];

function gameCompleted() {
  finished = true;
  // console.log("WWCD");
  unsubscribe();
}

var correct_lights = [];
let detected_light;
let delay = false;
var correct_light = 0;
var repeater = 0;
var scanning = true;
var cycles;

function compare_lights() {
  for (i in correct_lights) {
    if (detected_light == correct_lights[i]) {
      return true;
    }
  }
  return false;
}

function timer() {
  if (!finished && scanning) {
    if (compare_lights() && delay) {
      clearInterval(repeater);
      gameCompleted();
      var randomCorrect =
        correctMessages[Math.floor(Math.random() * correctMessages.length)];
      console.log(randomCorrect);
      // olaSay(randomCorrect);
    }
    if (compare_lights()) {
      delay = true;
    }
    if (!delay && cycles == 1) {
      // clearInterval(repeater);
      scanning = false;
      cycles = 0;
      var randomIncorrect =
        incorrectMessages[Math.floor(Math.random() * incorrectMessages.length)];
      console.log(randomIncorrect);
      // olaSay(randomIncorrect);
    }
    cycles += 1;
    repeater = setTimeout(timer, 5000);
  }
}

var detecting = false;

function detectLight(x, y) {
  // top
  const startY_row1 = 300;
  const endY_row1 = 330;
  // L = 62
  // middle
  const startY_row2 = 350;
  const endY_row2 = 380;
  // bottom
  const startY_row3 = 410;
  const endY_row3 = 430;

  const lights_1_3 = [
    [460, 472],
    [484, 496],
    [508, 520],
    [532, 544],
    [556, 568],
    [580, 592],
    [604, 616],
    [628, 640],
    [652, 664],
    [676, 688],
    [700, 712],
    [724, 736],
    [748, 760],
  ];
  const lights_2 = [
    [472, 484],
    [496, 508],
    [520, 532],
    [544, 556],
    [568, 580],
    [592, 604],
    [616, 628],
    [640, 652],
    [664, 676],
    [688, 700],
    [712, 724],
    [736, 748],
  ];
  const lights_1_values = [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  const lights_3_values = [67, 66, 65, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55];
  const lights_2_values = [39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28];

  if (y >= startY_row1 && y <= endY_row1) {
    // row 1
    for (var i = 0; i < 13; i++) {
      if (x >= lights_1_3[i][0] && x <= lights_1_3[i][1]) {
        if (lights_1_values[i] != detected_light) {
          detecting = false;
          cycles = 0;
          clearInterval(repeater);
          delay = false;
        }
        if (!detecting) {
          console.log("User at light number: ", lights_1_values[i]);
          detected_light = lights_1_values[i];
          detecting = true;
          scanning = true;
          timer();
        }
      }
    }
  } else if (y >= startY_row2 && y <= endY_row2) {
    // row 2
    for (var i = 0; i < 12; i++) {
      if (x >= lights_2[i][0] && x <= lights_2[i][1]) {
        if (lights_2_values[i] != detected_light) {
          detecting = false;
          cycles = 0;
          clearInterval(repeater);
          delay = false;
        }
        if (!detecting) {
          console.log("User at light number: ", lights_2_values[i]);
          detected_light = lights_2_values[i];
          detecting = true;
          scanning = true;
          timer();
        }
      }
    }
  } else if (y >= startY_row3 && y <= endY_row3) {
    // row 3
    for (var i = 0; i < 13; i++) {
      if (x >= lights_1_3[i][0] && x <= lights_1_3[i][1]) {
        if (lights_3_values[i] != detected_light) {
          detecting = false;
          cycles = 0;
          clearInterval(repeater);
          delay = false;
        }
        if (!detecting) {
          console.log("User at light number: ", lights_3_values[i]);
          detected_light = lights_3_values[i];
          detecting = true;
          scanning = true;
          timer();
        }
      }
    }
  }
}

function rgbToColor(rgbCode){
  switch(rgbCode){
    case "#0000FF":
      return "modrú";
    case "#FF0000":
      return "červenú";
    case "#FFFF00":
      return "žltú";
  }
}

function changeScreen() {
  var color = Math.floor(Math.random() * 3);
  switch (color) {
    case 0:
      color = "#0000FF";
      correct_lights = [4, 8, 12, 32, 35, 38, 59, 62, 64, 66];
      break;
    case 1:
      color = "#FF0000";
      correct_lights = [5, 7, 9, 11, 31, 34, 37, 58, 61, 64];
      break;
    case 2:
      color = "#FFFF00";
      correct_lights = [4, 6, 10, 30, 33, 36, 39, 60, 63, 65];
      break;
  }
  setTimeout(function () {
    // changeLights(color);
    document.getElementById("text").innerHTML = `Nájdite ${rgbToColor(color)} farbu:`;
    // switch(color){
    //   case "#0000FF":
    //     olaSay("Nájdi modrú farbu");
    //     break;
    //   case "#FF0000":
    //     olaSay("Nájdi červenú farbu");
    //     break;
    //   case "#FFFF00":
    //     olaSay("Nájdi žltú farbu");
    //     break;
    // } 

    document.getElementById("hraj").style.visibility = "hidden";
    // console.log(color);
    console.log(correct_lights);
    // document.getElementById('color').style.backgroundColor = color;
  }, 2000);
}

// const lights_blue = require('../assets/lights/lights_blue.json');
// const lights_red = require('../assets/lights/lights_red.json');
// const lights_yellow = require('../assets/lights/lights_yellow.json');

// function changeLights(color) {
//   if(mqttClient.isConnected()){
//     var content;
//     switch (color) {
//       case "#0000FF":
//         content = lights_blue;
//         break;
//       case "#FF0000":
//         content = lights_red;
//         break;
//       case "#FFFF00":
//         content = lights_yellow;
//         break;
//     }
//     var message = new Paho.MQTT.Message(JSON.stringify(content));
//     message.destinationName = "openlab/lights";
//     mqttClient.send(message);
//   } 
// }

// function showOnScreens(page, screen){
//     if(MQTTclient.isConnected()){
//         console.log("Showing content on displays");
//         var message = new Paho.MQTT.Message(page)
//         message.destinationName = `openlab/screen/${screen}/url`;
//         MQTTclient.send(message);
//     }else{
//         console.log("Client not connected!!!");
//     }
// }

// function olaSay(text){
//     var content = JSON.stringify( {"say" : text});
//     var message = new Paho.MQTT.Message(content);
//     message.destinationName = "openlab/audio";
//     MQTTclient.send(message);
// }
