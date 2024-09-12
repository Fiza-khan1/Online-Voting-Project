import React, { useEffect, useState } from 'react';
import './CssFolder/NotificationComponent.css'; // Adjust the path if needed
 // Import CSS for styling

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // WebSocket URL (adjust as needed)
    const socket = new WebSocket('ws://127.0.0.1:9000/ws/notification/');

    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received data:", data);

      if (data.type === 'new_vote_notification') {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          {
            message: data.message,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="notification-bar">
      <button className="notification-button" onClick={handleToggleDropdown}>
        Notifications ({notifications.length})
      </button>
      {showDropdown && (
        <div className="notification-dropdown">
          <ul>
            {notifications.length === 0 ? (
              <li>No notifications yet.</li>
            ) : (
              notifications.map((notification, index) => (
                <li key={index}>
                  <p>{notification.message}</p>
                  <small>{notification.timestamp}</small>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;
