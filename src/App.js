import React,{useState,useEffect} from 'react';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import ContestDetails from './components/contestdetails/ContestDetails';
import Home from './components/home/Home';


const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/contest/:id" element={<ContestDetails/>}/>
      </Routes> 
    </Router>
  );
}

export default App;
