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
	
	$specific_email = $request->spec_email;
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
		
		$opens_query = "SELECT sm_mailing_summary.Mailing_Nm, sm_tracking_log.TType, sm_tracking_log.MailingId, date_format(Datestamp, '%Y-%m-%d') AS Datestamp, date_format(Datestamp, '%H') AS Hourstamp, COUNT(sm_tracking_log.TType) AS OpenCount
						FROM `sm_tracking_log`
						INNER JOIN sm_mailing_summary
						ON sm_tracking_log.MailingID = sm_mailing_summary.Mailing_Id
						WHERE Datestamp BETWEEN '$start_no_time' AND '$end_no_time' AND HOUR(Datestamp) IN (0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23) AND sm_mailing_summary.Mailing_Nm LIKE '$specific_email' AND TType = 'open'
						GROUP BY sm_tracking_log.MailingID, date_format(Datestamp, '%Y-%m-%d-%H')
						ORDER BY Datestamp, Hourstamp ASC";	
		break;
		case "Single Day":

		//break the date up around the " " character in $date_no_time
		$parts = explode(" ",$start_date);
		//grab the first part
		$date_no_time = $parts['0'];
		$opens_query = "SELECT sm_mailing_summary.Mailing_Nm, sm_tracking_log.TType, sm_tracking_log.MailingId, date_format(Datestamp, '%Y-%m-%d') AS Datestamp, date_format(Datestamp, '%H') AS Hourstamp, COUNT(sm_tracking_log.TType) AS OpenCount
						FROM `sm_tracking_log`
						INNER JOIN sm_mailing_summary
						ON sm_tracking_log.MailingID = sm_mailing_summary.Mailing_Id
						WHERE Datestamp LIKE '".$date_no_time."%' AND HOUR(Datestamp) IN (0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23) AND sm_mailing_summary.Mailing_Nm LIKE '$specific_email' AND TType = 'open'
						GROUP BY sm_tracking_log.MailingID, date_format(Datestamp, '%Y-%m-%d-%H')
						ORDER BY Datestamp, Hourstamp ASC";	
						
		//$device_usage_query = "SELECT DISTINCT DEVICEPLATFORM, COUNT(DEVICEPLATFORM) AS UserCount FROM (SELECT DISTINCT DEVICEPLATFORM, USERID FROM sm_devicecategory_log force index(DEVICEPLAT_USERID_Index) where TTYPE='open' AND DATESTAMP LIKE '".$date_no_time."%') intial_tallying GROUP BY DEVICEPLATFORM";
		break;
		case "One Week":

		//break the date up around the " " character in $date_no_time
		$parts = explode(" ",$start_date);
		//grab the first part
		$date_no_time = $parts['0'];

		$opens_query = "SELECT sm_mailing_summary.Mailing_Nm, sm_tracking_log.TType, sm_tracking_log.MailingId, Datestamp, date_format(Datestamp, '%H') AS Hourstamp, COUNT(sm_tracking_log.TType) AS OpenCount
						FROM `sm_tracking_log`
						INNER JOIN sm_mailing_summary
						ON sm_tracking_log.MailingID = sm_mailing_summary.Mailing_Id
						WHERE Datestamp BETWEEN '$date_no_time' AND '$date_no_time' + INTERVAL 7 DAY AND HOUR(Datestamp) IN (0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23) AND sm_mailing_summary.Mailing_Nm LIKE '$specific_email' AND TType = 'open'
						GROUP BY sm_tracking_log.MailingID, date_format(Datestamp, '%Y-%m-%d-%H')
						ORDER BY Datestamp, Hourstamp ASC";	
						
		//$device_usage_query = "SELECT DISTINCT DEVICEPLATFORM, COUNT(DEVICEPLATFORM) AS UserCount FROM (SELECT DISTINCT DEVICEPLATFORM, USERID FROM sm_devicecategory_log force index(DEVICEPLAT_USERID_Index) where TTYPE='open' AND DATESTAMP BETWEEN '$date_no_time' AND '$date_no_time' + INTERVAL 7 DAY) intial_tallying GROUP BY DEVICEPLATFORM";
		break;
		case "One Month":

		//break the date up around the " " character in $date_no_time
		$parts = explode(" ",$start_date);
		//grab the first part
		$date_no_time = $parts['0'];
		$opens_query = "SELECT sm_mailing_summary.Mailing_Nm, sm_tracking_log.TType, sm_tracking_log.MailingId, date_format(Datestamp, '%Y-%m-%d') AS Datestamp, date_format(Datestamp, '%H') AS Hourstamp, COUNT(sm_tracking_log.TType) AS OpenCount
						FROM `sm_tracking_log`
						INNER JOIN sm_mailing_summary
						ON sm_tracking_log.MailingID = sm_mailing_summary.Mailing_Id
						WHERE Datestamp BETWEEN '$date_no_time' AND '$date_no_time' + INTERVAL 30 DAY AND HOUR(Datestamp) IN (0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23) AND sm_mailing_summary.Mailing_Nm LIKE '$specific_email' AND TType = 'open'
						GROUP BY sm_tracking_log.MailingID, date_format(Datestamp, '%Y-%m-%d-%H')
						ORDER BY Datestamp, Hourstamp ASC";	
						
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