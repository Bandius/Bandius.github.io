MQTTclient = new Paho.MQTT.Client("openlab.kpi.fei.tuke.sk", 80, "/mqtt", "ib149cd_testing_" + new Date() + (Math.random() * 1000));
MQTTclient.onConnectionLost = onConnectionLost;
MQTTclient.onMessageArrived = onMessage;
MQTTclient.connect({onSuccess: onConnect});

var started = false;
var finished = false;
const TEST_TOPIC = 'experiments/mapPositions/ib149cd/0';
const TEST_TOPIC_VOICE = 'experiments/voice/recognition/ib149cd';

function onConnect(){
    console.log("connected to MQTT");
    subscribe();
}

var start = ["áno", "Áno", "ano", "Ano"];

function onMessage(message) {
    msg = JSON.parse(message.payloadString);
    // console.log(msg);
    if (message.destinationName == 'experiments/voice/recognition/ib149cd'){
        if(msg.status == "recognized"){
            console.log(msg.recognized);
            if (!started && start.includes(msg.recognized)){
                started = true;
            }
        }
    }else{
        position = msg.positions[0];
        //console.log(position);
        if(!finished){
            checkPosition(position[0], position[1]);
        }
    }    
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
    MQTTclient.connect({onSuccess: onConnect});
}

function listen(){
    console.log("I am listening");
    MQTTclient.subscribe(TEST_TOPIC_VOICE);
}

function doNotListen(){
    console.log("Paused listening");
    MQTTclient.unsubscribe(TEST_TOPIC_VOICE);
}

function subscribe(){
    MQTTclient.subscribe(TEST_TOPIC);
    // MQTTclient.subscribe(TOPIC_POS_9);
    // MQTTclient.subscribe(TOPIC_POS_11);
    console.log("Subscribed!");
}

function unsubscribe(){
    MQTTclient.unsubscribe(TEST_TOPIC);
    MQTTclient.unsubscribe(TEST_TOPIC_VOICE);
    // MQTTclient.unsubscribe(TOPIC_POS_9);
    // MQTTclient.unsubscribe(TOPIC_POS_11);
}

let detected_display;
let delay = false;
var repeater = 0;

function timer(){
    if(!finished && scanning){
        if (!delay && cycles == 1){
            // clearInterval(repeater);
            scanning = false;
            cycles = 0;
            if (detected_display <= 3){
                sayInfo(detected_display+1);
            }
            
        }
        cycles += 1;
        repeater = setTimeout(timer, 2000);
    }
}

const displays = [[735, 770],[680, 715],[625, 660],[570, 605],[510, 550]];

function checkPosition(x, y){
    if (y >= 440 && y <= 470){
        for (let i = 0; i < 5; i++){
            if(x >= displays[i][0] && x <= displays[i][1]){
                if (i != detected_display){
                    detecting = false;
                    // console.log("User moved to another display");
                    cycles = 0;
                    clearInterval(repeater);
                    delay = false;
                }
                if (!detecting){
                    console.log("User at display number: ", i+1);
                    detected_display = i;
                    detecting = true;
                    scanning = true;
                    timer();
                }
            }
        }
    }
}

// function olaSay(text){
//     var content = JSON.stringify( {"say" : text});
//     var message = new Paho.MQTT.Message(content);
//     message.destinationName = "openlab/audio";
//     MQTTclient.send(message);
// }

function sayInfo(game){
    switch(game){
        case 1:
            olaSay("V tejto hre budeš mať za úlohu hľadať zvieratká na displejoch \pau=200\ podľa zvuku \pau=500\ ktorý ti pustím");
            break;
        case 2:
            olaSay("V tejto hre budeš hľadať farbu svetla \pau=500\ ktorú ti ukážem");
            break;
        case 3:
            olaSay("V tejto hre ti ukážem obrázok \pau=500\ a tvojou úlohou bude spočítať veci \pau=500\ ktoré uvidíš");
            break;
        case 4:
            olaSay("V tejto hre ti ukážem farby \pau=500\ ktoré si zapamätáš \pau=500\ a potom mi ich povieš");
            break;
    }
}