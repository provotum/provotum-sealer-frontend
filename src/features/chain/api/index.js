
const axios = require('axios').default;

export const distributedKeyGeneration = (sealerUrl) => {
    console.log('starting DKG!')
    axios.post(`${sealerUrl}/dkg`);
}

export const sendAddress = (sealer) => {
    console.log(sealer.url);
    axios.post(`${sealer.url}/wallet`)
        .then(function (response) {
            // handle success
            console.log(response);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
            console.log('done');
        });

}

export const getSealers = async () => {
    return [
        {
            url: process.env.REACT_APP_SEALER_1_URL,
            name: 'bob',
            spec: {},
            chain: {},
            keys: {},
            chainNodeRunning: false,
            specLoaded: false,
            backendOnline: false,
        },
        {
            url: process.env.REACT_APP_SEALER_2_URL,
            name: 'max',
            spec: {},
            chain: {},
            keys: {},
            chainNodeRunning: false,
            specLoaded: false,
            backendOnline: false,
        }
    ]
}

export const getVaUrl = async () => {
    return process.env.REACT_APP_VA_URL
}

export const getVotes = async (vaUrl) => {
    console.log('fetching votes');
    try {
        let response = await axios.get(`${vaUrl}/votes`);
        console.log(response);
        return response.data;
    } catch (e) {
        console.log(e);
        return []
    }
}

export const triggerDkg = async (sealer, electionId) => {
    console.log('doing dkg for election: ', electionId);
    try {
        let response = await axios.post(`${sealer.url}/dkg`, { voteId: electionId });
        console.log(response);
    } catch (e) {
        console.log(e);
    }
}

export const fetchChainSpec = async (sealer) => {
    let response = await axios.post(`${sealer.url}/bootstrap/chain-spec`);
    return {
        sealerName: sealer.name,
        response: response.data,
    };
}

export const startChainNode = async (sealer) => {
    try {
        let response = await axios.post(`${sealer.url}/bootstrap/chain/bootnode?restart=false`);
        console.log(response)
        return {
            sealerName: sealer.name,
            response: response.data,
        }
    } catch (e) {
        console.log(e)
    }

}

export const insertValidatorKeys = async (sealer) => {
    console.log('inserting validator keys')
    let response = await axios.post(`${sealer.url}/bootstrap/validators`);
    console.log(response.data)
    return {
        sealerName: sealer.name,
        response: response.data,
    }
}

export const startTally = async (sealer, electionId) => {
    console.log('starting tally');
    try {
        let response = await axios.post(`${sealer.url}/tally`, { voteId: electionId });
        console.log(response.data)
        return {
            sealerName: sealer.name,
            response: response.data,
        }
    } catch (e) {
        console.log(e)
    }

}


