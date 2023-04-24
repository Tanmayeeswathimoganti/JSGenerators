import {call, put} from 'redux-saga/effects';

function* fetchProducts(dispatch) {
    const products = yield call(Api.fetch, './products');
    dispatch({type: 'PRODUCTS_RECEIVED', products});
}

//drawbacks 
//we have to mock the dispatch function
//create a plain javaScript Object to instruct the middleware that dispatch some action


const iterator = fetchProducts();

assert.deepEqual(
    iterator.next.value,
    call(Api.fetch, '/products'),
    "fetchProducts should yield an Effect call(Api.fetch, './products')"
);

const products = {};

assert.deepEqual(
    iterator.next(products).value,
    put({type: "PRODUCTS_RECEIVED", products}),
    "fetchProducts should yield an Effect put({ type: 'PRODUCTS_RECEIVED', products })"
);

//here put(value)  value means {type: "PRODUCTS_RECEIVED", products: products}

//we pass the fake response to Generator via its next method 
//Outside middleware environment we have total control over the Generator 
//we Simulate by mocking results and resuming the Generator with them 



//triggering side effects from inside a Saga is always done by yielding some declarative effect 

//Saga compose all effects together to implement desired control flow 
//sequence of yielded effects by putting the yields one after another 
//