/*
//	Chatbox - Coding challenge by DreamGamer
//	Project start: 07.02.2018	
//	File: main.js
//
//	Coded by: Maurice Bertram
*/

var botName = "Chatbot";
var userName = "Ich: ";
var yesWords = ["ja", "natürlich", "sicher", "yes", "klaro", "jap", "jo", "yea", "joa", "jep", "joahr", "joar"];
var noWords = ["nein", "ne", "nope", "nö"];


var understandError = "Tut mir leid ich habe leider nicht verstanden was du gesagt hast. Wir entschuldigen uns vielmals.";
var understandErrorRepeat = "Tut mir leid ich habe leider nicht verstanden was du gesagt hast.";
var understandErrorCounter = 0;
var resetSentence = "Es ist ein Fehler aufgetreten der bot wird neugestartet<span id='restartDots'>...</span>";

var firstQuastionNoAwnser = "Ok... Vieleicht ja ein andern mal :) Ich w&uuml;nsche dir noch einen sch&ouml;nen Tag!";

var quastions = 1;

var quastion1Text = "Willkommen beim GetInIt Coding Challenge Chatbot. Ich habe geh&ouml;rt du m&ouml;chtest eine rat f&uuml;r deine Freizeitgestaltung?";
var quastion2Text = "Cool! Dann fangen wir doch direkt mal an.<br />Wie alt bist du denn? (Bitte gebe nur die Zahl ein!)";
var quastion3Text = "Ok, und wieviel Zeit m&ouml;chtest du f&uuml;r die Freizeitaktivit&auml;t einplanen? <br />1 -> 15 Minuten<br />2 -> 30 Minuten<br />3 -> 45 Minuten<br />4 -> 45+ Minuten";
var quastion4Text = "Gut zu wissen ^^<br/>Weißt du wie das Wetter sein wird?";
var quastion4TextV1 = "Oh wenn du wenig Zeit hast beeilen wir uns lieber und kommen direkt zur n&auml;chsten Frage!<br/>Weißt du wie das Wetter sein wird?<br/>1 -> Regnerisch<br/>2 -> Sonnig<br/>3 -> Weiß nicht";
var quastion4TextV2 = "Gut zu wissen ^^<br/>Weißt du wie das Wetter sein wird?<br/>1 -> Regnerisch<br/>2 -> Sonnig<br/>3 -> Weiß nicht";
var quastion4TextV3 = "Gut zu wissen ^^<br/>Weißt du wie das Wetter sein wird?<br/>1 -> Regnerisch<br/>2 -> Sonnig<br/>3 -> Weiß nicht";
var quastion4TextV4 = "Cool das du dir soviel Zeit nimmst :)<br/>Weißt du wie das Wetter sein wird?<br/>1 -> Regnerisch<br/>2 -> Sonnig<br/>3 -> Weiß nicht";
var quastion5TextV1 = "Oh nein das ist nicht gut :/ Dann suche ich mal lieber etwas f&uuml;rs Trockene.<br/>Wie anstrengend soll die Freizeitaktivit&auml;t denn sein?<br/>1 -> Einfach<br/>2 -> Mittel<br/>3 -> Schwer";
var quastion5TextV2 = "Cool wenn die Sonne scheint kann ich ja etwas f&uuml;r draußen suchen :)<br/>Wie anstrengend soll die Freizeitaktivit&auml;t denn sein?<br/>1 -> Einfach<br/>2 -> Mittel<br/>3 -> Schwer";
var quastion5TextV3 = "Ok ist nicht schlimm das du es nicht weißt.<br/>Wie anstrengend soll die Freizeitaktivit&auml;t denn sein?<br/>1 -> Einfach<br/>2 -> Mittel<br/>3 -> Schwer";
var quastion6Text = "Ok kommen wir zur letzten Frage! Welche Kategorie nimmst du?";
var quastion6TextAwnsers = "";

var finalTextArray = {};
var finalText = "Wie w&auml;re es mit einer dieser Freizeitaktivit&auml;ten? <br />";
var finalText1 = "Ok :) Lass mich kurz &uuml;berlegen was mir einf&auml;llt...";


var lastBotMessage = "";
var restarting = false;

var allCategories = {};

