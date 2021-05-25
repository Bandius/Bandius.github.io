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

// openlab topics
const TOPIC_VOICE = "openlab/voice/recognition";
const TOPIC_POS_9 = "openlab/mapPositions/9";

var running = false;

function onConnect() {
  console.log("connected to MQTT");
  if (!running) {
    intro();
    running = true;
  }
  subscribe();
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
  if (message.destinationName == "openlab/voice/recognition") {
    if (msg.status == "recognized") {
      if (start.includes(msg.recognized)) {
        playGame();
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

function listen() {
  MQTTclient.subscribe(TOPIC_VOICE);
}

function doNotListen() {
  MQTTclient.unsubscribe(TOPIC_VOICE);
}

function subscribe() {
  MQTTclient.subscribe(TOPIC_POS_9);
}

function unsubscribe() {
  MQTTclient.unsubscribe(TOPIC_POS_9);
  MQTTclient.unsubscribe(TOPIC_VOICE);
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
  switch (game) {
    case 1:
      olaSay(
        "V tejto hre budeš mať za úlohu hľadať zvieratká na displejoch podľa zvuku ktorý ti pustím. Chceš hrať túto hru?"
      );
      break;
    case 2:
      olaSay(
        "V tejto hre budeš hľadať farbu svetla ktorú ti ukážem. Chceš si zahrať túto hru?"
      );
      break;
    case 3:
      olaSay(
        "V tejto hre ti ukážem obrázok a tvojou úlohou bude spočítať veci ktoré uvidíš. Chceš si zahrať túto hru?"
      );
      break;
    case 4:
      olaSay(
        "V tejto hre ti ukážem farby ktoré si zapamätáš a potom mi ich povieš. Chceš hrať túto hru?"
      );
      break;
  }
  setTimeout(function () {
    listen();
  }, 3000);
}

function intro() {
  lights();
  showOnScreens(
    "http://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fintro.png", 0);

  olaSay("Ahoj vitaj v oupenlabe. Chceš si zahrať niektorú z hier? Pozri sa na displeje vpravo.");

  setTimeout(() => {
    showOnScreens("http://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fbackground_arrow.png", 0);
  }, 5000);

  showOnScreens("http://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fshowdown1.gif", 11);
  showOnScreens("http://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fshowdown2.gif", 12);
  showOnScreens("http://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fshowdown3.png", 13);
  showOnScreens("http://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fshowdown4.gif", 14);

  setTimeout(() => {
    olaSay("Choď k niektorému z displejov a vyber si hru ktorú si chceš zahrať.");
  }, 10000);

  setTimeout(() => {
    showOnScreens("http://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fintro.png", 0);
  }, 7000);
}

function playGame(game) {
  unsubscribe();
  switch (game) {
    case 1:
      showOnScreens("http://cdn.glitch.com/f57fcd24-cfe9-48da-8e70-e5e2ce11831a%2Fintro.png", 0);
      showOnScreens("http://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fvertical_blank.png", 11);
      showOnScreens("http://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fvertical_blank.png", 12);
      showOnScreens("http://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fvertical_blank.png", 13);
      showOnScreens("http://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fvertical_blank.png", 14);
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

function olaSay(text) {
  var content = JSON.stringify({ say: text });
  var message = new Paho.MQTT.Message(content);
  message.destinationName = "openlab/audio";
  MQTTclient.send(message);
}

function lights() {
  const all_green = {
    all: "00ff0000",
    duration: 1000,
  };
  var message = new Paho.MQTT.Message(JSON.stringify(all_green));
  message.destinationName = "openlab/lights";
  MQTTclient.send(message);
}

function showOnScreens(page, screen) {
  if (MQTTclient.isConnected()) {
    var message = new Paho.MQTT.Message(page);
    message.destinationName = `openlab/screen/${screen}/url`;
    MQTTclient.send(message);
  }
}

function revertScreens() {
  for (var i = 11; i <= 15; i++) {
    showOnScreens("http://cdn.glitch.com/5d5672be-1399-4c02-8b58-9265fd697244%2Fvertical_blank.png", i);
  }
}
