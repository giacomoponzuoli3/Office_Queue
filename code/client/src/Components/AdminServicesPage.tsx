import {Button, Card, Container, Row, Navbar,Nav,Form,Dropdown} from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import React, { useState} from 'react'
import PropTypes from "prop-types";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css"
import API from "../API/API"; 
import { Service } from "../Models/service";
  
  interface AdminServicesPageProps {
    services: Service[]; // Array of Service objects
    updateServices: () => void; // Function to update the services
  }

function AdminServicesPage({ services, updateServices }:AdminServicesPageProps) {
    const navigate = useNavigate()
    // Use useState to manage the selected tab
  const [activeTab, setActiveTab] = useState('#add');
  const [editSelection, setEditSelection] = useState('');
  const [deleteSelection, setDeleteSelection] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [serviceTime, setServiceTime] = useState('');

  // Define the content that changes based on the selected tab
  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    await API.addService(serviceName, Number(serviceTime));
    setServiceName('');
    setServiceTime('');

    updateServices();
};

  const handleEdit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(editSelection);
    console.log(serviceName);
    console.log(serviceTime);
    await API.editService(editSelection, serviceName, Number(serviceTime));
    setServiceName('');
    setServiceTime('');
    setEditSelection('');
    await updateServices();
  };

  const handleDelete = async (event: React.FormEvent) => {
    event.preventDefault();
    await API.deleteService(deleteSelection);
    setDeleteSelection('');
    await updateServices();
  };

    return (
        <>
            <Container fluid>
            <Navbar style={{ backgroundColor: '#FF7F50' }}>
             <Container background-colour="#FF7F50">
                <Navbar.Brand href="#home">
                <i className="bi bi-building"></i>{' '}
                  Office Queue
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
                <Card>
                  <Card.Header>
                    <Nav variant="tabs" 
                    defaultActiveKey="#add" 
                    onSelect={(selectedKey) => {
                        // Handle the case where selectedKey might be null
                        if (selectedKey) {
                          setActiveTab(selectedKey);
                          setServiceName('')
                          setServiceTime('')
                          setEditSelection('')
                          setDeleteSelection('')
                        }
                      }}>
                      <Nav.Item>
                        <Nav.Link eventKey="#add">Add a service</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                         <Nav.Link eventKey="#edit">Edit a service</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                          <Nav.Link eventKey="#delete">Delete a service</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Card.Header>
                  {activeTab==="#add" ? (
                    <Card.Body>
                    <Card.Title>Add a Service</Card.Title>
                    <Form onSubmit={handleAdd}>
                      <Form.Group className="mb-3" controlId="username">
                        <Form.Label>Name of service</Form.Label>
                        <Form.Control
                          value={serviceName}
                          placeholder="Example: Delivery"
                          onChange={(ev) => setServiceName(ev.target.value)}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Service time</Form.Label>
                        <Form.Control
                          value={serviceTime}
                          placeholder="Example: 10"
                          onChange={(ev) => setServiceTime(ev.target.value)}
                          required
                        />
                      </Form.Group>
                      <Button type="submit" style={{ backgroundColor: '#FF7F50' }}>Add</Button>
                    </Form>
                  </Card.Body>
                 ) : activeTab==="#edit" ?(
                    <Card.Body>
                    <Card.Title>Edit a Service</Card.Title>
                    <Dropdown data-bs-theme="dark">
                      <Dropdown.Toggle id="dropdown-button-dark-example1" variant="secondary">
                      {editSelection ? editSelection : "Choose a service"}
                      </Dropdown.Toggle>
                    <Dropdown.Menu>
                    {services.map((service, index) => (
                          <Dropdown.Item
                            key={index}
                            eventKey={service.name}
                            onClick={() => {
                                setEditSelection(service.name)
                                setServiceName(service.name)
                                setServiceTime(service.serviceTime.toString())
                            }}
                          >
                            {service.name}
                          </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                  </Dropdown>
                    <Form onSubmit={handleEdit}>
                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Name of service</Form.Label>
                    <Form.Control
                      value={serviceName}
                      placeholder=""
                      onChange={(ev) => setServiceName(ev.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Service time</Form.Label>
                    <Form.Control
                      value={serviceTime}
                      placeholder=""
                      onChange={(ev) => setServiceTime(ev.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button type="submit" style={{ backgroundColor: '#FF7F50' }}>Edit</Button>
                </Form>
                    </Card.Body>
                 ) : (
                    <Card.Body>
                    <Card.Title>Delete a Service</Card.Title>
                    <Dropdown data-bs-theme="dark">
                      <Dropdown.Toggle id="dropdown-button-dark-example1" variant="secondary">
                      {deleteSelection ? deleteSelection : "Choose a service"}
                      </Dropdown.Toggle>
                    <Dropdown.Menu>
                    {services.map((service, index) => (
                          <Dropdown.Item
                            key={index}
                            eventKey={service.name}
                            onClick={() => {
                                setDeleteSelection(service.name)
                                setServiceName(service.name)
                                setServiceTime(service.serviceTime.toString())
                            }}
                          >
                            {service.name}
                          </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                  </Dropdown>
                  <br/>
                  <p>{deleteSelection==='' ? '' : `Are you sure you want to delete ${deleteSelection}?`}</p>
                    <Button onClick={handleDelete} style={{ backgroundColor: '#FF7F50' }}>Delete</Button>
                  </Card.Body>
                 )
                }
            </Card>
          
        </Row>
      </Container>
    </div>
            </Container>
        </>
    )
}

AdminServicesPage.propTypes = {
  services: PropTypes.arrayOf(
      PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          serviceTime: PropTypes.number.isRequired,     
      })
  ).isRequired,
  updateServices: PropTypes.func.isRequired,
};

export default AdminServicesPage