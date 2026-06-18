<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
 * VAPID keys for Web Push notifications (minishlink/web-push).
 * Public key is shared with the frontend.
 * Private key NEVER leaves the server.
 * Generated once via: php generate_vapid_keys.php
 */

define('VAPID_PUBLIC_KEY',  'BAMIj-Y0_RkzetqpktCiAwjaoOcyxG-ZQWTzrA5YpArnT8artX7B_1FpnfMECl9tcwzqH7GQEIsIF8hoFc9HqRE');
define('VAPID_PRIVATE_KEY', '6JHg8gg-GdFXF580Tr1LD5D0Q01zY29sCrcTDD4EWyk');
define('VAPID_SUBJECT',     'mailto:admin@alumniportal.com');

$config['vapid_public_key']  = VAPID_PUBLIC_KEY;
$config['vapid_private_key'] = VAPID_PRIVATE_KEY;
$config['vapid_subject']     = VAPID_SUBJECT;
