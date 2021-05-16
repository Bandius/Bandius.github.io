MQTTclient = new Paho.MQTT.Client("openlab.kpi.fei.tuke.sk", 80, "/mqtt", "voice_simulator_" + new Date() + (Math.random() * 1000));
MQTTclient.onConnectionLost = onConnectionLost;
MQTTclient.onMessageArrived = onMessage;
MQTTclient.connect({onSuccess: onConnect});

const TOPIC = 'experiments/voice/recognition/ib149cd';

var chosenObject;

function onConnect(){
    console.log("connected to MQTT");
    subscribe();
}

function onMessage(message) {
    msg = JSON.parse(message.payloadString);
    if(msg.status == "recognized"){
        console.log(msg.recognized);
        var number = detectNumber(msg.recognized);
        validateNumber(number);

    }
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}

function subscribe(){
    MQTTclient.subscribe(TOPIC);
}

function unsubscribe(){
    MQTTclient.unsubscribe(TOPIC);
}

function detectNumber(num){
    if(parseInt(num) == num){
        return parseInt(num);
    }else{
        const numbers = ["nula", "jeden", "dva", "tri", "štyri", "päť", "šesť", "sedem", "osem", "deväť", "desať"];
        for (var i = 0; i < numbers.length; i++){
            if(numbers[i] == num){
                return i;
            }
        }
    }
}

function validateNumber(num){
    const objects = [5, 8, 7];
    if(num == objects[chosenObject]){
        var win = new Audio("../assets/audio/win.mp3");
        win.play();
    }else{
        var nope = new Audio("../assets/audio/nope.mp3");
        nope.play();
    }
}

function changeScreen(){
    var object = Math.floor(Math.random() * 3);
    var printObject;
    switch(object){
        case 0:
            printObject = 'autíčok';
            chosenObject = 0;
            break;
        case 1:
            printObject = 'lietadiel';
            chosenObject = 1;
            break;
        case 2:
            printObject = 'kravičiek';
            chosenObject = 2;
            break;
    }
    setTimeout(function (){
        document.getElementById('animals').style.visibility = 'visible';
        document.getElementById('text').innerHTML = `Koľko ${printObject} je na obrázku?`
    }, 5000);
}
window.onload = changeScreen();

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
