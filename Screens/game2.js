// const lights_blue = require('../assets/lights/lights_blue.json');
// const lights_red = require('../assets/lights/lights_red.json');
// const lights_yellow = require('../assets/lights/lights_yellow.json');
MQTTclient = new Paho.MQTT.Client("openlab.kpi.fei.tuke.sk", 80, "/mqtt", "map_simulator_" + new Date() + (Math.random() * 1000));
MQTTclient.onConnectionLost = onConnectionLost;
MQTTclient.onMessageArrived = onMessage;
MQTTclient.connect({onSuccess: onConnect});

const TOPIC = 'experiments/mapPositions/ib149cd/0';
const TOPIC_VOICE = 'experiments/voice/recognition/ib149cd';

function onConnect(){
    console.log("connected to MQTT");
    subscribe();
}

function onMessage(message) {
    msg = JSON.parse(message.payloadString);
    if (message.destinationName == 'experiments/voice/recognition/ib149cd'){
        if(msg.status == "recognized"){
            console.log(msg.recognized);
            if (!started && start.includes(msg.recognized)){
                started = true;
                changeScreen();
            }
        }
    }else{
        position = msg.positions[0];
        console.log(position);
        detectLight(position[0], position[1]);
    }
    

}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}

function subscribe(){
    MQTTclient.subscribe(TOPIC);
    MQTTclient.subscribe(TOPIC_VOICE);
    console.log("Subscribed!");
}

function unsubscribe(){
    MQTTclient.unsubscribe(TOPIC);
    MQTTclient.unsubscribe(TOPIC_VOICE);
}


function generate(){
    for (var i = 0; i < slider.value; i++){
        var d = document.createElement('div');
        d.id = `drag${i}`;
        d.onclick = function(){takeElement(this.id)};
        d.style.left = `${500 + i*50}px`;
        d.style.top = '700px';
        d.style.position = 'absolute';
        document.body.appendChild(d);  
    }
}
// refactor this to type of array as in game1
function detectLight(x, y){
    const startY_row1 = 80;
    const endY_row1 = 147;

    const startY_row2 = 174;
    const endY_row2 = 233;

    const startY_row3 = 258;
    const endY_row3 = 320;
  
    const lights_1_3 = [[460, 472], [484, 496], [508,520], [532, 544], [556, 568], [580, 592], [604, 616], [628, 640], [652, 664], [676, 688], [700, 712], [724, 736], [748, 760]];
    const lights_2 = [[472, 484], [496, 508], [520, 532], [544, 556], [568, 580], [592, 604], [616, 628], [640, 652], [664, 676], [688, 700], [712, 724], [736, 748]]
    const lights_1_values = [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    const lights_3_values = [67, 66, 65, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55]
    const lights_2_values = [39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28]

    if(y >= startY_row1 && y <= endY_row1){
      // row 1
      for(var i = 0; i < 13; i++){
        if(x >= lights_1_3[i][0] && x <= lights_1_3[i][1]){
          console.log("Light", lights_1_values[i]);
        }
      }
    }else if(y >= startY_row2 && y <= endY_row2){
      // row 2
      for(var i = 0; i < 12; i++){
        if(x >= lights_2[i][0] && x <= lights_2[i][1]){
          console.log("Light", lights_2_values[i]);
        }
      }
    }else if(y >= startY_row3 && y <= endY_row3){
      // row 3
      for(var i = 0; i < 13; i++){
        if(x >= lights_1_3[i][0] && x <= lights_1_3[i][1]){
          console.log("Light", lights_3_values[i]);
        }
      }
    }
  
  }

function changeScreen(){
    setTimeout(function (){
        start();
        document.getElementById('myRange').style.visibility = 'hidden';
        document.getElementById('text').innerHTML = "V tejto hre vám poviem farbu. <br> Vašou úlohou bude hľadať svetlo rovnakej farby a postaviť sa na neho.";
    }, 1000);
}
// window.onload = changeScreen();
function start(){
    var color = Math.floor(Math.random() * 3);
    switch (color) {
        case 0:
            color = "#0000FF";
            break;
        case 1:
            color = "#FF0000";
            break;
        case 2:
            color = "#FFFF00";
            break;
    }
    setTimeout(function (){
        changeLights(color);
        document.getElementById('text').innerHTML = "Nájdite túto farbu:";
        // console.log(color);
        // document.getElementById('color').style.backgroundColor = color;
    }, 2000);
}

function lightsOut(color){
    // if(mqttClient.isConnected()){
        var content;
        switch (color) {
            case "#0000FF":
                content = lights_blue;
                break;
            case "#FF0000":
                content = lights_red
                break;
            case "#FFFF00":
                content = lights_yellow
                break;
        }
    //     var message = new Paho.MQTT.Message(content)
    //     message.destinationName = "openlab/lights";
    //     mqttClient.send(message);
    // }else{
    //     console.error("Mqtt client is not connected");
    // }

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
