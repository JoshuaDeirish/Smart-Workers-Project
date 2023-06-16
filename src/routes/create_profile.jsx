import { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useFirebaseApp, useUser } from 'reactfire';
import { useNavigate } from 'react-router-dom';
import { useAuthRedirect } from '../components/page_protection_funcs';
import { Alert, Button, Form, Modal } from 'react-bootstrap';

export default function CreateProfile() {
  useAuthRedirect();
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [phone, setPhone] = useState('');
  const [isEmployer, setIsEmployer] = useState(false);
  const [companyName, setCompany] = useState('');
  const firebaseApp = useFirebaseApp();
  const db = getFirestore(firebaseApp);
  const user = useUser();
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true); // Display validation error messages
    } else {
      setShow(true); // Open the modal
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleConfirm = async () => {
    try {
      console.log('during try');
      if (isEmployer) {
        console.log('is employer');
        await addDoc(collection(db, 'Employers'), {
          firstName: fName,
          lastName: lName,
          email: user.data.email,
          phone: phone,
          companyName: companyName,
        });
      } else {
        await addDoc(collection(db, 'JobSeekers'), {
          firstName: fName,
          lastName: lName,
          email: user.data.email,
          phone: phone,
        });
      }
      console.log('after try');
      // Clear form fields after successful submission
      setFName('');
      setLName('');
      setPhone('');
      setIsEmployer(false);
      setCompany('');

      navigate('/job-list');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <header>Create Profile</header>
      <div>
        <Form noValidate validated={validated} onSubmit={handleCreateProfile}>
          <Form.Group controlId="validationCustom01">
            <Form.Label>First Name:</Form.Label>
            <Form.Control
              type="text"
              value={fName}
              required
              onChange={(e) => setFName(e.target.value)}
              placeholder="First Name"
              isInvalid={validated && !fName}
            />
            <Form.Control.Feedback type="invalid">Please provide a First Name</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="validationCustom02">
            <Form.Label>Last Name:</Form.Label>
            <Form.Control
              type="text"
              value={lName}
              required
              onChange={(e) => setLName(e.target.value)}
              placeholder="Last Name"
              isInvalid={validated && !lName}
            />
            <Form.Control.Feedback type="invalid">Please provide a Last Name</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="validationCustom03">
            <Form.Label>Phone Number:</Form.Label>
            <Form.Control
              type="text"
              value={phone}
              required
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              isInvalid={validated && !phone}
            />
            <Form.Control.Feedback type="invalid">Please provide a Phone Number</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="validationCustom04">
            <Form.Label>Are you an employer?</Form.Label>
            <Form.Check type="checkbox" checked={isEmployer} onChange={(e) => setIsEmployer(e.target.checked)} />
          </Form.Group>
          {isEmployer && (
            <Form.Group controlId="validationCustom05">
              <Form.Label>Company Name:</Form.Label>
              <Form.Control
                type="text"
                value={companyName}
                required
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company Name"
                isInvalid={validated && !companyName}
              />
              <Form.Control.Feedback type="invalid">Please provide a Company Name</Form.Control.Feedback>
            </Form.Group>
          )}

          <Button type="submit">Create Profile</Button>
        </Form>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Profile Creation Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure all the information you have input is correct?
          <br />
          <Alert variant="warning">Warning: The ability to change your profile after creation has not yet been implemented</Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
