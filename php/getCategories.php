<?php

header('Content-Type: application/json');

if($_SERVER["REQUEST_METHOD"] == "POST") {
	require("config.php");
	$javascriptResultArray = array();

	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);

	// Check connection
	if ($conn->connect_error) {
	    $javascriptResultArray["error"] = "Error: No MySQL connection!";
	} else {
		$selectAllCategories = "SELECT DISTINCT category FROM freetimeactivities";
		$result = $conn->query($selectAllCategories);

		if ($result->num_rows > 0) {
			$allCategories = array();
			while($row = $result->fetch_assoc()) {
		        array_push($allCategories, $row["category"]);
			}

			$string = implode(",", $allCategories);
			$javascriptResultArray["result"] = $string;



		} else {
			$javascriptResultArray["error"] = "No entries in the Database";
		}

		$conn->close();
	}

	echo json_encode($javascriptResultArray);
}


?>