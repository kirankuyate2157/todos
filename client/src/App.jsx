import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "./components/ui/button";

function App() {
  return (
    <>
      <div className='bg-amber-600'>
        <div className='flex flex-col items-center justify-center '>
          <Button>Click me</Button>
        </div>
      </div>
    </>
  );
}

export default App;
