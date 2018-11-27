// 'use strict'
const {Handler} = require("./proxy.handler.js");

class Item{
	constructor(name,type){
		this.name = name;
		this.type = type;
	}

	init(){
		this.addUnreadable("name");
		this.addUnwritable("type");
	}
	

}
function main(){
	const guarded = new Proxy(Item,new Handler());

	console.log("Defining specie new instance");
	const g1 = new guarded("Katana","Sword");
	console.log("name: %s",g1.name);
	console.log("type: %s",g1.type);

    console.log("Changing name to: Shelf");
    g1.name = "Shelf";

    console.log("Changing type to: Furniture");
    g1.type = "Furniture";

	console.log("name: %s",g1.name);
	console.log("type: %s",g1.type);
	console.log("Serialized: %s",JSON.stringify(g1));

	console.log("Removing 'name' form unreadables");
	g1.removeUnreadable("name");
	console.log("name:  %s",g1.name);
	console.log("Serialized: %s",JSON.stringify(g1));
}

main();

