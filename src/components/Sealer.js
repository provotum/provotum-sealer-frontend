import {
    startChainNodeForSealer,
    selectElections,
    triggerDkgForElection,
    tally,
    selectSealer,
    loadWalletForSealer,
    checkChainSpecLoaded,
    checkNodeRunning,
    checkBackendRunning,
    checkValidatorKeysInserted
} from "./../features/chain/chainSlice";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect } from "react";
import { Typography, Button, Card, CardContent } from '@material-ui/core';


function Sealer() {
    const dispatch = useDispatch();
    let sealer = useSelector(selectSealer);
    const elections = useSelector(selectElections);

    useEffect(async () => {
        console.log('checking backend health');
        dispatch(checkBackendRunning(sealer));
    }, [dispatch]);

    useEffect(async () => {
        console.log('loading sealer wallet for: ', sealer.name);
        dispatch(loadWalletForSealer(sealer));
    }, [dispatch]);


    useEffect(async () => {
        console.log('checking if chain sealer node is running');
        dispatch(checkNodeRunning(sealer));
    }, [dispatch]);




    const dispatchStartChainNode = (sealer) => {
        dispatch(startChainNodeForSealer(sealer));
    };

    const dipatchTally = (sealer, electionId) => {
        dispatch(tally({ sealer: sealer, electionId: electionId }));
    };
    const dispatchDkg = (sealer, electionId) => {
        console.log(sealer.url, electionId);
        dispatch(triggerDkgForElection({ sealer: sealer, electionId: electionId }));
    };

    const voteHasOpenTask = (vote) => {
        if (vote.phase === 'Voting') return false;
        //if (vote.results.length > 0) return false;
        return true;
        //return vote.phase !== 'Voting' || !vote.results
    }

    const renderElections = (sealer) =>
        elections.filter(e => voteHasOpenTask(e)).map((e) => (
            <div className="election" key={e.electionId}>
                <div>
                    <h3>{e.title}</h3>
                    <p>{e.phase}</p>
                </div>
                <div>
                    {e.phase === 'Tallying' && (
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={() => {
                                dipatchTally(sealer, e.electionId);
                            }}
                        >
                            tally
                        </Button>
                    )}
                    {e.phase === 'DistributedKeyGeneration' && (
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={() => {
                                dispatchDkg(sealer, e.electionId);
                            }}
                        >
                            Generate Key
                        </Button>
                    )}
                </div>



            </div>
        ));

    return (
        <div className="module sealer">
            <div className="module-header">
                <div className="sealer-title">
                    {sealer.name}'s Dashboard
                </div>
            </div>
            <div className="module-content">
                <div className="section-content">

                    {!sealer.nodeIsRunning ? (
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={() => {
                                dispatchStartChainNode(sealer);
                            }}
                        >
                            start chain node
                        </Button>
                    ) : null}


                </div>
            </div>

            <div className="elections">{renderElections(sealer)}</div>
        </div>
    );
}

export default Sealer;
