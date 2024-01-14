// By defoult .js uses CommonJS

// You can change the extensions of 
// the files to .mjs to use something called "ES Modules"

import { sum, sub, mult, div } from './sum.mjs'

console.log(sum(2,2))
console.log(sub(2,2))
console.log(mult(2,2))
console.log(div(2,2))