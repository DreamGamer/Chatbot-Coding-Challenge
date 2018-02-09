var botName = "Chatbot";
var yesWords = ["ja", "natürlich", "sicher", "yes", "klaro", "jap", "jo"];
var noWords = ["nein", "ne", "nope", "nö"];


var understandError = "<p>Tut mir leid ich habe leider nicht verstanden was du gesagt hast. Wir entschuldigen uns vielmals.</p>";
var understandErrorRepeat = "<p>Tut mir leid ich habe leider nicht verstanden was du gesagt hast könntest du dies wiederholen?</p>";
var understandErrorCounter = 0;
var resetSentence = "<p>Es ist ein Fehler aufgetreten der bot wird neugestartet<span id='restartDots'>...</span></p>";

var currentQuastion = 0;
var quastions = 1;

var lastBotMessage = "";
var restarting = false;

var anwsers =  {
	"1": "",
	"2": "",
	"3": "",
	"4": ""
}


$(document).ready(function() {

	startBot();


	// Remove disable attr after the Bot writen something...
	$("#submit-button").removeAttr("disabled", "disabled");


});

$("#chat-form").submit(function() {
	// Send current message
	sendMessage();

	// Cancel the submit Event
	return false;
});

$("#chat-form").keypress(function (e) {
	// 13 equels the Enter key
    if(e.which == 13 && !$("#submit-button").attr("disabled")) {
        // Send message if the Enter key pressed
        sendMessage();
        // Cancel the submit Event
        e.preventDefault();
    }
});


function sendMessage() {
	// Get typed message
	var message = $(".chat").val();

	if (message != "") {
		// Add message to div
		addMessage("You", message);

		// Scroll to end of div
		$('.conversation-container').scrollTop($('.conversation-container')[0].scrollHeight);

		// Clear the current Chatbox
		$(".chat").val("");

		// Disable the submit button
		$("#submit-button").attr("disabled", "disabled");

		switch (currentQuastion) {
			case 0:
				startQuastion1(message);
				break;
			default:
				console.log("Default");
		}

		for (var r in anwsers) {
		    console.log(r);
		}
	}
}


function addMessage(userName, message) {
	$(".conversation-container").append("<p><b>" + userName + ":</b> " + message + "</p>");
}

function startBot() {
	lastBotMessage = "Willkommen beim GetInIt Coding Challenge Chatbot. Ich habe gehört du möchtest eine rat für deine Freizeitgestaltung?";
	addMessage(botName, "Willkommen beim GetInIt Coding Challenge Chatbot. Ich habe gehört du möchtest eine rat für deine Freizeitgestaltung?");
}

function searchWord(words, message) {
	message = message.toLowerCase();

	var includeCounter = 0;
	// For loop for all words that should get checked
	for (var i=0; i < words.length; i++) {
		// Set word to lower case.
		word = words[i].toLowerCase();
		/*
		// If the word is in the message then say it to includeCounter
		if (message.indexOf(word) >= 0) {
			includeCounter++;
		}
		*/

		if (message.length == word.length && message.includes(word)) {
			includeCounter++;
		} else if (message.includes(" " + word + " ") || message.includes(word + " ") || message.includes(" " + word)) {
			includeCounter++;
		}


	}

	if (includeCounter > 0) {
		return true;
	}

	return false;
}

function yesORNo(message) {
	if (searchWord(yesWords, message) && !searchWord(noWords, message)) {
		return true;
	} else if (!searchWord(yesWords, message) && searchWord(noWords, message)) {
		return false;
	} else {
		return null;
	}
}

function startQuastion1(message) {
	if (yesORNo(message) == true) {
		// Anwser yes
		console.log("yes");
		anwsers["1"] = "yes";
		currentQuastion = 1;
	} else if(yesORNo(message) == false) {
		// Anwser no
		console.log("no");
		anwsers["1"] = "no";
		currentQuastion = 1;
	} else {
		didntUnderstand();
		resetChatbox();
	}
}

function startQuastion2(message) {

}

function didntUnderstand() {
	if (understandErrorCounter > 2) {
		addMessage(botName, understandError);
		resetChatbot();
	} else {
		addMessage(botName, understandErrorRepeat);
		understandErrorCounter++;
	}
}

function resetChatbox() {
	// Reset the chat submit button
	$("#submit-button").removeAttr("disabled", "disabled");
}

function resetChatbot() {
	if (!restarting) {
		restarting = true;
		addMessage(botName, resetSentence);
		animateDots(4000);
		setTimeout(function(){ 
			currentQuastion = 0;
			$(".conversation-container").html("");
			startBot();
			understandErrorCounter = 0;
			restarting = false;
	    }, 4000);
	}
}

function animateDots(time) {
	var counter = time / 500;

	console.log($("#restartDots").html());

	setTimeout(function(){ 
		counter--;
		switch ($("#restartDots").html) {
			case ".":
			$("#restartDots").html("..");
				break;
			case "..":
			$("#restartDots").html("...");
				break;
			case "...":
			$("#restartDots").html(".");
				break;
		}
		if (counter > 0) {
			animateDots(time);
		}
	 }, 500);
}