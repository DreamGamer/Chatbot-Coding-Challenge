<?php

if($_SERVER["REQUEST_METHOD"] == "POST") {
	require("config.php");

	$currentDate = date("Y-d-m");
	$message = $_POST["message"];
	$userIP = getUserIP();

	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);

	// Check connection
	if ($conn->connect_error) {
	    consoleLog("Error: No MySQL connection!");
	} else {
		$sendMessageSQL = "INSERT INTO chat (message, ip, date) VALUES ('$message', '$userIP', '$currentDate')";

		if ($conn->query($sendMessageSQL) === FALSE) {
			consoleLog("Error: " . $conn->error);
		}
	}



}


function consoleLog($message) {
	echo "<script>console.log('" . $message . "');</script>";
}


function getUserIP() {
	$ip = $_SERVER['SERVER_ADDR'];

	if (PHP_OS == 'WINNT'){
		$ip = getHostByName(getHostName());
	}

	if (PHP_OS == 'Linux'){
		$command="/sbin/ifconfig";
		exec($command, $output);
		// var_dump($output);
		$pattern = '/inet addr:?([^ ]+)/';

		$ip = array();
		foreach ($output as $key => $subject) {
		    $result = preg_match_all($pattern, $subject, $subpattern);
		    if ($result == 1) {
		        if ($subpattern[1][0] != "127.0.0.1")
		        $ip = $subpattern[1][0];
		    }
		}
	}

	return $ip;
}

?>