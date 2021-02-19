import { configureStore } from '@reduxjs/toolkit';
import chainReducer from './features/chain/chainSlice';

export default configureStore({
    reducer: {
        chain: chainReducer,
    }
})

//store.subscribe(() => console.log(store.getState()));

//store.dispatch(increment());