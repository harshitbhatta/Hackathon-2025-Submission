import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MainPage from './Pages/MainPage'
import VisualsPage from './Pages/VisualsPage'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [count, setCount] = useState(0)
  return(
    <>
      <BrowserRouter>
        <Routes>
          <Route index element = {<MainPage />} />
          <Route path="/visuals" element = {<VisualsPage />} />
        </Routes>
      </BrowserRouter>
      
    </>
    
  )
}

export default App
