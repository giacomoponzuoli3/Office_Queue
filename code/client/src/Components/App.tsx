import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import API from '../API/API';
import Homepage from './Homepage';
import AdminPage from './AdminPage';
import AdminServicesPage from './AdminServicesPage';
import AdminCountersPage from './AdminCountersPage';
import EmployeePage from './EmployeePage';
import { Counter } from '../Models/counter';
import { Service } from '../Models/service';
import {Ticket} from "../Models/ticket";

function App() {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [services, setServices] = useState<Service[]>([]);
    const [counters, setCounters] = useState<Counter[]>([]);
    const [nextCustomerList, setNextCustomerList] = useState<Ticket[]>([]);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const addNextCustomerToCallList = (ticket: Ticket) => {
        setNextCustomerList(prevList =>
            prevList.filter(customer => customer.counterId !== ticket.counterId)
        );
        setNextCustomerList(prevList => [
            ...prevList,  // Spread the previous list items
            ticket
        ]);
      };

    const getCounters = async () => {
        try {
            const counters = await API.getAllCounters();
            setCounters(counters);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const getServices = async () => {
        try {
            const services = await API.getServices();
            setServices(services);
        } catch (err: any) {
            setError(err.message);
        }
    };

    useEffect(() => {
        getServices().then();
        getCounters().then();
    }, []);

    return (
        <Container fluid style={{ padding: 0, height: "100%" }}>
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Homepage services={services} nextCustomerList={nextCustomerList}/>} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/employee" element={<EmployeePage counters={counters} addNextCustomerToCallList={addNextCustomerToCallList}/>} />
                <Route
                    path="/admin/services"
                    element={<AdminServicesPage services={services} updateServices={getServices} />}
                />
                <Route
                    path="/admin/counters"
                    element={<AdminCountersPage services={services}/>}
                />
            </Routes>
        </Container>
    );
}

export default App