import { useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

export default function Root() {
  useEffect(() => {
    const cards = document.querySelectorAll(".fade-in-card");

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.25,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          observer.unobserve(entry.target);
        }
      });
    }, options);

    cards.forEach((card) => {
      observer.observe(card);
    });
  }, []);

  return (
    <div className="page-container">
      <div className="header"></div>
      <div
        className="banner fade-in-card"
        style={{
          backgroundImage:
            "url(https://newcomersincanada.ca/wp-content/uploads/2023/01/Online-Job-Searching-Tips-650x313.png)",
        }}
      >
        <div className="banner-content">
          <h1 className="banner-title">SMART<br />WORKERS</h1>
        </div>
      </div>
      <Container className="content-container">
        <Container className="section-heading">
          <h1 className="section-title fade-in-card">Job Seekers</h1>
        </Container>
        <Row className="card-row">
          <Col md={4}>
            <Card className="fade-in-card">
              <Card.Img src={require("./assets/Imgs/seeker-acc.png")} />
              <Card.Body>
                <Card.Title>My Account</Card.Title>
                <Card.Text>Manage and personalize your profile effortlessly.</Card.Text>
                <Button href="/">View Account</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="fade-in-card">
              <Card.Img src={require("./assets/Imgs/seeker-app.png")} />
              <Card.Body>
                <Card.Title>My Applications</Card.Title>
                <Card.Text>Keep track of your active applications and monitor their status.</Card.Text>
                <Button href="/my-applications">View Applications</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="fade-in-card">
              <Card.Img src={require("./assets/Imgs/seeker-job-list.png")} />
              <Card.Body>
                <Card.Title>Job List</Card.Title>
                <Card.Text>Explore exciting opportunities on the SMART WORKERS job board.</Card.Text>
                <Button href="/job-list">Browse Jobs</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Container className="section-heading">
          <h1 className="section-title fade-in-card">Employers</h1>
        </Container>
        <Row className="card-row">
          <Col md={4}>
            <Card className="fade-in-card">
              <Card.Img src={require("./assets/Imgs/employer acc.png")} />
              <Card.Body>
                <Card.Title>Employer Account</Card.Title>
                <Card.Text>Tailor and optimize your business account to meet your needs.</Card.Text>
                <Button href="/">View Account</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="fade-in-card">
              <Card.Img src={require("./assets/Imgs/employer-posts.png")} />
              <Card.Body>
                <Card.Title>My Postings</Card.Title>
                <Card.Text>Explore all your current job openings in one place.</Card.Text>
                <Button href="/my-postings">View Posts</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="fade-in-card">
              <Card.Img src={require("./assets/Imgs/employer-add.png")} />
              <Card.Body>
                <Card.Title>Add Jobs</Card.Title>
                <Card.Text>Advertise open positions in your business with ease.</Card.Text>
                <Button href="/add-job">Add Job</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Container className="section-heading">
          <h1 className="section-title fade-in-card">Articles</h1>
        </Container>
        <Row className="card-row">
          <Col md={6} className="fade-in-card">
            <Card.Img src={require("./assets/Imgs/employer-art.jpeg")} />
            <br /><br />
            <Card.Body>
              <Card.Title>Employer Articles</Card.Title>
              <Card.Text>Gain insights on selecting the right candidates and optimizing your business structure.</Card.Text>
              <Button href="/">View</Button>
            </Card.Body>
            <br />
          </Col>
          
          <Col md={6} className="fade-in-card">
            <Card.Img src={require("./assets/Imgs/KEC-how-we-do-business-1024x683.jpeg")} />
            <br /><br />
            <Card.Body>
              <Card.Title>Prospective Employee Articles</Card.Title>
              <Card.Text>Discover valuable tips and advice to boost your chances of landing your dream job.</Card.Text>
              <Button href="/">View</Button>
            </Card.Body>
          </Col>
        </Row>
      </Container>
      <style jsx>{`
        .page-container {
          padding: 0px 0px 100px 0px;
          background-color: #f5f5f5;
        }

        .header {
          background-color: #8ec7b7;
          height: 67px;
        }

        .banner {
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center center;
          display: flex;
          align-items: center;
          height: 800px;
        }

        .banner-content {
          background-color: #005262;
          width: 40%;
          margin-left: 20px;
          opacity: 0.95;
          
        }

        .banner-title {
          text-align: center;
          font-size: 70px;
          font-weight: bold;
          color: #f5f5f5;
          max-width: 50px;
          padding: 5px;
        }

        .content-container {
          margin-top: 100px;
          margin-bottom: 100px;
        }

        .section-heading {
          text-align: center;
          margin-bottom: 70px;
        }

        .section-title {
          font-weight: bold;
          background-color: #005262;
          color: #f5f5f5;
          border-radius: 5px;
        }

        .card-row {
          margin-left: -15px;
          margin-right: -15px;
        }

        .fade-in-card {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .fade-in {
          opacity: 1;
          transform: translateY(0px);
        }

        .card {
          margin-bottom: 30px;
        }

        .card-img-top {
          object-fit: cover;
          height: 250px;
        }

        .card-title {
          font-weight: bold;
        }

        .card-text {
          margin-bottom: 20px;
        }

        .btn {
          background-color: #005262;
          color: #f5f5f5;
          border: none;
        }

        .btn:hover {
          background-color: #003440;
        }
      `}</style>
    </div>
  );
}
