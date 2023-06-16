import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Container, Navbar, Offcanvas, Nav, Button } from 'react-bootstrap';
import { useDatabase, useUser } from 'reactfire';

export default function Navigation() {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const database = useDatabase();
  const employersCollection = collection(database, "Employers");
  const jobSeekersCollection = collection(database, "JobSeekers");
  const currentUser = useUser();


  const [isEmployer, setIsEmployer] = useState(false);
  const [isJobSeeker, setIsJobSeeker] = useState(false);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [auth]);

  const logout = () => {
    signOut(auth)
      .then(() => {
      })
      .catch((error) => {
      });
  };
  useEffect(() => {
    const checkIfEmployer = async () => {
      if (currentUser && currentUser.data) { // Add this condition to check if user and user.data exist
        const employersQuery = query(
          employersCollection,
          where("email", "==", currentUser.data.email)
        );

        try {
          const querySnapshot = await getDocs(employersQuery);
          setIsEmployer(!querySnapshot.empty);
        } catch (error) {
          console.error("Error checking if employer:", error);
          setIsEmployer(false);
        }
      }
    };
    if (currentUser.data) {
      checkIfEmployer();
    }

  }, [employersCollection, currentUser]);

  useEffect(() => {
    const checkIfJobSeeker = async () => {
      if (currentUser && currentUser.data) { // Add this condition to check if user and user.data exist
        const jobSeekerQuery = query(
          jobSeekersCollection,
          where("email", "==", currentUser.data.email)
        );

        try {
          const querySnapshot = await getDocs(jobSeekerQuery);
          setIsJobSeeker(!querySnapshot.empty);
        } catch (error) {
          console.error("Error checking if employer:", error);
          setIsJobSeeker(false);
        }
      }
    };

    if (currentUser.data) {
      checkIfJobSeeker();
    }
  }, [jobSeekersCollection, currentUser]);


  return (
    <div>
      
     
      <Navbar  style={{ backgroundColor:"#8ec7b7" }} expand="xxl">
        <Container fluid>
          <Navbar.Brand href="/">Smart Workers</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Offcanvas placement="end">
          <Offcanvas.Header closeButton>
                <Offcanvas.Title >
                 Menu
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav >
                  <Nav.Link href='/' >Home</Nav.Link>
                  {!user && (
                    <>
                    <Nav.Link href="/register" >Register</Nav.Link>
                    <Nav.Link href="/login" >Login</Nav.Link>
                    </>
                  )}
                  {user && (
                    <>
                    <Nav.Link href="/" onClick={logout}>Logout</Nav.Link>
                    </>
                  )}
                  <Nav.Link href="/job-list">Job List</Nav.Link>
                  {isEmployer && (
                    <>
                    <Nav.Link href="/add-job">Add Job</Nav.Link>
                    <Nav.Link href="/my-postings">My Postings</Nav.Link>
                    </>
                  )}
                  {isJobSeeker && (
                    <>
                    <Nav.Link href="/my-applications">Applications</Nav.Link>
                    </>
                  )}
                  
                </Nav>
              </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </div>

  );
}
