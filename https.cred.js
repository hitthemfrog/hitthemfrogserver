const fs = require('fs')

const privateKey = fs.readFileSync('/etc/letsencrypt/live/hitthemfrogsocket.khariskhasburrahman.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/hitthemfrogsocket.khariskhasburrahman.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/hitthemfrogsocket.khariskhasburrahman.com/chain.pem', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};

module.exports = credentials