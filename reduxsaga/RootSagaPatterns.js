//root saga aggregates multiple sagas to single entry point for the sagaMiddleware to run


export default function* rootSaga() {
    yield all([
        helloSaga(),
        watchIncrementSync()
    ]);
}

//all effect is used with an array and our sagas will be executed in parallel 

//Non-blocking fork effects similar to above one 

export function* rootSaga() {
    yield fork(saga1);
    yield fork(saga2);
    yield fork(saga3);
}

//yielding fork will give back a task descriptor three times 
//sub sagas are executed in the same order 
//fork is non-blocking the rootSaga can finish while child sagas continue to run and be blocked by their internal effects 


//all effect is blocking in nature where all our sub-sagas are started and executed in the same order 
//fork is non-blocking rootSaga can finish while child sagas continue to run and be 

//we can use the task descriptors that fork returned to cancel/join the forked task via task descriptors 


const [task1, task2, task3] = yield all([fork(saga1), fork(saga2), fork(saga3)]);

//here all will become non-blocking as it nested non-blocking fork effects 
//they are always connected to the parent task through underlying forkQueue
//uncaught errors from forked tasks bubble to parent task and thus abort it and its child tasks 


//do not do this. The fork effect always wins the race immediately

yield race([
    fork(someSaga),
    take('SOME_ACTION'),
    somePromise
]);


//Keeping the root alive 
//rootSaga will terminate on the first error in any individual child effect or saga 
//Ajax requests could put our app at mercy 
//spawn effect will disconnect our child saga from its parent 

//spawn effect might be considered similar to Error Boundaries 


function* rootSaga() {
    yield spawn(saga1);
    yield spawn(saga2);
    yield spawn(saga3);
}


//Keeping everythin alive
//saga able to restart in the event of failure
//sagas may continue to work after failing 

function* sagaThatMayCrash() {
    //wait for something that happens during app startup
    yield take('APP_INITILIZED');

    //assume it dies here
    yield call(doSomethingThatMayCrash)
}

function* rootSaga() {
    const sagas = [saga1, saga2, saga3];

    yield all(sagas.map(saga => 
        spawn(function* () {
            while(true) {
                try {
                    yield call(saga);
                    break;
                }catch(error) {
                    console.log(error);
                }
            }
        })
        ));
}
