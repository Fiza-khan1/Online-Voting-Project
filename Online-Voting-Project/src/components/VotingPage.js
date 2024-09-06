import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';

function VotePage() {
  const { id } = useParams(); // Get the election ID from URL
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
 

  // Dummy options for voting
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  useEffect(() => {
    // Replace with your data fetching logic to get election details
    console.log(`Fetching details for election ID: ${id}`);
  }, [id]);

  const handleVote = () => {
    if (selectedOption) {
      // Replace with your vote submission logic (e.g., API call)
      setHasVoted(true);
      alert(`Thank you for voting for ${options.find(opt => opt.value === selectedOption)?.label}!`);
    } else {
      alert('Please select an option before voting.');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Vote for Election {id}</h2>
      <Form>
        <Form.Group>
          <Form.Label>Select your option:</Form.Label>
          {options.map((option) => (
            <Form.Check
              key={option.value}
              type="radio"
              id={option.value}
              label={option.label}
              value={option.value}
              checked={selectedOption === option.value}
              onChange={(e) => setSelectedOption(e.target.value)}
              disabled={hasVoted}
            />
          ))}
        </Form.Group>
      </Form>
      <div className="text-center mt-4">
        <Button
          variant="primary"
          onClick={handleVote}
          disabled={hasVoted}
        >
          {hasVoted ? "Vote Submitted" : "Submit Vote"}
        </Button>
      </div>
    </Container>
  );
}

export default VotePage;
