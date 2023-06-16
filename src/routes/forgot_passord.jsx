import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "reactfire";


export default function ForgotPassword() {
      const [email, setEmail] = React.useState("");
      const navigate = useNavigate();
      const auth = useAuth();

      const triggerResetEmail = async () => {
            await sendPasswordResetEmail(auth, email);
            alert("Password reset email sent")
            navigate("/login");
          }
     

      return (
            <div>
                  <header>Reset Password</header><br/>
                  <div>
                        <Form onSubmit={triggerResetEmail}>
                       <Form.Group>
                                    <Form.Label>Email: </Form.Label>
                                    <Form.Control
                                          type="text"
                                          required
                                          value={email}
                                          onChange={(e) => setEmail(e.target.value)}
                                    />

                              </Form.Group>       
                              <Button variant="success" type='submit'>Next</Button>
                        </Form>
                  
                        
                       
                  </div>
            </div>
      );
}
