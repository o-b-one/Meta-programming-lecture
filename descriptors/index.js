// 'use strict';

class Language {
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


const myLanguage = new Language("nodejs", "2009/11/08");
console.log("name: %s", myLanguage.name);
myLanguage.name = "golang";
console.log("new name: %s", myLanguage.name);
console.log("birthdate: %s", myLanguage.birthdate);
console.log("age: %s,", myLanguage.age);
console.log("Serialized: %s", JSON.stringify(myLanguage));
