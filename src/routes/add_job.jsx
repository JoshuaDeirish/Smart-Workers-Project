import React, { useEffect, useState } from 'react';
import { collection, addDoc, where, query, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useDatabase, useUser } from 'reactfire';
import { useAuthRedirect, useEmployerAuthRedirect } from '../components/page_protection_funcs';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';

export default function Add_Job() {
  useEmployerAuthRedirect();
  useAuthRedirect();
  const [company, setCompany] = useState(null);
  const [location, setLocation] = useState('');
  const [positionTitle, setPositionTitle] = useState('');
  const [description, setDescription] = useState('');
  const [salary, setSalary] = useState('');
  const navigate = useNavigate();
  const database = useDatabase();
  const jobsQuery = collection(database, 'Jobs');
  const user = useUser();
  const employersCollection = collection(database, 'Employers');
  const [validated, setValidated] = useState(false);
  const [loadType, setLoadType] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employersQuery = query(employersCollection, where('email', '==', user.data.email));
        const empQuerySnapshot = await getDocs(employersQuery);
        const companyData = empQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))[0];
        setCompany(companyData?.companyName);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    fetchData();
  }, [employersCollection, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true); // Display validation error messages
    } else {
      setValidated(true);

      try {
        await addDoc(jobsQuery, {
          company: company,
          location: location,
          positionTitle: positionTitle,
          description: description,
          salary: salary,
          loadType: loadType,
          applicants: [],
        });

        alert('Job added successfully');
        navigate('/job-list');
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div style={{ padding: "100px 20px 100px 20px", backgroundColor: "#F5F5F5" }}>
      <header style={{ fontSize: "30px", fontWeight: "bold", textAlign: "center", marginBottom: "20px" }}>
        Add Job
      </header>
      {company && <h3 style={{ textAlign: "center" }}>For {company}</h3>}
      <Row>
        <Col xs={12} md={6}>
          <Card>
            <Card.Body>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group controlId="validationCustom01">
                  <Form.Label>Location:</Form.Label>
                  <Form.Control
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location"
                    required
                    isInvalid={validated && !location}
                  />
                  <Form.Control.Feedback type="invalid">Please provide a location.</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="validationCustom02">
                  <Form.Label>Position Title:</Form.Label>
                  <Form.Control
                    type="text"
                    value={positionTitle}
                    onChange={(e) => setPositionTitle(e.target.value)}
                    placeholder="Position Title"
                    required
                    isInvalid={validated && !positionTitle}
                  />
                  <Form.Control.Feedback type="invalid">Please provide a position title.</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="validationCustom03">
                  <Form.Label>Description:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    required
                    isInvalid={validated && !description}
                  />
                  <Form.Control.Feedback type="invalid">Please provide a description.</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="validationCustom04">
                  <Form.Label>Salary:</Form.Label>
                  <Form.Control
                    type="text"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="Salary"
                    required
                    isInvalid={validated && !salary}
                  />
                  <Form.Control.Feedback type="invalid">Please provide a salary.</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="validationCustom05">
                  <Form.Label>Position Work Load:</Form.Label>
                  <Row>
                    <Col>
                      <Form.Check
                        type="radio"
                        value="Full-Time"
                        name="group1"
                        label="Full-Time"
                        required
                        checked={loadType === "Full-Time"}
                        onChange={() => setLoadType("Full-Time")}
                      />
                    </Col>
                    <Col>
                      <Form.Check
                        type="radio"
                        value="Part-Time"
                        name="group1"
                        label="Part-Time"
                        required
                        checked={loadType === "Part-Time"}
                        onChange={() => setLoadType("Part-Time")}
                      />
                    </Col>
                  </Row>
                  <Form.Control.Feedback type="invalid">Please provide a position work load.</Form.Control.Feedback>
                </Form.Group>

                <Button style={{ backgroundColor: "#8ec7b7", borderColor: "#565656" }} type="submit">
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Card.Img variant="top" src="https://www.recruiting.com/img/blog-img/WriteEffectivePostingsDescriptionSkills-01.png" />
            <Card.Body>
              <Card.Title>How to Write Effective Job Postings...</Card.Title>
              <Card.Text>Read this article on How to Write Effective Job Postings: Job Description and Skills</Card.Text>
              <Button style={{ backgroundColor: "#8ec7b7", borderColor: "#565656" }} href='https://www.recruiting.com/blog/how-to-write-effective-job-postings-job-description-and-skills/'>Read Article</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
