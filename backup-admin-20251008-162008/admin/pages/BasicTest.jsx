import React from 'react';

const BasicTest = () => {
  console.log('BasicTest component is rendering');
  
  return (
    <div style={{ 
      padding: '50px', 
      background: 'red', 
      color: 'white',
      fontSize: '24px',
      textAlign: 'center'
    }}>
      <h1>BASIC TEST - ADMIN LOGIN PAGE</h1>
      <p>If you can see this red page, the routing works!</p>
      <p>Current URL: {window.location.pathname}</p>
    </div>
  );
};

export default BasicTest;
