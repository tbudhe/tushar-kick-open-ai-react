import React from 'react';
import Profile from './profile';
import ContactPage from './contact';

const UserHub: React.FC = () => {
  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <section>
        <h1 style={{ margin: '0 0 8px', fontSize: '1.5rem', color: '#1a2f42' }}>Contact</h1>
        <p style={{ margin: 0, color: '#5b7288', fontSize: '0.95rem' }}>
          Share your requirements, verify identity, and contact support from one place.
        </p>
      </section>
      <Profile />
      <ContactPage />
    </div>
  );
};

export default UserHub;
