<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
//set up the connection variables
  
$db_name = 'miles_db';
  
$hostname = 'localhost';
  
$username = 'root';
  
$password = '';


// connect to the database
  
$conn = mysql_connect($hostname, $username, $password);

mysql_select_db($db_name, $conn);

$result = mysql_query("SELECT Mailing_Class_Nm, Mailed_Cnt, Actual_Sent_Cnt, Open_Cnt, Start_Ts, Data_Source_Nm, From_Nm FROM sm_mailing_summary", $conn);

$emparray = array();

while($row =mysql_fetch_assoc($result)){
	$emparray[]=$row;
}

echo json_encode($emparray);
//$conn->close();
?>