import "./assets/pages.css"
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDatabase, useUser } from "reactfire";
import { useAuthRedirect, useEmployerAuthRedirect } from "../components/page_protection_funcs";
import { Alert, Button, Card, Modal } from "react-bootstrap";
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
  const [selectedJobId, setSelectedJobId] = useState(null); // New state variable to store the selected job ID
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
    setSelectedJobId(null); // Clear the selected job ID when closing the modal
  };

  const handleShow = (jobId, jobName) => {
      setSelectedJob(jobName);
    setSelectedJobId(jobId); // Set the selected job ID when showing the modal
    setShow(true);
  };

  return (
    <div>
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div key={job.id}>
            <Card>
              <h1>{job.positionTitle}</h1>
              <p>Location: {job.location}</p>
              <p>Company: {job.company}</p>
            </Card>
            <Card>
              <h3>Job Description</h3>
              <p>{job.description}</p>
            <p>Salary: {job.salary}</p>
            </Card>
            
            <Button style={{ backgroundColor:"#8ec7b7", borderColor:"#565656" }} onClick={() => handleShow(job.id, job.positionTitle)}>Delete Posting</Button>
          </div>
        ))
      ) : (
        <>
        <p>You have no job postings.</p>
        <a href="/add-job">Create a Job Posting</a>
        </>
      )}

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
          <Button style={{ backgroundColor:"#565656" }} onClick={handleClose}>
            Cancel
          </Button>
          <Button style={{ backgroundColor:"#8ec7b7" }}  onClick={()=>{handleDelete(selectedJobId)}}>
            Delete Posting
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}


