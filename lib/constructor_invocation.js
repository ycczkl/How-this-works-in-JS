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
