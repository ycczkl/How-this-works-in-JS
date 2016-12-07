// Basic
var hello = (name) => `hello ${name}`
console.log(hello('world')) //hello world

// Rest parameter
var sumArguments = (...args) => {
  console.log(typeof arguments) //undefined
  return args.reduce((res, i) => res + i)
}
console.log(sumArguments(1,2,3)) //6

// 6.1
class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  log() {
    console.log(this === myPoint) //true
    setTimeout(() => {
      console.log(this === myPoint) //true
      console.log(this.x + ':' + this.y) //95:165
    }, 1000)
  }
}

var myPoint = new Point(95, 165)
myPoint.log()

// 6.1 `this` context can't be changed
var numbers = [1, 2];
(function() {
  var get = () => {
    return this
  }
  console.log(this === numbers) //true
  console.log(get()) //[1, 2]
  console.log(get.call([0])) //[1, 2]
  console.log(get.apply([0])) //[1, 2]
  console.log(get.bind([0])()) //[1, 2]
}).call(numbers)

// 6.2
function Period (hours, minutes) {  
  this.hours = hours;
  this.minutes = minutes;
}
Period.prototype.format = () => {  
  console.log(this === global); // => true
  return this.hours + ' hours and ' + this.minutes + ' minutes';
};
var walkPeriod = new Period(2, 30);  
console.log(walkPeriod.format()); // => 'undefined hours and undefined minutes'  
