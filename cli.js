#!/usr/bin/env node
const { execSync } = require("child_process");
const inquirer = require("inquirer");
const path = require("path");

async function main() {
  const { name, includeAuth } = await inquirer.prompt([
    { name: "name", message: "Project name" },
    {
      name: "includeAuth",
      type: "confirm",
      message: "Include JWt boiler Plate",
      default: true,
    },
  ]);

  execSync(`npx degit mibrahimkhan290100/nodejs-backend-template ${name}`, {
    stdio: "inherit",
  });

  process.chdir(name);
  if (!includeAuth) {
    execSync(
      `rm -rf src/controllers/authController.js src/routes/authRoute.js`,
      {
        stdio: "inherit",
      }
    );
  }

  execSync("npm install", { stdio: "inherit" });
  execSync("git init", { stdio: "inherit" });

  console.log('\n✔️  Done!');
  console.log(`   cd ${name} && npm run dev`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
