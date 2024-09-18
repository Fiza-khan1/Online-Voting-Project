import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.js';
import { formatDistanceToNow } from 'date-fns'; // For formatting timestamps
import { Link } from 'react-router-dom';
import './CssFolder/NotificationsPage.css'; // Custom CSS for styling

function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://127.0.0.1:8000/notifications/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications); // Adjust based on API response
        } else {
          console.error('Failed to fetch notifications:', await response.json());
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <div key={index} className="notification-item">
            {notification.profilePicture ? (
              <img
                src={notification.profilePicture}
                alt="Profile"
                className="notification-profile-picture"
              />
            ) : (
              <div className="notification-avatar">
                {notification.avatarLetter}
              </div>
            )}
            <div className="notification-content">
              <div className="notification-message">
                <strong>{notification.username}</strong>
                {notification.message.replace(notification.username, '')}
              </div>
              {notification.timestamp && (
                <span className="notification-timestamp">
                  {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                </span>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No notifications</p>
      )}
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default NotificationsPage;
