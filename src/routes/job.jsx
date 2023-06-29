import { useDatabase, useUser } from 'reactfire';
import { useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthRedirect } from '../components/page_protection_funcs';
import { Button, Card, Container } from 'react-bootstrap';

//TODO make it so that employers cant apply for jobs by making the apply button disabled if the users email is in the Employers collection
function Job() {
  useAuthRedirect();
  const database = useDatabase();
  const { jobId } = useParams();
  const [jobData, setJobData] = useState(null);
  const user = useUser();
  const [applied, setApplied] = useState(false);
  const employersCollection = collection(database, 'Employers');

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const jobRef = doc(database, 'Jobs', jobId);
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
    if (user && user.data) {
      const employersQuery = query(employersCollection, where('email', '==', user.data.email));
      try {
        const querySnapshot = await getDocs(employersQuery);
        if (!querySnapshot.empty) {
          // User is an employer, so do not proceed with the application
          alert('Employers are not allowed to apply for jobs.');
          return;
        }
      } catch (err) {
        console.error('Error checking employer status:', err);
      }
    }
    // Proceed with the application for non-employers
    try {
      const jobRef = doc(database, 'Jobs', jobId);
      await updateDoc(jobRef, {
        applicants: [...jobData.applicants, user.data.email],
      });
      setApplied(true);
      alert('Application sent!');
    } catch (error) {
      console.error('Error applying for the job:', error);
    }
  };  

  
  return (
    <div style={{ padding: "100px 60px 100px 60px", backgroundColor: "#F5F5F5" }}>
      <Card>
        <Container className="job-container">
          <h1 className="job-title">{jobData.positionTitle}</h1>
          <h3 className="job-subtitle">Job Description</h3>
          <p>{jobData.description}</p>
          <p>
            <b>Company:</b> {jobData.company}
          </p>
          <p>
            <b>Location:</b> {jobData.location}
          </p>
          <p>
            <b>Salary:</b> ${jobData.salary}
          </p>
          <Button style={{ backgroundColor: "#8ec7b7", borderColor: "#565656", padding: "10px 30px 10px 30px" }} onClick={handleApply} disabled={applied}>
            Apply
          </Button>
        </Container>
      </Card>

      <style jsx>{`
        

        .job-container {
          padding: 40px 30px;
        }

        .job-title {
          font-size: 50px;
          font-family: 'Avrile Sans';
          font-weight: bold;
        }

        .job-subtitle {
          font-family: 'Avrile Sans';
          font-weight: bold;
        }

        @media (max-width: 767px) {
          .page-container {
            padding: 50px 20px;
          }

          .job-container {
            padding: 20px 15px;
          }

          .job-title {
            font-size: 36px;
          }
        }
      `}</style>
    </div>
  );
}

export default Job;
