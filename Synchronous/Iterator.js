let ranks = ['A', 'B', 'C'];

for(let i = 0; i < ranks.length; i++) {
    console.log(ranks[i]);
}

//as complexity grows when we nest a loop inside another loop keeping track of multiple variables inside the loop is error prone

//ES6 new loop constructor for...of to eliminate the standard loop's complexity

//using for...of construct

for(let rank of ranks) {
    console.log(rank)
}


//for...of loop has ability to loop over any iterable object not just an array

//iterable protocol and iterator protocol

//iterator protocol
////any object is iterator if it answers two questions 

//is there any element left?
//if there is what is the element?


//object has a next method that returns an object with two properties
//done: boolean value indicating whether or not there are any more elements that could be iterated upon
//value: the current element 

//next() returns the next value in the collection
//{value: 'next value', done: false}

//next() method after last value has been returned the next() returns

//{ done: true, value: undefined};

//iterable protocol 

// object contains [Symbol.iterator] method takes no argument returns an object which conforms on iterator protocol

//built in iterators for collection types Array, Set, Map

//For custom type we need to implement

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

                return {value: counter, done: true};
            }
        }
    }
}

let evenNumbers = new Sequence(2, 10, 2);

for(const num of evenNumbers) {
    console.log(num);
}


//we can explicitly access [Symbol.iterator]() method 

let iterator = evenNumbers[Symbol.iterator]();

let result = iterator.next();


while(!result.done) {
    console.log(result.value);

    result = iterator.next();
}


//cleaning up 

//the next() method [Symbol.iterator]() may optionally return a method called return()


//return() method will be invoked automatically when the iteration is stopped prematurely
//place where we keep the clean up the resources code 


class Sequence2 {
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
                    let result = {value: nextIndex, done: false};
                    nextIndex += this.interval;
                    counter++;

                    return result;
                }

                return {value: counter, done: true};
            },

            return: () => {
                console.log("cleaning up....");
                return {value: undefined, done: true};
            }
        }
    }
}

//if iteration is prematurely stops it automatically invokes return()

let oddNumbers = new Sequence2(1, 10, 2);

for(const num of oddNumbers) {
    if(num > 7) {
        break;
    }

    console.log(num);
}

//yield keyword 

//[variable_name] = yield [expression];

//expression specifies the value to return from a generator function via iteration protocol

//variable_name stores the optional value passed to the next() method of the iterator object


function* foo() {
    yield 1;
    yield 2;
    yield 3;
}

let f = foo();

console.log(f.next());

//returning undefined 


function* bar() {
    yield;
}

let b = bar();

console.log(b.next());

//passing value to the next method 
//yield keyword is an expression that evaluates the argument passed to the next() method 


function* generate1() {
    let result = yield;
    console.log(`result is ${result}`);
}

let g = generate1();

console.log(g.next());

console.log(g.next(1000));


function* baz() {
    let arr = [yield, yield];

    console.log(arr);
}

var z  = baz();

console.log(z.next());
console.log(z.next(1));
console.log(z.next(2));


//using yield to return an array


function* yieldArray() {
    yield 1;
    yield [20, 30, 40];
}

let y = yieldArray();

console.log(y.next());
console.log(y.next());
console.log(y.next());

//using yield to return individual elements of an array

function* yieldArrayElements() {
    yield 1;
    yield* [20, 30, 40];
}

let a = yieldArrayElements();

console.log(a.next());
console.log(a.next());
console.log(a.next());
console.log(a.next());
