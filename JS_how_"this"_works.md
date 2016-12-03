## 详解this在javascript中的作用

### 缘起: 谜一样的`this`
如果你有多年JAVA或PHP的经验然后再开始写JS代码, 你一定会对JS中`this`关键词的用法感到迷惑. 在JAVA或其他语言中, `this`指代对象实例, 仅此而已, 但在JS中你会发现`this`在函数,对象,strict mode下都会有不同的含义与用法. 其实在很多情况下如果你不是完全理解`this`的用法并不会对工作产生特别大的影像, 但如果想彻底掌握JS, `this`的用法必须要了然于心. 
我本人一直对`this`在JS中用法认知比较模糊, 于是决定写一篇文章把`this`的方方面面都总结下.

### 1. 函数调用
你执行一次函数就称为一次函数调用, 例如`parseInt("2333")`. **特别需要注意的是**, 通过对象属性执行的函数表达式(`myObject.myFunction`)不称为函数调用而称为方法调用. 例如`[2, 3].join(',')`不称为函数调用.

#### 1.1 函数调用中的`this`
> 函数调用中的`this`指向global object

所以`this`在浏览器中指向`window`, 在node中指向`global`.
~~~javascript
function sum(a, b) {  
   console.log(this === window); // => true
   this.myNumber = 20; // add 'myNumber' property to global object
   return a + b;
}
// sum() is invoked as a function
// this in sum() is a global object (window)
sum(15, 16);     // => 31  
window.myNumber; // => 20  
~~~

在function外部环境(浏览器), `this`依旧指向global object. 但是在node里的top-level环境中`this`相当于module.exports.
~~~javascript
//In browser
console.log(this === window); // => true  
this.myString = 'Hello World!';  
console.log(window.myString); // => 'Hello World!'  

//Node.js
console.log(this) // {}
global.a = "hello"
console.log(global.a) // hello
~~~

#### 1.2 函数调用中的`this`(strict mode)
> 在strict mode下的函数调用中的`this`为undefined

~~~javascript
() => {
  'use strict'
  function test() {
    console.log(this)
  }
  test()
}() // undefined
~~~

strict mode不仅仅作用与当前scope也作用与所有strict mode scope内部声明的函数中. 因为我们可以在函数中声明是否应用strict mode所以一个js文件中可能并存strct mode与非strict的函数.

#### 1.3 深坑: `this`在inner function中的作用.
一个很容易出错的地方在于很多人认为inner function的`this`等同于outer function. 
事实上`this`的值只取决于函数的执行环境.

~~~javascript
var boardGames = {
  game1: 'codenames',
  game2: 'blood rage',
  concat: function() {
    console.log(this === boardGames) // true
    function addTogether() {
      console.log(this === boardGames) //false
      console.log(this === global) //true
      return `${this.game1} and ${this.game2}`
    }
    return addTogether()
  }
}
boardGames.concat()
~~~
这段代码在strict mode下会报错, 因为第二个this为undefined.
boardGames.concat()是boardGames对象的方法调用(我会在section2详细介绍方法调用), 所以第一个`this`指向boardGames对象. addTogether()是一个函数调用所以第二个`this`指向global object, 在浏览器中为window对象, 在node中为global.

如果想让此函数正确执行, 我们需要手动把`this`指向boardGames对象。只需改动一行代码即可`return addTogether.call(this)`

### 2. 方法调用
方法(method)就是定义在对象属性中的函数。例如

~~~javascript
var obj = {
  myFunction: function() {
    return 'hello'
  }
}
console.log(obj.myFunction()) // hello
~~~

`myFunction`是定义在obj里的函数, 我们可以通过属性选择器来得到改函数: `obj.myFunction`
方法调用就是通过对象的属性选择器来执行的函数, 比如: `obj.myFunction()`, `[1, 2].join(',')`

区分函数调用与方法调用是非常重要的, 两者之间最大的不同在于方法调用需要通过对象的属性选器来执行: `obj.myFunction() 或 obj['myFunction']()`

#### 2.1 方法调用中的`this`
> 在方法调用中的`this`指向拥有此函数的对象

~~~javascript
var Calc = {
  var count: 0,
  increment: function() {
    console.log(this === Calc)
    this.count++
    return this.count
  }
}
Calc.increment()
~~~

如果利用ECMAScript 6 中新加入的`class`来创建对象如上的规则一样适用: `this`指向对象本身.

~~~javascript
class NewCalc {
  constructor(count) {
    this.count = count
  }
  increment() {
    console.log(this === CalcObj)
    this.count++
    return this.count
  }
}
var CalcObj = new NewCalc(0)
console.log(CalcObj.increment())
~~~

#### 2.2 深坑: 对象方法与对象分离后独立执行
对象方法可以赋值给一个变量, 当我们以这个变量来执行函数调用的时候我们很容易以为函数中的`this`依然指向对象, 然而由于这是函数调用而非方法调用, 在这种情况下`this`指向global(strict模式下为undefined)。

