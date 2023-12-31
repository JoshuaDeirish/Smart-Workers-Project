import './App.css';
import { FirestoreProvider } from 'reactfire';
import { RouterProvider, } from "react-router-dom";
import { router } from './routes/router';
import { AuthProvider, DatabaseProvider } from 'reactfire';
import Navigation from './components/nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import FooterPart from './components/footer';


function App({ firestoreInstance, auth }) {

  return (
    <AuthProvider sdk={auth}>
      <DatabaseProvider sdk={firestoreInstance}>
        <FirestoreProvider sdk={firestoreInstance}>
          <Navigation/>
          <RouterProvider router={router} />
          <FooterPart/>
        </FirestoreProvider>
      </DatabaseProvider>
    </AuthProvider>
  );
}

export default App;
