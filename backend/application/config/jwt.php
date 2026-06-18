<?php
defined('BASEPATH') or exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| JWT Configuration
|--------------------------------------------------------------------------
|
| jwt_secret  — MUST be a long random string. Generate once with:
|               php -r "echo bin2hex(random_bytes(32));"
|               Then paste the output below.
|
|               NEVER commit this to version control.
|               Use environment variable in production:
|               $config['jwt_secret'] = getenv('JWT_SECRET');
|
*/

$config['jwt_secret'] = '734d64ab7973478b8a9f2f228833a92c2aeb48b1692ed816c135366fc24b6b4f';

/*
|--------------------------------------------------------------------------
| Token Expiry (seconds)
|--------------------------------------------------------------------------
| access_token_ttl   — how long the JWT is valid (default: 24 hours)
| refresh_token_ttl  — how long the refresh token is valid (default: 7 days)
|
*/
$config['access_token_ttl']  = 86400;   // 24 hours
$config['refresh_token_ttl'] = 604800;  // 7 days
