import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

function VoteCountDisplayOne() {
  const [optionVoteCounts, setOptionVoteCounts] = useState([]);
  const [agendaVoteCounts, setAgendaVoteCounts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVoteCounts = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('User not authenticated. Please log in.');
        return;
      }

      try {
        // Fetch initial option vote counts
        const optionResponse = await fetch('http://127.0.0.1:8000/option-vote-count/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        if (!optionResponse.ok) {
          if (optionResponse.status === 401) {
            setError('Unauthorized access. Please log in.');
          } else {
            throw new Error('Failed to fetch option vote counts');
          }
          return;
        }

        const optionData = await optionResponse.json();
        setOptionVoteCounts(optionData);

        // Fetch initial agenda vote counts
        const agendaResponse = await fetch('http://127.0.0.1:8000/agenda-vote-count/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        if (!agendaResponse.ok) {
          if (agendaResponse.status === 401) {
            setError('Unauthorized access. Please log in.');
          } else {
            throw new Error('Failed to fetch agenda vote counts');
          }
          return;
        }

        const agendaData = await agendaResponse.json();
        setAgendaVoteCounts(agendaData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchVoteCounts();

    // Connect to WebSocket
    const socket = new WebSocket('ws://127.0.0.1:9000/ws/vote-count/'); 
    console.log("sockets:",socket)
    // Adjust URL as needed
    socket.onopen = () => {
        console.log("WebSocket connection opened");
      }
    socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log('Received data:', data);
      setOptionVoteCounts(data.option_counts || []);
      console.log(data.option_counts)
      setAgendaVoteCounts(data.agenda_counts || []);
    };

    socket.onerror = (e) => {
        console.error('WebSocket error:', e);
        setError('WebSocket error: ' + e.message);
      };
    socket.onclose= () => {
      console.log("CLOSED")
      };

    return () => socket.close();
  }, []);

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Vote Counts</h2>

      <h3 className="mb-3">Option Vote Counts</h3>
      <Row className="g-4">
  {optionVoteCounts.length > 0 ? (
    optionVoteCounts.map((option) => (
      <Col md={6} lg={4} key={option.id}> {/* Ensure 'option.id' is unique */}
        <Card className="custom-card">
          <Card.Body>
            <Card.Title>{option.option_name || 'Option Name Missing'}</Card.Title>
            <Card.Text>Vote Count: {option.vote_count}</Card.Text>
            <Card.Text>Agenda Title: {option.agenda_title || 'Agenda Title Missing'}</Card.Text>
            <Card.Text>Agenda Description: {option.agenda_description || 'Agenda Description Missing'}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    ))
  ) : (
    <p>No option vote counts available.</p>
  )}
</Row>

<Row className="g-4">
  {agendaVoteCounts.length > 0 ? (
    agendaVoteCounts.map((agenda) => (
      <Col md={6} lg={4} key={agenda.id}> {/* Ensure 'agenda.id' is unique */}
        <Card className="custom-card">
          <Card.Body>
            <Card.Title>{agenda.agenda_name || 'Agenda Name Missing'}</Card.Title>
            <Card.Text>Total Votes: {agenda.vote_count}</Card.Text>
            <Card.Text>Agenda Title: {agenda.agenda_title || 'Agenda Title Missing'}</Card.Text>
            <Card.Text>Agenda Description: {agenda.agenda_description || 'Agenda Description Missing'}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    ))
  ) : (
    <p>No agenda vote counts available.</p>
  )}
</Row>

    </Container>
  );
}

export default VoteCountDisplayOne;




// import React, { useState, useEffect } from 'react';
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Card from 'react-bootstrap/Card';
// function VoteCountDisplay() {
//   const [optionVoteCounts, setOptionVoteCounts] = useState([]);
//   const [agendaVoteCounts, setAgendaVoteCounts] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchVoteCounts = async () => {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         setError('User not authenticated. Please log in.');
//         return;
//       }

//       try {
//         // Fetch initial option vote counts
//         const optionResponse = await fetch('http://127.0.0.1:8000/option-vote-count/', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Token ${token}`,
//           },
//         });

//         if (!optionResponse.ok) {
//           if (optionResponse.status === 401) {
//             setError('Unauthorized access. Please log in.');
//           } else {
//             throw new Error('Failed to fetch option vote counts');
//           }
//           return;
//         }

//         const optionData = await optionResponse.json();
//         setOptionVoteCounts(optionData);

//         // Fetch initial agenda vote counts
//         const agendaResponse = await fetch('http://127.0.0.1:8000/agenda-vote-count/', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Token ${token}`,
//           },
//         });

//         if (!agendaResponse.ok) {
//           if (agendaResponse.status === 401) {
//             setError('Unauthorized access. Please log in.');
//           } else {
//             throw new Error('Failed to fetch agenda vote counts');
//           }
//           return;
//         }

//         const agendaData = await agendaResponse.json();
//         setAgendaVoteCounts(agendaData);
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     fetchVoteCounts();

//     // Connect to WebSocket
//     const socket = new WebSocket('ws://127.0.0.1:9000/ws/vote-count/'); // Adjust URL as needed
//     socket.onmessage = (e) => {
//       const data = JSON.parse(e.data);
//       setOptionVoteCounts(data.option_counts || []);
//       setAgendaVoteCounts(data.agenda_counts || []);
//     };

//     socket.onerror = (e) => {
//       setError('WebSocket error: ' + e.message);
//     };

