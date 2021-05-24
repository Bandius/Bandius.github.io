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
var scan = false;
var animal;

// testing topics
const TOPIC_POS_9 = "experiments/mapPositions/ib149cd/0";
const TOPIC_VOICE = "experiments/voice/recognition/ib149cd";


// topics for openlab
// const TOPIC_POS_9 = 'openlab/mapPositions/9';
// const TOPIC_POS_11= 'openlab/mapPositions/11';
// const TOPIC_VOICE = 'openlab/voice/recognition';

function onConnect() {
  console.log("connected to MQTT");
  subscribe();
}
var start = ["chceme hrať", "chcem hrať"];

function onMessage(message) {
  msg = JSON.parse(message.payloadString);
  // console.log(msg);
  if (message.destinationName == "experiments/voice/recognition/ib149cd") {
    if (msg.status == "recognized") {
      console.log(msg.recognized);
      if (!started && start.includes(msg.recognized)) {
        started = true;
        changeScreen();
      }
    }
  } else {
    if (scan) {
      position = msg.positions[0];
      //console.log(position);
      if (!finished) {
        checkPosition(position[0], position[1]);
      }
    }
  }
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
  MQTTclient.connect({ onSuccess: onConnect });
}

function subscribe() {
  MQTTclient.subscribe(TOPIC_POS_9);
  MQTTclient.subscribe(TOPIC_VOICE);
  // MQTTclient.subscribe(TOPIC_VOICE);
  // MQTTclient.subscribe(TOPIC_POS_9);
  // MQTTclient.subscribe(TOPIC_POS_11);
  console.log("Subscribed!");
}

function unsubscribe() {
  MQTTclient.unsubscribe(TOPIC_POS_9);
  MQTTclient.unsubscribe(TOPIC_VOICE);
  // MQTTclient.unsubscribe(TOPIC_VOICE);
  // MQTTclient.unsubscribe(TOPIC_POS_9);
  // MQTTclient.unsubscribe(TOPIC_POS_11);
}
//---------------------------------------------------------------------

const displays = [
  [735, 770],
  [680, 715],
  [625, 660],
  [570, 605],
  [510, 550],
];
let correct_display = 0;
let detected_display;
let delay = false;
var repeater = 0;

const correctMessages = ["Super, našiel si ho", "Jupí, si jednotka"];
const incorrectMessages = [
  "Toto nie je to správne zvieratko",
  "Zvieratko ktoré hľadáš robí tento zvuk",
];

function playAnimalSound() {
  var cow = new Audio("../assets/audio/cow.mp3");
  var cat = new Audio("../assets/audio/cat.mp3");
  var dog = new Audio("../assets/audio/dog.mp3");
  switch (animal) {
    case 0:
      var play = cow.play();
      // var content = JSON.stringify( {"play" : text});
      break;
    case 1:
      var play = cat.play();
      // var content = JSON.stringify( {"play" : text});
      break;
    case 2:
      var play = dog.play();
      // var content = JSON.stringify( {"play" : text});
      break;
  }
  // var message = new Paho.MQTT.Message(content);
  // message.destinationName = "openlab/audio";
  // MQTTclient.send(message);
}

function gameCompleted() {
  finished = true;
  unsubscribe();
}

function incorrectHint() {
  var hint = Math.floor(Math.random() * incorrectMessages.length);
  console.log(incorrectMessages[hint]);
  if (hint == 1) {
    playAnimalSound();
  }
}

// window.onload = setBlankScreens();

var scanning = true;
var cycles;

function timer() {
  if (!finished && scanning) {
    if (detected_display == correct_display && delay) {
      clearInterval(repeater);
      var randomElement =
        correctMessages[Math.floor(Math.random() * correctMessages.length)];
      console.log(randomElement);
      gameCompleted();
    }
    if (detected_display == correct_display) {
      delay = true;
    }
    if (!delay && cycles == 1) {
      // clearInterval(repeater);
      scanning = false;
      cycles = 0;
      incorrectHint();
    }
    cycles += 1;
    repeater = setTimeout(timer, 5000);
  }
}

// function olaSay(text){
//     var content = JSON.stringify( {"say" : text});
//     var message = new Paho.MQTT.Message(content);
//     message.destinationName = "openlab/audio";
//     MQTTclient.send(message);
// }

