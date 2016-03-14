<?php
error_reporting(0);

$host='localhost';
$user='root';
$pass='';
$db='miles_db';

$db = new mysqli($host, $user, $pass, $db);

if($db) {
	//sm_tracking_log.TType, sm_tracking_log.MailingId,
	$opens_query = "SELECT sm_mailing_summary.Mailing_Nm, sm_tracking_log.MailingId, Datestamp, COUNT(sm_tracking_log.TType) AS OpenCount
					FROM `sm_tracking_log`
					INNER JOIN sm_mailing_summary
					ON sm_tracking_log.MailingID = sm_mailing_summary.Mailing_Id
					WHERE Datestamp BETWEEN '2015-02-12' AND '2015-02-20' AND TType LIKE '%Open%' AND sm_mailing_summary.Mailing_Id IN (
   					 SELECT Mailing_Id 
   					 	From sm_mailing_summary 
    					WHERE From_Nm = 'Georgia Tourism'
    					)
					GROUP BY sm_tracking_log.MailingID, date_format(Datestamp, '%Y-%m-%d')";
					
					
	//$opens_query = "SELECT sm_mailing_summary.Mailing_Nm, date_format(Datestamp, '%Y-%m-%d') AS Datestamp, date_format(Datestamp, '%H') AS Hourstamp, COUNT(sm_tracking_log.TType) AS OpenCount FROM `sm_tracking_log` INNER JOIN sm_mailing_summary ON sm_tracking_log.MailingID = sm_mailing_summary.Mailing_Id WHERE Datestamp BETWEEN '2015-02-12' AND '2015-02-20' AND HOUR(Datestamp) IN (0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23) AND sm_mailing_summary.Mailing_Nm LIKE '2.12.2015 February Georgia BiMonthly 1%' AND TType = 'open' GROUP BY sm_tracking_log.MailingID, date_format(Datestamp, '%Y-%m-%d-%H') ORDER BY Datestamp, Hourstamp ASC";
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