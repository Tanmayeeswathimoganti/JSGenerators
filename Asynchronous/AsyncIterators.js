//iterator is well suited for accessing the synchronous data sources like arrays, sets, maps

//Synchronous data means the next value in the sequence and the done state is known at the time the next() method returns 

//JavaScript often has access to asynchronous data sources the value and done state 


//ES2018 introduced asynchronous iterator 

//async iterator returns a promise that resolves to the {value, done} object


class Sequence {
    constructor(start = 0, end = Infinity, interval = 1) {
        this.start = start;
        this.end = end;
        this.interval = interval;
    }

    [Symbol.iterator]() {
        let counter = 0;
        let nextIndex = this.start;

        return {
            next: () => {
                if(nextIndex <= this.end) {
                    let result = {
                        value: nextIndex,
                        done: false
                    };

                    nextIndex += this.interval;
                    counter++;
                    return result;
                }

                return {
                    value: counter,
                    done: true
                }
            }
        }
    }
}

//async sequence using async iterator Symbol.asyncIterator instead of Symbol.iterator

class AsyncSequence {
    constructor(start = 0, end = Infinity, interval = 1) {
        this.start = start;
        this.end = end;
        this.interval = interval;
    }

    [Symbol.asyncIterator]() {
        let counter = 0;
        let nextIndex = this.start;

        return {
            next: async () => {
                if(nextIndex <= this.end) {
                    let result = {
                        value: nextIndex,
                        done: false
                    };

                    nextIndex += this.interval;
                    counter++;

                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve(result);
                        }, 1000);
                    });
                }

                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve({
                            value: counter,
                            done: true
                        });
                    }, 1000);
                });
            }
        }
    }
}


//to iterate over instead of for of we use for await of statement

//async IIFE as an AsyncSequence


(async () => {
    let seq = new AsyncSequence(1, 10, 1);

    for await (let value of seq) {
        console.log(value);
    }
})();


//difference between iterators and async iterators

//Symbol  - Symbol.Iterator and Symbol.asyncIterator
//next() return value is {value, done} and Promise that resolves to {value, done}
//Loop Statement - for...of and for await...of
