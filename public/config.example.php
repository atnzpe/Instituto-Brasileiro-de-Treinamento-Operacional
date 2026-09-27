<?php
/**
 * Copy this file to config.php (same folder, next to contact.php) on the
 * HostGator server and fill in real values. config.php is gitignored —
 * never commit real API keys.
 */

define('RESEND_API_KEY', '');
define('CONTACT_TO_EMAIL', 'comando.ibto@gmail.com');
define('CONTACT_FROM_EMAIL', 'ouvidoria@ib-to.org');

// Optional: where contact.php keeps the hourly send counters (hashed IPs).
// Must be outside the public folder. Default: .ibto-contact-limits in the
// folder above this one (on HostGator, the account's home folder).
// define('RATE_LIMIT_DIR', '/home1/edua1187/.ibto-contact-limits');
