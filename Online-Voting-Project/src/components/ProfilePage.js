import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Import AuthContext
import './CssFolder/profile.css'; // Import your custom CSS

const UserProfile = () => {
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState({
    profile_picture: '',
    username: '',
    email: '',
    bio: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const fetchProfile = async () => {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    try {
      const response = await fetch('http://127.0.0.1:8000/profile/', {
        headers: {
          'Authorization': `Token ${token}`, // Include token in request headers
        },
      });

      if (response.ok) {
        const profileData = await response.json();
        console.log('Fetched profile data:', profileData);
        setUser(profileData);
        setFormData(profileData);

        // Store user's name in localStorage
        localStorage.setItem('username', profileData.username);
      } else {
        console.error('Failed to fetch profile:', await response.json());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value, // Handle file input
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    const dataToUpdate = new FormData();

    dataToUpdate.append('bio', formData.bio);
    if (formData.profile_picture instanceof File) {
      dataToUpdate.append('profile_picture', formData.profile_picture);
    }
    dataToUpdate.append('email', formData.email);
    dataToUpdate.append('user', user.id); // Include the user ID

    try {
      const response = await fetch('http://127.0.0.1:8000/profile/', {
        method: 'PUT', // Assuming you are updating the profile
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: dataToUpdate,
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setUser(updatedProfile);
        setIsEditing(false);

        // Update the stored user's name in localStorage
        localStorage.setItem('username', updatedProfile.username);
      } else {
        const errorText = await response.text();
        console.error('Failed to update profile:', errorText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <div className="profile-card">
        <img
          src={user.profile_picture ? `http://127.0.0.1:8000${user.profile_picture}` : 'https://picsum.photos/id/870/200/300?grayscale&blur=2'}
          alt="Profile"
          className="profile-img"
          onError={(e) => e.target.src = 'https://picsum.photos/id/870/200/300?grayscale&blur=2'} // Fallback image in case of error
        />
        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="profile_picture">Profile Picture</label>
              <input
                type="file"
                id="profile_picture"
                name="profile_picture"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">Cancel</button>
          </form>
        ) : (
          <div className="profile-info">
            <h2 className="profile-username">{user.username}</h2>
            <p className="profile-email">{user.email || 'No email provided'}</p>
            <p className="profile-bio">{user.bio || 'No bio available'}</p>
            <button onClick={() => setIsEditing(true)} className="btn btn-primary">Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
