import { useDatabase, useUser } from 'reactfire';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

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
    if (description.length > 400) {
      return description.substring(0, 400) + '...';
    }
    return description;
  };

  return (
    <div style={{ padding: "100px 20px 100px 20px", backgroundColor: "#F5F5F5" }}>
      <Container>
        <Card style={{ padding: "10px", marginBottom: "20px" }}>
          <Form.Control
            placeholder="Search - (Web Developer, Chef, HR Manager)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <Button
            style={{ backgroundColor: "#8ec7b7", borderColor: "#565656", width: "100%" }}
            onClick={handleSearch}
          >
            Search
          </Button>
          {isEmployer && (
            <Button
              style={{ backgroundColor: "#8ec7b7", borderColor: "#565656", marginTop: "10px", width: "100%" }}
              onClick={addButton}
            >
              Add Job
            </Button>
          )}
        </Card>
        <Row>
          <Col md={6}>
            <Card style={{ marginBottom: "10px" }}>
              <Card.Img style={{ borderRadius: "5px" }} src={require("./assets/Imgs/KEC-how-we-do-business-1024x683.jpeg")} />
              <Card.Body>
                <Card.Title>Prospective Employee Articles</Card.Title>
                <Card.Text>
                  Discover valuable tips and advice to boost your chances of landing your dream job.
                </Card.Text>
                <Button style={{ backgroundColor: "#8ec7b7", borderColor: "#565656" }} href="/">
                  View
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            {loading ? (
              <span>Loading...</span>
            ) : jobs.length === 0 ? (
              <span style={{ fontSize: "24px", textAlign: "center", marginTop: "20px" }}>
                No results found.
              </span>
            ) : (
              <>
                {jobs.map((job) => (
                  <Card
                    key={job.id}
                    onClick={() => applyButton(job.id)}
                    style={{
                      marginBottom: "10px",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                    }}
                    className="job-card"
                  >
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px", fontWeight: "bold" }}>
                        {job.positionTitle}
                      </Card.Title>
                      <Card.Subtitle style={{paddingBottom:9, }}><u>{job.location}</u></Card.Subtitle>
                      <Card.Subtitle>${job.salary}</Card.Subtitle>
                      <Card.Text>{truncateDescription(job.description)}</Card.Text>
                      <Button
                        style={{ backgroundColor: "#8ec7b7", borderColor: "#565656", width: "100%" }}
                        onClick={() => applyButton(job.id)}
                      >
                        <Icon.ArrowRight /> View
                      </Button>
                    </Card.Body>
                  </Card>
                ))}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
