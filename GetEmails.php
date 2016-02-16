
<?php
error_reporting(0);

$host='localhost';
$user='root';
$pass='';
$db='miles_db';

$db = new mysqli($host, $user, $pass, $db);

if($db) {

  if($result = $db->query("SELECT distinct Mailing_Nm,Mailing_Id FROM sm_mailing_summary WHERE Mailing_Nm IS NOT NULL AND Mailing_Nm <> '' AND Mailing_Id IS NOT NULL AND Mailing_Id <> '' ORDER BY Mailing_Id ASC
") or die($db->error)){
	
	 $data = array();	  
	
	 if($result->num_rows > 0){
	      while($row = $result->fetch_assoc()) {
			   $data[] = $row; 
											   }
							  } 						  
	  	sort($data);  
		//JSON-encode the response
		echo $data = json_encode($data);
  					}
}  //ends if

else {
   die($db->error);
     }
?>