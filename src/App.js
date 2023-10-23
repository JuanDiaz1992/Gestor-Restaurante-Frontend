import AppRouter from './router/AppRouter';
import { useEffect } from "react"
import {NextUIProvider} from "@nextui-org/react";
import { SocketProvider } from './context/SocketContex';



function App() {
  useEffect(()=>{
    document.title = "Restaurante Casandra"
  },[])


  return (
    <div className="App">
      <SocketProvider>
        <NextUIProvider>
          <AppRouter />
        </NextUIProvider>
      </SocketProvider>
    </div>
  );
}

export default App;

