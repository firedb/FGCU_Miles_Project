
<?php
error_reporting(0);

$host='localhost';
$user='root';
$pass='';
$db='miles_db';

$db = new mysqli($host, $user, $pass, $db);

if($db) {

  if($result = $db->query("SELECT distinct client_name as Client_Name,From_Nm as Campaign_Name, Mailing_Nm as Specific_Email FROM lu_vsg_client vsg inner join sm_mailing_summary sms on vsg.VSGName=sms.Mailing_Class_Nm WHERE client_name IS NOT NULL AND client_name <> ''AND From_Nm IS NOT NULL AND From_Nm <> '' AND Mailing_Nm IS NOT NULL AND Mailing_Nm <> '' AND Mailing_Id IS NOT NULL AND Mailing_Id <> '' ORDER BY client_name, From_Nm, Data_Source_Nm, Mailing_Nm ASC ") or die($db->error)){
	 	
	mysql_close($db);	
			
	 $response ["client_campaign_mappings"] = array();			
	 $response ["campaign_email_mappings"] = array();			
			
	 $data = array();	  
	
	 if($result->num_rows > 0){

	     	$i=0;  //first row 		     
		 
		  $current_email="";
	      
		  $numResults = $result->num_rows;
		  $counter = 0;
		  
	      while($row = $result->fetch_assoc()) {
			   $counter++;
			   $data[] = $row; 	
			  	 
			  // set first values 
			  if($i==0){
			  	 $current_client=$row['Client_Name'];
				 $current_campaign=$row['Campaign_Name'];
				 $next_client=$current_client;
				 $next_campaign=$current_campaign;				 
				 
				 $campaigns_array = array();
				 	
				 array_push($campaigns_array, $current_campaign); 
				 	
				 //start a new email array			  		
				 $emails_array = array();
				  				 
				 $i++;		
			  		   } //ends if
			 
			 //set next client for all following rows
			  else{
			  $next_client=$row['Client_Name'];	
			  $next_campaign=$row['Campaign_Name'];	
			      }
			 
			 //if client has not changed, check to see if campaign has changed		  
			  if($current_client==$next_client){
			  					  					  				
	
					//if campaign changed, push it on to campaigns array, and reset current campaign
					if($current_campaign==$next_campaign){
								
						$next_email=$row['Specific_Email'];	
						array_push($emails_array, $next_email); 		
							
														 }  //ends if
														 
					else{
							
						array_push($response ["campaign_email_mappings"], array('Campaign_Name' => $current_campaign,'Email_List' => $emails_array));		
						
						//start a new email array			  		
						$emails_array = array();
						
						//add the first new email to the array
						$next_email=$row['Specific_Email'];	  		  
						array_push($emails_array, $next_email); 			
							
						array_push($campaigns_array, $next_campaign); 
					
					    //add the first new campaign to the array
					  	$next_campaign=$row['Campaign_Name'];
						$current_campaign = $next_campaign;	
					
						}

												}  //ends $current_client==$next_client if
			  
			  //if client changed, submit client and campaign mappings
			  else {
			  		
			  	array_push($response ["client_campaign_mappings"], array('Client_Name' => $current_client,'Campaign_List' => $campaigns_array));
			  	
			  	array_push($response ["campaign_email_mappings"], array('Campaign_Name' => $current_campaign,'Email_List' => $emails_array));		
				
				//start a new campaign array			  		
			  	$campaigns_array = array();	
				
				//start a new email array			  		
			    $emails_array = array();
	  		
			    //add the first new campaign to the array
			  	$next_campaign=$row['Campaign_Name'];	  		
	
			    array_push($campaigns_array, $next_campaign); 
				
				//add the first new email to the array
			  	$next_email=$row['Specific_Email'];	  		
	
			    array_push($emails_array, $next_email); 
				
				$current_client=$next_client;
					
				$current_campaign = $next_campaign;											
				   }  //ends else
				   
				if ($counter == $numResults) {
        			// last row
        			        			
        			array_push($response ["client_campaign_mappings"], array('Client_Name' => $next_client,'Campaign_List' => $campaigns_array));
        			
        			array_push($response ["campaign_email_mappings"], array('Campaign_Name' => $next_campaign,'Email_List' => $emails_array));		
					
    										   } 
    			
				   			   	  		  
		  									   }  //ends while
		  			  									   
				echo json_encode($response, JSON_PRETTY_PRINT);	
				
  					          }  //ends $result->num_rows > 0 if
															}  //ends $result = $db->query(...) if
          }  //ends if($db) if

else {
   die($db->error);
     }
?>