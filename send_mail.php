<?php

########### CONFIG ###############
$recipient = $_POST['email'];
$redirect = 'index.html';
$message = 'Hi there, click on the following link to reset your password => https://join.adrian-krampikowski.com/templates/resetPw.html?email=' . $recipient;


$name = 'JOIN Support Team';

########### CONFIG END ###########

########### Intruction ###########   
#
#   This script has been created to send an email to the $recipient
#   
#  1) Upload this file to your FTP Server
#  2) Send a POST rewquest to this file, including
#     [name] The name of the sender (Absender)
#     [message] Message that should be send to you
#
##################################

switch ($_SERVER['REQUEST_METHOD']) {
    case ("OPTIONS"): //Allow preflighting to take place.
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: content-type");
        exit;
    case ("POST"): //Send the email;
        header("Access-Control-Allow-Origin: *");

        $subject = "Contact From " . $name;
        $headers = "From:  info@adrian-krampikowski.com";

        mail($recipient, $subject, $message, $headers);
        header("Location: https://join.adrian-krampikowski.com/smallest_backend_ever");
        
        // "location:".$_SERVER['HTTP_REFERER']

        break;
        default: //Reject any non POST or OPTIONS requests.
        header("Allow: POST", true, 405);
        exit;
}
