<?php

$a_quien = "gabrieltame@yahoo.es" ;

$titulo = "IREVOLUCION-Solicitud de info " .$_GET['nombre'] ;
$mensaje = $_GET["mail"].'<br/> '.$_GET["msj"] ;
$data = array();


$encoding = "utf-8";

// Preferences for Subject field
$subject_preferences = array(
	"input-charset" => $encoding,
	"output-charset" => $encoding,
	"line-length" => 76,
	"line-break-chars" => "\r\n"
);

 $from_name='no-reply@irevolucion.es';

  // Mail header
  $header = "Content-type: text/html; charset=".$encoding." \r\n";
  $header .= "From: ".$from_name." <".$from_name."> \r\n";
  $header .= "MIME-Version: 1.0 \r\n";
  $header .= "Content-Transfer-Encoding: 8bit \r\n";
  $header .= "Date: ".date("r (T)")." \r\n";
  $header .= iconv_mime_encode("Subject", $titulo, $subject_preferences);


if (@mail($a_quien, $titulo, $mensaje,$header))
	$data['status'] = 'success';
else
	$data['status'] = 'error';

echo json_encode($data);
?>
