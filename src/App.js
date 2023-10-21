import AppRouter from './router/AppRouter';
import {NextUIProvider} from "@nextui-org/react";
import { SocketProvider } from './context/SocketContex';


function App() {


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

