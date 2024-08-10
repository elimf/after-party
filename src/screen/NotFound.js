import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h3>404</h3>
      <div className='flex flex-col m-3 items-center'>
      <h6>The page you are looking for cannot be found</h6>
      <Link  className="leave-room-button text-white mt-20 w-2/12"  to="/">Go back to Home</Link>
      </div>
    </div>
  );
};

export default NotFound;
