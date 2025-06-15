const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

function generateSecretKey() {
  const key = crypto.randomBytes(64).toString('hex'); // 64 bytes = 128 hex characters
  return key;
}

function writeToEnv(secretKey) {
  const envPath = path.resolve(__dirname, '../../../.env');
  const envContent = fs.readFileSync(envPath, 'utf8');

  const updatedContent = envContent.includes('JWT_SECRET=')
    ? envContent.replace(/JWT_SECRET=.*/g, `JWT_SECRET=${secretKey}`)
    : `${envContent}\nJWT_SECRET=${secretKey}`;

  fs.writeFileSync(envPath, updatedContent);
  console.log('✅ JWT_SECRET updated in .env file');
}

const secretKey = generateSecretKey();
console.log('Generated JWT_SECRET:', secretKey);
writeToEnv(secretKey);