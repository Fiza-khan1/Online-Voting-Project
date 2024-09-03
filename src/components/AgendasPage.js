import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';


function AgendasPage() {
  const [agendaTitle, setAgendaTitle] = useState('');
  const [agendaDescription, setAgendaDescription] = useState('');
  const [agendas, setAgendas] = useState([]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newAgenda = {
      title: agendaTitle,
      description: agendaDescription,
      date: new Date().toLocaleDateString()
    };
    setAgendas([...agendas, newAgenda]);
    setAgendaTitle('');
    setAgendaDescription('');
  };

  return (
    <Container className="mt-4">
      <h1>Create and Manage Agendas</h1>
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group controlId="agendaTitle">
          <Form.Label>Agenda Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter agenda title"
            value={agendaTitle}
            onChange={(e) => setAgendaTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="agendaDescription" className="mt-3">
          <Form.Label>Agenda Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter agenda description"
            value={agendaDescription}
            onChange={(e) => setAgendaDescription(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Create Agenda
        </Button>
      </Form>
      <h2>Agendas List</h2>
      <ListGroup>
        {agendas.map((agenda, index) => (
          <ListGroup.Item key={index}>
            <h5>{agenda.title}</h5>
            <p>{agenda.description}</p>
            <small>{agenda.date}</small>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default AgendasPage;
