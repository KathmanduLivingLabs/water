<?php

$svg = $_GET['svg'];
//$to_stop = isset($_GET['to']) ? $_GET['to'] : '000000';

header('Content-type: image/svg+xml; charset=utf-8');

echo '<?xml version="1.0"?>'.$svg;

?>
