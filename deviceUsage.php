<?php
error_reporting ( 0 );
​
$host = 'localhost';
$user = 'root';
​
//$pass = 'password'; // YOUR PASS IS MOST LIKELY BLANK
$pass = '';
//$db = 'milesdb'; // ALSO YOUR DB NAME MAY BE DIFFERENT
$db = 'miles_db';
$db = new mysqli ( $host, $user, $pass, $db );
​
// pass the dates or times into a variable
/* $start_date = ($_GET ['start_date']); // when passed the variable names must be exactly the same!!!!
$end_date = ($_GET ['end_date']);
$time_length = ($_GET ['time_length']); */
​
// ///Example of how to create a date to add days and convert to proper format for SQL
// $test=date_create($start_date);
// date_add($test, date_interval_create_from_date_string("40 days"));
// $test = date_format($test, "Y-m-d H:i:s");
// echo $test;
​
/*
 * Collect all Details from Angular HTTP Request.
*/
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
@$start_date = $request->start_date;
@$end_date = $request->end_date;
echo $end_date; //this will go back under "data" of angular call.
/*
 * You can use $email and $pass for further work. Such as Database calls.
 */
​
// check if end date sent or if null add the time length
if ($end_date == null) {
	switch ($time_length) {
		case null :
			$end_date = date_create ( $start_date );
			date_add ( $end_date, date_interval_create_from_date_string ( "40 days" ) );
			$end_date = date_format ( $end_date, "Y-m-d H:i:s" ); // so sql can read
			echo $end_date;
			echo "null missing time";
			break;
		case day :
			$end_date = date_create ( $start_date );
			date_add ( $end_date, date_interval_create_from_date_string ( "1 days" ) );
			$end_date = date_format ( $end_date, "Y-m-d H:i:s" ); // so sql can read
			//echo $end_date;
			break;
			
		case week :
			$end_date = date_create ( $start_date );
			date_add ( $end_date, date_interval_create_from_date_string ( "7 days" ) );
			$end_date = date_format ( $end_date, "Y-m-d H:i:s" ); // so sql can read
			//echo $end_date
			break;
		case month :
			$end_date = date_create ( $start_date );
			date_add ( $end_date, date_interval_create_from_date_string ( "30 days" ) );
			$end_date = date_format ( $end_date, "Y-m-d H:i:s" ); // so sql can read
			//echo $end_date
			break;
	}
}
​
// will hold query and dates
$response ["devices"] = array ();
$response ["start_date"] = $start_date;
$response ["end_date"] = $end_date;
​
if ($db) {
	
	if ($result = $db->query ( "SELECT DISTINCT DEVICEPLATFORM, COUNT(DEVICEPLATFORM) AS USERCOUNT FROM TEMP_DEVICECATEGORY WHERE DCDATE BETWEEN '$start_date' AND '$end_date' GROUP BY DEVICEPLATFORM ORDER BY DEVICEPLATFORM" ) or die ( $db->error )) {
		
		$data = array ();
		
		if ($result->num_rows > 0) {
			while ( $row = $result->fetch_assoc () ) {
				$data [] = $row;
			}
		}
		sort ( $data );
		
		// save data in response array
		array_push ( $response ["devices"], $data );
		// JSON-encode the response
		echo $response = json_encode ( $response );
	}
}  // ends if
​
else {
	die ( $db->error );
}
?>