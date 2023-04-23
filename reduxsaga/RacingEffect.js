//starting race between multiple effects 
//we just need the winner among the parallel tasks 
//first one that resolves or rejects race effect


import {race, call, put, delay, take} from 'redux-saga/effects';

function* fetchPostsWithTimeout() {
    const {posts, timeout} = yield race({
        posts: call(fetchApi, '/posts'),
        timeout: delay(1000)
    });

    if(posts) 
    yield put({type: 'POSTS_RECEIVED', posts});
    else 
    yield put({type: 'TIMEOUT_ERROR'});
}

//race automatically cancels the loser effects 
//first starts a task in an endless loop while(true) synching some data with server with x seconds 

function* backgroundTask() {
    while(true) {
        //....
    }
}

function* watchStartBackgroundTask() {
    while(true) {
        yield take('START_BACKGROUND_TASK');
        yield race({
            task: call(backgroundTask),
            cancel: take('CANCEL_TASK')
        });
    }
}

