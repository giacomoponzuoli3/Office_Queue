import {Button, Card, Container, Row, Navbar, Col,Dropdown} from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import React, { useState} from 'react'
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css"
import { Counter } from "../Models/counter";
import { Ticket } from "../Models/ticket";
import API from "../API/API";

interface EmployeePageProps {
  counters: Counter[];
  addNextCustomerToCallList: (ticket: Ticket) => void;
}

function EmployeePage({ counters, addNextCustomerToCallList }: EmployeePageProps) {
    const navigate = useNavigate()
    const [selectedCounter, setSelectedCounter] = useState('');
    const [selectedCounterId, setSelectedCounterId] = useState<number>(0);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [ticketCounter, setTicketCounter] = useState<number>(0);
    const [nextCustomer, setNextCustomer] = useState<number>(0);

    const handleSelect = async (event: React.FormEvent) => {
      event.preventDefault();

      if(!selectedCounter) {
          alert("Please select a service before submitting.");
          return;
      }
      setIsRegistered(true);
      //todo here comes an API call
    }

    const handleNextCustomer = async (event: React.FormEvent) => {
      event.preventDefault();

      API.callNextTicket(selectedCounterId)
          .then((ticket: Ticket) => {
              addNextCustomerToCallList(ticket);
              console.log(ticket.counterId)
              setNextCustomer(ticket.id);
              setIsClicked(true);
          })
          .catch(err => console.log(err));
    }

    const handleUnregister = async (event: React.FormEvent) => {
      event.preventDefault();
      setSelectedCounter('');
      setSelectedCounterId(0);
      setIsClicked(false);
      setIsRegistered(false);
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
                                onClick={() => navigate("/home")}>
                                Customer
                            </Dropdown.Item>
                            <Dropdown.Item
                                key="1"
                                eventKey="employee"
                                onClick={() => navigate("/admin")}>
                                Admin
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
                                    <Card.Title style={{ fontSize: '2rem', fontWeight: 'bold' }}>Welcome to your Employee Page!</Card.Title>
                                    <Card.Text >
                                        To register on the counter you are currently working choose a counter and click on the "Register on Counter" button
                                    </Card.Text>
                                    <Dropdown data-bs-theme="dark">
                                        <Dropdown.Toggle id="dropdown-basic" variant="secondary">
                                            {selectedCounter ? selectedCounter : "Choose a Counter" }
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {counters.map((counter, index) => (
                                                <Dropdown.Item
                                                    key={index}
                                                    eventKey={counter.name}
                                                    onClick={() => {
                                                        setSelectedCounter(counter.name)
                                                        setSelectedCounterId(counter.id)
                                                    }}>
                                                    {counter.name}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <br/>
                                    <Button type="submit" style={{ backgroundColor: '#FF7F50' }} onClick={handleSelect}>
                                        Register on Counter
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={8} lg={6}>
                            <Card className="shadow-sm" style={{backgroundColor: 'rgb(250, 250, 210, 0.8)', padding: '10px', height: '400px'}} >
                                { isRegistered ? (
                                    <Card.Body style={{backgroundColor: 'rgb(250, 250, 210, 0)'}}>
                                        <Card.Title style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                            You are currently working on {selectedCounter}
                                        </Card.Title>
                                        <p>To call the next customer click on the "Next Customer" button</p>
                                        <p>To unregister from the current counter u are working on click on the "Unregister from Counter" button</p>
                                        {isClicked ? (<p style={{fontWeight: 'bold' }}>The next customer is {formatTicketNumber(nextCustomer)}</p>):null}
                                        <Button type="submit" style={{ backgroundColor: '#FF7F50' }} onClick={handleNextCustomer}>
                                            Next Customer
                                        </Button>
                                        <br/>
                                        <br/>
                                        <Button type="submit" style={{ backgroundColor: '#FF7F50' }} onClick={handleUnregister}>
                                            Unregister from Counter
                                        </Button>
                                    </Card.Body>
                                ): null}
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            </Container>
        </>
    )
}

export default EmployeePage