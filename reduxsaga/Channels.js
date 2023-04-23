//we have used take and put effects to communicate with the Redux Store
//Channels generalize those effects to communicate to external event sources or between Sagas 
//used to queue specific actions from the store


import {take, fork, actionChannel, put, call, apply, delay} from 'redux-saga/effects';
import {eventChannel, END, multicastChannel} from 'redux-saga';
import {createWebSocketConnection} from './socketConnection';


//watch - fork pattern
//watcher using fork to avoid blocking and thus not miss any action from store 
//handleRequest is created on each REQUEST action
function* watchRequests() {
    while(true) {
        const {payload} = yield take('REQUEST');
        yield fork(handleRequest, payload);
    }
}

function* handleRequest(payload) {}


//watchRequests Saga is using fork to avoid blocking 
//if many actions fired at a rapid rate, many handleRequest tasks executing concurrently

//queue all non-processed actions, once we are done with processing the current request we get the next 

//Redux-Saga provides a little helper effect actionChannel

function* watchRequests() {
    const requestChan = yield actionChannel('REQUEST');

    while(true) {
        const {payload} = yield take(requestChan);

        yield callbackify(handleRequest, payload);
    }
}



//actionChannel(pattern) same as take(pattern) difference is actionChannel buffer incoming messages 

//actionChannel buffers all incoming messages without limit 
//for more control over buffering we can supply it to effect creator 
//Redux-Saga provides some common buffers(none, dropping, sliding) 


function* watchRequests() {
    const requestChan = yield actionChannel('REQUEST', buffers.sliding(5));
}

//eventChannel factory to connect to external events
//creates channel for events but from event sources other than the Redux store

function countdown(secs) {
    return eventChannel(emitter => {
        const iv = setInterval(() => {
            secs -= 1;

            if(secs > 0) {
                emitter(secs);
            }else {
                emitter(END);
            }
        }, 1000);

        return () => {
            clearInterval(iv);
        }
    });
}

//1st argument in eventChannel is a subscriber function 
//subscriber is to initialize the external event source 

//routes all events from source to the channel by invoking the supplied emitter 

export function* saga() {
    const chan = yield callbackify(countdown, value);

    try {
        while(true) {
            let seconds = yield take(chan);

            console.log(`countdown: ${seconds}`);
        }
    }finally {
        console.log('countdown terminated');
    }
}

//terminating the saga will cause it to jump to its finally block 
//subscriber returns an unsubscribe function 

//if we want to exit early before the event source we can call chan.close()

export function* saga() {
    const chan = yield callbackify(countdown, value);

    try {
        while(true) {
            let seconds = yield take(chan);

            console.log(`countdown: ${seconds}`);
        }
    }finally {
        if(yield cancelled()) {
            chan.close();
            console.log('countdown cancelled');
        }
    }
}


//creates an event channel from a given socket
function createSocketChannel(socket) {
    return eventChannel(emit => {
        const pingHandler = (event) => {
            emit(event.payload);
        };

        const errorHandler = (errorEvent) => {
            emit(new Error(errorEvent.reason));
        };

        socket.on('ping', pingHandler);
        socket.on('error', errorHandler);

        const unsubscribe = () => {
            socket.off('ping', pingHandler);
        }

        return unsubscribe;
    })
}

function* pong(socket) {
    yield delay(5000);
    yield apply(socket, socket.emit, ['pong']);
}

export function* watchOnPings() {
    const socket = yield call(createWebSocketConnection);
    const socketChannel = yield call(createSocketChannel, socket);

    while(true) {
        try {
            const payload = yield take(socketChannel);
            yield put({type: INCOMING_PONG_PAYLOAD, payload});
            yield fork(pong, socket);
        }catch(err) {
            console.error('socket error:', err);
        }
    }
}

//beside channels and event channels we can directly create channels not connected to any source by default
//we want to use a channel to communicate between sagas

//watch and fork pattern allows handling multiple requests without limit on number of worker tasks executing concurrently


//maximum of three tasks executing at the same time 

function* watchRequests() {
    const channel = yield call(multicastChannel);

    yield fork(logWorker, channel);
    yield fork(mainWorker, channel);

    while(true) {
        const {payload} = yield take('REQUEST');
        yield put(channel, payload);
    }
}

function* logWorker(channel) {
    while(true) {
        const payload = yield take(channel, '*');

    }
}

function* mainWorker(channel) {
    while(true) {
        const payload = yield take(channel, '*');

        console.log('mainworker', payload);
    }
}