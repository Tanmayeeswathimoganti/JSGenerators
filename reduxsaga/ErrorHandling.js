//we catch errors in Saga using try/catch syntax


import Api from './path/to/api';
import {call, put} from 'redux-saga/effects';


function* fetchProducts() {
    try {
        const products = yield call(Api.fetch, '/products');
        yield put({type: 'PRODUCTS_RECEIVED', products});
    }catch(error) {
        yield put({type: 'PRODUCTS_REQUEST_FAILED', error});
    }
}

//testing

const iterator = fetchProducts();

assert.deepEqual(
    iterator.next().value,
    call(Api.fetch, '/products'),
    "fetchProducts should yield an Effect call(Api.fetch, './products')"
);

//create a fake error
const error = {}

assert.deepEqual(
    iterator.throw(error).value,
    put({type: 'PRODUCTS_REQUEST_FAILED', error }),
    "fetchProducts should yield an Effect put({ type: 'PRODUCTS_REQUEST_FAILED', error })"
);

function fetchProductsApi() {
    return Api.fetch('/products')
    .then(response => ({response}))
    .catch(error => ({error}));
}

function* fetchProducts() {
    const {response, error} = yield call(fetchProductsApi);

    if (response)
    yield put({ type: 'PRODUCTS_RECEIVED', products: response })
  else
    yield put({ type: 'PRODUCTS_REQUEST_FAILED', error })
}


//Errors forked tasks bubbles up to their parents until it is caught or reaches the root saga 
//If error propagates to root saga tree is already terminated 
//use an onError hook to report an exception

