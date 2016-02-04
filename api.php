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
  
$result = $conn ->query("SELECT Mailing_Class_Nm, Mailed_Cnt, Actual_Sent_Cnt, Open_Cnt, Start_Ts, Data_Source_Nm, From_Nm FROM sm_mailing_summary");

$outp = "";
while ($rs = $result->fetch_array(MYSQLI_ASSOC)){
	if ($outp !="") {$outp .=",";}
	$outp .='{"Client":"' . $rs["Mailing_Class_Nm"] .'",';
	$outp .='"Client_Name":"' . $rs["From_Nm"] .'",';
	$outp .='"Total_List":"' . $rs["Mailed_Cnt"] .'",';
	$outp .='"Total_Sent":"' . $rs["Actual_Sent_Cnt"] .'",';
	$outp .='"Total_Opened":"' . $rs["Open_Cnt"] .'",';
	$outp .='"Date_Time_Sent":"' . $rs["Start_Ts"] .'",';
	$outp .='"Campaign_Name":"' . $rs["Data_Source_Nm"] .'"}';
}
$outp ='{"clientData":['.$outp.']}';
$conn->close();

//echo the object string
  
echo ($outp);
?>