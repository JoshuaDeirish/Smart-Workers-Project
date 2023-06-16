import { useDatabase, useUser } from 'reactfire';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { useAuthRedirect } from '../components/page_protection_funcs';
import { Button } from 'react-bootstrap';


function Job() {
  useAuthRedirect()
  const database = useDatabase();
  const { jobId } = useParams();
  const [jobData, setJobData] = useState(null);
  const user = useUser();
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const jobRef = doc(database, "Jobs", jobId);
        const snapshot = await getDoc(jobRef);
        if (snapshot.exists()) {
          setJobData(snapshot.data());
        } else {
          // Handle case when the job document does not exist
          console.log('Job document not found');
        }
      } catch (error) {
        // Handle any errors during the data fetching process
        console.error('Error fetching job data:', error);
      }
    };

    fetchJobData();
  }, [database, jobId]);
  useEffect(() => {
    const checkIfApplied = () => {
      if (jobData && user.data) {
        const applicants = jobData.applicants || [];
        const userEmail = user.data.email;
        setApplied(applicants.includes(userEmail));
      }
    };

    checkIfApplied();
  }, [jobData, user]);

  if (!jobData) {
    return <div>Loading...</div>;
  }
  const handleApply = async () => {
    try {
      const jobRef = doc(database, "Jobs", jobId);
      await updateDoc(jobRef, {
        applicants: [...jobData.applicants, user.data.email]
      });
      setApplied(true);
      alert("Application sent!");
    } catch (error) {
      console.error('Error applying for the job:', error);
    }
  }

  return (
    <div>
      <h1>{jobData.positionTitle} </h1>
      <p>{jobData.description}</p>
      <p>Company: {jobData.company}</p>
      <p>Location: {jobData.location}</p>
      <p>Salary: {jobData.salary}</p>
      <Button variant='success' onClick={handleApply} disabled={applied} >Apply</Button>
    </div>
  );
}

export default Job;
