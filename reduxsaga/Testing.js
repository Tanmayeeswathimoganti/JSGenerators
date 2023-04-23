//testing saga generator function step by step or running full saga and asserting the side effects
import {put, take} from 'redux-saga/effects';
import {cloneableGenerator} from '@redux-saga/testing-utils';

const CHOOSE_COLOR = 'CHOOSE_COLOR';
const CHANGE_UI = 'CHANGE_UI';

const chooseColor = color => ({
    type: CHOOSE_COLOR,
    payload: {
        color,
    }
});

const changeUI = color => ({
    type: CHANGE_UI,
    payload: {
        color
    }
});

//testing the saga
function* changeColorSaga() {
    const action = yield take(CHOOSE_COLOR);
    yield put(changeUI(action.payload.color));
}

//yielding effects have basic factory functions put, take

const gen = changeColorSaga();

assert.deepEqual(gen.next().value, take(CHOOSE_COLOR), 'it should wait for a user to choose a color');


const color = 'red';

assert.deepEqual(
    gen.next(chooseColor(color)).value,
    put(changeUI(color)),
    'it should dispatch an action to change the ui'
);

assert.deepEqual(
    gen.next().done,
    true,
    'it should be done'
);

//Branching Saga 
//to test different branches without repeating all the steps 
//we can use the cloneableGenerator

const CHOOSE_NUMBER = 'CHOOSE_NUMBER';
const DO_STUFF = 'DO_STUFF';

const chooseNumber = number => ({
    type: CHOOSE_NUMBER,
    payload: {
        number
    }
});

const doStuff = () => ({
    type: DO_STUFF
});


function* doStuffThenChangeColor() {
    yield put(doStuff());
    yield put(doStuff());
    const action = yield take(CHOOSE_NUMBER);
    if(action.payload.number % 2 === 0) {
        yield put(changeUI('red'));
    }else {
        yield put(changeUI('blue'));
    }
}



test('donStuffThenChangeColor', assert => {
    const gen = cloneableGenerator(doStuffThenChangeColor)();

    gen.next(); //DO_STUFF
    gen.next(); //DO_STUFF
    gen.next(); //CHOOSE_NUMBER

    assert.test('user choose an even number', a => {
        const clone = gen.clone();

        a.deepEqual(clone.next(chooseNumber(2)).value, put(changeUI('red'), 'should change the color to red'));

        a.equal(clone.next().done, true, 'it should be done');

        a.end();
    });


    assert.test('user choose an odd number', a => {
        const clone = gen.clone();

        a.deepEqual(clone.next(chooseNumber(3)).value, put(changeUI('blue')), 'should change the color to blue');

        a.equal(clone.next().done, true, 'it should be done');

        a.end();
    });
});

