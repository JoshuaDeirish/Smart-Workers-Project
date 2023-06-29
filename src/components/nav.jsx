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
      <Navbar
        fixed="top"
        style={{
          backgroundColor: "#8ec7b7",
          boxShadow: "1px 2px 7px lightGray",
          opacity: "90%",
          paddingBottom: 10,
        }}
        expand="xxl"
      >
        <Container fluid>
          <Navbar.Brand href="/" style={{
          color: "white", fontSize:27}}>SMART WORKERS</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Offcanvas placement="end">
            <Offcanvas.Header closeButton style={{ backgroundColor: "#8ec7b7" }}>
              <Offcanvas.Title>
                <b>Menu</b>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body style={{ fontSize: 22 }}>
              <Nav navbarScroll>
                <Nav.Link href="/" className="nav-link">Home</Nav.Link>
                {!user && (
                  <>
                    <Nav.Link href="/register" className="nav-link">Register</Nav.Link>
                    <Nav.Link href="/login" className="nav-link">Login</Nav.Link>
                  </>
                )}
                {user && (
                  <>
                    <Nav.Link href="/" onClick={logout} className="nav-link">Logout</Nav.Link>
                  </>
                )}
                <Nav.Link href="/job-list" className="nav-link">Job List</Nav.Link>
                {isEmployer && (
                  <>
                    <Nav.Link href="/add-job" className="nav-link">Add Job</Nav.Link>
                    <Nav.Link href="/my-postings" className="nav-link">My Postings</Nav.Link>
                  </>
                )}
                {isJobSeeker && (
                  <>
                    <Nav.Link href="/my-applications" className="nav-link">Applications</Nav.Link>
                  </>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      <style>
        {`
          .nav-link:hover {
            color: #bde5ac !important;
          }
        `}
      </style>
    </div>
  );
}
