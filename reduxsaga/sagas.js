import {call, put, takeEvery, takeLates, all} from 'redux-saga/effects';
import Api from '...';


function* fetchUser(action) {
    try {
        const user = yield call(Api.fetchUser, action.payload.userId);
        yield put({type: 'USER_FETCH_SUCCEEDED', user: user});
    }catch(e) {
        yield put({type: 'USER_FETCH_FAILED', message: e.message});
    }
}

//starts fetchUser on each dispatched action allows concurrent fetches of user
function* mySaga() {
    yield takeEvery('USER_FETCH_REQUESTED', fetchUser);
}

//doesnot allow concurrent fetches of user if an action is dipatched while a fetch action is already 
//pending then pending fetch is cancelled only latest one will berun


function* mySaga() {
    yield takeLatest('USER_FETCH_REQUESTED', fetchUser);
}


//Sagas implement Generator functions  that yield objects to redux-saga middleware

//yielded objects are instructions implmented by middleware 

//Promise yielded to middleware then middleware suspend the saga until the promise completes 


const delay = (ms) => new Promise(res => setTimeout(res, ms));

export function* helloSaga() {
    console.log("Hello Saga!");
}

//worker saga will perform the async increment task
export function* incrementAsync() {
    yield delay(1000);
    yield put({type: 'INCREMENT'});
}

//watcher saga will spawn a new incrementAsync task on each INCREMENT_ASYNC action
export function* watchIncrementAsync() {
    yield takeEvery('INCREMENT_ASYNC', incrementAsync);
}

export function* watchIncrementAsync() {
    yield takeEvery('INCREMENT_ASYNC', incrementAsync);
}

export default function* rootSaga() {
    yield all([helloSaga(), watchIncrementAsync()]);
}