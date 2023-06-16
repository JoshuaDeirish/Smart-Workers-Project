import { useDatabase, useUser } from 'reactfire';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Form } from 'react-bootstrap';

export default function Job_List() {
  const database = useDatabase();
  const jobsCollection = collection(database, 'Jobs');
  const employersCollection = collection(database, 'Employers');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useUser();
  const [isEmployer, setIsEmployer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let jobsQuery = query(jobsCollection);

        if (searchQuery) {
          jobsQuery = query(jobsCollection, where('positionTitle', '==', searchQuery));
        }

        const querySnapshot = await getDocs(jobsQuery);
        const jobsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobsCollection, searchQuery]);

  useEffect(() => {
    const checkIfEmployer = async () => {
      const employersQuery = query(employersCollection, where('email', '==', user.data.email));

      try {
        const querySnapshot = await getDocs(employersQuery);
        setIsEmployer(!querySnapshot.empty);
      } catch (error) {
        console.error('Error checking if employer:', error);
        setIsEmployer(false);
      }
    };

    if (user.data) {
      checkIfEmployer();
    }
  }, [employersCollection, user]);

  const addButton = () => {
    navigate('/add-job');
  };

  const applyButton = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  const handleSearch = () => {
    fetchData();
  };

  const fetchData = async () => {
    try {
      let jobsQuery = query(jobsCollection);

      if (searchQuery) {
        jobsQuery = query(jobsCollection, where('positionTitle', '==', searchQuery));
      }

      const querySnapshot = await getDocs(jobsQuery);
      const jobsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const truncateDescription = (description) => {
    if (description.length > 500) {
      return description.substring(0, 500) + '...';
    }
    return description;
  };

  return (
    <div>
      <header>Job List</header>
      {isEmployer && <Button variant="success" onClick={addButton}>Add Job</Button>}
      <Form.Control placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      <Button variant="success" onClick={handleSearch}>Search</Button>
      {loading ? (
        <span>Loading...</span>
      ) : (
        <>
          {jobs.map((job) => (
            <Card key={job.id} onClick={() => applyButton(job.id)} style={{ marginBottom:10, marginLeft:20, marginRight:800}}>
              <Card.Body>
                <Card.Title>{job.positionTitle}</Card.Title>
                <Card.Subtitle>
                  {job.location}<br />
                  ${job.salary}
                  </Card.Subtitle><br />
                <Card.Text><li>{truncateDescription(job.description)}</li></Card.Text>
                <Button variant="success" onClick={() => applyButton(job.id)}>Apply</Button><br /><br />
              </Card.Body>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}
