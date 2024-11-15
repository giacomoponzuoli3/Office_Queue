import {Button, Card, Container, Row, Navbar, Col,Dropdown} from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useState} from 'react'
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css"
import API from "../API/API";

function AdminPage() {
    const navigate = useNavigate()
    const [flip, setFlip] = useState(false)

    return (
        <>
            <Container fluid>
            <Navbar style={{ backgroundColor: '#FF7F50' }}>
                <Container background-colour="#FF7F50">
                    <Navbar.Brand href="#home">
                        <i className="bi bi-building"></i>{' '}Office Queue
                    </Navbar.Brand>
                    <Dropdown data-bs-theme="dark" className="ms-auto">
                        <Dropdown.Toggle id="dropdown-basic" variant="secondary">Switch to</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                key="0"
                                eventKey="admin"
                                onClick={() => navigate("/home")}>
                                Customer
                            </Dropdown.Item>
                            <Dropdown.Item
                                key="1"
                                eventKey="employee"
                                onClick={() => navigate("/employee")}>
                               Employee
                           </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Container>
            </Navbar>
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <Container>
                        <Row className="justify-content-md-center">
                            <Col md={8} lg={6}>
                                <Card className="shadow-sm" style={{backgroundColor: 'rgb(250, 250, 210, 0.8)', padding: '10px'}} onClick={() => navigate("/admin/services")}>
                                    <Card.Body>
                                        <Card.Img variant="top" src="servicesImg3.png" />
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={8} lg={6}>
                                <Card className="shadow-sm" style={{backgroundColor: 'rgb(250, 250, 210, 0.8)', padding: '10px'}} onClick={() => navigate("/admin/counters")}>
                                    <Card.Body style={{backgroundColor: 'rgb(250, 250, 210, 0)'}}>
                                        <Card.Img variant="top" src="countersImg.png" />
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </Container>
        </>
    )
}

export default AdminPage