import React from 'react';

const TestLogin = () => {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Admin Login Test</h1>
      <p>This is a test component to check if routing works.</p>
      <form>
        <input type="email" placeholder="Email" style={{ margin: '10px', padding: '10px' }} />
        <br />
        <input type="password" placeholder="Password" style={{ margin: '10px', padding: '10px' }} />
        <br />
        <button type="submit" style={{ margin: '10px', padding: '10px 20px' }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default TestLogin;
