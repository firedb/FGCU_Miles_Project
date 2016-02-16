<?php
error_reporting(0);

$host='localhost';
$user='root';
$pass='';
$db='miles_db';

$db = new mysqli($host, $user, $pass, $db);

if($db) {

  if($result = $db->query("SELECT distinct client_name FROM lu_vsg_client") or die($db->error)){
	
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