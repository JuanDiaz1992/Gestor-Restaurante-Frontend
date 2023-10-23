import React, { createContext, useState, useEffect } from 'react';

import io from 'socket.io-client';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);


  useEffect(() => {
    const socket = io('http://192.168.1.159:4000');
    setSocket(socket);

    return () => socket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
