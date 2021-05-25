import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchResults, fetchPublicKeyShares, validatorKeysInserted, backendHealth, nodeIsRunning, chainSpecLoaded, sendAddress, getSealer, fetchChainSpec, startChainNode, insertValidatorKeys, getVotes, getVaUrl, triggerDkg, startTally, fetchAddresses, fetchWallet } from './api/index';

export const checkBackendRunning = createAsyncThunk('', async (sealer) => {
    let result = await backendHealth(sealer);
    console.log(result);
    return result;
});

export const triggerSendAddress = createAsyncThunk('chain/triggerSendAddress', async (sealerUrl) => {
    sendAddress(sealerUrl);
});

export const checkChainSpecLoaded = createAsyncThunk('chain/checkChainSpecLoaded', async (sealer) => {
    let result = await chainSpecLoaded(sealer);
    console.log(result);
    return result;
});

export const checkValidatorKeysInserted = createAsyncThunk('chain/checkValidatorKeysInserted', async (sealer) => {
    let result = await validatorKeysInserted(sealer);
    console.log(result);
    return {
        sealerName: sealer.name,
        keys: result.hasGrandpaKey && result.hasAuraKey
    };
});

export const checkNodeRunning = createAsyncThunk('chain/checkNodeRunning', async (sealer) => {
    let result = await nodeIsRunning(sealer);
    console.log(result);
    return result;
})

export const loadWalletForSealer = createAsyncThunk('chain/loadWalletForSealer', async (sealer) => {
    let result = await fetchWallet(sealer);
    console.log(result);
    let foundSealer = result.registeredSealers.find(s =>
        s.auraAddress === result.wallet.aura.address &&
        s.grandpaAddress === result.wallet.grandpa.address
    );
    return {
        sealerName: sealer.name,
        wallet: result.wallet,
        registeredWithVA: foundSealer ? true : false
    }
});

export const loadSealer = createAsyncThunk('chain/loadSealer', async () => {
    let result = await getSealer();
    return result;
});


export const triggerDkgForElection = createAsyncThunk('chain/triggerDkgForElection', async (payload) => {
    console.log('dkg action triggered with params:');
    console.log('sealer: ', payload.sealer.url)
    console.log('election: ', payload.electionId);
    let result = await triggerDkg(payload.sealer, payload.electionId);
    return result;
});

export const loadVotingAuthority = createAsyncThunk('chain/loadVotingAuthority', async () => {
    let result = await getVaUrl();
    return result;
});

export const loadChainSpecForSealer = createAsyncThunk('chain/loadChainSpecForSealer', async (sealer) => {
    let result = await fetchChainSpec(sealer);
    return result;
});

export const startChainNodeForSealer = createAsyncThunk('chain/startChainNodeForSealer', async (sealer) => {
    let result = await startChainNode(sealer);
    let result2 = await insertValidatorKeys(sealer);
    return { chain: result, keys: result2 }
});



export const tally = createAsyncThunk('chain/tally', async (payload) => {
    console.log('tallying');
    let result = await startTally(payload.sealer, payload.electionId);
    console.log(result);
    return result;
});

export const getElections = createAsyncThunk('elections/getElections', async (vaUrl) => {
    console.log('loading elections')
    let result = await getVotes(vaUrl);
    console.log(result)
    for await (const vote of result) {
        let shares = await fetchPublicKeyShares(vaUrl, vote.electionId);
        vote.shares = shares;
        let results = await fetchResults(vaUrl, vote.electionId);
        vote.results = results;
    }

    return result;
});



//a slice is a collection of redux reducer logic and actions for a single feature in the app
export const slice = createSlice({
    name: 'chain',
    initialState: {
        sealer: {},
        wallet: {},
        chain: {},
        keys: {},
        spec: {},
        elections: [],
        votingAuthority: '',
        registeredSealers: [],
        registeredWithVA: false,
        sealers: [],
        backendHealth: {},
        nodeIsRunning: false,
        keysInserted: false,
    },
    reducers: {
        setSealer: (state, action) => {
            state.sealer = action.payload;
        }
    },
    extraReducers: {
        [checkValidatorKeysInserted.fulfilled]: (state, action) => {
            state.keysInserted = action.payload;
        },
        [checkBackendRunning.fulfilled]: (state, action) => {
            state.backendHealth = action.payload.health;
        },
        [checkNodeRunning.fulfilled]: (state, action) => {
            state.nodeIsRunning = action.payload.nodeUp;
        },
        [checkChainSpecLoaded.fulfilled]: (state, action) => {
            state.spec = action.payload.response;

        },
        [loadSealer.fulfilled]: (state, action) => {
            state.sealer = action.payload;
        },
        [loadVotingAuthority.fulfilled]: (state, action) => {
            state.votingAuthority = action.payload;
        },
        [getElections.fulfilled]: (state, action) => {
            state.elections = action.payload;
        },
        [loadChainSpecForSealer.fulfilled]: (state, action) => {
            state.spec = action.payload.response;
        },
        [startChainNodeForSealer.fulfilled]: (state, action) => {
            state.chain = action.payload.chain;
            state.keys = action.payload.keys;
        },
        [loadWalletForSealer.fulfilled]: (state, action) => {
            state.wallet = action.payload.wallet;
            state.registeredWithVA = action.payload.registeredWithVA;

        }
    }
})

export const { setSealers } = slice.actions;


export const selectSealers = state => state.chain.sealers;
export const selectSealer = state => state.chain.sealer;
export const selectVotingAuthority = state => state.chain.votingAuthority;
export const selectElections = state => state.chain.elections;
export default slice.reducer;