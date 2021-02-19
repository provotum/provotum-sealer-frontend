import './App.css';
import { selectSealers, triggerSendAddress, loadSealers, loadChainSpecForSealer, startChainNodeForSealer, insertValidatorKeysForSealer, selectVotingAuthority, getElections, selectElections, triggerDkgForElection } from './features/chain/chainSlice';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react'

function App() {

  const dispatch = useDispatch();
  const sealers = useSelector(selectSealers);
  //const votingAuthority = useSelector(selectVotingAuthority);
  const votingAuthority = process.env.REACT_APP_VA_URL
  const elections = useSelector(selectElections);
  const dispatchSendAddress = (sealer) => {
    dispatch(triggerSendAddress(sealer));
  }
  const dispatchGetChainSpec = (sealer) => {
    dispatch(loadChainSpecForSealer(sealer));
  }
  const dispatchStartChainNode = (sealer) => {
    dispatch(startChainNodeForSealer(sealer));
  }
  const dispatchValidatorKeys = (sealer) => {
    dispatch(insertValidatorKeysForSealer(sealer));
  }
  const dispatchDkg = (sealer, electionId) => {
    console.log(sealer.url, electionId);
    dispatch(triggerDkgForElection({ sealer: sealer, electionId: electionId }));
  }

  useEffect(() => {
    dispatch(loadSealers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getElections(votingAuthority));
  }, [dispatch, votingAuthority]);

  const getMapValues = (spec) => {
    let list = Object.entries(spec).map(s => {
      return { key: s[0], value: String(s[1]) }
    });
    return list;
  }

  const renderSpec = (sealer) => getMapValues(sealer.spec).map(t => (
    <div key={t.key} className="spec">
      <div><p variant="body1">{t.key}: {t.value}</p></div>
    </div>
  ));
  const renderChain = (sealer) => getMapValues(sealer.chain).map(t => (
    <div key={t.key} className="spec">
      <div><p variant="body1">{t.key}: {t.value}</p></div>
    </div>
  ));

  const sendWalletButtons = () => sealers.map(s => (
    <div>
      <h1>Sealer</h1>
      <p>name: {s.name}</p>
      <p>address: {s.url}</p>
      <h2>Status</h2>

      <h2>spec</h2>
      {renderSpec(s)}
      <h2>chain</h2>
      {renderChain(s)}
      <h2>actions</h2>
      <button onClick={() => { dispatchSendAddress(s) }}>send adress to VA</button>
      <button onClick={() => { dispatchGetChainSpec(s) }}>get chain spec</button>
      <button onClick={() => { dispatchStartChainNode(s) }}>start chain node</button>
      <button onClick={() => { dispatchValidatorKeys(s) }}>insert validator keys</button>
      {renderElections(s)}
    </div>
  ));

  const renderElections = (sealer) => elections.map(e => (
    <div key={e.electionId}>
      <h3>{e.title}</h3>
      <p>{e.electionId}</p>
      <p>phase: {e.phase}</p>
      <button onClick={() => { dispatchDkg(sealer, e.electionId) }}>create and store public key on the bc</button>
    </div>
  ));

  return (
    <div className="App">
      {sendWalletButtons()}

    </div>
  );
}

export default App;
