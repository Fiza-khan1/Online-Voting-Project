import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// import './CssFolder/votedisplay.css';
// Import custom CSS

function VoteCountDisplay() {
  const [optionVoteCounts, setOptionVoteCounts] = useState([]);
  const [agendaVoteCounts, setAgendaVoteCounts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let socket;

    const connectWebSocket = () => {
      socket = new WebSocket('ws://127.0.0.1:9000/ws/vote-count/');

      socket.onopen = () => {
        console.log("WebSocket connection opened");
      };

      socket.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          console.log('Received WebSocket data:', data);

          if (Array.isArray(data.option_counts) && Array.isArray(data.agenda_counts)) {
            setOptionVoteCounts(data.option_counts);
            setAgendaVoteCounts(data.agenda_counts);
          } else {
            console.error('Unexpected data structure:', data);
            setError('Received unexpected data structure.');
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          setError('Error parsing WebSocket message.');
        }
      };

      socket.onerror = (e) => {
        console.error('WebSocket error:', e);
        setError('WebSocket error: ' + e.message);
      };

      socket.onclose = (e) => {
        console.log('WebSocket closed. Reconnecting...');
        setTimeout(connectWebSocket, 1000);
      };
    };

    connectWebSocket();

    return () => {
      if (socket) socket.close();
    };
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Vote Counts</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <h2 className="mb-3">Option Vote Counts</h2>
<ul className="list-group mb-4">
  {optionVoteCounts.length > 0 ? (
    optionVoteCounts.map(option => (
      <li key={option.id} className="list-group-item">
        <strong>Option Name: </strong> {option.name || "Option Name Missing"}<br />
        <strong>Agenda Title: </strong> {option.agenda__name || "Agenda Title Missing"}<br />
        <strong>Vote Count: </strong> {option.vote_count !== undefined ? option.vote_count : "Vote Count Missing"}
      </li>
    ))
  ) : (
    <p>No option vote counts available.</p>
  )}
</ul>


      <h2 className="mb-3">Agenda Counts</h2>
      <ul className="list-group">
        {agendaVoteCounts.length > 0 ? (
          agendaVoteCounts.map(agenda => (
            <li key={agenda.id} className="list-group-item">
              <strong>Agenda Title: </strong> {agenda.name || "Agenda Title Missing"}<br />
              <strong>Total Votes: </strong> {agenda.vote_count !== undefined ? agenda.vote_count : "Vote Count Missing"}<br />
              <strong>Agenda Description: </strong> {agenda.description || "Agenda Description Missing"}
            </li>
          ))
        ) : (
          <p>No agenda vote counts available.</p>
        )}
      </ul>
    </div>
  );
}

export default VoteCountDisplay;
