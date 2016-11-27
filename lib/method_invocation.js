//ES5
var Calc = {
  count: 0,
  increment: function() {
    console.log(this === Calc) //true
    this.count++
    return this.count
  }
}
console.log(Calc.increment()) //1

//ES6
class NewCalc {
  constructor(count) {
    this.count = count
  }
  increment() {
    console.log(this === CalcObj) //true
    this.count++
    return this.count
  }
}
var CalcObj = new NewCalc(0)
console.log(CalcObj.increment()) //1

// 深坑
var outter = Calc.increment
outter() //false

function Animal(type, legs) {  
  this.type = type;
  this.legs = legs;  
  this.logInfo = function() {
    console.log(this === myCat); // => false
    console.log('The ' + this.type + ' has ' + this.legs + ' legs');
  }
}
var myCat = new Animal('Cat', 4);
// logs "The undefined has undefined legs"
// or throws a TypeError in strict mode
setTimeout(myCat.logInfo, 1000);
setTimeout(myCat.logInfo.bind(myCat), 1000) // The Cat has 4 legs
