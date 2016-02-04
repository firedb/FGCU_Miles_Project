<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
  
//set up the connection variables
  
$db_name = 'miles_db';
  
$hostname = 'localhost';
  
$username = 'root';
  
$password = '';


// connect to the database
  
$conn = new mysqli($hostname, $username, $password, $db_name);


// a query get all distinct clients and there names from the SM_mailing_summary
  
$result = $conn ->query("SELECT DISTINCT mailing_class_nm, from_nm FROM sm_mailing_summary");

$outp = "";
while ($rs = $result->fetch_array(MYSQLI_ASSOC)){
	if ($outp !="") {$outp .=",";}
	$outp .='{"Client":"' . $rs["mailing_class_nm"] .'",';
	$outp .='"Client_Name":"' . $rs["from_nm"] .'"}';
}
$outp ='{"records":['.$outp.']}';
$conn->close();

//echo the json string
  
echo ($outp);
?>