MQTTclient = new Paho.MQTT.Client(
  "openlab.kpi.fei.tuke.sk",
  80,
  "/mqtt",
  "ib149cd_testing_" + new Date() + Math.random() * 1000
);
MQTTclient.onConnectionLost = onConnectionLost;
MQTTclient.onMessageArrived = onMessage;
MQTTclient.connect({ onSuccess: onConnect });

var started = false;
var finished = false;

// simulator topics
const TOPIC_POS_9 = "experiments/mapPositions/ib149cd/0";
const TOPIC_VOICE = "experiments/voice/recognition/ib149cd";

// openlab topics
// const TOPIC_VOICE = 'openlab/voice/recognition';
// const TOPIC_POS_9 = 'openlab/mapPositions/9';
// const TOPIC_POS_11= 'openlab/mapPositions/11';


function onConnect() {
  console.log("connected to MQTT");
  subscribe();
  intro();
}

var start = [
  "áno",
  "Áno",
  "ano",
  "Ano",
  "Chcem",
  "chcem",
  "áno chcem",
  "Áno chcem",
  "áno, chcem",
  "Áno, chcem",
];

function onMessage(message) {
  msg = JSON.parse(message.payloadString);
  // console.log(msg);
  if (message.destinationName == "experiments/voice/recognition/ib149cd") {
    if (msg.status == "recognized") {
      console.log(msg.recognized);
      if (start.includes(msg.recognized)) {
        // playGame();
      }
    }
  } else {
    position = msg.positions[0];
    //console.log(position);
    if (!finished) {
      checkPosition(position[0], position[1]);
    }
  }
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
  MQTTclient.connect({ onSuccess: onConnect });
}

function listen() {
  console.log("I am listening");
  MQTTclient.subscribe(TOPIC_VOICE);
}

function doNotListen() {
  console.log("Paused listening");
  MQTTclient.unsubscribe(TOPIC_VOICE);
}

function subscribe() {
  MQTTclient.subscribe(TOPIC_POS_9);
  // intro();
  // MQTTclient.subscribe(TOPIC_POS_9);
  // MQTTclient.subscribe(TOPIC_POS_11);
  console.log("Subscribed!");
}

function unsubscribe() {
  MQTTclient.unsubscribe(TOPIC_POS_9);
  MQTTclient.unsubscribe(TOPIC_VOICE);
  // MQTTclient.unsubscribe(TOPIC_POS_9);
  // MQTTclient.unsubscribe(TOPIC_POS_11);
}

let detected_display;
let delay = false;
var repeater = 0;

function timer() {
  if (!finished && scanning) {
    if (!delay && cycles == 1) {
      scanning = false;
      cycles = 0;
      if (detected_display <= 3) {
        sayInfo(detected_display + 1);
        // playGame(detected_display + 1);
      }
    }
    cycles += 1;
    repeater = setTimeout(timer, 2000);
  }
}

const displays = [
  [735, 770],
  [680, 715],
  [625, 660],
  [570, 605],
  [510, 550],
];

function checkPosition(x, y) {
  if (y >= 440 && y <= 470) {
    for (let i = 0; i < 5; i++) {
      if (x >= displays[i][0] && x <= displays[i][1]) {
        if (i != detected_display) {
          detecting = false;
          cycles = 0;
          clearInterval(repeater);
          delay = false;
        }
        if (!detecting) {
          console.log("User at display number: ", i + 1);
          detected_display = i;
          detecting = true;
          scanning = true;
          timer();
        }
      }
    }
  }
}

function sayInfo(game) {
  console.log("Started saying info");
  switch (game) {
    case 1:
      // olaSay("V tejto hre budeš mať za úlohu hľadať zvieratká na displejoch \pau=200\ podľa zvuku \pau=500\ ktorý ti pustím. Chceš hrať túto hru?");
      break;
    case 2:
      // olaSay("V tejto hre budeš hľadať farbu svetla \pau=500\ ktorú ti ukážem. Chceš si zahrať túto hru?");
      break;
    case 3:
      // olaSay("V tejto hre ti ukážem obrázok \pau=500\ a tvojou úlohou bude spočítať veci \pau=500\ ktoré uvidíš. Chceš si zahrať túto hru?");
      break;
    case 4:
      // olaSay("V tejto hre ti ukážem farby \pau=500\ ktoré si zapamätáš \pau=500\ a potom mi ich povieš. Chceš hrať túto hru?");
      break;
  }
  setTimeout(function(){
    listen();
  }, 3000);
}

function intro() {
  // olaSay("Ahoj pau=200 vitaj v oupenlabe. pau=200 Chceš si zahrať niektorú z hier? pau=200 Pozri sa na displeje vpravo.");
  setTimeout(() => {
    document.getElementById("intro_header").style.visibility = "hidden";
    document.body.style.backgroundImage = 'url("./assets/images/pointer_right.gif")';
  }, 5000);
  // showOnScreens("https://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fshowdown1.gif?v=1621861165873", 11);
  // showOnScreens("https://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fshowdown2.gif?v=1621861246148", 12);
  // showOnScreens("https://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fshowdown3.png?v=1621861253629", 13);
  // showOnScreens("https://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fshowdown4.gif?v=1621861256145", 14);
  // olaSay("Choď k niektorému z displejov a vyber si hru pau=200 ktorú si chceš zahrať.")
  setTimeout(() => {
    document.getElementById("intro_header").style.visibility = "visible";
    document.body.style.backgroundImage = 'url("./assets/images/intro.png")';
  }, 7000);
}

function playGame(game){
  unsubscribe();
  switch(game){
    case 1:
      location.replace("./Screens/game1.html");
      break;
    case 2:
      location.replace("./Screens/game2.html");
      break;
    case 3:
      location.replace("./Screens/game3.html");
      break;
    case 4:
      location.replace("./Screens/game4.html");
      break;
  }
}

// function olaSay(text){
//     var content = JSON.stringify( {"say" : text});
//     var message = new Paho.MQTT.Message(content);
//     message.destinationName = "openlab/audio";
//     MQTTclient.send(message);
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
