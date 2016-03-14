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
			
	        $device_usage_query = "SELECT DISTINCT DEVICEPLATFORM, COUNT(DEVICEPLATFORM) AS UserCount FROM (SELECT DISTINCT DEVICEPLATFORM, USERID FROM sm_devicecategory_log force index(DEVICEPLAT_USERID_Index) where TTYPE='open' AND DATESTAMP BETWEEN '$start_no_time' AND '$end_no_time') intial_tallying GROUP BY DEVICEPLATFORM";	        
	        break;
	    case "Single Day":
			
		    //break the date up around the " " character in $date_no_time
			$parts = explode(" ",$start_date);
			//grab the first part 																								
			$date_no_time = $parts['0'];
			
	        $device_usage_query = "SELECT DISTINCT DEVICEPLATFORM, COUNT(DEVICEPLATFORM) AS UserCount FROM (SELECT DISTINCT DEVICEPLATFORM, USERID FROM sm_devicecategory_log force index(DEVICEPLAT_USERID_Index) where TTYPE='open' AND DATESTAMP LIKE '".$date_no_time."%') intial_tallying GROUP BY DEVICEPLATFORM";	        		
	        break;
	    case "One Week":
			
			//break the date up around the " " character in $date_no_time
			$parts = explode(" ",$start_date);
			//grab the first part 																								
			$date_no_time = $parts['0'];
			
	        $device_usage_query = "SELECT DISTINCT DEVICEPLATFORM, COUNT(DEVICEPLATFORM) AS UserCount FROM (SELECT DISTINCT DEVICEPLATFORM, USERID FROM sm_devicecategory_log force index(DEVICEPLAT_USERID_Index) where TTYPE='open' AND DATESTAMP BETWEEN '$date_no_time' AND '$date_no_time' + INTERVAL 7 DAY) intial_tallying GROUP BY DEVICEPLATFORM";	        
	        break;
	    case "One Month":
	      	
	      	//break the date up around the " " character in $date_no_time
			$parts = explode(" ",$start_date);
			//grab the first part 																								
			$date_no_time = $parts['0'];
			
	        $device_usage_query = "SELECT DISTINCT DEVICEPLATFORM, COUNT(DEVICEPLATFORM) AS UserCount FROM (SELECT DISTINCT DEVICEPLATFORM, USERID FROM sm_devicecategory_log force index(DEVICEPLAT_USERID_Index) where TTYPE='open' AND DATESTAMP BETWEEN '$date_no_time' AND '$date_no_time' + INTERVAL 30 DAY) intial_tallying GROUP BY DEVICEPLATFORM";	        
	        break;
		
		default:
			break;
}

  if($result = $db->query($device_usage_query) or die($db->error)){
	 	
	 mysql_close($db);
	
	 $data = array();	  
	
	 if($result->num_rows > 0){
	      while($row = $result->fetch_assoc()) {
		
				switch ($row['DEVICEPLATFORM']) {
	   
	    			case "":		
						$row['DEVICEPLATFORM']="Empty Entry";
						$data[] = $row;										
						break;
						
					case is_null($row['DEVICEPLATFORM']):
						$row['DEVICEPLATFORM']="Empty Entry";
					    $data[] = $row;										
						break;
					case "Linux":
						$row['DEVICEPLATFORM']="Linux PC";
						$data[] = $row;										
						break;
					case "Mac":
						$row['DEVICEPLATFORM']="Mac PC";
						$data[] = $row;										
						break;
					case "Windows":
						$row['DEVICEPLATFORM']="Windows PC";
						$data[] = $row;										
						break;
				    default:
						$data[] = $row;											
						break;		
											}  //ends switch					  		
											   }  //ends while
							  } 						  
		//JSON-encode the response
		echo json_encode($data, JSON_PRETTY_PRINT);
  					}
}  //ends if

else {
   die($db->error);
     }
?>