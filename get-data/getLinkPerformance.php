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
				        
	        $link_performance_query ="SELECT distinct REPLACE(REPLACE(REPLACE(TRIM(Mailing_Nm),'\r', ''), '\n',''), '\t','') AS Mailing_Nm, Link, LinkID, date_format(Datestamp, '%Y-%m-%d') as Datestamp, COUNT(LinkID) AS LinkCounts FROM sm_mailing_summary INNER JOIN SM_Tracking_Log FORCE INDEX (MailingID_Index) ON sm_mailing_summary.Mailing_Id=SM_Tracking_Log.MailingID where TType='click' AND Datestamp BETWEEN '$start_no_time' AND '$end_no_time' AND Mailing_Nm='$specific_email' GROUP BY LinkID,date_format(Datestamp, '%Y-%m-%d') ORDER BY LinkID,Datestamp ASC";        
	        break;
	    case "Single Day":
			
		    //break the date up around the " " character in $date_no_time
			$parts = explode(" ",$start_date);
			//grab the first part 																								
			$date_no_time = $parts['0'];
				       
	       $link_performance_query = "SELECT distinct REPLACE(REPLACE(REPLACE(TRIM(Mailing_Nm),'\r', ''), '\n',''), '\t','') AS Mailing_Nm, Link, LinkID, date_format(Datestamp, '%Y-%m-%d') as Datestamp, COUNT(LinkID) AS LinkCounts FROM sm_mailing_summary sms INNER JOIN SM_Tracking_Log stl FORCE INDEX (Datestamp_Index) ON sms.Mailing_Id=stl.MailingID where Datestamp LIKE '".$date_no_time."%' AND ttype='click' AND Mailing_Nm='$specific_email' GROUP BY LinkID,date_format(Datestamp, '%Y-%m-%d') ORDER BY LinkID,Datestamp ASC ";
	        break;
	    case "One Week":
			
			//break the date up around the " " character in $date_no_time
			$parts = explode(" ",$start_date);
			//grab the first part 																								
			$date_no_time = $parts['0'];
				        
	        $link_performance_query = "SELECT distinct REPLACE(REPLACE(REPLACE(TRIM(Mailing_Nm),'\r', ''), '\n',''), '\t','') AS Mailing_Nm, Link, LinkID, date_format(Datestamp, '%Y-%m-%d') as Datestamp, COUNT(LinkID) AS LinkCounts FROM sm_mailing_summary sms INNER JOIN SM_Tracking_Log stl ON sms.Mailing_Id=stl.MailingID where Datestamp BETWEEN '$date_no_time' AND '$date_no_time' + INTERVAL 7 DAY AND ttype='click' AND Mailing_Nm='$specific_email' GROUP BY LinkID,date_format(Datestamp, '%Y-%m-%d') ORDER BY LinkID,Datestamp ASC";			
	        break;
	    case "One Month":
	      	
	      	//break the date up around the " " character in $date_no_time
			$parts = explode(" ",$start_date);
			//grab the first part 																								
			$date_no_time = $parts['0'];
				        
	        $link_performance_query = "SELECT distinct REPLACE(REPLACE(REPLACE(TRIM(Mailing_Nm),'\r', ''), '\n',''), '\t','') AS Mailing_Nm, Link, LinkID, date_format(Datestamp, '%Y-%m-%d') as Datestamp, COUNT(LinkID) AS LinkCounts FROM sm_mailing_summary sms INNER JOIN SM_Tracking_Log stl ON sms.Mailing_Id=stl.MailingID where Datestamp BETWEEN '$date_no_time' AND '$date_no_time' + INTERVAL 30 DAY AND ttype='click' AND Mailing_Nm='$specific_email' GROUP BY LinkID,date_format(Datestamp, '%Y-%m-%d') ORDER BY LinkID,Datestamp ASC";
	        break;
		
		default:
			break;
}


  if($result = $db->query($link_performance_query) or die($db->error)){
											
	$response ["all_link"] = array();			
	$response ["per_link"] = array();			
			
	 $data = array();	  
	
	 if($result->num_rows > 0){
	     			
	     $first_link_id = 0;
	     $link_points = 0;	
	     $i=0;	
	     $link_points_array = array();
	     
	      while($row = $result->fetch_assoc()) {
			   $data[] = $row; 
			  
			  if($first_link_id==0){
			  	$current_link_id = $row['LinkID'];	  		
			  	$first_link_id++;
			  					   }
			  
			  if($current_link_id=== $row['LinkID']){
			  	$link_points++;
			  									    }
			  
			  else {
 				array_push($link_points_array, array('link_num' => $i,'link_points'=>$link_points));
  				$i++;
				
				$link_points=0;
				$current_link_id = $row['LinkID'];
				$link_points++;
				   }
				   								}
							  } 
		//JSON-encode the response
		array_push($response ["per_link"], $link_points_array);
		array_push($response ["all_link"], $data);
		
		echo $response = json_encode($response, JSON_PRETTY_PRINT);	
		  					}
}  //ends if

else {
   die($db->error);
     }
?>