#!/usr/bin/env node
const { execSync } = require('child_process');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

async function main() {
  // Prompt for project name and auth inclusion, trim whitespace
  const answers = await inquirer.prompt([
    {
      name: 'name',
      message: 'Project name:',
      filter: input => input.trim(),
      validate: input => input.trim() !== '' || 'Name cannot be empty'
    },
    {
      name: 'includeAuth',
      type: 'confirm',
      message: 'Include JWT boilerplate?',
      default: true
    }
  ]);

  const name = answers.name;
  const includeAuth = answers.includeAuth;
  const destDir = path.resolve(process.cwd(), name);

  // If destination exists, remove it
  if (fs.existsSync(destDir)) {
    console.log(`> Removing existing directory: ${name}`);
    try {
      fs.rmSync(destDir, { recursive: true, force: true });
    } catch (err) {
      console.error(`Failed to remove existing folder ${name}:`, err);
      process.exit(1);
    }
  }

  // Clone template
  try {
    execSync(`npx degit mibrahimkhan290100/nodejs-backend-template ${name}`, { stdio: 'inherit' });
  } catch (err) {
    console.error('Error during degit:', err);
    process.exit(1);
  }

  // Change into project folder
  process.chdir(destDir);

  // Remove auth files if not included
  if (!includeAuth) {
    console.log('> Removing auth boilerplate');
    ['src/controllers/authController.js', 'src/routes/authRoute.js'].forEach(file => {
      if (fs.existsSync(file)) fs.rmSync(file, { force: true });
    });
  }

  // Install deps and init git
  execSync('npm install', { stdio: 'inherit' });
  execSync('git init', { stdio: 'inherit' });

  console.log(`\n✔️  Scaffolded ${name} successfully!`);
  console.log(`   cd ${name} && npm run dev`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
