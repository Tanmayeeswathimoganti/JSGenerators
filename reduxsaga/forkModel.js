//we can dynamically fork tasks that execute in the background using 2 effects 

//fork is used to create attached forks
//spawn is used to created detached forks 


//attached forks remain attached to their parent by rules

//a saga terminates only after it terminates its own body of instructions
//all attached forks are themselves terminates 

import {fork, call, put, delay, all} from 'redux-saga/effects';
import api from './someWhere/api';
import {receiveData} from './someWhere/actions';

function* fetchAll() {
    const task1 = yield fork(fetchResource, 'users');
    const task2 = yield fork(fetchResource, 'comments');

    yield delay(1000);
}

function* fetchResource(resource) {
    const {data} = yield call(api.fetch, resource);
    yield put(receiveData(data));
}

function* main() {
    try {
    yield call(fetchAll);
    }catch(error) {
        //handle fetchAll errors
    }
}

//call(fetchAll) terminates after fetchAll body itself terminates 3 effects are performed 
//fork are non-blocking the task will block on delay(1000)

//2 forked tasks terminate after fetching the required resources and putting the corresponding receivedData actions 


//whole task will block until a delay of 1000 milliseconds and both task1, task2 finished their business

//fetchAll wait untill all tasks finished their business


//alternative render could be written using the parallel effect 

function* fetchAll() {
    yield all([
        call(fetchResource, 'users'),
        call(fetchResource, 'comments'),
        delay(1000)
    ]);
}

//error cancellation propagation, considering it by dynamic parallel effect 

//Error Propagation 
//fetchAll will fail when one of 3 child effects fails 
//uncaught error will cause the parallel effect to cancel all other pending effects 
//other 2 tasks(if they are still pending) then aborts iteself 

//we can catch error from call(fetchAll) inside main only because we're using blocking call
//we cannot catch error directly from fetchAll 
//You can't catch errors from forked tasks 
//failure in attached fork will cause the forking parent to abort 

//Cancellation
//Cancelling Saga causes the cancellation of 
//main task this means cancelling the current effect where the saga is blocked
//all attached forks that are still executing 


//Detached forks using Spawn 
//Detached forks live in their own execution context 
//a parent doesn't wait for detached fork to terminate 
//uncaught errors from spawned tasks are not bubbled up to the parent 
//cancelling parent doesn't automatically cancel detached forks 

