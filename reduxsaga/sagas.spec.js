import test from 'tape';
import { incrementAsync } from './sagas';

test('incrementAsync Saga test', (assert) => {
    const gen = incrementAsync();


    //gen.next() - {done: boolean, value: any}

    // gen.next(); //{done: false, value: <result of calling delay(1000)>}
    // gen.next(); //{done: false, value: <result of calling put({type: "INCREMENT"})}
    // gen.next(); //{done: true, value: undefined}

    assert.deepEqual(
        gen.next(), 
        {done: false, value: 10},     
        'incrementAsync should return a Promise that will resolve after 1 second'
    );
});

