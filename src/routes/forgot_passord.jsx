import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'reactfire';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();

  const triggerResetEmail = async () => {
      console.log("before")
    await sendPasswordResetEmail(auth, email);
    console.log("after")
    alert('Password reset email sent');
    navigate('/login');
  };

  return (
    <div className="page-container">
      <Card className="password-reset-card">
        <Card.Title className="card-title">Reset Password</Card.Title>
        <Card.Body>
          <Form onSubmit={triggerResetEmail}>
            <Form.Group>
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
              />
            </Form.Group>
            <br />
            
          </Form><Button onClick={triggerResetEmail} style={{ backgroundColor: "#8ec7b7", borderColor: "#565656", padding: "8px 30px 8px 30px"  }} type="button">
              Next
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

        .password-reset-card {
          width: 50%;
          padding: 10px;
        }

        @media (max-width: 767px) {
          .password-reset-card {
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
