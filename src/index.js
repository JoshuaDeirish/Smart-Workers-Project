import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { FirebaseAppProvider } from 'reactfire';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { firebaseConfig } from './config/firebase';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

const app = initializeApp(firebaseConfig);
const firestoreInstance = getFirestore(app);
const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    ReactDOM.render(
      <FirebaseAppProvider firebaseApp={app}>
        <App firestoreInstance={firestoreInstance} auth={auth} />
      </FirebaseAppProvider>,
      document.getElementById('root')
    );
  })
  .catch((error) => {
    console.log(error);
  });

reportWebVitals();
