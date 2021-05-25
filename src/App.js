import "./App.css";
import {
  selectSealer,
  loadSealer,
  getElections,
} from "./features/chain/chainSlice";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect } from "react";
import Sealer from './components/Sealer';

function App() {
  const dispatch = useDispatch();
  const sealer = useSelector(selectSealer);
  //const votingAuthority = useSelector(selectVotingAuthority);
  const votingAuthority = process.env.REACT_APP_VA_URL;


  useEffect(() => {
    dispatch(loadSealer());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getElections(votingAuthority));
  }, [dispatch, votingAuthority]);


  return <div className="app dashboard">
    <Sealer sealer={sealer}></Sealer>
  </div>;
}

export default App;
