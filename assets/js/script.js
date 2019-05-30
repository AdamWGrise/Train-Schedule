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

    // FINISH CALCULATIONS HERE

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