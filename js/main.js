$(document).ready(function() {

});

$("#chat-form").submit(function() {
	// Send current message
	sendMessage();

	// Cancel the submit Event
	return false;
});

$("#chat-form").keypress(function (e) {
	// 13 equels the Enter key
    if(e.which == 13) {
        // Send message if the Enter key pressed
        sendMessage();
        // Cancel the submit Event
        e.preventDefault();
    }
});


function sendMessage() {
	// Get typed message
	var message = $(".chat").val();

	if (message != null) {
		// Add message to div
		$(".conversation-container").append("<p>You: " + message + "</p>");

		// Scroll to end of div
		$('.conversation-container').scrollTop($('.conversation-container')[0].scrollHeight);

		// Clear the current Chatbox
		$(".chat").val("");
	}
}