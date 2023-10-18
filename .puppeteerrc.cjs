const { join } = require('path');
const fs = require('fs');

/**
 * @type {import("puppeteer").Configuration}
 */

module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
