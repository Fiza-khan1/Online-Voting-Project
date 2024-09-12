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
      const response = await fetch(`http://127.0.0.1:8000/agendas/${editingAgendaId}/edit/`, {
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
      const response = await fetch(`http://127.0.0.1:8000/agendas/${id}/delete/`, {
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

  const handleEditOption = async () => {
    if (editingOptionValue.trim() === '') {
      alert('Please enter a new value for the option!');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/options/${editingOptionId}/edit/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ name: editingOptionValue }),
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

  const handleRemoveOption = async (agendaId, optionId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/options/${optionId}/delete/`, {
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
            value={newAgendaDescription}
            onChange={(e) => setNewAgendaDescription(e.target.value)}
          />
        </div>
        <button className="btn btn-primary mt-2" onClick={handleAddAgenda}>
          Add Agenda
        </button>
      </div>

      <div className="card p-4 mt-4">
        <h3 className="mb-3">Agenda List</h3>
        {agendaItems.map((agenda) => (
          <div key={agenda.id} className="agenda-item">
            <h4>{agenda.name}</h4>
            <p>
              {agenda.start_date} to {agenda.end_date}
            </p>
            <p>{agenda.description}</p>
            <button
              className="btn btn-secondary mr-2"
              onClick={() => {
                setEditingAgendaId(agenda.id);
                setEditingAgenda({
                  name: agenda.name,
                  start_date: agenda.start_date,
                  end_date: agenda.end_date,
                  description: agenda.description
                });
              }}
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleRemoveAgenda(agenda.id)}
            >
              Delete
            </button>
            <div className="form-group mt-3">
              <label htmlFor={`option-${agenda.id}`}>Add Option</label>
              <input
                type="text"
                id={`option-${agenda.id}`}
                className="form-control"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
              />
              <button
                className="btn btn-primary mt-2"
                onClick={() => {
                  setSelectedAgendaId(agenda.id);
                  handleAddOption();
                }}
              >
                Add Option
              </button>
            </div>
            <ul className="list-group mt-3">
              {agenda.options.map((option) => (
                <li key={option.id} className="list-group-item">
                  {option.name}
                  <button
                    className="btn btn-secondary btn-sm ml-2"
                    onClick={() => {
                      setEditingOptionId(option.id);
                      setEditingOptionValue(option.name);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm ml-2"
                    onClick={() => handleRemoveOption(agenda.id, option.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {editingAgendaId && (
        <div className="card p-4 mt-4">
          <h3>Edit Agenda</h3>
          <div className="form-group">
            <label htmlFor="editAgendaName">Agenda Name</label>
            <input
              type="text"
              id="editAgendaName"
              className="form-control"
              value={editingAgenda.name}
              onChange={(e) =>
                setEditingAgenda({ ...editingAgenda, name: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="editAgendaStartDate">Start Date</label>
            <input
              type="date"
              id="editAgendaStartDate"
              className="form-control"
              value={editingAgenda.start_date}
              onChange={(e) =>
                setEditingAgenda({ ...editingAgenda, start_date: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="editAgendaEndDate">End Date</label>
            <input
              type="date"
              id="editAgendaEndDate"
              className="form-control"
              value={editingAgenda.end_date}
              onChange={(e) =>
                setEditingAgenda({ ...editingAgenda, end_date: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="editAgendaDescription">Description</label>
            <textarea
              id="editAgendaDescription"
              className="form-control"
              value={editingAgenda.description}
              onChange={(e) =>
                setEditingAgenda({ ...editingAgenda, description: e.target.value })
              }
            />
          </div>
          <button className="btn btn-primary mt-2" onClick={handleEditAgenda}>
            Save Changes
          </button>
        </div>
      )}

      {editingOptionId && (
        <div className="card p-4 mt-4">
          <h3>Edit Option</h3>
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
