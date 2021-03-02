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
    loadRegisteredSealers,
    loadWalletForSealer,
    checkChainSpecLoaded,
    checkNodeRunning,
    checkBackendRunning
} from "./../features/chain/chainSlice";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect } from "react";

function Sealer(props) {
    const dispatch = useDispatch();
    let sealer = props.sealer;

    useEffect(async () => {
        console.log('checking backend health');
        dispatch(checkBackendRunning(sealer));
    }, [dispatch]);

    useEffect(async () => {
        console.log('loading sealer wallet for: ', sealer.name);
        dispatch(loadWalletForSealer(sealer));
    }, [dispatch]);

    useEffect(async () => {
        console.log('checking if chain spec loaded');
        dispatch(checkChainSpecLoaded(sealer));
    }, [dispatch]);

    useEffect(async () => {
        console.log('checking if chain sealer node is running');
        dispatch(checkNodeRunning(sealer));
    }, [dispatch]);





    const elections = useSelector(selectElections);
    const dispatchSendAddress = (sealer) => {
        dispatch(triggerSendAddress(sealer));
    };
    const dispatchGetChainSpec = (sealer) => {
        dispatch(loadChainSpecForSealer(sealer));
    };
    const dispatchStartChainNode = (sealer) => {
        dispatch(startChainNodeForSealer(sealer));
    };
    const dispatchValidatorKeys = (sealer) => {
        dispatch(insertValidatorKeysForSealer(sealer));
    };

    const dipatchTally = (sealer, electionId) => {
        dispatch(tally({ sealer: sealer, electionId: electionId }));
    };
    const dispatchDkg = (sealer, electionId) => {
        console.log(sealer.url, electionId);
        dispatch(triggerDkgForElection({ sealer: sealer, electionId: electionId }));
    };

    const getMapValues = (spec) => {
        let list = Object.entries(spec).map((s) => {
            return { key: s[0], value: String(s[1]) };
        });
        return list;
    };

    const renderSpec = (sealer) =>
        getMapValues(sealer.spec).map((t) => (
            <div key={t.key} className="spec">
                <div>
                    <p variant="body1">
                        {t.key}: {t.value}
                    </p>
                </div>
            </div>
        ));
    const renderChain = (sealer) =>
        getMapValues(sealer.chain).map((t) => (
            <div key={t.key} className="spec">
                <div>
                    <p variant="body1">
                        {t.key}: {t.value}
                    </p>
                </div>
            </div>
        ));

    const renderElections = (sealer) =>
        elections.map((e) => (
            <div className="election" key={e.electionId}>
                <h3>{e.title}</h3>
                <p>{e.electionId}</p>
                <p>phase: {e.phase}</p>
                <button
                    onClick={() => {
                        dispatchDkg(sealer, e.electionId);
                    }}
                >
                    create and store public key on the bc
        </button>
                <button
                    onClick={() => {
                        dipatchTally(sealer, e.electionId);
                    }}
                >
                    tally
        </button>
            </div>
        ));

    return (
        <div className="sealer">
            <div className="section">
                <div className="section-title">Sealer</div>
                <div className="section-content">
                    <p>name: {sealer.name}</p>
                    <p>address: {sealer.url}</p>
                    <h2>Status</h2>
                </div>
            </div>
            {sealer.backendHealth.health === 'up' ? (
                <div className="section">
                    <div className="section-title">Bootstrap</div>
                    <div className="section-content">
                        {!sealer.registeredWithVA ?
                            (<button
                                onClick={() => {
                                    dispatchSendAddress(sealer);
                                }}
                            >
                                send adress to VA
                            </button>) : (<p>registered with VA</p>)}
                        {!sealer.spec.name ? (
                            <button
                                onClick={() => {
                                    dispatchGetChainSpec(sealer);
                                }}
                            >
                                get chain spec
                            </button>
                        ) : (
                            <p>spec loaded</p>
                        )}
                        {!sealer.nodeIsRunning ? (
                            <button
                                onClick={() => {
                                    dispatchStartChainNode(sealer);
                                }}
                            >
                                start chain node
                            </button>
                        ) : (
                            <p>node running</p>
                        )}

                        <button
                            onClick={() => {
                                dispatchValidatorKeys(sealer);
                            }}
                        >
                            insert validator keys
            </button>
                    </div>
                </div>
            ) : (
                <p>backend offline</p>
            )}

            <div className="section"></div>
            <h2>spec</h2>
            {renderSpec(sealer)}
            <h2>chain</h2>
            {renderChain(sealer)}
            <h2>actions</h2>
            <div className="elections">{renderElections(sealer)}</div>
        </div>
    );
}

export default Sealer;
