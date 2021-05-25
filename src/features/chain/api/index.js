const axios = require("axios").default;

export const backendHealth = async (sealer) => {
  let response = await axios.get(`${sealer.url}/health`);
  return {
    sealerName: sealer.name,
    health: response.data
  };
}

export const distributedKeyGeneration = async (sealerUrl) => {
  console.log("starting DKG!");
  axios.post(`${sealerUrl}/dkg`);
};

export const fetchAddresses = async (sealer) => {
  console.log('loading addresses');

  //return response;
}
export const nodeIsRunning = async (sealer) => {
  console.log('checking if node is up');
  let response = await axios.get(`${sealer.url}/bootstrap/chain`);
  console.log('node up: ', response);
  return {
    sealerName: sealer.name,
    nodeUp: response.data === 'ESRCH' ? false : true,
  }
}

export const fetchWallet = async (sealer) => {
  console.log('loading wallet');
  let response = await axios.get(`${sealer.url}/wallet`);
  let wallet = response.data;
  let registeredSealers = await axios.get(`${sealer.url}/bootstrap/registered`)
  console.log(response);
  return {
    sealerName: sealer.name,
    wallet: wallet,
    registeredSealers: registeredSealers.data
  };
}

export const sendAddress = (sealer) => {
  console.log(sealer.url);
  axios
    .post(`${sealer.url}/wallet`)
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
      console.log("done");
    });
};

export const getSealer = async () => {
  return {
    url: process.env.REACT_APP_SEALER_1_URL,
    name: "sealer-bob",
    spec: {},
    chain: {},
    keys: {},
    backendHealth: {},
    specLoaded: false,
    wallet: {},
    registeredWithVA: false,
    nodeIsRunning: false,
    keysInserted: false,
  };
};

export const getVaUrl = async () => {
  return process.env.REACT_APP_VA_URL;
};

export const getVotes = async (vaUrl) => {
  console.log("fetching votes");
  try {
    let response = await axios.get(`${vaUrl}/votes`);
    return response.data;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const fetchResults = async (vaUrl, electionId) => {
  console.log(`fetching results vor vote ${electionId}`);
  try {
    let response = await axios.get(`${vaUrl}/votes/results`, {
      params: {
        voteId: electionId
      }
    });
    return response.data;

  } catch (e) {
    console.log(e);
  }
}

export const fetchPublicKeyShares = async (vaUrl, electionId) => {
  console.log(`fetching shares vor vote ${electionId}`);
  try {
    let response = await axios.get(`${vaUrl}/votes/publicKeyShares`, {
      params: {
        voteId: electionId
      }
    });
    return response.data;

  } catch (e) {
    console.log(e);
  }
}

export const triggerDkg = async (sealer, electionId) => {
  console.log("doing dkg for election: ", electionId);
  try {
    let response = await axios.post(`${sealer.url}/dkg`, {
      voteId: electionId,
    });
    console.log(response);
  } catch (e) {
    console.log(e);
  }
};

export const fetchChainSpec = async (sealer) => {
  let response = await axios.post(`${sealer.url}/bootstrap/chain-spec`);
  return {
    sealerName: sealer.name,
    response: response.data,
  };
};

export const chainSpecLoaded = async (sealer) => {
  let response = await axios.get(`${sealer.url}/bootstrap/chain-spec`);
  return {
    sealerName: sealer.name,
    response: response.data
  }
}

export const startChainNode = async (sealer) => {
  try {
    let response = await axios.post(
      `${sealer.url}/bootstrap/chain/bootnode?restart=false`
    );
    console.log(response);
    return {
      sealerName: sealer.name,
      response: response.data,
    };
  } catch (e) {
    console.log(e);
  }
};

export const insertValidatorKeys = async (sealer) => {
  console.log("inserting validator keys");
  let response = await axios.post(`${sealer.url}/bootstrap/validators`);
  console.log(response.data);
  return {
    sealerName: sealer.name,
    response: response.data,
  };
};

export const validatorKeysInserted = async (sealer) => {
  console.log("checking if validator keys inserted");
  let response = await axios.get(`${sealer.url}/bootstrap/validators`);
  console.log(response.data);
  return {
    sealerName: sealer.name,
    response: response.data,
  };
};

export const startTally = async (sealer, electionId) => {
  console.log("starting tally");
  try {
    let response = await axios.post(`${sealer.url}/tally`, {
      voteId: electionId,
    });
    console.log(response.data);
    return {
      sealerName: sealer.name,
      response: response.data,
    };
  } catch (e) {
    console.log(e);
  }
};
