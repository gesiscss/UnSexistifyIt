function isBlankObject(value) {
    return value !== null && typeof value === 'object' && !Object.getPrototypeOf(value);
}

function forEach(obj, iterator, context) {
    var key, length;
    if (obj) {
        if (obj.forEach && obj.forEach !== forEach) {
            obj.forEach(iterator, context, obj);
        } else if (isBlankObject(obj)) {
            // createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
            for (key in obj) {
                iterator.call(context, obj[key], key, obj);
            }
        } else if (typeof obj.hasOwnProperty === 'function') {
            // Slow path for objects inheriting Object.prototype, hasOwnProperty check needed
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    iterator.call(context, obj[key], key, obj);
                }
            }
        } else {
            // Slow path for objects which do not have a method `hasOwnProperty`
            for (key in obj) {
                if (hasOwnProperty.call(obj, key)) {
                    iterator.call(context, obj[key], key, obj);
                }
            }
        }
    }
    return obj;
}

module.exports = forEach;