var config = {
    apiKey: "AIzaSyAVA3exkrV7DMW6DIgH0K7juHgtZNXh2rc",
    authDomain: "train-schedule-1c021.firebaseapp.com",
    databaseURL: "https://train-schedule-1c021.firebaseio.com",
    projectId: "train-schedule-1c021",
    storageBucket: "train-schedule-1c021.appspot.com",
    messagingSenderId: "156242379899",
    appId: "1:156242379899:web:c88594616452160a"
};
// Initialize Firebase
firebase.initializeApp(config);
var db = firebase.database();

// Initial values for input fields
var trainName = '';
var destination = '';
var time = '';
var frequency = '';

// Button to submit a new train!
$('#add-train').click(function () {
    event.preventDefault();
    trainName = $('#train-name-input').val().trim();
    destination = $('#destination-input').val().trim();
    time = $('#time-input').val().trim();
    frequency = $('#frequency-input').val().trim();

    newTrainData = {
        trainName: trainName,
        destination: destination,
        time: time,
        frequency: frequency,
        timeStamp: firebase.database.ServerValue.TIMESTAMP
    }
    db.ref().push(newTrainData);
    clearInputs();
});

//////////////////////////////////////////
// Main function for getting data ////////
//////////////////////////////////////////

db.ref().on('child_added', function (cSnapshot) {
    var tName = cSnapshot.val().trainName;
    var tDest = cSnapshot.val().destination;
    var tTime = cSnapshot.val().time;
    var tFreq = cSnapshot.val().frequency;
    var tArrv = moment(tTime, 'hh:mm A')
    console.log(tName + ', ' + tDest + ', ' + tTime + ', ' + tFreq + ', ' + tArrv);

    console.log(moment().format('hh:mm A') + ', ' + moment(tArrv).format('hh:mm A'))

    var difference = moment().diff(moment(tArrv) , "minutes");
    console.log(difference);

    var wait = '';
    var nextTrain = '';
    var trains = '';
    var currentTime = moment().format('hh:mm A');

    var waitCalc = function() {
        if (difference < 0) {
            wait = Math.abs(difference);
            console.log('Still waiting for first train.');
            nextTrain = tTime;
            console.log('Wait: ' + wait + ' mins | Next Train: ' + nextTrain);
        } else {
            // FIX THIS
            console.log('Just waiting for the next one.');


            console.log('=--=0-=-==- vars -0--00-00-9-=');
            console.log(currentTime);
            console.log(tTime);
            console.log(tFreq);

            trains = Math.floor((currentTime - tTime)/tFreq);
            console.log('trains: ' + trains);
            

            wait = difference % tFreq;
            nextTrain = moment().add(wait, 'm').format('hh:mm A');
            console.log('Wait: ' + wait + ' mins | Next Train: ' + nextTrain);
        };
    };

    waitCalc();

    $("#train-list").append("<tr><td>" + tName +"</td><td>" + tDest + "</td><td>" + tFreq + "</td><td>" + nextTrain + "</td><td>" + wait + "</td></tr>");

}, function (errorObject) {
    console.log("Error: " + errorObject.code);
});

//////////////////////////////////////////
// Clock in Jumbotron ////////////////////
//////////////////////////////////////////

var clock = function () {
    time = moment().format('hh:mm:ss A');
    $('#clock').text(time);
}
clockInterval = setInterval(clock, 1000);

//////////////////////////////////////////
// Clear inputs after submission /////////
//////////////////////////////////////////

var clearInputs = function () {
    $('#train-name-input').val('');
    $('#destination-input').val('');
    $('#time-input').val('');
    $('#frequency-input').val('');
};