~~~javascript
// 例1:
var Calc = {
  var count: 0,
  increment: function() {
    console.log(this === Calc)
    this.count++
    return this.count
  }
}
var outter = Calc.increment
outter() //false

// 例2:
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
~~~

在例子2中很多人可能会以为setTimeout会调用`myCat.logInfo()`而事实上当把对象方法当作参数传入函数的时候, 对象方法会脱离对象, 这样方法调用就变成了函数调用. 如何解决呢? 其实办法很粗暴, 我们只要显式地把函数bind到对象上就好了: `setTimeout(myCat.logInfo.bind(myCat), 1000)`

### 3. 构造器调用
构造器调用就是再函数调用的前面加上`new`关键词, 例如`new RegExp('\\d')`.
下面这个例子会声明一个函数Country, 并利用构造器的方式进行调用:

~~~javascript
function Country(name, population) {
  this.name = name
  this.population = population
}
var China = new Country('China', 1300000000)
~~~

ES6中我们可以利用class关键字声明构造器

~~~javascript
class Country {
  constructor(name, population) {
    this.name = name
    this.population = population
  }
}
var China = new Country('China', 1300000000)
~~~

需要注意的是, 如果new后面跟着的是对象选择器(`myObject.myFunction`), JS会把它当成构造器调用而非方法调用.

#### 3.1 构造器调用中的`this`
> 在构造器调用中`this`指向新创建的对象

~~~javascript
function Foo () {  
  console.log(this instanceof Foo); // => true
  this.property = 'Default Value';
}
// Constructor invocation
var fooInstance = new Foo();  
fooInstance.property; // => 'Default Value'  

class Bar {  
  constructor() {
    console.log(this instanceof Bar); // => true
    this.property = 'Default Value';
  }
}
// Constructor invocation
var barInstance = new Bar();  
barInstance.property; // => 'Default Value' 
~~~

### 4. 间接调用(Indirect invocation)
当利用`.call()`或`.apply()`调用函数的时候, 这类调用被称为间接调用.
`.call()`与`.apply()`共同点在于它们接受的的第一个参数都是用来设定函数context的,区别在于前者可接受多个参数而后者只接受一个array-like对象作为参数. 例如`myFunction.call(thisValue, 'value1', 'value2')`和`myFunction.apply(thisValue, ['value1', 'value2'])`.

#### 4.1 间接调用中的`this`
> 间接调用中的`this`指向`.call()`和`.apply()`函数中的第一个参数

~~~javascript
var rabbit = { name: 'White Rabbit' };  
function concatName(string) {  
  console.log(this === rabbit); // => true
  return string + this.name;
}
// Indirect invocations
concatName.call(rabbit, 'Hello ');  // => 'Hello White Rabbit'  
concatName.apply(rabbit, ['Bye ']); // => 'Bye White Rabbit'  
~~~

在上例中我们利用`call`与`apply`函数在concatName函数执行时中的`this`绑定.

### 6. bound函数
运用`.bind()`函数创建的函数称为bound函数.

~~~javascript
function multiply(number) {  
  'use strict';
  return this * number;
}
// create a bound function with context
var double = multiply.bind(2);  
// invoke the bound function
double(3);  // => 6  
double(10); // => 20  
~~~

上例中, `multiply.bind(2)`会返回一个新函数double, double与multiply函数唯一的不同就是函数执行时的context不同。在double函数中`this`为2.

`bind`与`apply`, `call`的区别在于后者会直接对函数进行调用而前者会返回一个新函数.

#### 6.1 bound函数中的`this`
> bound函数中的`this`指向`.bind()`函数中第一个参数

~~~javascript
var numbers = {  
  array: [3, 5, 10],
  getNumbers: function() {
    return this.array;    
  }
};
// Create a bound function
var boundGetNumbers = numbers.getNumbers.bind(numbers);  
boundGetNumbers(); // => [3, 5, 10]  
// Extract method from object
var simpleGetNumbers = numbers.getNumbers;  
simpleGetNumbers(); // => undefined or throws an error in strict mode  
~~~

还记得为什么`simpleGetNumbers`会返回undefined吗？ 如果忘了请重读2.2

值得我们注意的是, `.bind()`会永久性的把context和函数绑定, 即便你利用`.call()`或`.apply()`也不乏改变context. 同时你也不能rebind函数.

~~~javascript
function getThis() {  
  'use strict';
  return this;
}
var one = getThis.bind(1);  
// Bound function invocation
one(); // => 1  
// Use bound function with .apply() and .call()
one.call(2);  // => 1  
one.apply(2); // => 1  
// Bind again
one.bind(2)(); // => 1  
~~~

### 7. 箭头函数
