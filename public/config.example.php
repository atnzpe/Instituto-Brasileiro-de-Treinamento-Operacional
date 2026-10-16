<?php
/**
 * Optional. mensagem.php works without it (sends with PHP mail() from
 * comando@ib-to.org to comando@ib-to.org). To change that, copy this
 * file to config.php (same folder, next to mensagem.php) on the HostGator
 * server. config.php is gitignored and never published by the deploy.
 */

// Sender and recipient: the ib-to.org mailbox (Gleyson's decision, 16/10/2026,
// replacing the Gmail address of 28/09). HostGator signs for its own domain
// (SPF/DKIM "Valid" in cPanel > Email Deliverability), so messages don't land
// in spam. Only create config.php to send somewhere else.
define('CONTACT_TO_EMAIL', 'comando@ib-to.org');
define('CONTACT_FROM_EMAIL', 'comando@ib-to.org');

// Optional: where mensagem.php keeps the hourly send counters (hashed IPs).
// Must be outside the public folder. Default: .ibto-contact-limits in the
// folder above this one (on HostGator, the account's home folder).
// define('RATE_LIMIT_DIR', '/home1/edua1187/.ibto-contact-limits');
