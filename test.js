const arr = [
    {"a": "1", "b": "2"},
    {"c": "3", "d": "4"}
]
arr.push({e:5, f:6})
const c = Object.keys(arr)
console.log(typeof c)

let isArr = arr instanceof Array;
// let isArr = Array.isArray(data);

isArr = Object.prototype.toString.call(arr) === '[object Array]';
console.log(isArr)