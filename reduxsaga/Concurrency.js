//takeEvery implementation using low-level effects

import {cancel, fork, take} from 'redux-saga/effects';

const takeEvery = (pattern, saga, ...args) => {
    fork(function*() {
        while(true) {
            const action = yield take(pattern);
            yield fork(saga, ...args.concat(action));
        }
    });
};

//takeEvery allows multiple saga tasks to be forked concurrently 


//takeLatest

const takeLatest = (pattern, saga, ...args) => fork(function*() {
    let lastTask;
    while(true) {
        const action = yield take(pattern);
        if(lastTask) {
            yield cancel(lastTask);
        }

        lastTask = yield fork(saga, ...args.concat(action));
    }
});

//takeLatest doesn't allow multiple saga tasks to be fired concurrently
//for new dispatched action it cancels any previously-forked task(if still running)
//we can use takeLatest to handle AJAX requests where we want to only have the response to latest request







