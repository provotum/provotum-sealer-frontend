import "./App.css";
import {
  selectSealers,
  triggerSendAddress,
  loadSealers,
  loadChainSpecForSealer,
  startChainNodeForSealer,
  insertValidatorKeysForSealer,
  selectVotingAuthority,
  getElections,
  selectElections,
  triggerDkgForElection,
  tally,
  loadRegisteredSealers
} from "./features/chain/chainSlice";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect } from "react";
import Sealer from './components/Sealer';

function App() {
  const dispatch = useDispatch();
  const sealers = useSelector(selectSealers);
  //const votingAuthority = useSelector(selectVotingAuthority);
  const votingAuthority = process.env.REACT_APP_VA_URL;


  useEffect(() => {
    dispatch(loadSealers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getElections(votingAuthority));
  }, [dispatch, votingAuthority]);

  const renderSealers = () => {
    return sealers.map(s => (
      <Sealer sealer={s} key={s.name}></Sealer>
    ));
  }


  return <div className="app">{renderSealers()}</div>;
}

export default App;
