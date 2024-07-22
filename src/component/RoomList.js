import React from 'react';

const RoomList = ({ rooms, onJoinRoom }) => {
  return (
    <div>
      <h2>Available Rooms</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            {room.name} <button onClick={() => onJoinRoom(room.id)}>Join Room</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
