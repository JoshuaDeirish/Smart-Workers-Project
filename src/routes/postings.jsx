import "./assets/pages.css";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDatabase, useUser } from "reactfire";
import {
  useAuthRedirect,
  useEmployerAuthRedirect,
} from "../components/page_protection_funcs";
import { Alert, Button, Card, Col, Modal, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Postings() {
  useEmployerAuthRedirect();
  useAuthRedirect();
  const database = useDatabase();
  const employersCollection = collection(database, "Employers");
  const jobsCollection = collection(database, "Jobs");
  const user = useUser();
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the employer's document based on their email
        const employersQuery = query(
          employersCollection,
          where("email", "==", user.data.email)
        );
        const empQuerySnapshot = await getDocs(employersQuery);
        const companyData = empQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))[0];
        setCompany(companyData?.companyName);

        // Get all job documents that have the same company
        if (companyData?.companyName) {
          const jobsQuery = query(
            jobsCollection,
            where("company", "==", companyData.companyName)
          );
          const querySnapshot = await getDocs(jobsQuery);
          const jobsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setJobs(jobsData);
        }
      } catch (error) {
        console.error("Error fetching job postings:", error);
      }
    };
    fetchData();
  }, [employersCollection, jobsCollection, user]);

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(database, "Jobs", selectedJobId));
      handleClose();
    } catch (error) {
      console.error("Error deleting job posting:", error);
    }
  };

  const handleClose = () => {
    setShow(false);
    setSelectedJobId(null);
  };

  const handleShow = (jobId, jobName) => {
    setSelectedJob(jobName);
    setSelectedJobId(jobId);
    setShow(true);
  };

  return (
    <div style={{ padding: "100px 20px 100px 20px", backgroundColor: "#F5F5F5" }}>
      <h1 style={{ color: "#005262", textAlign:"center" }}><b>My Postings</b></h1>
      <Row>
        <Col xs={12} md={8}>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id}>
                <Card className="my-2 mx-2 p-2">
                  <h1><b>{job.positionTitle}</b></h1>
                  <p>
                    <b>Location:</b> {job.location}
                  </p>
                  <p>
                    <b>Company:</b> {job.company}
                  </p>
                </Card>
                <Card className="my-2 mx-2 p-2">
                  <h3>Job Description</h3>
                  <p>{job.description}</p>
                  <p>
                    <b>Salary:</b> ${job.salary}
                  </p>
                  <Button
                    style={{
                      backgroundColor: "#8ec7b7",
                      borderColor: "#565656",
                    }}
                    onClick={() => handleShow(job.id, job.positionTitle)}
                  >
                    Delete Posting
                  </Button>
                  <br />
                  <Button
                    style={{
                      backgroundColor: "#005262",
                      borderColor: "#565656",
                    }}
                  >
                    Edit Post
                  </Button>
                </Card>
              </div>
            ))
          ) : (
            <>
              <p>You have no job postings.</p>
              <Button
                variant="link"
                href="/add-job"
                style={{ color: "#005262" }}
              >
                Create a Job Posting
              </Button>
            </>
          )}
        </Col>
        <Col xs={12} md={4}>
          <Card className="my-2 mx-2 p-2">
            <Card.Img
              variant="top"
              src="https://www.recruiting.com/img/blog-img/WriteEffectivePostingsDescriptionSkills-01.png"
            />
            <Card.Body>
              <Card.Title>
                How to Write Effective Job Postings...
              </Card.Title>
              <Card.Text>
                Read this article on How to Write Effective Job Postings: Job
                Description and Skills
              </Card.Text>
              <Button
                style={{
                  backgroundColor: "#8ec7b7",
                  borderColor: "#565656",
                }}
                href="https://www.recruiting.com/blog/how-to-write-effective-job-postings-job-description-and-skills/"
              >
                Read Article
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Post Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you would like to delete this post?<br />
          <h2>Title: {selectedJob}</h2>
          <Alert variant="danger">This Cannot Be Undone!</Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ backgroundColor: "#565656", borderColor: "#005262" }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: "#8ec7b7", borderColor: "#005262" }}
            onClick={() => {
              handleDelete(selectedJobId);
            }}
          >
            Delete Posting
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
