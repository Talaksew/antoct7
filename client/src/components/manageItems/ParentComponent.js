// ParentComponent.js
import React, { useState } from 'react';
import Users from './Users';

const ParentComponent = () => {
  const [link, setLink] = useState('initialLink');

  const setSelectedLink = (newLink) => {
    console.log('Selected link:', newLink); // Debugging
    setLink(newLink);
  };

  return <Users setSelectedLink={setSelectedLink} link={link} />;
};

export default ParentComponent;
