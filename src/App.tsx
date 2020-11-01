import React, {useContext, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import {BowlingContext} from "./Providers/bowling-provider";

function App() {
  const {Points, IsSuccess} = React.useContext(BowlingContext);
  let cssClass ="";
  const listItems = Points.map((number,index) =>
      <li key={"id="+index}>{number[0]} -
      {number[1]}</li>
  );


  useEffect(()=>{
    cssClass ="updated"
},[Points])

  useEffect(()=>{
    if(IsSuccess === true){
      cssClass = "success";
    }else{
      cssClass = "failure"
    }
  },[IsSuccess])

  return (
    <div className={`App`}>
      <header className={`App-header ${IsSuccess ? "success": "failure"}`}>
        <img src={logo} className="App-logo" alt="logo" />
          <React.Fragment>
            <ul>
              {listItems}
            </ul>

          </React.Fragment>

      </header>
    </div>
  );
}

export default App;
