//A simple example of function invocation:
function hello(name) {
  return `hello ${name}`
}
console.log(hello('world'))

//Advance example of function invocation: IIFE
let res = ((name) => `hello ${name}`)('world')
console.log(res)

// this in function invocation
console.log(this) //{}
console.log(global) //global obj
function add(a, b) {
  console.log(this === global) // true
  return a + b
}
add(1, 2);

// strict mode
(function() {
  'use strict'
  function test() {
    console.log(this) // undefined
  }
  test()
})()

// Pitfall: this in an inner function
function a() {
  console.log(this === global) //true
  function b(){
    console.log(this === global) //true
  }
  b()
}
a()

var boardGames = {
  game1: 'codenames',
  game2: 'blood rage',
  concat: function() {
    console.log(this === boardGames) //true
    function addTogether() {
      console.log(this === boardGames) //false
      console.log(this === global) //true
      return `${this.game1} and ${this.game2}`
    }
    return addTogether()
  }
}
console.log(boardGames.concat()) // undefined and undefined

var boardGames = {
  game1: 'codenames',
  game2: 'blood rage',
  concat: function() {
    console.log(this === boardGames) //true
    function addTogether() {
      console.log(this === boardGames) //true
      console.log(this === global) //false
      return `${this.game1} and ${this.game2}`
    }
    return addTogether.call(this)
  }
}
console.log(boardGames.concat()) // codenames and blood rage
