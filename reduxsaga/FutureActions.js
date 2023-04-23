//Pulling future actions 

//takeEvery in order to spawn a new task on each incoming action 
//mimcs the behavior of redux-thunk 

//takeEvery is just a wrapper effect for internal helper function built on top of the lower - level


import {select, takeEvery, take, put, call, fork, cancel} from 'redux-saga/effects';
import Api from "../";

function* watchAndLog() {
    yield takeEvery('*', function* logger(action) { //wildcard pattern we can catch all dispatched actions regardless of their types
        const state = yield select();

        console.log('action', action);
        console.log('state after', state);
    });
}


//implement above using take effect 

function* watchAndLog() {
    while(true) {
        const action = yield take('*');
        const state = yield select();

        console.log('action', action);
        console.log('state after', state);
    }
}

//take creates another command object that tells middleware for a specific action 
//take will suspend the generator until a matching action is dispatched 

//generator will block on each iteration waiting for action to happen

//in case of takeEvery invoked tasks have no control on when they'll be called 
//they will be invoked again and again on each matching action 
//also have no control on when to stop the observation 


//in case take control is inverted 
//actions will be pushed to the handler tasks 
//Saga is pulling the action by itself if saga is performing a normal function call action = getNextAction()
//allowing us to implement control flows that are non-trival to do with traditional push approach

function* watchFirstThreeTodosCreation() {
    for(let i = 0; i < 3; i++) {
        const action = yield take('TODO_CREATED');
    }

    yield put({type: 'SHOW_CONGRATULATION'});
}

//after execution Generator will be garbage collected and no more observation takes place 


//implementing login flow using two actions LOGIN, LOGOUT using takeEvery or redux-thunk 
//using the pull model 

function* loginFlow() {
    while(true) {
        yield take('LOGIN');
        //..perform the login logic
        yield take('LOGOUT');
        //..perform the logout logic 
    }
}

//expected action sequence LOGIN action should always LOGOUT action 
//a good UI enforce a cosistent order of actions by hidding or disabling unexpected actions 


//authorization is done on the server side 
//on logout we have to delete any authorization token stored previously 

//we can make asynchronous calls using call effect and dispatch actions using put effect 


function* authorize(user, password) {
    try {
        const token = yield call(Api.authorize, user, password);
        yield put({type: 'LOGIN_SUCCESS', token});
        return token;
    }catch(error) {
        yield put({type: 'LOGIN_ERROR', error});
    }
}

function* loginFlow() {
    while(true) {
        const {user, password} = yield take('LOGIN_REQUEST');
        const token = yield call(authorize, user, password);
        if(token) {
            yield call(Api.storeItem, {token});
            yield take('LOGOUT');
            yield call(Api.clearItem, 'token');
        }
    }
}


//loginflow implements its entire flow inside a while(true) loop once it reaches the last LOGOUT we start a new iteration 

//issues
//loginFlow is blocked on the authorize call an eventual LOGOUT occuring in between hte call is missed 
//call is blocking effect Generator can't perform/handle anything else until the call terminates 

//to express non-blocking calls we need fork effect 
//fork a task the task is started in the background and caller can continue its flow without waiting for forked task to terminate 


function* loginFlow() {
    while(true) {
        //...
        try {
            //non blocking call what's the returned value here 
            //const value = yield fork(authorize, user, password);
        }catch {
            //error handling
        }
    }
}


//issue 
//authorize action is started in the background we can't get the token result 
//we need to move the token storage operation into the autorize task 


function* authorize(user, password) {
    try {
        const token = yield call(Api.authorize, user, password);
        yield put({type: 'LOGIN_SUCCESS', token});
        yield call(Api.storeItem, {token});
    }catch(error) {
        yield put({type: 'LOGIN_ERROR', error});
    }
}

function* loginFlow() {
    while(true) {
        const {user, password} = yield take('LOGIN_REQUEST');
        yield fork(authorize, user, password);
        yield take(['LOGOUT', 'LOGIN_ERROR']);
        yield call(Api.clearItem, 'token');
    }
}

//yield take(['LOGOUT', 'LOGIN_ERROR']) means we are watching for 2 concurrent actions 


//idempotent - denoting element of set which is unchanged in value when multiplied or otherwise operated on by itself 

//Api.clearItem is idempotent it'll have no effect if token was stores by the authorize call


//LOGOUT in the middle of API call we have to cancel the authorize process 
//We'll have concurrent tasks evolving in parallel 


function* loginFlow() {
    while(true) {
        const {user, password} = yield take('LOGIN_REQUEST');

        //fork return a task object 
        const task = yield fork(authorize, user, password);
        const action = yield take(['LOGOUT', 'LOGIN_ERROR']);

        if(action.type === 'LOGOUT') {
            yield cancel(task);
        }
        yield call(Api.clearItem, 'token');
    }
}

//yield fork results in Task Object 
//if logout we pass the object to cancel effect 

//issue 
//support LOGIN_REQUEST action our reducer sets some isLoginPending flag to true  it can display some message or spinner in the UI 
//if we get LOGOUT in the middle of the API call end up inconsistent state 
//Cancel will give you a chance to perform its cleanup logic 
//cancelled task can handle any cancellation logic in its finally block 

function* authorize(user, password) {
    try {
        const token = yield call(Api.authorize, user, password);
        yield put({type: 'LOGIN_SUCCESS', token});
        yield call(Api.storeItem, {token});
        return token;
    }catch(error) {
        yield put({type: 'LOGIN_ERROR', error});
    }finally {
        if(yield cancelled()) {
            //..put special cancellation handling code here 
        }
    }
}