var answers =  {
	"1": "",
	"2": "",
	"3": "",
	"4": "",
	"5": "",
	"6": ""
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
		addMessage(userName, message);

		// Scroll to end of div
		$('.conversation-container').scrollTop($('.conversation-container')[0].scrollHeight);

		// Clear the current Chatbox
		$(".chat").val("");

		// Disable the submit button
		$("#submit-button").attr("disabled", "disabled");

		startQuastions(message);

		for (var r in answers) {
		    console.log(answers[r]);
		}

		sendMessageToDatabase(message);
	}
}


function addMessage(name, message) {
	$(".conversation-container").append("<p><b>" + name + ":</b> " + message + "</p>");
	scrollToTheEndOfTheDiv();
}

function startBot() {
	addMessage(botName, quastion1Text);
}

function searchWord(words, message) {
	message = message.toLowerCase();

	var includeCounter = 0;
	// For loop for all words that should get checked
	for (var i=0; i < words.length; i++) {
		// Set word to lower case.
		word = words[i].toLowerCase();

		// Check if the message has the same length as the word (so if i say "no" it should get the word) (example for this if: minecraft -> ne is in the word this if filter it)
		// Examples: "minecraft" -> ne = X "ne" -> ne = Y Ne, ich m&ouml;chte nicht -> ne, = Y
		if (message.length == word.length && message.includes(word)) {
			includeCounter++;
		} else if (message.includes(" " + word + " ") || message.includes(word + " ") || message.includes(" " + word) || message.includes("," + word + ",") || message.includes(word + ",") || message.includes("," + word)) {
			includeCounter++;
		}

	}

	// if the word is included return true
	if (includeCounter > 0) {
		return true;
	}

	// Default return statement is false
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

function startQuastions(message) {
	if (answers["1"] == "") {
		// --------- Quastion 1 --------- \\
		if (yesORNo(message) == true) {
			// answer yes
			answers["1"] = "yes";
			addMessage(botName, quastion2Text);
			resetChatbox();
			understandErrorCounter = 0;
		} else if(yesORNo(message) == false) {
			// answer no
			answers["1"] = "no";
			addMessage(botName, firstQuastionNoAwnser);
			understandErrorCounter = 0;
		} else {
			didntUnderstand();
		}
	} else if (answers["2"] == "") {
		// --------- Quastion 2 --------- \\
		if (!isNaN(message)) {
			answers["2"] = message;
			addMessage(botName, quastion3Text);
			resetChatbox();
			understandErrorCounter = 0;
		} else {
			didntUnderstand();
		}
	} else if (answers["3"] == "") {
		// --------- Quastion 3 --------- \\
		if (message == "1" || message == "2" || message == "3" || message == "4") {
			answers["3"] = message;
			switch (answers["3"]) {
				case "1":
				addMessage(botName, quastion4TextV1);
					break;
				case "2":
				addMessage(botName, quastion4TextV2);
					break;
				case "3":
				addMessage(botName, quastion4TextV3);
					break;
				case "4":
				addMessage(botName, quastion4TextV4);
					break;
				default:
					addMessage(botName, quastion4Text);
					break;
			}
			resetChatbox();
			understandErrorCounter = 0;
		} else {
			didntUnderstand();
		}
	} else if (answers["4"] == "") {
		// --------- Quastion 4 --------- \\
		if (message == "1" || message == "2" || message == "3") {
			answers["4"] = message;
			switch (answers["4"]) {
				case "1":
				addMessage(botName, quastion5TextV1);
					break;
				case "2":
				addMessage(botName, quastion5TextV2);
					break;
				case "3":
				addMessage(botName, quastion5TextV3);
					break;
			}
			resetChatbox();
			understandErrorCounter = 0;
		} else {
			didntUnderstand();
		}

	} else if (answers["5"] == "") {
		// --------- Quastion 5 --------- \\
		if (message == "1" || message == "2" || message == "3") {
			answers["5"] = message;
			$.ajax({
			    type: "POST",
			    url: 'php/getCategories.php',
			    dataType: 'json',
			    success: function (obj, textstatus) {
			    	if( !('error' in obj) ) {
	                    var results = obj.result;
				    	allCategories = results.split(',');
				    	for (var r in allCategories) {
				    		var number = r;
				    		number++;
							quastion6TextAwnsers = quastion6TextAwnsers + "<br />" + number + " -> " + allCategories[r];
						}

						addMessage(botName, quastion6Text + quastion6TextAwnsers);
						resetChatbox();
						understandErrorCounter = 0;
	                }
	                else {
	                    console.log(obj.error);
	                }
			    },
				error: function(jqXHR, textStatus, errorMessage) {
					console.log("(jqXHR)Unknown Error: " + jqXHR);
					console.log("(textStatus)Unknown Error: " + textStatus);
					console.log("(errorMessage)Unknown Error: " + errorMessage);
				}
			});
		} else {
			didntUnderstand();
		}

	} else if (answers["6"] == "") {
		// --------- Quastion 6 --------- \\

		if (!isNaN(message)) {
			var messageNumber = parseInt(message);
			console.log("CategoriesLength: " + allCategories.length);
			console.log("Number: " + messageNumber);
			if (messageNumber < (allCategories.length += 1) && messageNumber > 0) {
				addMessage(botName, finalText1);

				answers["6"] = allCategories[messageNumber -= 1];

				$.ajax({
				    type: "POST",
				    url: 'php/getResult.php',
				    dataType: 'json',
				    data: {
				    	answer1: answers["1"],
				    	answer2: answers["2"],
				    	answer3: answers["3"],
				    	answer4: answers["4"],
				    	answer5: answers["5"],
				    	answer6: answers["6"]
				    },
				    success: function (obj, textstatus) {
				    	messageSpacer();


				    	if ( !("error" in obj) && !("noActivity" in obj)) {
				    		var results = obj.result;
					    	finalTextArray = results.split(',');
					    	for (var r in finalTextArray) {
					    		if (r == 0) {
					    			finalText = finalText + finalTextArray[r];
					    		} else {
									finalText = finalText + ", " + finalTextArray[r];
								}
							}


				    		console.log("RESULT: " + obj.result)
				    		addMessage(botName, finalText);
		                } else if ("noActivity" in obj) {
		                	addMessage(botName, obj.noActivity);
		                } else {
		                    console.log(obj.error);
		                }
		            },
					error: function(jqXHR, textStatus, errorMessage) {
						console.log("(jqXHR)Unknown Error: " + jqXHR);
						console.log("(textStatus)Unknown Error: " + textStatus);
						console.log("(errorMessage)Unknown Error: " + errorMessage);
					}
				});
			} else {
				didntUnderstand();
			}
		} else {
			didntUnderstand();
		}
	}
}

function didntUnderstand() {
	if (understandErrorCounter > 3) {
		addMessage(botName, understandError);
		resetChatbot();
	} else {
		addMessage(botName, understandErrorRepeat);
		understandErrorCounter++;
		resetChatbox();
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
		answers["1"] = "";
		answers["2"] = "";
		answers["3"] = "";
		answers["4"] = "";
		answers["5"] = "";
		answers["6"] = "";

		animateDots(4000);
		setTimeout(function(){ 
			$(".conversation-container").html("");
			resetChatbox();
			startBot();
			understandErrorCounter = 0;
			restarting = false;
	    }, 4000);
	}
}

function animateDots(time) {
	var counter = time / 500;

	setTimeout(function(){
		counter--;
		// Switch system for the dots (. -> .. -> ...)
		switch ($("#restartDots").html()) {
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

		// If counter bigger then 0 start animateDots again
		if (counter > 0) {
			// Start this function again but remove 500 because if it will be not be removed this will be a endless loop :D
			animateDots(time -= 500);
		}
	 }, 500);
}

function sendMessageToDatabase(message) {
	if (message != "" || message != null) {
		$.ajax({
			type: 'post',
			url: '/php/sendMessage.php',
			data: {
				message:message
			},
			success: function (response) {
				$("body").append(response);
			},
			error: function(jqXHR, textStatus, errorMessage) {
				console.log("(jqXHR)Unknown Error: " + jqXHR);
				console.log("(textStatus)Unknown Error: " + textStatus);
				console.log("(errorMessage)Unknown Error: " + errorMessage);
			}
		});
	}
}

function scrollToTheEndOfTheDiv() {
	// Scroll to end of div
	$('.conversation-container').scrollTop($('.conversation-container')[0].scrollHeight);
}

function messageSpacer() {
	$(".conversation-container").append("<div class='resultSpacer'><center><p>Die Auswertung:</p></center></div>");
}