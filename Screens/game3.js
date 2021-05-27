MQTTclient = new Paho.MQTT.Client(
  "openlab.kpi.fei.tuke.sk",
  80,
  "/mqtt",
  "ib149cd_testing_" + new Date() + Math.random() * 1000
);
MQTTclient.onConnectionLost = onConnectionLost;
MQTTclient.onMessageArrived = onMessage;
MQTTclient.connect({ onSuccess: onConnect });

// topic for openlab
const TOPIC_VOICE = 'openlab/voice/recognition';

var chosenObject;

var started = false;
var start = ["chceme hrať", "chcem hrať", "Chceme hrať", "Chcem hrať"];

function onConnect() {
  console.log("connected to MQTT");
  intro();
}

function onMessage(message) {
  msg = JSON.parse(message.payloadString);
  if (msg.status == "recognized") {
    if (!started && start.includes(msg.recognized)) {
      started = true;
      subscribe();
      changeScreen();
    }
    var number = detectNumber(msg.recognized);
    validateNumber(number);
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

function detectNumber(num) {
  if (parseInt(num) == num) {
    return parseInt(num);
  } else {
    const numbers = [
      "nula",
      "jeden",
      "dva",
      "tri",
      "štyri",
      "päť",
      "šesť",
      "sedem",
      "osem",
      "deväť",
      "desať",
    ];
    for (var i = 0; i < numbers.length; i++) {
      if (numbers[i] == num) {
        return i;
      }
    }
  }
}

function validateNumber(num) {
  const objects = [5, 8, 7];
  if (num == objects[chosenObject]) {
    olaSay("vyhral si!");
    unsubscribe();
  } else {
    olaSay("skús to ešte raz");
  }
}

function changeScreen() {
  var object = Math.floor(Math.random() * 3);
  var text_hladaj;
  switch (object) {
    case 0:
      text_hladaj = "Koľko autíčok je na obrázku?";
      chosenObject = 0;
      break;
    case 1:
      text_hladaj = "Koľko lietadiel je na obrázku?";
      chosenObject = 1;
      break;
    case 2:
      text_hladaj = "Koľko kravičiek je na obrázku?";
      chosenObject = 2;
      break;
  }
  setTimeout(function () {
    document.getElementById('hraj').style.visibility = 'hidden';
    document.getElementById("animals").style.visibility = "visible";
    document.getElementById("text").innerHTML = text_hladaj;
    olaSay(text_hladaj);
  }, 5000);
}

function intro(){
  const info1 =
  "V tejto hre budete hľadať, koľko objektov sa nachádza na obrazovke. Ak budete pripravení povedzte Ole Chceme hrať";
  olaSay(info1);
  subscribe();
}

function showOnScreens(page, screen){
    if(MQTTclient.isConnected()){
        var message = new Paho.MQTT.Message(page)
        message.destinationName = `openlab/screen/${screen}/url`;
        MQTTclient.send(message);
    }
}

function olaSay(text){
    var content = JSON.stringify( {"say" : text});
    var message = new Paho.MQTT.Message(content);
    message.destinationName = "openlab/audio";
    MQTTclient.send(message);
}