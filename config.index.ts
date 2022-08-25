import {writeFile} from 'fs';

const targetPath = './src/environments/environment.ts';
const targetProdPath = './src/environments/environment.prod.ts';

const envConfigFile = `export const environment = {
  production: false,
  firebase: {
    apiKey: '${process.env.FIREBASE_API_KEY}',
    authDomain: "covoittracker.firebaseapp.com",
    projectId: "covoittracker",
    storageBucket: "covoittracker.appspot.com",
    messagingSenderId: "202967395128",
    appId: '${process.env.FIREBASE_APP_ID}',
    measurementId: "G-CVZVQB4QQW"
  }
};
`;

const envProdConfigFile = `export const environment = {
  production: true,
  firebase: {
    apiKey: '${process.env.FIREBASE_API_KEY}',
    authDomain: "covoittracker.firebaseapp.com",
    projectId: "covoittracker",
    storageBucket: "covoittracker.appspot.com",
    messagingSenderId: "202967395128",
    appId: '${process.env.FIREBASE_APP_ID}',
    measurementId: "G-CVZVQB4QQW"
  }
};
`;

writeFile(targetPath, envConfigFile, 'utf8', (err) => {
  if (err) {
    return console.log(err);
  }
});

writeFile(targetProdPath, envProdConfigFile, 'utf8', (err) => {
  if (err) {
    return console.log(err);
  }
});
