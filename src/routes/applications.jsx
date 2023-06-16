import { collection, doc, getDocs, updateDoc, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDatabase, useUser } from "reactfire";
import { Link } from "react-router-dom";
import { useAuthRedirect, useJobSeekerAuthRedirect } from "../components/page_protection_funcs";
import {  Button, Modal } from "react-bootstrap";


export default function Applications() {
  useAuthRedirect();
  useJobSeekerAuthRedirect();
  const database = useDatabase();
  const jobsCollection = collection(database, "Jobs");
  const user = useUser();
  const [jobs, setJobs] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null); // New state variable to store the selected job ID
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsQuery = query(
          jobsCollection,
          where("applicants", "array-contains", user.data.email)
        );

        const querySnapshot = await getDocs(jobsQuery);
        const jobsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJobs(jobsData);
      } catch (error) {
        console.error("Error fetching Applications:", error);
      }
    };
    fetchData();
  }, [jobsCollection, user]);

  const handleWithdraw = async (jobId) => {
    const jobRef = doc(database, 'Jobs', jobId);
    try {
      // Remove the job seeker's email from the applicants array
      await updateDoc(jobRef, {
        applicants: jobs.find(job => job.id === jobId).applicants.filter(applicant => applicant !== user.data.email)
      });
      alert("Application has been withdrawn")
      // Fetch the updated applications after withdrawal
      
    } catch (error) {
      console.error("Error withdrawing application:", error);
    }
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div>
        <p>You have no applications.</p>
        <Link to="/job-list">View available jobs</Link>
      </div>
    );
  }
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
      {jobs.map((job) => (
        <div key={job.id}>
          <h1>{job.positionTitle}</h1>
          <p>{job.description}</p>
          <p>Company: {job.company}</p>
          <p>Location: {job.location}</p>
          <p>Salary: {job.salary}</p>
          <Button onClick={() => handleShow(job.id, job.positionTitle)}>Withdraw Application</Button>
        </div>
      ))}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Application Withdrawal </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you would like to withdraw this application?<br />
            <h2>Title: {selectedJob}</h2>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={()=>{handleWithdraw(selectedJobId)}}>
            Confirm Withdrawal 
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
