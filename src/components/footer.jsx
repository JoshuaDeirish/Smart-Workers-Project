import { Col, Container, Row } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

export default function FooterPart() {
  return (
    <div style={{ backgroundColor: "#005262" }}>
      <Container style={{ paddingTop: 50, paddingBottom: 50 }}>
        <Row style={{ color: "#d3d4d1" }}>
          <Col xs={12} sm={6} md={3}>
            <h1 style={{ textAlign: "center", fontWeight: "bold" }}>
              SMART<br />WORKERS
            </h1>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <h4 style={{ fontWeight: "bold" }}>Contact</h4>
            <br />
            <p><Icon.EnvelopeAt /> Joshuadeirish@gmail.com</p>
            <p><Icon.Phone /> (647)-685-2746</p>
            <p><Icon.GeoAlt /> Durham Ontario, Canada</p>
            <a href="https://www.linkedin.com/in/joshua-deirish-55823b1a2/"><Icon.Linkedin /> LinkedIn/JoshuaDeirish</a>
            <br /><br />
            <a href="https://github.com/JoshuaDeirish"><Icon.Github /> Github/JoshuaDeirish</a>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <h4 style={{ fontWeight: "bold" }}>Job Seekers</h4>
            <br />
            <a href="/">My Account</a>
            <br /><br />
            <a href="/my-applications">Applications</a>
            <br /><br />
            <a href="/">Prospective Employee Blog</a>
            <br />
          </Col>
          <Col xs={12} sm={6} md={3}>
            <h4 style={{ fontWeight: "bold" }}>Employers</h4>
            <br />
            <a href="/">Employer Account</a>
            <br /><br />
            <a href="/my-postings">Posts</a>
            <br /><br />
            <a href="/add-jobs">Add Job</a>
            <br /><br />
            <a href="/">Employer Blog</a>
            <br /><br />
          </Col>
        </Row>
      </Container>
      <style>
        {`
          a {
            text-decoration: none;
            color: #d3d4d1;
            transition: color 0.3s;
          }
          a:hover {
            color: #ffffff;
          }
        `}
      </style>
    </div>
  );
}
