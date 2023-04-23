//redux saga provides some helper effects wrapping internal functions to spawn tasks

import {call, put, takeEvery} from 'redux-saga/effects';
import Api from './path/to/Api';

export function* fetchData(action) {
    try {
        const data = yield call(Api.fetchUser, action.payload.url);
        yield put({type: 'FETCH_SUCCEEDED', data});
    }catch(error) {
        yield put({type: 'FETCH_FAILED', error});
    }
}

function* watchFetchData() {
    yield takeEvery('FETCH_REQUESTED', fetchData);
}


//if we want the latest 
function* watchFetchData() {
    yield takeLatest('FETCH_REQUESTED', fetchData);
}

//watching multiple actions

export default function* rootSaga() {
    yield takeEvery('FETCH_USERS', fetchUsers);
    yield takeEvery('CREATE_USER', createUser);
}

