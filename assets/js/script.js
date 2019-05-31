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
    var tTimeX = cSnapshot.val().time;
    var tFreq = cSnapshot.val().frequency;
    var tTime = moment(tTimeX, 'hh:mm A');
    console.log('======== TRAIN DETAILS ========')
    console.log(tName + ', ' + tDest + ', ' + moment(tTime).format('hh:mm A') + ', ' + tFreq);

    var difference = moment().diff(moment(tTime), "minutes");
    var wait = '';
    var nextTrain = '';
    
    var waitCalc = function() {
        if (difference < 0) {
            wait = Math.abs(difference);
            nextTrain = moment(tTime).format('hh:mm A');
            console.log('Wait: ' + wait + ' mins | Next Train: ' + nextTrain);
        } else {
            sinceLastTrain = difference % tFreq;
            wait = tFreq - sinceLastTrain;
            console.log('Last Train (mins): ' + sinceLastTrain + ' | Wait: ' + wait);
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
    time = moment().format('LTS');
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