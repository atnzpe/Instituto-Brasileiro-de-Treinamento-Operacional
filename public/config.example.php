<?php
/**
 * Optional. mensagem.php works without it (sends with PHP mail() from
 * ouvidoria@ib-to.org to comando.ibto@gmail.com). To change that, copy this
 * file to config.php (same folder, next to mensagem.php) on the HostGator
 * server. config.php is gitignored and never published by the deploy.
 */

// The sender must be a mailbox of the ib-to.org domain created in cPanel,
// otherwise Gmail may send the message to spam.
define('CONTACT_TO_EMAIL', 'comando.ibto@gmail.com');
define('CONTACT_FROM_EMAIL', 'ouvidoria@ib-to.org');

// Optional: where mensagem.php keeps the hourly send counters (hashed IPs).
// Must be outside the public folder. Default: .ibto-contact-limits in the
// folder above this one (on HostGator, the account's home folder).
// define('RATE_LIMIT_DIR', '/home1/edua1187/.ibto-contact-limits');
