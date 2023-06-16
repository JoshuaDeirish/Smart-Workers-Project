import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useFirebaseApp } from 'reactfire';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { Alert, Button, Form } from "react-bootstrap";

export default function Registration() {
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const navigate = useNavigate();
      const firebaseApp = useFirebaseApp();
      const auth = getAuth(firebaseApp);
      const googleProvider = new GoogleAuthProvider();
      const [error, setError] = React.useState(null); // State variable to store the error message


      const signup = (e) => {
            e.preventDefault();
            createUserWithEmailAndPassword(auth, email, password)
                  .then((userCredential) => {
                        console.log(userCredential);
                        navigate("/create-profile");
                  })
                  .catch((error) => {
                       if(error.message === "Firebase: Error (auth/email-already-in-use)."){
                              console.log("email in use error shown");
                          setError('Email already in use'); 
                        }else if(error.message === "Firebase: Password should be at least 6 characters (auth/weak-password)."){
                              console.log("weak password error shown");
                          setError('Weak Password: Password should be at least 6 characters'); 
                        }else{
                              console.log(error.message);
                        }
                  });
      };

      const signupWithGoogle = (e) => {
            e.preventDefault();
            signInWithPopup(auth, googleProvider)
                  .then((userCredential) => {
                        console.log(userCredential);
                        navigate("/create-profile");
                  })
                  .catch((err) => {
                        console.log(err);
                  });
      };

      return (
            <div>
                  <header>Registration</header>
                  <div>
                  {error && <Alert variant="danger">{error}</Alert>}
                  <Form onSubmit={signup}>
                              <Form.Group>
                                    <Form.Label>Email: </Form.Label>
                                    <Form.Control
                                          type="text"
                                          required
                                          value={email}
                                          onChange={(e) => setEmail(e.target.value)}
                                    />

                              </Form.Group>
                              <Form.Group>
                                  <Form.Label>
                                    Password:
                                    <Form.Control
                                          type="password"
                                          value={password}
                                          required
                                          onChange={(e) => setPassword(e.target.value)}
                                    />
                              </Form.Label>
                              </Form.Group>
                              
                              <Button variant='success' type="submit">Register</Button>
                        </Form>
                        <Button variant='success' onClick={signupWithGoogle}>Sign Up with Google</Button>
                  </div>
            </div>
      );
}
