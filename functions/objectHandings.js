import {notNull} from "./tool";

/**
 * 简单合并对象一级属性，只有target 属性为 null或者undefined 时使用 source 中的对象的属性
 * @param {Object} target
 * @param {*[]} source
 * @return {Object}
 */
export function objectMerge(target, ...source) {
    let newObject = {};
    let getValue = key => {
        let findRes = source.find(item => notNull(item[key]));
        return findRes ? findRes[key] || null : null;
    };
    for (let key of Reflect.ownKeys(target)) {
        newObject[key] = notNull(target[key]) ? target[key] : getValue(key);
    }
    return newObject;
}


/**
 * 对象转化为数组
 * @param {Object} source
 * @return {Array}
 */
export function map2arr(source) {
    let arr = [];
    for (let key of Reflect.ownKeys(source)) {
        arr.push(source[key]);
    }
    return arr;
}
