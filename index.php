<!--
//	Chatbox - Coding challenge by DreamGamer
//	Project start: 07.02.2018	
//	File: index.php	
//
//	Coded by: Maurice Bertram
-->

<html>
<head>
	<title>Chatbot - Coding Challenge</title>
	<link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet"> 
	<link rel="stylesheet" type="text/css" href="/css/bootstrap.css">
	<link rel="stylesheet" type="text/css" href="/css/style.css">
	<script type="text/javascript" src="/js/jquery.js"></script>
	<script type="text/javascript" src="/js/bootstrap.js"></script>
	
</head>
<body>

	<div class="main-container">
		<div class="conversation-container">
			
		</div>
		<div class="spacer"></div>
		<div class="chatbox-container">
			<form id="chat-form">
				<textarea class="chat form-control" placeholder="Schreibe etwas..." maxlength="75" required autofocus></textarea>
				<button id="submit-button" type="submit" disabled="disabled" class="btn btn-primary submitBTN">Senden</button>
			</form>
		</div>
	</div>

</body>
</html>

<!--
	// Scripts
-->
<script type="text/javascript" src="/js/main.js"></script>