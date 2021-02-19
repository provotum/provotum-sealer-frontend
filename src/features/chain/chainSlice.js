import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sendAddress, getSealers, fetchChainSpec, startChainNode, insertValidatorKeys, getVotes, getVaUrl, triggerDkg } from './api/index';

export const triggerSendAddress = createAsyncThunk('chain/triggerSendAddress', async (sealerUrl) => {
    sendAddress(sealerUrl);
});

export const loadSealers = createAsyncThunk('chain/loadSealers', async () => {
    let result = await getSealers();
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
    return result;
});

export const insertValidatorKeysForSealer = createAsyncThunk('chain/insertValidatorKeysForSealer', async (sealer) => {
    console.log('sending val keys')
    let result = await insertValidatorKeys(sealer);
    return result;
});

export const getElections = createAsyncThunk('chain/getElections', async (vaUrl) => {
    let result = await getVotes(vaUrl);
    return result;
});



//a slice is a collection of redux reducer logic and actions for a single feature in the app
export const slice = createSlice({
    name: 'chain',
    initialState: {
        sealers: [],
        elections: [],
        votingAuthority: '',
    },
    reducers: {
        setSealers: (state, action) => {
            state.sealers = action.payload;
        }
    },
    extraReducers: {
        [loadSealers.fulfilled]: (state, action) => {
            state.sealers = action.payload;
        },
        [loadVotingAuthority.fulfilled]: (state, action) => {
            state.votingAuthority = action.payload;
        },
        [getElections.fulfilled]: (state, action) => {
            state.elections = action.payload;
        },
        [loadChainSpecForSealer.fulfilled]: (state, action) => {
            state.sealers.find(s => s.name === action.payload.sealerName).spec = action.payload.response;
        },
        [startChainNodeForSealer.fulfilled]: (state, action) => {
            state.sealers.find(s => s.name === action.payload.sealerName).chain = action.payload.response;
        },
        [insertValidatorKeysForSealer.fulfilled]: (state, action) => {
            state.sealers.find(s => s.name === action.payload.sealerName).keys = action.payload.response;
        }
    }
})

export const { setSealers } = slice.actions;


export const selectSealers = state => state.chain.sealers;
export const selectVotingAuthority = state => state.chain.votingAuthority;
export const selectElections = state => state.chain.elections;
export default slice.reducer;