<?php
/*
//	Chatbox - Coding challenge by DreamGamer
//	Project start: 07.02.2018	
//	File: getResult.php
//
//	Coded by: Maurice Bertram
*/



//header('Content-Type: application/json');


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

				if ($categoriesListStmt = $conn->prepare("SELECT category FROM freetimeactivities WHERE category=?")) {
					$categoriesListStmt->bind_param("s", $category);
					$categoriesListStmt->execute();
					$categoriesListStmt->store_result();
					$categoriesListStmt->bind_result($categorieCheck);
				} else {
					$javascriptResultArray["error"] = "Error: Statement($ categoriesListStmt) = false";
					echo json_encode($javascriptResultArray);
					die();
				}

				if ($categoriesListStmt->num_rows > 0) {
					if ($weather == "3") {
						if ($stmt = $conn->prepare("SELECT DISTINCT name FROM freetimeactivities WHERE effort = ? AND category = ? AND time < ? AND minAge < ?")) {
							$stmt->bind_param("ssss", $effort, $category, $time += 1, $age);
							$stmt->execute();
							$stmt->store_result();
							$stmt->bind_result($result);
						} else {
							$javascriptResultArray["error"] = "Error: Statement($ stmt) = false";
							echo json_encode($javascriptResultArray);
							die();
						}
					} else {
						if ($stmt = $conn->prepare("SELECT DISTINCT name FROM freetimeactivities WHERE effort=? AND category=? AND weather=? AND time < ? AND minAge < ? OR effort=? AND category=? AND weather='3' AND time < ? AND minAge < ?")) {
							$stmt->bind_param("ssssssssss", $effort, $category, $weather, $time += 1, $age, $effort, $category, $weather, $time += 1, $age);
							$stmt->execute();
							$stmt->store_result();
							$stmt->bind_result($result);
						} else {
							$javascriptResultArray["error"] = "Error: Statement( $stmt) = false";
							echo json_encode($javascriptResultArray);
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

					$stmt->close();
					$conn->close();
				} else {
					$javascriptResultArray["error"] = "Error: Category not in the database!";
				}
			}
		}

	} else {
		$javascriptResultArray["error"] = "Missing POST datas!";
	}


	echo json_encode($javascriptResultArray);
} else {
	$currentDate = date("m/d/Y");
	echo $currentDate;
	echo season(array($currentDate, $currentDate));
}


function season($period) {
    $seasons    = array(
        'spring'	=> array('March 21'     , 'June 20'),
        'summer'	=> array('June 21'      , 'September 22'),
        'fall'  	=> array('September 23' , 'December 20'),
        'winter'	=> array('December 21'  , 'March 20')
    );

    $seasonsYear = array();

    $start      = strtotime($period[0]);
    $end        = strtotime($period[1]);

    $seasonsYear[date('Y', $start)] = array();

    if (key(current($seasonsYear)) != date('Y', $end))
        $seasonsYear[date('Y', $end)] = array();

    foreach ($seasonsYear as $year => &$seasonYear)
        foreach ($seasons as $season => $period)
            $seasonYear[$season] = array(strtotime($period[0].' '.$year), strtotime($period[1].' '.($season != 'winter' ? $year : ($year+1))));

    foreach ($seasonsYear as $year => &$seasons) {
        foreach ($seasons as $season => &$period) {
            if ($start >= $period[0] && $end <= $period[1])
                return ucFirst($season).' '.$year;

            if ($start >= $period[0] && $start <= $period[1]) {
                if (date('Y', $end) != $year) 
                    $seasons = $seasonsYear[date('Y', $end)];   
                    $year = date('Y', $end);

                $nextSeason = key($seasons);
                $nextPeriod = current($seasons);                
                do {                    
                    $findNext   = ($end >= $nextPeriod[0] && $end <= $nextPeriod[1]);

                    $nextSeason = key($seasons);
                    $nextPeriod = current($seasons);
                } while ($findNext = False);

                $diffCurr   = $period[1]-$start;
                $diffNext   = $end-$nextPeriod[0];

                if ($diffCurr > $diffNext)
                    return ucFirst($season).' '.$year;
                else {
                    return ucFirst($nextSeason).' '.$year;
                }
            }
        }
    }
}

?>