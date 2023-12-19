import React, { createContext, useState, useEffect } from 'react';

import io from 'socket.io-client';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const url = process.env.REACT_APP_URL_HOST_NODE;
  useEffect(() => {
    const socket = io(url);
    setSocket(socket);

    return () => socket.disconnect();
  }, [url]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
