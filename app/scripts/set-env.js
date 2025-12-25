const fs = require('fs');
const dotenv = require('dotenv');

// Load env vars
// Assuming script is run from 'app/' folder or we resolve relative to this file
const envPath = require('path').resolve(__dirname, '../.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error("Error loading .env file:", result.error);
}

console.log("Loaded environment config from:", envPath);


const envConfigFile = `export const environment = {
  production: false,
  apiBaseUrl: '${process.env.API_BASE_URL_DEV}',
  firebase: {
    apiKey: "${process.env.FIREBASE_API_KEY}",
    authDomain: "${process.env.FIREBASE_AUTH_DOMAIN}",
    projectId: "${process.env.FIREBASE_PROJECT_ID}",
    storageBucket: "${process.env.FIREBASE_STORAGE_BUCKET}",
    messagingSenderId: "${process.env.FIREBASE_MESSAGING_SENDER_ID}",
    appId: "${process.env.FIREBASE_APP_ID}",
    measurementId: "${process.env.FIREBASE_MEASUREMENT_ID}"
  },
  stripePublishableKey: '${process.env.STRIPE_PUBLISHABLE_KEY}'
};
`;

const envProdConfigFile = `export const environment = {
  production: true,
  apiBaseUrl: '${process.env.API_BASE_URL_PROD}',
  firebase: {
    apiKey: "${process.env.FIREBASE_API_KEY}",
    authDomain: "${process.env.FIREBASE_AUTH_DOMAIN}",
    projectId: "${process.env.FIREBASE_PROJECT_ID}",
    storageBucket: "${process.env.FIREBASE_STORAGE_BUCKET}",
    messagingSenderId: "${process.env.FIREBASE_MESSAGING_SENDER_ID}",
    appId: "${process.env.FIREBASE_APP_ID}",
    measurementId: "${process.env.FIREBASE_MEASUREMENT_ID}"
  },
  stripePublishableKey: '${process.env.STRIPE_PUBLISHABLE_KEY}'
};
`;

const targetPath = './src/environments/environment.ts';
const targetProdPath = './src/environments/environment.prod.ts';

fs.mkdirSync('./src/environments', { recursive: true });

fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
  }
});

fs.writeFile(targetProdPath, envProdConfigFile, function (err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(`Angular environment.prod.ts file generated correctly at ${targetProdPath} \n`);
  }
});
