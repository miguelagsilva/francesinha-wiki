require('dotenv').config();
const { exec } = require('child_process');

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    const process = exec(command);

    process.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    process.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    process.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`));
      } else {
        resolve();
      }
    });
  });
};

const setupSequelize = async () => {
  try {
    console.log('Running migrations...');
    await runCommand('npx sequelize-cli db:migrate');
    console.log('Running seeders...');
    await runCommand('npx sequelize-cli db:seed:all');
    console.log('Database setup completed successfully.');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
};

setupSequelize();