//     return () => socket.close();
//   }, []);

//   if (error) {
//     return <p className="text-danger">{error}</p>;
//   }

//   return (
//     <Container className="mt-4">
//       <h2 className="text-center mb-4">Vote Counts</h2>

//       <h3 className="mb-3">Option Vote Counts</h3>
//       <Row className="g-4">
//         {optionVoteCounts.length > 0 ? (
//           optionVoteCounts.map((option) => (
//             <Col md={6} lg={4} key={option.id}>
//               <Card className="custom-card">
//                 <Card.Body>
//                   <Card.Title>{option.option_name || 'Option Name Missing'}</Card.Title>
//                   <Card.Text>Vote Count: {option.vote_count}</Card.Text>
//                   <Card.Text>Agenda Title: {option.agenda_title || 'Agenda Title Missing'}</Card.Text>
//                   <Card.Text>Agenda Description: {option.agenda_description || 'Agenda Description Missing'}</Card.Text>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))
//         ) : (
//           <p>No option vote counts available.</p>
//         )}
//       </Row>

//       <h3 className="mb-3 mt-4">Agenda Vote Counts</h3>
//       <Row className="g-4">
//         {agendaVoteCounts.length > 0 ? (
//           agendaVoteCounts.map((agenda) => (
//             <Col md={6} lg={4} key={agenda.id}>
//               <Card className="custom-card">
//                 <Card.Body>
//                   <Card.Title>{agenda.agenda_name || 'Agenda Name Missing'}</Card.Title>
//                   <Card.Text>Total Votes: {agenda.vote_count}</Card.Text>
//                   <Card.Text>Agenda Title: {agenda.agenda_title || 'Agenda Title Missing'}</Card.Text>
//                   <Card.Text>Agenda Description: {agenda.agenda_description || 'Agenda Description Missing'}</Card.Text>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))
//         ) : (
//           <p>No agenda vote counts available.</p>
//         )}
//       </Row>
//     </Container>
//   );
// }

// export default VoteCountDisplay;





// import React, { useState, useEffect } from 'react';
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Card from 'react-bootstrap/Card';

// function VoteCountDisplay() {
//   const [optionVoteCounts, setOptionVoteCounts] = useState([]);
//   const [agendaVoteCounts, setAgendaVoteCounts] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchVoteCounts = async () => {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         setError('User not authenticated. Please log in.');
//         return;
//       }

//       try {
//         // Fetch option vote counts
//         const optionResponse = await fetch('http://127.0.0.1:8000/option-vote-count/', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Token ${token}`,
//           },
//         });

//         if (!optionResponse.ok) {
//           if (optionResponse.status === 401) {
//             setError('Unauthorized access. Please log in.');
//           } else {
//             throw new Error('Failed to fetch option vote counts');
//           }
//           return;
//         }

//         const optionData = await optionResponse.json();
//         setOptionVoteCounts(optionData);

//         // Fetch agenda vote counts
//         const agendaResponse = await fetch('http://127.0.0.1:8000/agenda-vote-count/', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Token ${token}`,
//           },
//         });

//         if (!agendaResponse.ok) {
//           if (agendaResponse.status === 401) {
//             setError('Unauthorized access. Please log in.');
//           } else {
//             throw new Error('Failed to fetch agenda vote counts');
//           }
//           return;
//         }

//         const agendaData = await agendaResponse.json();
//         setAgendaVoteCounts(agendaData);
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     fetchVoteCounts();
//   }, []);

//   if (error) {
//     return <p className="text-danger">{error}</p>;
//   }

//   return (
//     <Container className="mt-4">
//       <h2 className="text-center mb-4">Vote Counts</h2>

//       <h3 className="mb-3">Option Vote Counts</h3>
//       <Row className="g-4">
//         {optionVoteCounts.length > 0 ? (
//           optionVoteCounts.map((option) => (
//             <Col md={6} lg={4} key={option.id}>
//               <Card className="custom-card">
//                 <Card.Body>
//                   <Card.Title>{option.option_name || 'Option Name Missing'}</Card.Title>
//                   <Card.Text>Vote Count: {option.vote_count}</Card.Text>
//                   <Card.Text>Agenda Title: {option.agenda_title || 'Agenda Title Missing'}</Card.Text>
//                   <Card.Text>Agenda Description: {option.agenda_description || 'Agenda Description Missing'}</Card.Text>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))
//         ) : (
//           <p>No option vote counts available.</p>
//         )}
//       </Row>

//       <h3 className="mb-3 mt-4">Agenda Vote Counts</h3>
//       <Row className="g-4">
//         {agendaVoteCounts.length > 0 ? (
//           agendaVoteCounts.map((agenda) => (
//             <Col md={6} lg={4} key={agenda.id}>
//               <Card className="custom-card">
//                 <Card.Body>
//                   <Card.Title>{agenda.agenda_name || 'Agenda Name Missing'}</Card.Title>
//                   <Card.Text>Total Votes: {agenda.vote_count}</Card.Text>
//                   <Card.Text>Agenda Title: {agenda.agenda_title || 'Agenda Title Missing'}</Card.Text>
//                   <Card.Text>Agenda Description: {agenda.agenda_description || 'Agenda Description Missing'}</Card.Text>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))
//         ) : (
//           <p>No agenda vote counts available.</p>
//         )}
//       </Row>
//     </Container>
//   );
// }

// export default VoteCountDisplay;