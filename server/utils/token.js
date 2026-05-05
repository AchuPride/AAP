const crypto = require('crypto');

/**
 * Generates a cryptographically secure case token.
 * Format: 3 groups of 8 hex chars separated by dashes → XXX-XXXXXXXX-XXXXXXXX
 * Easy for users to copy; hard to brute-force (96 bits of entropy).
 */
const generateCaseToken = () => {
  const bytes = crypto.randomBytes(12); // 96 bits
  const hex = bytes.toString('hex').toUpperCase();
  return `GBV-${hex.slice(0, 8)}-${hex.slice(8, 16)}-${hex.slice(16)}`;
};

module.exports = { generateCaseToken };
