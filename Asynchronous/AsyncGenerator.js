//async generator is similar to regular generator except that its next() method returns a Promise

//to iterate over an async generator we use for...await...of statement

//regular generator 

function* sequence(start, end) {
    for(let i = start; i <= end; i++) {
        yield i;
    }
}

let seq = sequence(2, 5);

for(const num of seq) {
    console.log(num);
}


//async generator is similar to regular generator 

//async keyword placed infront of function keyword
//yield returns a promise instead of value 


async function* asyncSequence(start, end) {
    for(let i = start; i <= end; i++) {
        yield new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(i);
            }, 1000);
        });
    }
}

//Async IIFE with await keyword 


(async () => {
    let seq = asyncSequence(1, 5);

    for await (let num of seq) {
        console.log(num);
    }
})();