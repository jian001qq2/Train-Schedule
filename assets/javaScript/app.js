// Initialize Firebase
var config = {
    apiKey: "AIzaSyB33klvOkvCbiPszcqdCOCSO5VNfahpZlA",
    authDomain: "train-schedule-99f27.firebaseapp.com",
    databaseURL: "https://train-schedule-99f27.firebaseio.com",
    projectId: "train-schedule-99f27",
    storageBucket: "train-schedule-99f27.appspot.com",
    messagingSenderId: "1042710019170"
};
firebase.initializeApp(config);

// inital variable declaration 
var database = firebase.database();

// Capture click for the submit button to add train
$("#add-info-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user inputs
    var trainName = $("#train-name-input").val().trim();
    var destinationName = $("#destination-input").val().trim();
    var firstTime = moment($("#first-time-input").val().trim(), "HH:mm").subtract(2, "years").format("X");
    var frequency = $("#frequency-input").val().trim();
    //Store variables in the firebase
    //First create a local object for data storage, then push it to firebase's database
    var newTrain = {
        name: trainName,
        destination: destinationName,
        initialTime: firstTime,
        frequency: frequency
    };
    // Push to the database
    database.ref().push(newTrain);
    // Log to check the data
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.initialTime);
    console.log(newTrain.frequency);

    //Clear the input text boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-time-input").val("");
    $("#frequency-input").val("");
});

// Create Firebase event for adding employee to the database
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything from the database into variables.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().initialTime;
    var trainFrequency = childSnapshot.val().frequency;

    // For train time calculation
    //How long did the train left
    var remainder = moment().diff(moment.unix(trainTime), "minutes") % trainFrequency;
    //How long for the next train to arrive
    var minutes = trainFrequency - remainder;
    //What time will the next train arrive with date for better accuracy
    var arrivalTime = moment().add(minutes, "minutes").format("LLL");

    //Create new row to append in the table body and then display it lin the list
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(arrivalTime),
        $("<td>").text(minutes)
    );
    $("#schedule-table > tbody").append(newRow);
})