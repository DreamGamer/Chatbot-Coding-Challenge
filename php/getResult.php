<?php
/*
//	Chatbox - Coding challenge by DreamGamer
//	Project start: 07.02.2018	
//	File: getResult.php
//
//	Coded by: Maurice Bertram
*/



header('Content-Type: application/json');


if($_SERVER["REQUEST_METHOD"] == "POST") {
	require("config.php");
	$javascriptResultArray = array();

	if (isset($_POST["answer1"]) && isset($_POST["answer2"]) && isset($_POST["answer3"]) && isset($_POST["answer4"]) && isset($_POST["answer5"]) && isset($_POST["answer6"])) {
		$yesOrNo = $_POST["answer1"];	// yes or no
		$age = $_POST["answer2"];		// age
		$time = $_POST["answer3"];		// time
		$weather = $_POST["answer4"];	// weather
		$effort = $_POST["answer5"];	// effort
		$category = $_POST["answer6"];	// category

		// Create connection
		$conn = new mysqli($servername, $username, $password, $dbname);

		// Check connection
		if ($conn->connect_error) {
	    	$javascriptResultArray["error"] = "Error: No MySQL connection!";
		} else {
			if ($yesOrNo == "yes" && (1 <= $time) && ($time <= 4) && (1 <= $effort) && ($effort <= 3)) {
				//
				//
				//
				//
				//
				//
				//if ()

				$javascriptResultArray["error"] = $yesOrNo . " | " . $age . " | " . $time . " | " . $weather . " | " . $effort . " | " . $category;


				if ($weather === "3") {
					if ($stmt = $conn->prepare("SELECT DISTINCT name FROM freetimeactivities WHERE effort=? AND time=? AND category=? HAVING SUM(minAge) <= ?")) {
						$stmt->bind_param("ssss", $effort, $time, $category, $age);
						$stmt->execute();
						$stmt->bind_result($result);
					} else {
						$javascriptResultArray["error"] = "Error: Statement($stmt) = false";
						die();
					}
				} else {
					if ($stmt = $conn->prepare("SELECT DISTINCT name FROM freetimeactivities WHERE effort=? AND time=? AND category=? AND weather=? HAVING SUM(minAge) <= ?")) {
						$stmt->bind_param("sssss", $effort, $time, $category, $weather, $age);
						$stmt->execute();
						$stmt->bind_result($result);
					} else {
						$javascriptResultArray["error"] = "Error: Statement($stmt) = false";
						die();
					}
				}

				if ($stmt->num_rows > 0) {
					$resultsNames = array();
					while ($stmt->fetch()) {
						array_push($resultsNames, $result);
					}

					$string = implode(",", $resultsNames);
					$javascriptResultArray["result"] = $string;
				} else {
					$javascriptResultArray["noActivity"] = "Es tut mir leid :/ Aber mir fällt keine Freizeitaktivität ein die du vornehmen könntest. Frag doch deine Freunde vielleicht fällt denen noch etwas ein! :)";
				}
			}
		}

	} else {
		$javascriptResultArray["error"] = "Missing POST datas!";
	}


	echo json_encode($javascriptResultArray);
}

?>