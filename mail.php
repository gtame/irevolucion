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


$headers   = array();
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-type: text/plain; charset=utf-8";
$headers[] = "From:".$from_name;
$headers[] = "X-Mailer: PHP/".phpversion();

if (@mail($a_quien, $titulo, $mensaje,implode("\r\n",$headers),"-f ". $from_name))
	$data['status'] = 'success';
else
	$data['status'] = 'error';

echo json_encode($data);
?>
