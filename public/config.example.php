<?php
/**
 * Optional. mensagem.php works without it (sends with PHP mail() from
 * comando.ibto@gmail.com to comando.ibto@gmail.com). To change that, copy this
 * file to config.php (same folder, next to mensagem.php) on the HostGator
 * server. config.php is gitignored and never published by the deploy.
 */

// The sender is the institute's Gmail (Gleyson's decision, 28/09/2026). Gmail
// may flag it as spoofed, since HostGator can't sign for gmail.com; if the
// messages land in spam, switch to a mailbox of the ib-to.org domain created
// in cPanel (with SPF/DKIM "Valid" in Email Deliverability).
define('CONTACT_TO_EMAIL', 'comando.ibto@gmail.com');
define('CONTACT_FROM_EMAIL', 'comando.ibto@gmail.com');

// Optional: where mensagem.php keeps the hourly send counters (hashed IPs).
// Must be outside the public folder. Default: .ibto-contact-limits in the
// folder above this one (on HostGator, the account's home folder).
// define('RATE_LIMIT_DIR', '/home1/edua1187/.ibto-contact-limits');
