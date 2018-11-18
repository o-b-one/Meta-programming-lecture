const readonlySymbol = Symbol.for("readonly");
const unreadableSymbol = Symbol.for("unreadable");


export class DecoratorProxyHandler {
    construct(target, args, proxy) {

        const instance = Reflect.construct(target, args, proxy);

        instance.addUnreadable = (
            function (property) {
                Reflect.defineMetadata(unreadableSymbol, property, this);
            }
        ).bind(instance);

        instance.addUnwritable = (
            function (property) {
                Reflect.defineMetadata(readonlySymbol, property, this);
            }
        ).bind(instance);


        instance.removeUnreadable = (function (property) {
            removeFromList(unreadableSymbol, property,this)
        }).bind(instance);
        instance.removeUnwritable = (function (property) {
            removeFromList(readonlySymbol, property,this)
        }).bind(instance);


        function removeFromList(list, property, target) {
            const set = Reflect.getMetadata(list, target) || new Set();
            set.delete(property);
            Reflect.defineMetadata(property, Array.from(set), target);
        }

        if (Reflect.has(instance, 'init'))
            instance.init();
        return new Proxy(instance, this);

    }

    get(guardedObject, property, proxy) {
        const unreadable = Reflect.getMetadata(unreadableSymbol, guardedObject) as Set<string>;
        if (unreadable && unreadable.has(property)) {
            return null;
        }
        return Reflect.get(guardedObject, property, proxy);
    }

    set(guardedObject, property, value, proxy) {
        const readonly = Reflect.getMetadata(readonlySymbol, guardedObject) as Set<string>;
        if (readonly && readonly.has(property)) {
            return false;
        }
        return Reflect.set(guardedObject, property, value, proxy);
    }
}