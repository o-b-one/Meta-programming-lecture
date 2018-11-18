const readonlySymbol = Symbol.for("readonly");
const unreadableSymbol = Symbol.for("unreadable");


class Handler{
    construct(className,args,proxy){
        const instance = Reflect.construct(...arguments);
        instance.unreadables =[];
        instance.unwritables =[];
        instance.addUnreadable = (function(property){
            instance.unreadables.push(property);
        }).bind(instance);

        instance.addUnwritable = (function(property){
            this.unwritables.push(property);
        }).bind(instance);


        instance.removeUnreadable = (function(property){
            removeFromList(this.unreadables,property);

        }).bind(instance);

        instance.removeUnwritable = (function(property){
            this.unwritables.push(property);
        }).bind(instance);

        function removeFromList(array,property){
            const index = array.findIndex(item=>item === property);
            if (index > -1) {
                array.splice(index,1);
            }
        }

        if(Reflect.has(instance,'init') )
            instance.init();
        return new Proxy(instance,this);

    }

    get(guardedObject,property,proxy){
        if(guardedObject.unreadables && guardedObject.unreadables.includes(property)){
            return null;
        }
        return Reflect.get(...arguments);
    }

    set(guardedObject,property,value,proxy){
        if(guardedObject.unwritables && guardedObject.unwritables.includes(property)){
            return false;
        }
        return Reflect.set(...arguments);
    }
}
module.exports = {Handler,readonlySymbol,unreadableSymbol};