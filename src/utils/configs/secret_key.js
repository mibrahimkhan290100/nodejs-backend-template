const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Generate a 64-byte (128-character hex) secret key
function generateSecretKey() {
  return crypto.randomBytes(64).toString("hex");
}

// Write or replace JWT_SECRET in .env file
function writeToEnv(secretKey) {
  const envPath = path.resolve(__dirname, "../../../.env");

  let envContent = "";
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8");
  }

  const updatedContent = envContent.includes("JWT_SECRET=")
    ? envContent.replace(/JWT_SECRET=.*/g, `JWT_SECRET=${secretKey}`)
    : `${envContent}\nJWT_SECRET=${secretKey}`;

  fs.writeFileSync(envPath, updatedContent.trim() + "\n");
  console.log("✅ JWT_SECRET written to .env file");
}

// Parse CLI flags
const args = process.argv.slice(2);
const writeFlag = args.includes("--write");

// Run
const secretKey = generateSecretKey();
console.log("🔐 Generated JWT_SECRET:");
console.log(secretKey);

if (writeFlag) {
  writeToEnv(secretKey);
} else {
  console.log("\n💡 To write this key to .env, run:");
  console.log("   node src/utils/configs/secret_key.js --write");
}
