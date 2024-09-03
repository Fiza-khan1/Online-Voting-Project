import React, { useState } from 'react';
import './CssFolder/createAgenda.css';

const CreateAgenda = () => {
  const [agendaItems, setAgendaItems] = useState([]);
  const [newAgendaItem, setNewAgendaItem] = useState('');
  const [newOption, setNewOption] = useState('');
  const [selectedAgendaId, setSelectedAgendaId] = useState(null);

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

  const handleRemoveAgenda = (id) => {
    setAgendaItems(agendaItems.filter(item => item.id !== id));
  };

  const handleRemoveOption = (agendaId, optionId) => {
    setAgendaItems(agendaItems.map(item =>
      item.id === agendaId
        ? { ...item, options: item.options.filter(option => option.id !== optionId) }
        : item
    ));
  };

  return (
    <div className="create-agenda">
      <h1>Create Agenda</h1>
      <div className="agenda-form">
        <input
          type="text"
          value={newAgendaItem}
          onChange={(e) => setNewAgendaItem(e.target.value)}
          placeholder="Enter new agenda item"
        />
        <button onClick={handleAddAgenda}>Add Agenda</button>
      </div>
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
                <div className="option-list">
                  {item.options.length === 0 ? (
                    <p>No options available.</p>
                  ) : (
                    <ul>
                      {item.options.map(option => (
                        <li key={option.id} className="option-item">
                          <span>{option.name}</span>
                          <button onClick={() => handleRemoveOption(item.id, option.id)} className="remove-btn">✖</button>
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
    </div>
  );
};

export default CreateAgenda;
