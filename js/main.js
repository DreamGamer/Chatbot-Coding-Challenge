$(document).ready(function() {

});

$("#chatform").submit(function() {
	var message = $(".chat").val();
	console.log("Message: '" + message + "'");

	return false;
});