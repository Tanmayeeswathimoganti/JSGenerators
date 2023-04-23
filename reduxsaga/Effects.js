//Sagas are implemented using Generator functions
//to express saga logic we yield plain javaScript objects from the generator 
//those objects are called Effects
//Effect contain information to be interpreted by the middleware 

//to create effects we use functions provided by the library in the redux-saga/effects package


import {takeEvery, call} from 'redux-saga/effects';
import Api from './path/to/api';

function* watchFetchProducts() {
    yield takeEvery('PRODUCTS_REQUESTED', fetchProducts);
}

function* fetchProducts() {
    const products = yield Api.fetch('/products');
    console.log(products);
}

//testing this one is hard as 
const iterator = fetchProducts();

//assert.deepEqual(iterator.next().value, ??) //we donot know 


//result of products will be a Promise executing real service during tests is neither a viable nor practical approach 
//we mock the service 
//mocks make testing more difficult and less reliable 
//functions that return values are easier to test 
//leads to reliable tests


//instead of calling asynchronous function directly the generator function will yield only a description of the function invocation 

// {
//     CALL: {
//         fn: Api.fetch,
//         args: ['./products']
//     }
// }

//Generator will yield plain Objects containing instructions for redux-saga middleware to takecare 


function* fetchProducts() {
    const products = yield call(Api.fetch, './products');
}

//testing 

const iterator2 = fetchProducts();

assert.deepEqual(
    iterator2.next().value,
    call(Api.fetch, './products'),
    "fetchProducts should yield an Effect call(Api.fetch, './products')"
);

//we can test all logic inside Saga by iterating over the Generator and doing deepEqual test on the values yielded 
//complex asynchronous operations are no longer black boxes

//yield call([obj, obj.method], arg1, arg2, ...);
//yield apply(obj, obj.method, [arg1, arg2, ...]);

