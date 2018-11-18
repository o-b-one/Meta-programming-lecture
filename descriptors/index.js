// 'use strict';

class Person {
    constructor(name, birthdate) {
        this.name = name;
        this.birthdate = birthdate;
    }

    set birthdate(birthdate) {
        this.setProperty("_birthdate", birthdate, false, false);
        const today = new Date().getTime();
        const bDate = new Date(birthdate).getTime();
        const age = Math.abs(new Date(today - bDate).getUTCFullYear() - 1970);
        this.setProperty("age", age, true, true);
    }

    get birthdate() {
        return this._birthdate;
    }

    set name(name) {
        this.setProperty("_name", name, false, true);
    }

    get name() {
        return this._name;
    }

    setProperty(propertyName, value, writeable, enumerable) {
        let descriptor = Object.getOwnPropertyDescriptor(this, propertyName) || {};
        // let descriptor = Reflect.getOwnPropertyDescriptor(this, propertyName) || {};
        Object.assign(descriptor, {writeable, enumerable, value});

        //todo: change to reflect to silence the redefine error
        try {
            Object.defineProperty(this, propertyName, descriptor);
        }catch (err){
            console.error("============ Reflect will silence this error =============");
            throw err;
        }
        // Reflect.defineProperty(this, propertyName, descriptor);
    }
}


const myPerson = new Person("nodejs", "2009/11/08");
console.log("name: %s", myPerson.name);
myPerson.name = "golang";
console.log("new name: %s", myPerson.name);
console.log("birthdate: %s", myPerson.birthdate);
console.log("age: %s,", myPerson.age);
console.log("Serialized: %s", JSON.stringify(myPerson));
