MQTTclient = new Paho.MQTT.Client(
  "openlab.kpi.fei.tuke.sk",
  80,
  "/mqtt",
  "ib149cd_testing_" + new Date() + Math.random() * 1000
);
MQTTclient.onConnectionLost = onConnectionLost;
MQTTclient.onMessageArrived = onMessage;
MQTTclient.connect({ onSuccess: onConnect });

// testing topic
const TOPIC_VOICE = "experiments/voice/recognition/ib149cd";

// topic for openlab
// const TOPIC_VOICE = 'openlab/voice/recognition';

var colors = [];
var detected = [];

var started = false;
var start = ["chceme hrať", "chcem hrať", "Chceme hrať", "Chcem hrať"];

// storing texts which will be said by ola
const correct = ["áno", "to bola ona", "pekne", "super"];
const incorrect = [
  "táto farba tam nebola",
  "ajaj, skús to ešte raz",
  "nie nie, toto nie je tá farba",
];

function onConnect() {
  console.log("connected to MQTT");
  subscribe();
}

function onMessage(message) {
  msg = JSON.parse(message.payloadString);
  if (msg.status == "recognized") {
    if (!started && start.includes(msg.recognized)){
      started = true;
      changeScreen();
    }
    console.log(msg.recognized);
    saveColor(msg.recognized);
  }
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
  MQTTclient.connect({onSuccess: onConnect});
}

function subscribe() {
  MQTTclient.subscribe(TOPIC_VOICE);
}

function unsubscribe() {
  MQTTclient.unsubscribe(TOPIC_VOICE);
}

// function olaSay(text){
//     var content = JSON.stringify( {"say" : text});
//     var message = new Paho.MQTT.Message(content);
//     message.destinationName = "openlab/audio";
//     MQTTclient.send(message);
// }

function changeScreen() {
  const info1 =
    "V tejto hre si budete musieť zapamätať farby, ktoré sa vám ukážu. Ak budete pripravení povedzte Ole Chceme hrať";
  // olaSay(info1);
  document.getElementById('hraj').style.visibility = 'hidden';
  setTimeout(function () {
    const info2 = "Zapamätajte si tieto farby.";
    document.getElementById("text").innerHTML = `Zapamätajte si tieto farby.`;
    // olaSay(info2);
    unsubscribe();
    revealColors();
  }, 2000);
}

var colorsLeft = 4;
function saveColor(color) {
  if (colors.includes(color) && !detected.includes(color)) {
    if (colorsLeft > 1) {
      // var random_correct = Math.floor(Math.random() * correct.length);
      // olaSay(correct[random_correct]);
    }
    detected.push(color);
    colorsLeft--;
  } else {
    // var random_incorrect = Math.floor(Math.random() * incorrect.length);
    // olaSay(incorrect[random_incorrect]);
  }
  if (colorsLeft == 0) {
    // const winning_text = "Krásne, uhádli ste všetky farby. Ste veľmi šikovní";
    // olaSay(winning_text);
  }
}

function revealColors() {
  var cnt = 0;
  var color;
  // var lights;
  setTimeout(function () {
    const interval = setInterval(function () {
      switch (cnt) {
        case 0:
          color = "#0000FF";
          colorStr = "modrá";
          // lights="0000ff00";
          break;
        case 1:
          color = "#FF0000";
          colorStr = "červená";
          // lights="ff000000";
          break;
        case 2:
          color = "#00FF00";
          colorStr = "zelená";
          // lights="00ff0000";
          break;
        case 3:
          color = "#FF8800";
          colorStr = "oranžová";
          // lights="ff880000";
          break;
      }
      console.log(color);
      colors.push(colorStr);
      document.getElementById("color").style.visibility = 'visible';
      document.getElementById("color").style.backgroundColor = color;
      cnt += 1;
      if (cnt === 5) {
        clearInterval(interval);
        results();
      }
    }, 1000);
  }, 1000);
}

function results() {
  setTimeout(function () {
    subscribe();
    document.getElementById('color').style.visibility = 'hidden';
    const info3 = "Teraz mi povedzte farby, ktoré ste videli.";
    document.getElementById("text").innerHTML = info3;
    // olaSay(info3)
  }, 1000);
}
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
