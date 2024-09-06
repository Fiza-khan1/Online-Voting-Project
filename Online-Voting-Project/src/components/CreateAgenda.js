import React, { useState } from 'react';
import './CssFolder/createAgenda.css';

const CreateAgenda = () => {
  const [agendaItems, setAgendaItems] = useState([]);
  const [newAgendaItem, setNewAgendaItem] = useState('');
  const [newOption, setNewOption] = useState('');
  const [selectedAgendaId, setSelectedAgendaId] = useState(null);
  const [editingOption, setEditingOption] = useState(null);

  // Function to handle adding a new agenda item
  const handleAddAgenda = () => {
    if (newAgendaItem.trim() === '') {
      alert('Please enter an agenda item!');
      return;
    }
    setAgendaItems([
      ...agendaItems,
      { id: Date.now(), name: newAgendaItem, options: [] }
    ]);
    setNewAgendaItem('');
  };

  // Function to handle adding a new option to an agenda
  const handleAddOption = () => {
    if (newOption.trim() === '' || selectedAgendaId === null) {
      alert('Please select an agenda item and enter an option!');
      return;
    }
    setAgendaItems(agendaItems.map(item =>
      item.id === selectedAgendaId
        ? { ...item, options: [...item.options, { id: Date.now(), name: newOption }] }
        : item
    ));
    setNewOption('');
  };

  // Function to handle removing an agenda item
  const handleRemoveAgenda = (id) => {
    setAgendaItems(agendaItems.filter(item => item.id !== id));
  };

  // Function to handle removing an option from an agenda
  const handleRemoveOption = (agendaId, optionId) => {
    setAgendaItems(agendaItems.map(item =>
      item.id === agendaId
        ? { ...item, options: item.options.filter(option => option.id !== optionId) }
        : item
    ));
  };

  // Function to handle editing an option
  const handleEditOption = async (agendaId, optionId, newOptionName) => {
    // Find the agenda by its ID to get the agenda name
    const agendaItem = agendaItems.find(item => item.id === agendaId);
  
    // If the agenda is not found, handle the error
    if (!agendaItem) {
      alert('Agenda item not found!');
      return;
    }
  
    try {
      const response = await fetch(`/api/edit-option`, {
        method: 'PUT', // Use the appropriate method based on your API
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agenda: agendaItem.name,   // Send the agenda name instead of ID
          option_id: optionId,
          new_option_name: newOptionName
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Edit successful:', data);
      // Update state accordingly if needed
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };
  
  
  
  return (
    <div className="create-agenda">
      <h1>Create Agenda</h1>

      {/* Form to add a new agenda item */}
      <div className="agenda-form">
        <input
          type="text"
          value={newAgendaItem}
          onChange={(e) => setNewAgendaItem(e.target.value)}
          placeholder="Enter new agenda item"
        />
        <button onClick={handleAddAgenda}>Add Agenda</button>
      </div>

      {/* Form to add a new option to the selected agenda */}
      {agendaItems.length > 0 && (
        <div className="option-form">
          <select onChange={(e) => setSelectedAgendaId(Number(e.target.value))}>
            <option value="">Select Agenda</option>
            {agendaItems.map(item => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder="Enter new option"
          />
          <button onClick={handleAddOption}>Add Option</button>
        </div>
      )}

      {/* List of agenda items */}
      <div className="agenda-list">
        {agendaItems.length === 0 ? (
          <p>No agenda items added.</p>
        ) : (
          <ul>
            {agendaItems.map(item => (
              <li key={item.id} className="agenda-item">
                <div className="agenda-item-header">
                  <h3>{item.name}</h3>
                  <button onClick={() => handleRemoveAgenda(item.id)} className="remove-btn">✖</button>
                </div>

                {/* List of options for each agenda item */}
                <div className="option-list">
                  {item.options.length === 0 ? (
                    <p>No options available.</p>
                  ) : (
                    <ul>
                      {item.options.map(option => (
                        <li key={option.id} className="option-item">
                          <span>{option.name}</span>
                          <button onClick={() => handleRemoveOption(item.id, option.id)} className="remove-btn">✖</button>
                          <button onClick={() => setEditingOption({ agendaId: item.id, optionId: option.id, name: option.name })}>
                            Edit
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit option form */}
      {editingOption && (
        <div className="edit-option">
          <h2>Edit Option</h2>
          <input
            type="text"
            value={editingOption.name}
            onChange={(e) => setEditingOption({ ...editingOption, name: e.target.value })}
            placeholder="Enter new option name"
          />
          <button onClick={() => handleEditOption(editingOption.agendaId, editingOption.optionId, editingOption.name)}>
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateAgenda;
