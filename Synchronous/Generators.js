//regular function is executed based on run to completion model 
//it cannot pause midway and then continues from where it paused 

function foo() {
    console.log('I');
    console.log("cannot");
    console.log('pause');
}

//function foo executes from top to bottom exit by returning from it or throwing an error

//ES6 function generator 
//generator can pause midway and then continues from where it is paused 

function* generate() {
    console.log("invoked 1st time");
    yield 1;
    console.log("invoked 2nd time!");
    yield 2;
}

//* after function indicates it is a generator 
//yield returns a value and pauses the execution of the function 

let gen = generate();


console.log(gen);

//generate() is not a normal function it returns an Generator object without executing it's body when it is invoked


//Generator object returns another two properties done and value 
//Generator object is iterable 

// let result = gen.next();

// console.log(result);

// result = gen.next();

// console.log(result);

// result = gen.next();

// console.log(result);

//as generator is an iterable we can use for of 

for(const g of gen) {
    console.log("g", g);
}

//generator to generate a never ending sequence

function* forever() {
    let index = 0;
    while(true) {
        yield index++;
    }
}

let f = forever();

console.log(f.next());
console.log(f.next());
console.log(f.next());

//using generator to implement iterators

//in this iterator we have to store the state every time we call the next method
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
                if(nextIndex < this.end) {
                    let result = {value: nextIndex, done: false};

                    nextIndex += this.interval;
                    counter++;
                    return result;
                }

                return {value: counter, done: true};
            }
        }
    }
}

//here generator function stops where it got paused 
class Sequence2 {
    constructor(start = 0, end = Infinity, interval = 1) {
        this.start = start;
        this.end = end;
        this.interval = interval;
    }

    * [Symbol.iterator]() {
        for(let index = this.start; index <= this.end; index += this.interval) {
            yield index;
        }
    }
}

//generator to implment bag datastructure

class Bag {
    constructor() {
        this.elements = [];
    }

    isEmpty() {
        return this.elements.length === 0;
    }

    add(element) {
        this.elements.push(element);
    }

    *[Symbol.iterator]() {
        for(let element of this.elements) {
            yield element;
        }
    }
}

let bag = new Bag();

bag.add(1);
bag.add(2);
bag.add(3);

for(let e of bag) {
    console.log(e);
}

