MQTTclient = new Paho.MQTT.Client(
  "openlab.kpi.fei.tuke.sk",
  80,
  "/mqtt",
  "ib149cd_testing_" + new Date() + Math.random() * 1000
);
MQTTclient.onConnectionLost = onConnectionLost;
MQTTclient.onMessageArrived = onMessage;
MQTTclient.connect({ onSuccess: onConnect });

// topics for openlab
const TOPIC_POS_9 = "openlab/mapPositions/9";
const TOPIC_VOICE = "openlab/voice/recognition";

var started = false;
var finished = false;
var scan = false;
var animal;

function onConnect() {
  console.log("connected to MQTT");
  intro();
}

function intro() {
  const info1 =
    "V tejto hre budete počuť zvuky zvierat. Vašou úlohou bude nájsť na obrazovkách okolo seba to správne zvieratko. Ak budete pripravení povedzte mi, Chceme hrať";
  olaSay(info1);
  listen();
}

var start = ["chceme hrať", "chcem hrať", "Chceme hrať", "Chcem hrať"];

function onMessage(message) {
  msg = JSON.parse(message.payloadString);
  if (message.destinationName == "openlab/voice/recognition") {
    if (msg.status == "recognized") {
      if (!started && start.includes(msg.recognized)) {
        started = true;
        changeScreen();
        doNotListen();
      }
    }
  } else {
    position = msg.positions[0];
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

// Subscribing and unsubscribing topics
function listen() {
  MQTTclient.subscribe(TOPIC_VOICE);
}

function doNotListen() {
  MQTTclient.unsubscribe(TOPIC_VOICE);
}

function track() {
  MQTTclient.subscribe(TOPIC_POS_9);
}

function doNotTrack() {
  MQTTclient.unsubscribe(TOPIC_POS_9);
}

function unsubscribe() {
  MQTTclient.unsubscribe(TOPIC_POS_9);
  MQTTclient.unsubscribe(TOPIC_VOICE);
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
  switch (animal) {
    case 0:
      var content = JSON.stringify( {"play" : "http://cdn.glitch.com/f57fcd24-cfe9-48da-8e70-e5e2ce11831a%2Fcow.mp3"});
      break;
    case 1:
      var content = JSON.stringify( {"play" : "http://cdn.glitch.com/f57fcd24-cfe9-48da-8e70-e5e2ce11831a%2Fcat.mp3"});
      break;
    case 2:
      var content = JSON.stringify( {"play" : "http://cdn.glitch.com/f57fcd24-cfe9-48da-8e70-e5e2ce11831a%2Fdog.mp3"});
      break;
  }
  var message = new Paho.MQTT.Message(content);
  message.destinationName = "openlab/audio";
  MQTTclient.send(message);
}

function gameCompleted() {
  finished = true;
  unsubscribe();
}

function incorrectHint() {
  var hint = Math.floor(Math.random() * incorrectMessages.length);
  if (hint == 1) {
    playAnimalSound();
  }
}

window.onload = setBlankScreens();

var scanning = true;
var cycles;

function timer() {
  if (!finished && scanning) {
    if (detected_display == correct_display && delay) {
      clearInterval(repeater);
      var randomElement =
        correctMessages[Math.floor(Math.random() * correctMessages.length)];
      gameCompleted();
    }
    if (detected_display == correct_display) {
      delay = true;
    }
    if (!delay && cycles == 1) {
      scanning = false;
      cycles = 0;
      incorrectHint();
    }
    cycles += 1;
    repeater = setTimeout(timer, 5000);
  }
}

function olaSay(text) {
  var content = JSON.stringify({ say: text });
  var message = new Paho.MQTT.Message(content);
  message.destinationName = "openlab/audio";
  MQTTclient.send(message);
}

function changeScreen() {
  setTimeout(function () {
    correct_display = Math.floor(Math.random() * 5);
    const text_listen = "Teraz počúvaj!";
    olaSay(text_listen);
    document.getElementById("text").innerHTML = text_listen;
    document.getElementById("hraj").style.visibility = "hidden";
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
  "http://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fscreen_cat.png";
const cow_url =
  "http://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fscreen_cow.png";
const dog_url =
  "http://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fscreen_dog.png";
const rabbit_url =
  "http://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fscreen_rabbit.png";
const sheep_url =
  "http://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fscreen_sheep.png";

function findAnimal(type) {
  const info2 = "Nájdi toto zvieratko okolo seba.";
  // showOnScreens("https://raw.githubusercontent.com/Bandius/Bandius.github.io/main/assets/testing_screens/Game1/find.png", 21);
  olaSay(info2);
  track();
  document.getElementById("text").innerHTML = info2;
  switch (type) {
    case 0:
      showOnScreens(cow_url, 11 + correct_display);
      for (var i = 11; i <= 15; i++) {
        if (i === 11 + correct_display) {
          i++;
        }
        showOnScreens(sheep_url, i);
      }
      break;
    case 1:
      showOnScreens(cat_url, 11 + correct_display);
      for (var i = 11; i <= 15; i++) {
        if (i === 11 + correct_display) {
          i++;
        }
        showOnScreens(sheep_url, i);
      }
      break;
    case 2:
      showOnScreens(dog_url, 11 + correct_display);
      for (var i = 11; i <= 15; i++) {
        if (i === 11 + correct_display) {
          i++;
        }
        showOnScreens(sheep_url, i);
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
          cycles = 0;
          clearInterval(repeater);
          delay = false;
        }
        if (!detecting) {
          detected_display = i;
          detecting = true;
          scanning = true;
          timer();
        }
      }
    }
  }
}

function showOnScreens(page, screen) {
  if (MQTTclient.isConnected()) {
    var message = new Paho.MQTT.Message(page);
    message.destinationName = `openlab/screen/${screen}/url`;
    MQTTclient.send(message);
  }
}

function setBlankScreens() {
  // main screen
  showOnScreens("http://aquatic-striped-surprise.glitch.me/Screens/game1.html", 0);
  // vertical screens
  for (var i = 11; i <= 15; i++) {
    showOnScreens("http://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fvertical_blank.png", i);
  }
}
