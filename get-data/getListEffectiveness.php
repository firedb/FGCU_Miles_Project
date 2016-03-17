<?php
error_reporting(0);

$host='localhost';
$user='root';
$pass='';
$db='miles_db';

$db = new mysqli($host, $user, $pass, $db);

if($db) {

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	
	$campaign = $request->campaign;
	$range_type = $request->r_type;
	$start_date = $request->sdate;
	$end_date = $request->edate;


	switch ($range_type) {

		case "From To":

		//break the date up around the " " character in $date_no_time
		$parts = explode(" ",$start_date);
		//grab the first part
		$start_no_time = $parts['0'];

		//break the date up around the " " character in $date_no_time
		$parts = explode(" ",$end_date);
		//grab the first part
		$end_no_time = $parts['0'];
		
		$opens_query = 	"SELECT From_Nm, Data_Source_Nm, Open_Cnt, Bounce_Cnt, Mailed_Cnt, Start_Ts, Data_Source_Id
						FROM sm_mailing_summary
						WHERE From_Nm = '$campaign' AND Start_Ts BETWEEN '$start_no_time' AND '$end_no_time'
						ORDER BY `sm_mailing_summary`.`Start_Ts` ASC";
		break;
		case "Single Day":

		//break the date up around the " " character in $date_no_time
		$parts = explode(" ",$start_date);
		//grab the first part
		$date_no_time = $parts['0'];

		$opens_query = 	"SELECT From_Nm, Data_Source_Nm, Open_Cnt, Bounce_Cnt, Mailed_Cnt, Start_Ts, Data_Source_Id
						FROM sm_mailing_summary
						WHERE From_Nm = '$campaign' AND Start_Ts LIKE '".$date_no_time."%'
						ORDER BY `sm_mailing_summary`.`Data_Source_Id` ASC";
						
						
		//$device_usage_query = "SELECT DISTINCT DEVICEPLATFORM, COUNT(DEVICEPLATFORM) AS UserCount FROM (SELECT DISTINCT DEVICEPLATFORM, USERID FROM sm_devicecategory_log force index(DEVICEPLAT_USERID_Index) where TTYPE='open' AND DATESTAMP LIKE '".$date_no_time."%') intial_tallying GROUP BY DEVICEPLATFORM";
		break;
		case "One Week":

		//break the date up around the " " character in $date_no_time
		$parts = explode(" ",$start_date);
		//grab the first part
		$date_no_time = $parts['0'];

		$opens_query = 	"SELECT From_Nm, Data_Source_Nm, Open_Cnt, Bounce_Cnt, Mailed_Cnt, Start_Ts, Data_Source_Id
						FROM sm_mailing_summary
						WHERE From_Nm = '$campaign' AND Start_Ts BETWEEN '$date_no_time' AND '$date_no_time' + INTERVAL 7 DAY
						ORDER BY `sm_mailing_summary`.`Data_Source_Id` ASC";

						
		//$device_usage_query = "SELECT DISTINCT DEVICEPLATFORM, COUNT(DEVICEPLATFORM) AS UserCount FROM (SELECT DISTINCT DEVICEPLATFORM, USERID FROM sm_devicecategory_log force index(DEVICEPLAT_USERID_Index) where TTYPE='open' AND DATESTAMP BETWEEN '$date_no_time' AND '$date_no_time' + INTERVAL 7 DAY) intial_tallying GROUP BY DEVICEPLATFORM";
		break;
		case "One Month":

		//break the date up around the " " character in $date_no_time
		$parts = explode(" ",$start_date);
		//grab the first part
		$date_no_time = $parts['0'];
		$opens_query = 	"SELECT From_Nm, Data_Source_Nm, Open_Cnt, Bounce_Cnt, Mailed_Cnt, Start_Ts, Data_Source_Id
						FROM sm_mailing_summary
						WHERE From_Nm = '$campaign' AND Start_Ts BETWEEN '$date_no_time' AND '$date_no_time' + INTERVAL 30 DAY
						ORDER BY `sm_mailing_summary`.`Data_Source_Id` ASC";
						
		//$device_usage_query = "SELECT DISTINCT DEVICEPLATFORM, COUNT(DEVICEPLATFORM) AS UserCount FROM (SELECT DISTINCT DEVICEPLATFORM, USERID FROM sm_devicecategory_log force index(DEVICEPLAT_USERID_Index) where TTYPE='open' AND DATESTAMP BETWEEN '$date_no_time' AND '$date_no_time' + INTERVAL 30 DAY) intial_tallying GROUP BY DEVICEPLATFORM";
		break;

		default:
		break;
		} //ends switch
		if($result = $db->query($opens_query) or die($db->error)){

			if ($result->num_rows > 0){
				while($row = $result->fetch_assoc()) {
					$data[] = $row;
				}
			}

			//JSON-encode the response
			echo $response = json_encode($data, JSON_PRETTY_PRINT);
		}
}  //ends if($db)
	else {
		die($db->error);
	}
?>