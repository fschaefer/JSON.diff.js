JSON.diff.js
============

JSON.diff(obj1, obj2) returns an object containing the differences between two objects.

Example:
```
JSON.diff({ "foo": true, "bar": "baz" }, { "bar": "qux", "quux": false });
// => {"mod":{"bar":"qux"},"add":{"quux":false},"del":{"foo":true}}    
```