function changeScreen() {
  const info1 =
    "V tejto hre budete počuť zvuky zvierat. Vašou úlohou bude nájsť na obrazovkách okolo seba to správne zvieratko. Ak budete pripravení povedzte mi, Chceme hrať";
  // olaSay(info1);
  setTimeout(function () {
    correct_display = Math.floor(Math.random() * 5);
    // console.log(">> display:",correct_display+1);
    const text_listen = "Teraz počúvaj!";
    // olaSay(text_listen);
    // showOnScreens("https://raw.githubusercontent.com/Bandius/Bandius.github.io/main/assets/testing_screens/Game1/listen.png", 21);
    document.getElementById("text").innerHTML = text_listen;
    document.getElementById("hraj").style.visibility = "hidden";
    scan = true;
    playSound();
  }, 1000);
}

function playSound() {
  animal = Math.floor(Math.random() * 3);
  setTimeout(function () {
    playAnimalSound(animal);
    findAnimal(animal);
  }, 2000);
}

const cat_url =
  "https://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fscreen_cat.png?v=1621861284175";
const cow_url =
  "https://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fscreen_cow.png?v=1621861286371";
const dog_url =
  "https://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fscreen_dog.png?v=1621861288817";
const rabbit_url =
  "https://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fscreen_rabbit.png?v=1621861290820";
const sheep_url =
  "https://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fscreen_sheep.png?v=1621861389005";

function findAnimal(type) {
  const info2 = "Nájdi toto zvieratko okolo seba.";
  // showOnScreens("https://raw.githubusercontent.com/Bandius/Bandius.github.io/main/assets/testing_screens/Game1/find.png", 21);
  // olaSay(info2);
  document.getElementById("text").innerHTML = info2;
  switch (type) {
    case 0:
      console.log("showing cow on display", correct_display + 11);
      // showOnScreens(cow_url, 11+correct_display)
      for (var i = 11; i <= 15; i++){
        if(i === 11+correct_display){
          i++;
        }
        // showOnScreens(sheep_url, i);
      }
      break;
    case 1:
      console.log("showing cat on display", correct_display + 11);
      // showOnScreens(cat_url, 11+correct_display)
      for (var i = 11; i <= 15; i++){
        if(i === 11+correct_display){
          i++;
        }
        console.log(i);
        // showOnScreens(sheep_url, i);
      }
      break;
    case 2:
      console.log("showing dog on display", correct_display + 11);
      // showOnScreens(dog_url, 11+correct_display)
      for (var i = 11; i <= 15; i++){
        if(i === 11+correct_display){
          i++;
        }
        console.log(i);
        // showOnScreens(sheep_url, i);
      }
      break;
  }
}

var detecting = false;

// returns current display based on position
function checkPosition(x, y) {
  if (y >= 440 && y <= 470) {
    for (let i = 0; i < 5; i++) {
      if (x >= displays[i][0] && x <= displays[i][1]) {
        if (i != detected_display) {
          detecting = false;
          // console.log("User moved to another display");
          cycles = 0;
          clearInterval(repeater);
          delay = false;
        }
        if (!detecting) {
          // console.log("User at display number: ", i+1);
          detected_display = i;
          detecting = true;
          scanning = true;
          timer();
        }
      }
    }
  }
}
//------------------------- ONLY FOR TESTING ------------------------------------------
// async function flash(){
//     // var response = await fetch("../assets/lights/lights_all_green.json")
//     var response = await fetch("../assets/lights/test.json")
//     var lights = await response.json()
//     console.log(lights);

//     var message = new Paho.MQTT.Message(JSON.stringify(lights));
//         message.destinationName = "openlab/lights";
//         MQTTclient.send(message);
// }
//-------------------------------------------------------------------------------------

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

// function setBlankScreens(){
//     console.log("Setting screens to blank");
//     // main screen
//     showOnScreens("https://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fbackground.png?v=1621864375592",0);
//     // vertical screens
//     for (var i = 11; i <= 15; i++){
//         showOnScreens("https://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fvertical_blank.png?v=1621861399073", i);
//     }
// }

// function revertScreens(){
//     console.log("Setting screens back to showcase");
//     for (var i = 11; i <= 15; i++){
//         showOnScreens("", i);
//     }
// }
