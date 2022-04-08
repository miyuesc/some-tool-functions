import {getRawType, notEmpty, notNull} from "./tool";

/**
 * 获取一个树节点的所有子节点数组 ( 场景：将一个组织的 code 与该组织的子组织 code 合并到一个数组 )
 * @param { Object } node 包含子节点的数据对象
 * @param { ?{children?: string, key?: string}} props 默认关键字
 * @return { Array[string] } 关键字数组
 */
export function getFlatChildren(node, props = {}) {
    let { key = "id", children = "children" } = props;
    let result = [];
    node[key] && result.push(node[key]);
    notEmpty(node[children]) &&
    node.children.reduce((target, child) => {
        if (notEmpty(child[children])) {
            target.push(...getFlatChildren(child, props));
        } else {
            child[key] && result.push(child[key]);
        }
        return result;
    }, result);
    return result;
}

/**
 * 获取一个数据在树形数组中对应的名称 ( 场景：根据code在组织树中查询对应的组织名称 )
 * @param { array } tree 包含子节点的数据对象
 * @param { * } value 当前查询的值, 一般是字符串或者数字
 * @param {{key?: string, label?: string, children?: string}} props 默认关键字(key: 查询值键名，label: 名称键名)
 * @param { ?boolean } splice 是否拼接
 * @return { string } 名称
 */
export function getTreeNodeLabel(tree, value, props = {}, splice = false) {
    let { key = "code", label = "label", children = "children" } = props;
    for (let node of tree) {
        if (node[key] === value) {
            return node[label];
        }
        if (notEmpty(node[children])) {
            let res = getTreeNodeLabel(node[children], value, props, splice);
            if (res) {
                return splice ? `${node[label]}/${res}` : res;
            }
        }
    }
    return undefined;
}

/**
 * 一维对象数组转对象，用于 校验 或者 formatter
 * @param {*} arr 对象数组
 * @param {{label: string, value: string}} props 参数配置
 * @return {{[string]:string|boolean}}
 */
export function arr2map(arr = [], props = {}) {
    if (getRawType(arr) !== "Array") {
        return {};
    }
    let { label = "label", value = "value" } = props;
    return arr.reduce((mMap, item) => {
        mMap[item[props.value]] = notNull(props.label) ? item[props.label] : true;
        return mMap;
    }, {});
}

/**
 * 级联对象数组转对象，用于 校验 或者 formatter
 * 例如 [{label: '123', value: 1, children: [{label: '124', value: 2}]}] 转换为 {1: '123', 2: '124'} 或者 {1: '123', '1-2': '124'}
 * @param {*} arr 对象数组
 * @param { props } props 参数配置 分隔符
 * @param { string } props.label 作为返回对象对应的键名的属性值
 * @param { string } props.value 作为返回对象的键的值
 * @param { boolean } props.cascadeKey 是否拼接
 * @param { string } props.separator 拼接符
 * @param { string } prefix 前缀
 * @return {{[string]:string|boolean}}
 */
export function cascadeArr2map(arr = [], props = {}, prefix = "") {
    if (getRawType(arr) !== "Array") {
        return {};
    }
    let { label = "label", value = "value", children = "children", cascadeKey = false, separator = '-' } = props || {};
    return arr.reduce((mMap, item) => {
        let prefixKey = cascadeKey ? `${prefix}${separator}${item[value]}` : item[value];
        mMap[prefixKey] = notNull(item[label]) ? item[label] : true;

        if (notNull(item[children]) && item[children].length) {
            let childPrefixKey = cascadeKey ? prefixKey : prefix;
            let childMap = cascadeArr2map(item[children], props, childPrefixKey);
            for (let key of Reflect.ownKeys(childMap)) {
                mMap[key] = childMap[key];
            }
        }

        return mMap;
    }, {});
}
