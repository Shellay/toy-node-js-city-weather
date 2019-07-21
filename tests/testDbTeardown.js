const { execSync } = require('child_process');

module.exports = async () => {
  console.log('[*] Tearing down postgres for testing...')
  execSync('docker-compose down');
  console.log('[*] DONE.')
}
