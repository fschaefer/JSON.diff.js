/*
 * JSON.diff.js
 *
 * JSON.diff(obj1, obj2) returns an object containing the differences between two objects.
 *
 * Copyright 2014, Florian Schäfer <florian.schaefer@gmail.com>
 * Copyright 2010, Marc Rutkowski / Attractive Media
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Based upon the code of Michael Schøler:
 * http://www.xn--schler-dya.net/blog/2008/01/15/diffing_json_objects/
 *
 */
!(function () {
    var BreakException = {};
    var isEmptyObject = function (obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    };
    var cyclicCheck = [];
    var diff = function (obj1, obj2) {
        if (typeof obj1 === 'undefined')
            obj1 = {};
        if (typeof obj2 === 'undefined')
            obj2 = {};

        var val1, val2, mod = {}, add = {}, del = {}, ret;
        try {
            Object.keys(obj2).forEach(function (key) {

                val1 = obj1[key];
                val2 = obj2[key];
                if (typeof val1 === 'undefined') {
                    add[key] = val2;
                } else if (typeof val1 != typeof val2) {
                    mod[key] = val2;
                } else if (val1 !== val2) {
                    if (typeof val2 === 'object') {
                        if (cyclicCheck.indexOf(val2) >= 0)
                            throw BreakException;
                        ret = diff(val1, val2);
                        if (!isEmptyObject(ret.mod))
                            mod[key] = JSON.parse(JSON.stringify(ret.mod));
                        if (!isEmptyObject(ret.add))
                            add[key] = JSON.parse(JSON.stringify(ret.add));
                        if (!isEmptyObject(ret.del))
                            del[key] = JSON.parse(JSON.stringify(ret.del));
                        cyclicCheck.push(val2);
                    } else
                        mod[key] = val2;
                }
            });
        } catch (e) {
            if (e !== BreakException) throw e;
        }

        Object.keys(obj1).forEach(function (key) {
            val1 = obj1[key];
            if (typeof obj2[key] === 'undefined')
                del[key] = true;
        });

        return {
            mod: mod,
            add: add,
            del: del
        };
    };

    JSON.diff = function (obj1, obj2) {
        cyclicCheck = [];
        return diff(obj1, obj2);
    };
})();
