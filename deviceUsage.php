<?php
error_reporting(0);

$host='localhost';
$user='root';
$pass='';
$db='miles_db';

$db = new mysqli($host, $user, $pass, $db);

if($db) {

  if($result = $db->query("SELECT DISTINCT DEVICEPLATFORM, COUNT(DEVICEPLATFORM) AS USERCOUNT FROM TEMP_DEVICECATEGORY WHERE DCDATE BETWEEN '2015-11-19 17:29:05' AND '2018-11-19 17:29:14' GROUP BY DEVICEPLATFORM ORDER BY DEVICEPLATFORM") or die($db->error)){
	
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