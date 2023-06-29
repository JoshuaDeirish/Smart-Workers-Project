import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useFirebaseApp } from 'reactfire';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { Alert, Button, Form, Card } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

export default function Registration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const firebaseApp = useFirebaseApp();
  const auth = getAuth(firebaseApp);
  const googleProvider = new GoogleAuthProvider();
  const [error, setError] = useState(null); // State variable to store the error message

  const signup = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        navigate("/create-profile");
      })
      .catch((error) => {
        if (error.message === "Firebase: Error (auth/email-already-in-use).") {
          console.log("email in use error shown");
          setError('Email already in use');
        } else if (error.message === "Firebase: Password should be at least 6 characters (auth/weak-password).") {
          console.log("weak password error shown");
          setError('Weak Password: Password should be at least 6 characters');
        } else {
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
    <div className="page-container">
      <Card className="registration-card">
        <Card.Title className="card-title">Sign Up</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={signup}>
            <Form.Group>
              <Form.Control
                type="text"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Control
                type="password"
                value={password}
                required
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <br />
            <Button style={{ backgroundColor: "#8ec7b7", borderColor: "#565656", padding: "8px 30px 8px 30px" }} type="submit">
              Register
            </Button>
          </Form>
          <br />
          <Button variant="outline-danger" onClick={signupWithGoogle}>
            <Icon.Google /> Sign Up with Google
          </Button>
        </Card.Body>
      </Card>

      <style jsx>{`
        .page-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f5f5f5;
        }

        .registration-card {
          width: 50%;
          padding: 10px;
        }

        .card-title {
          text-align: left;
          font-size: 30px;
        }

        @media (max-width: 767px) {
          .registration-card {
            width: 90%;
          }
        }
      `}</style>
    </div>
  );
}
