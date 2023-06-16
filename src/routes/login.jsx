import React from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'reactfire';
import { googleProvider } from '../config/firebase';
import { Button, Form, Alert } from 'react-bootstrap';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(null); // State variable to store the error message
  const navigate = useNavigate();
  const auth = useAuth();

  const logInWithEmailAndPassword = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate('/job-list');
      })
      .catch((error) => {
            if(error.message === "Firebase: Error (auth/wrong-password)."){
                  console.log("Incorrect password error shown");
              setError('Incorrect password. Please try again.'); // Set the error message    
            }else if(error.message ==="Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)."){
              console.log("locked account error shown")
              setError('Account temporarily locked due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.');
            }else if(error.message === "Firebase: Error (auth/user-not-found)."){
                  console.log("User not found error shown");
              setError('User not found'); 
            }else{
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
    <div>
      <header>Login</header>
      <div>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group>
            <Form.Label>Email: </Form.Label>
            <Form.Control type="text" required value={email} onChange={(e) => setEmail(e.target.value)} />
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
        </Form>
        <Button variant="success" onClick={logInWithEmailAndPassword}>
          Login
        </Button>
        <Button variant="success" onClick={logInWithGoogle}>
          Login with Google
        </Button>
        <br />
        <br />
        <a href="/forgot-password">Forgot Your Password?</a>
        <br />
        <br />
        <p>
          Don't have an Account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
}
