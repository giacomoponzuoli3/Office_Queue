import {Button, Card, Container, Row, Navbar, Dropdown, Col, Table} from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import React, { useState } from 'react'
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css"
import API from "../API/API";
import {Ticket} from "../Models/ticket";
import { Service } from "../Models/service";

interface HomepageProps {
    services: Service[];
    nextCustomerList: Ticket[];
}

function Homepage( {services, nextCustomerList }: HomepageProps ) {
    const navigate = useNavigate()

    const [selectedService, setSelectedService] = useState<string>('');
    const [selectedServiceId, setSelectedServiceId] = useState<number>(0);

    const [ticket, setTicket] = useState<Ticket>(new Ticket())

    const [waitingTime, setWaitingTime] = useState<number>(0);

    const handleSelect = async (event: React.FormEvent) => {
        event.preventDefault();

        if(!selectedService) {
            alert("Please select a service before submitting.");
            return;
        }

        setWaitingTime(0)
        setTicket(new Ticket())

        // This will fail if no counters have been set up for the specified service today.
        // Until the admin API is implemented, this means the db needs to be updated manually
        API.getWaitingTime(selectedServiceId)
            .then(waitTime => setWaitingTime(waitTime.waitingTime))
            .catch(err => console.log(err));

        // This will fail if the queue for the specified service has not been set up for today.
        // Until the admin API is implemented (to choose which services will be available today), the db needs to be updated manually.
        API.getNewTicket(selectedServiceId)
            .then((ticket: Ticket) => setTicket(ticket))
            .catch(err => console.log(err));
    }

    const handleOkClick = () => {
        setTicket(new Ticket());
        setSelectedService('');
        setWaitingTime(-1);
    }
    const formatTicketNumber = (number: number) => {
        return number.toString().padStart(5, '0');
      };

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
                                onClick={() => navigate("/admin")}>
                                Admin
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
                                <Card className="shadow-sm" style={{backgroundColor: 'rgb(250, 250, 210, 0.8)', padding: '10px', height: '400px'}}>
                                    <Card.Body>
                                        {ticket.id > 0 ? (
                                            <div>
                                                <Card.Title style={{ fontSize: '2rem', fontWeight: 'bold' }}>Your Ticket</Card.Title>
                                                <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>{formatTicketNumber(ticket.id)}</Card.Text>
                                                <Card.Text>Requested service: {selectedService}</Card.Text>
                                                <Card.Text>Your position in line: {ticket.queuePosition + 1}</Card.Text>
                                                <Card.Text>Estimated waiting time: {waitingTime ? waitingTime : ''}</Card.Text>
                                                <Button style={{ backgroundColor: '#FF7F50' }} onClick={handleOkClick}>Get another Ticket</Button>
                                            </div>
                                        ) : (
                                            <div>
                                                <Card.Title style={{ fontSize: '2rem', fontWeight: 'bold' }}>Welcome to the post office!</Card.Title>
                                                <Card.Text >
                                                    Get your ticket by choosing the service u want and clicking on the "Get Ticket" button
                                                </Card.Text>
                                                <Dropdown data-bs-theme="dark">
                                                    <Dropdown.Toggle id="dropdown-basic" variant="secondary">
                                                        {selectedService ? selectedService : "Choose a Service" }
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        {services.map((service, index) => (
                                                            <Dropdown.Item
                                                                key={index}
                                                                eventKey={service.name}
                                                                onClick={() => {
                                                                    setSelectedService(service.name)
                                                                    setSelectedServiceId(service.id)
                                                                }}
                                                            >
                                                                {service.name}
                                                            </Dropdown.Item>
                                                        ))}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                <br/>
                                                <Button
                                                    type="submit"
                                                    style={{ backgroundColor: '#FF7F50' }}
                                                    onClick={handleSelect}
                                                >
                                                    Get Ticket
                                                </Button>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={8} lg={6}>
                                <Card className="shadow-sm" style={{backgroundColor: 'rgb(250, 250, 210, 0.8)', padding: '10px', height: '400px'}}>
                                    <Card.Body>
                                        <Table responsive style={{backgroundColor: '#FF7F50'}}>
                                            <thead style={{backgroundColor: '#FF7F50'}}>
                                            <tr>
                                                <th style={{backgroundColor: '#FF7F50'}}>Ticket Number</th>
                                                <th style={{backgroundColor: '#FF7F50'}}>Counter</th>
                                            </tr>
                                            </thead>
                                            <tbody style={{backgroundColor: '#FF7F50'}}>
                                            {nextCustomerList.map((t, index) => (
                                                <tr>
                                                    <td style={{backgroundColor: '#FF7F50'}}>{formatTicketNumber(t.id)}</td>
                                                    <td style={{backgroundColor: '#FF7F50'}}>{t.counterId}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </Table>
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

export default Homepage