import React, { useState, useEffect } from 'react';
import './CssFolder/createAgenda.css';
import { useAuth } from './AuthContext';

const CreateAgenda = () => {
  const [agendaItems, setAgendaItems] = useState([]);
  const [newAgendaItem, setNewAgendaItem] = useState('');
  const [newAgendaDate, setNewAgendaDate] = useState('');
  const [newAgendaEndDate, setNewAgendaEndDate] = useState('');
  const [newAgendaDescription, setNewAgendaDescription] = useState('');
  const [newOption, setNewOption] = useState('');
  const [selectedAgendaId, setSelectedAgendaId] = useState(null);
  const [editingAgendaId, setEditingAgendaId] = useState(null);
  const [editingAgenda, setEditingAgenda] = useState({
    name: '',
    start_date: '',
    end_date: '',
    description: ''
  });
  const [editingOptionId, setEditingOptionId] = useState(null);
  const [editingOptionValue, setEditingOptionValue] = useState('');
  const { isAuthenticated } = useAuth();
 

  useEffect(() => {
    if (isAuthenticated) {
      fetchAgendas();
    }
  }, [isAuthenticated]);

  const fetchAgendas = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/agendas/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const data = await response.json();
      setAgendaItems(data);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  const handleAddAgenda = async () => {
    if (
      newAgendaItem.trim() === '' ||
      newAgendaDate.trim() === '' ||
      newAgendaEndDate.trim() === '' ||
      newAgendaDescription.trim() === ''
    ) {
      alert('Please fill out all fields for the agenda item!');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/agendas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          name: newAgendaItem,
          start_date: newAgendaDate,
          end_date: newAgendaEndDate,
          description: newAgendaDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const data = await response.json();
      setAgendaItems([...agendaItems, data]);
      setNewAgendaItem('');
      setNewAgendaDate('');
      setNewAgendaEndDate('');
      setNewAgendaDescription('');
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  const handleEditOption = async () => {
    if (editingOptionValue.trim() === '') {
      alert('Please enter a new value for the option!');
      return;
    }
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/options/${editingOptionId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ 
          name: editingOptionValue
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
  
      const data = await response.json();
      setAgendaItems(
        agendaItems.map((item) =>
          item.id === data.agenda
            ? {
                ...item,
                options: item.options.map((option) =>
                  option.id === editingOptionId ? data : option
                ),
              }
            : item
        )
      );
      setEditingOptionId(null);
      setEditingOptionValue('');
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  const handleEditAgenda = async () => {
    if (
      editingAgenda.name.trim() === '' ||
      editingAgenda.start_date.trim() === '' ||
      editingAgenda.end_date.trim() === '' ||
      editingAgenda.description.trim() === ''
    ) {
      alert('Please fill out all fields for the agenda item!');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/agendas/${editingAgendaId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(editingAgenda),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const data = await response.json();
      setAgendaItems(
        agendaItems.map((item) =>
          item.id === editingAgendaId ? data : item
        )
      );
      setEditingAgendaId(null);
      setEditingAgenda({
        name: '',
        start_date: '',
        end_date: '',
        description: ''
      });
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  const handleRemoveAgenda = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/agendas/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      setAgendaItems(agendaItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  const handleAddOption = async () => {
    if (newOption.trim() === '' || selectedAgendaId === null) {
      alert('Please select an agenda item and enter an option!');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/options/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ name: newOption, agenda: selectedAgendaId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const data = await response.json();
      setAgendaItems((prevAgendaItems) =>
        prevAgendaItems.map((item) =>
          item.id === selectedAgendaId
            ? { ...item, options: [...item.options, data] }
            : item
        )
      );
      setNewOption('');
      setSelectedAgendaId(null); // Reset selected agenda after adding option
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  const handleRemoveOption = async (agendaId, optionId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/options/${optionId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      setAgendaItems((prevAgendaItems) =>
        prevAgendaItems.map((item) =>
          item.id === agendaId
            ? {
                ...item,
                options: item.options.filter((option) => option.id !== optionId),
              }
            : item
        )
      );
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Create Agenda</h2>
      <div className="card p-4">
        <h3 className="mb-3">Add New Agenda</h3>
        <div className="form-group">
          <label htmlFor="agendaName">Agenda Name</label>
          <input
            type="text"
            id="agendaName"
            className="form-control"
            value={newAgendaItem}
            onChange={(e) => setNewAgendaItem(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="agendaStartDate">Start Date</label>
          <input
            type="date"
            id="agendaStartDate"
            className="form-control"
            value={newAgendaDate}
            onChange={(e) => setNewAgendaDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="agendaEndDate">End Date</label>
          <input
            type="date"
            id="agendaEndDate"
            className="form-control"
            value={newAgendaEndDate}
            onChange={(e) => setNewAgendaEndDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="agendaDescription">Description</label>
          <textarea
            id="agendaDescription"
            className="form-control"
            rows="3"
            value={newAgendaDescription}
            onChange={(e) => setNewAgendaDescription(e.target.value)}
          />
        </div>
        <button className="btn btn-primary mt-2" onClick={handleAddAgenda}>
          Add Agenda
        </button>
      </div>
      <div className="card p-4 mt-4">
        <h3 className="mb-3">Add Option to Agenda</h3>
        <div className="form-group">
          <label htmlFor="selectAgenda">Select Agenda</label>
          <select
            id="selectAgenda"
            className="form-control"
            value={selectedAgendaId || ''}
            onChange={(e) => setSelectedAgendaId(Number(e.target.value))}
          >
            <option value="">Select an agenda</option>
            {agendaItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="optionName">Option Name</label>
          <input
            type="text"
            id="optionName"
            className="form-control"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
          />
        </div>
        <button className="btn btn-primary mt-2" onClick={handleAddOption}>
          Add Option
        </button>
      </div>
      <div className="card p-4 mt-4">
        <h3 className="mb-3">Agenda List</h3>
        {agendaItems.map((agenda) => (
          <div key={agenda.id} className="mb-4">
            <h4>{agenda.name}</h4>
            <p>
              <strong>Start Date:</strong> {agenda.start_date}
            </p>
            <p>
              <strong>End Date:</strong> {agenda.end_date}
            </p>
            <p>
              <strong>Description:</strong> {agenda.description}
            </p>
            <button
              className="btn btn-warning me-2"
              onClick={() => {
                setEditingAgendaId(agenda.id);
                setEditingAgenda({
                  name: agenda.name,
                  start_date: agenda.start_date,
                  end_date: agenda.end_date,
                  description: agenda.description,
                });
              }}
            >
              Edit Agenda
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleRemoveAgenda(agenda.id)}
            >
              Remove Agenda
            </button>
            {agenda.options.length > 0 && (
              <div className="mt-3">
                <h5>Options</h5>
                <ul>
                  {agenda.options.map((option) => (
                    <li key={option.id}>
                      {option.name}
                      <button
                        className="btn btn-warning btn-sm ms-2"
                        onClick={() => {
                          setEditingOptionId(option.id);
                          setEditingOptionValue(option.name);
                        }}
                      >
                        Edit Option
                      </button>
                      <button
                        className="btn btn-danger btn-sm ms-2"
                        onClick={() => handleRemoveOption(agenda.id, option.id)}
                      >
                        Remove Option
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      {editingAgendaId && (
        <div className="card p-4 mt-4">
          <h3 className="mb-3">Edit Agenda</h3>
          <div className="form-group">
            <label htmlFor="editAgendaName">Agenda Name</label>
            <input
              type="text"
              id="editAgendaName"
              className="form-control"
              value={editingAgenda.name}
              onChange={(e) => setEditingAgenda({ ...editingAgenda, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="editAgendaStartDate">Start Date</label>
            <input
              type="date"
              id="editAgendaStartDate"
              className="form-control"
              value={editingAgenda.start_date}
              onChange={(e) => setEditingAgenda({ ...editingAgenda, start_date: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="editAgendaEndDate">End Date</label>
            <input
              type="date"
              id="editAgendaEndDate"
              className="form-control"
              value={editingAgenda.end_date}
              onChange={(e) => setEditingAgenda({ ...editingAgenda, end_date: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="editAgendaDescription">Description</label>
            <textarea
              id="editAgendaDescription"
              className="form-control"
              rows="3"
              value={editingAgenda.description}
              onChange={(e) => setEditingAgenda({ ...editingAgenda, description: e.target.value })}
            />
          </div>
          <button className="btn btn-primary mt-2" onClick={handleEditAgenda}>
            Save Changes
          </button>
        </div>
      )}
      {editingOptionId && (
        <div className="card p-4 mt-4">
          <h3 className="mb-3">Edit Option</h3>
          <div className="form-group">
            <label htmlFor="editOptionValue">Option Value</label>
            <input
              type="text"
              id="editOptionValue"
              className="form-control"
              value={editingOptionValue}
              onChange={(e) => setEditingOptionValue(e.target.value)}
            />
          </div>
          <button className="btn btn-primary mt-2" onClick={handleEditOption}>
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateAgenda;
