var crypto = require('crypto');
Util = {
    get: function (_key, obj) {
        try {
            for (i = 0; i < obj.length; i++) {
                if (obj[i].key == _key) {
                    return obj[i].keyValue;
                }
            }
        } catch (e) {
            return false;
        }
        return false;
    },
    containsKey: function (_key, obj) {
        var bln = false;
        try {
            for (i = 0; i < obj.length; i++) {
                if (obj[i].key == _key) {
                    bln = true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    },
    //传输token时加密
    codeStr: function (str) {
        var buffer = new Buffer(str);
        for (var i = 0; i < buffer.length; i++) {
            buffer[i] = buffer[i] ^ 0xFF;
        }
        var result = buffer.toString('Base64');
        return result;
    },
    //map转对象
    mapToObj: function (map) {
        var obj = Object.create(null);
        for (var item of map.entries()) {
            if (this.isMap(item[1])) {
                obj[item[0]] = this.mapToObj(item[1]);
            } else {
                obj[item[0]] = item[1];
            }
        }
        return obj;
    },
    //对象转map    var map = new Map(Object.entries(obj));
    objToMap: function (obj) {
        var map = new Map();
        for (var k of Object.keys(obj)) {
            if (Util.isObject(obj[k]) && Object.keys(obj[k]).length > 0) {
                map.set(k, this.objToMap(obj[k]));
            } else {
                map.set(k, obj[k]);
            }
        }
        return map;
    },

    isArray: function (arr) {
        return Object.prototype.toString.call(arr) === "[object Array]";
    },
    isString: function (arr) {
        return Object.prototype.toString.call(arr) === "[object String]";
    },
    isObject: function (arr) {
        return Object.prototype.toString.call(arr) === "[object Object]";
    },
    isMap: function (map) {
        return Object.prototype.toString.call(map) === "[object Map]";
    },
    obj2String: function (obj) {
        if (obj == null || obj == undefined) {
            return '';
        }

        if (!isNaN(obj) || isString(obj)) {
            return obj;
        }
        var result = '';
        for (var key of Object.keys(obj)) {
            if (!isNaN(obj[key]) || isString(obj[key])) {
                result += obj[key];

            }
            if (isArray(obj[key]) || isObject(obj[key])) {
                result += obj2String(obj[key]);

            }
        }
        return result;
    },
    /**
     * 过滤null值
     */
    wipeNull: function (obj) {
        for (var o of Object.keys(obj)) {

            if (this.isArray(obj[o])) {

                this.wipeNull(obj[o]);

            } else if (this.isObject(obj[o])) {

                this.wipeNull(obj[o]);

            } else if (obj[o] == null || obj[o] == undefined) {
                obj[o] = '';
            }
            // else if (!isNaN(obj[o])) {
            //     obj[o] = Number(obj[o].toFixed(4));
            // }
        }
    },
    /**
     * 过滤null值
     */
    wipeNullToZero: function (obj) {
        for (var o of Object.keys(obj)) {

            if (this.isArray(obj[o])) {

                this.wipeNullToZero(obj[o]);

            } else if (this.isObject(obj[o])) {

                this.wipeNullToZero(obj[o]);

            } else if (obj[o] == null || obj[o] == undefined || obj[o] == '') {
                obj[o] = 0;
            }
        }
    },
    /**
     * 替换属性key
     */
    replaceKey: function (obj, oldKey, newKey) {
        for (var o of Object.keys(obj)) {

            if (this.isArray(obj[o])) {

                this.replaceKey(obj[o], oldKey, newKey);

            } else if (this.isObject(obj[o])) {

                this.replaceKey(obj[o], oldKey, newKey);

            } else if (o == oldKey) {
                obj[newKey] = obj[o];
                delete obj[o];
            }
        }
    },
    /**
     * 替换值
     */
    replaceVal: function (obj, oldVal, newVal) {
        for (var o of Object.keys(obj)) {

            if (this.isArray(obj[o])) {

                this.replaceVal(obj[o], oldVal, newVal);

            } else if (this.isObject(obj[o])) {

                this.replaceVal(obj[o], oldVal, newVal);

            } else if (obj[o] == oldVal) {
                obj[o] = newVal;
            }
        }
    },
    /**
     * 客户端json填值  适用于[a:{},b:{}]的情况
     * obj  服务端json
     * targetObj    客户端json
     * keyPaht  []
     */
    fillNull: function (obj, targetObj, keyPath) {

        for (var o of Object.keys(obj)) {
            keyPath.push(o);
            if (this.isArray(obj[o])) {

                this.fillNull(obj[o], targetObj, keyPath);
                keyPath.pop();
            } else if (this.isObject(obj[o])) {

                this.fillNull(obj[o], targetObj, keyPath);
                keyPath.pop();

            } else {
                let targetTemp = targetObj;
                if (keyPath.length) {
                    for (let i = 0; i < keyPath.length; i++) {
                        if (i == keyPath.length - 1) {
                            targetTemp[keyPath[i]] = obj[o];

                        } else {
                            targetTemp = targetTemp[keyPath[i]];
                        }
                    }
                } else {
                    targetObj[o] = obj[o];
                }
                keyPath.pop();
            }
        }
    },
    /**
     * 适用于[{name:'name',xx:xx}]的形式
     */
    fillArray: function (obj, targetObj) {
        for (let i = 0; i < obj.length; i++) {
            for (let j = 0; j < targetObj.length; j++) {
                if (obj[i].name === targetObj[j].name) {
                    targetObj[j] = obj[i];
                }
            }
        }
    },
    //md5加密
    cryptoMd5: function (content) {
        var hash = crypto.crateHash('MD5');
        hash.update(content);
        return hash.digest('hex');
    },
    /**
     * 供电分区集合排序（属性AREA_TYPE）
     * @param a
     * @param b
     * @returns {boolean}
     */
    areaTypeSort: function (a, b) {
        if ("A+" == a.AREALEVEL) {
            return false;
        } else if ("A+" == b.AREALEVEL) {
            return true;
        } else {
            return a.AREALEVEL > b.AREALEVEL;
        }
    },
    /**
     * 供电分区集合排序（属性key）
     * @param a
     * @param b
     * @returns {boolean}
     */
    keyTypeSort: function (a, b) {
        if ("A+" == a.key) {
            return false;
        } else if ("A+" == b.key) {
            return true;
        } else {
            return a.key > b.key;
        }
    },
    /**
     * 供电分区集合排序（ab就为供电分区）
     * @param a
     * @param b
     * @returns {boolean}
     */
    onlyTypeSort: function (a, b) {
        if ("A+" == a) {
            return false;
        } else if ("A+" == b) {
            return true;
        } else {
            return a > b;
        }
    },
    /**
     * 供电分区集合排序（ab就为供电分区）
     * @param a
     * @param b
     * @returns {boolean}
     */
    oracleTypeSort: function (a, b) {
        if ("A+" == a[1]) {
            return false;
        } else if ("A+" == b[1]) {
            return true;
        } else {
            return a[1] > b[1];
        }
    }
}

module.exports = Util;