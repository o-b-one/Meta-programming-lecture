import "reflect-metadata"
import {unreadableSymbol, readonlySymbol} from "../proxy/proxy.handler.js";
import {DecoratorProxyHandler} from "./decorator-proxy.handler";


function Guarded(targetConstructor: any) {
    return new Proxy(targetConstructor, new DecoratorProxyHandler());
}

function Unreadable(targetObject: any, property: string) {
    const set = Reflect.getMetadata(unreadableSymbol, targetObject) || new Set();
    set.add(property);
    Reflect.defineMetadata(unreadableSymbol, set, targetObject);
}

function Unwritable(targetObject: any, property: string) {
    const set = Reflect.getMetadata(readonlySymbol, targetObject) || new Set();
    set.add(property);
    Reflect.defineMetadata(readonlySymbol, set, targetObject);
}

@Guarded
class Item {
    @Unreadable
    public name: string;

    @Unwritable
    public type: string;

    constructor(name: string, type: string) {
        this.name = name;
        this.type = type;
    }
}

function main() {
    console.log("Defining specie new instance");
    const g1 = new Item("Katana", "Sword") as any;

    console.log("name: %s", g1.name);
    console.log("type: %s", g1.type);

    try {
        console.log("Changing name to: Shelf");
        g1.name = "Shelf";

        console.log("Changing type to: Furniture");
        g1.type = "Furniture";
    } catch (err) {
    }

    console.log("name: %s", g1.name);
    console.log("type: %s", g1.type);
    console.log("Serialized: %s", JSON.stringify(g1));

    console.log("Removing name form unreadables");
    g1.removeUnreadable("name");
    console.log("name:  %s", g1.name);
    console.log("Serialized: %s", JSON.stringify(g1));
}

main();
