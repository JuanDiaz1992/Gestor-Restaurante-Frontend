import AppRouter from './router/AppRouter';
import { useEffect } from "react"
import {NextUIProvider} from "@nextui-org/react";




function App() {
  useEffect(()=>{
    document.title = "Restaurante Casandra"
  },[])


  return (
    <div className="App">
        <NextUIProvider>
          <AppRouter />
        </NextUIProvider>
    </div>
  );
}

export default App;

