import React, { useState } from 'react';

const CreateRoom = ({ onCreateRoom }) => {
  const [room, setRoom] = useState('');

  const handleCreateRoom = () => {
    onCreateRoom(room);
    setRoom(''); // Clear the input field after creating the room
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter room name"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <button onClick={handleCreateRoom}>Create Room</button>
    </div>
  );
};

export default CreateRoom;
