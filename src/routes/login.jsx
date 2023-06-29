import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'reactfire';
import { googleProvider } from '../config/firebase';
import { Button, Form, Alert, Card, Container } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // State variable to store the error message
  const navigate = useNavigate();
  const auth = useAuth();

  const logInWithEmailAndPassword = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate('/job-list');
      })
      .catch((error) => {
        if (error.message === 'Firebase: Error (auth/wrong-password).') {
          console.log('Incorrect password error shown');
          setError('Incorrect password. Please try again.'); // Set the error message
        } else if (
          error.message ===
          'Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).'
        ) {
          console.log('locked account error shown');
          setError(
            'Account temporarily locked due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.'
          );
        } else if (error.message === 'Firebase: Error (auth/user-not-found).') {
          console.log('User not found error shown');
          setError('User not found');
        } else {
          console.log(error.message);
        }
      });
  };

  const logInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then(() => {
        navigate('/job-list');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="page-container">
      <Card className="login-card">
        <Card.Title className="card-title">Log In</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        <Card.Body>
          <Form>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Email"
                required
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
            <Button style={{ backgroundColor: "#8ec7b7", borderColor: "#565656", padding:"8px 30px 8px 30px" }} onClick={logInWithEmailAndPassword}>
              Login
            </Button>
          </Form>
          <br />
          <Button variant="outline-danger" onClick={logInWithGoogle}>
            <Icon.Google /> Login with Google
          </Button>
        </Card.Body>
        <Container>
          <a href="/forgot-password">Forgot Your Password?</a>
          <p>
            Don't have an Account? <a href="/register">Sign up</a>
          </p>
        </Container>
      </Card>

      <style jsx>{`
        .page-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f5f5f5;
        }

        .login-card {
          width: 50%;
          padding: 10px;
        }

        @media (max-width: 767px) {
          .login-card {
            width: 90%;
          }
        }

        .card-title {
          text-align: initial;
          font-size: 30px;
        }
      `}</style>
    </div>
  );
}
