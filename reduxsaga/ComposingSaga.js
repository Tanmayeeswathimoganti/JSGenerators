//yield* provides an idiomatic way of composing saga 


//testing nested generators separately leads to some duplication 
//we don't want to test the nested generator but want to make sure we made right call issued with right argument


//yield* leads to sequential composition of tasks so one generator at a time 


//we can use the yield to start one or more subtasks in parallel 
//yielding call to a generator saga will wait for generator to terminate before processing then resume returned value 
//or throws if an error propagates from the subtask 

function* fetchPosts() {
    yield put(actions.requestPosts());
    const products = yield call(fetchApi, '/products');
    yield put(actions.receivePosts(products));
}

function* watchFetch() {
    while(yield take('FETCH_POSTS')) {
        yield call(fetchPosts); //waits for the fetchPosts task to terminate 
    }
}


//yielding an array of nested generators will start the sub-generatos in parallel wait for them to finish 


function* mainSaga(getState) {
    const results = yield all([call(task1), call(task2)]);
    yield put(showResults(results));
}

//yielding saga is no different than yielding other effects 
//we can combine those sagas with other types using effect combinators

function* game(getState) {
    let finished;
    while(!finished) {
        const {score, timeout} = yield race({
            score: call(play, getState),
            timeout: delay(60000)
        });

        if(!timeout) {
            finished = true;
            yield put(showScore(score));
        }
    }
}