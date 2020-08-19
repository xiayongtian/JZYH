import AsyncStorage from '@react-native-community/async-storage';
/**
 * 超时 key 后缀
 */
const EXPIRES_KEY_SUFFIX = '____expires';

/**
 * 清除缓存
 * @param {array} excludes 需保留的缓存对象，支持模糊匹配
 * 数据格式如下:
 */
async function clearExcludes(...excludes) {
  // 有保留数据，获取清除缓存时需要保留的key数据
  if (excludes && Array.isArray(excludes)) {
    // console.log("excludes = ", excludes);
    // 所有key
    const allKeys = await AsyncStorage.getAllKeys();
    // console.log("allKeys = ", allKeys);
    // 保存的key 值
    let savedKeys = [];
    if (allKeys && allKeys.length > 0) {
      for (const key of allKeys) {
        const saved = excludes.find(item => {
          if (item) {
            const regex = new RegExp(item);
            // console.log("regex = ", regex);
            // console.log("find item = ", item);
            return regex.test(key);
          }
          return false;
        });
        // 有匹配数据，保存相关 Key
        if (saved) {
          // console.log("clear, saved key = ", key);
          savedKeys.push(key);
        }
      }
      // 计算差集数据并删除未保存 key
      const allKeysSet = new Set(allKeys);
      const savedKeysSet = new Set(savedKeys);
      // console.log("savedKeys = ", savedKeys);
      const diffKeys = [...allKeysSet].filter(item => !savedKeysSet.has(item));
      // console.log("diffKeys = ", diffKeys);
      // 存在差异的 key ，进行批量删除
      if (diffKeys && diffKeys.length > 0) {
        await AsyncStorage.multiRemove(diffKeys);
      }
    }
  } else {
    // 无保留数据，直接整体清除
    return AsyncStorage.clear();
  }
}

/**
 * 清除缓存
 */
async function clear() {
  return clearExcludes();
}

/**
 * 获取缓存信息
 * @param {string} key key
 * @param {*} defaultValue 默认值
 */
async function get(key, defaultValue = null) {
  if (key) {
    // 拼接超时key
    const expiresKey = key + EXPIRES_KEY_SUFFIX;
    const expiresTime = await AsyncStorage.getItem(expiresKey);
    // console.log(
    //   "Storage get , expiresKey = %s , expiresTime = %o",
    //   expiresKey,
    //   expiresTime
    // );
    // 存在超时时间
    if (expiresTime) {
      // 当前时间毫秒值
      const currentTime = new Date().getTime();
      // console.log("currentTime = ", currentTime);
      // console.log("expiresTime = ", expiresTime);
      // console.log("distance = ", currentTime - parseFloat(expiresTime));
      // 比对超时时间与当前时间，如果超时，返回 null
      if (currentTime >= parseFloat(expiresTime)) {
        // console.log("Storage get , time expired");
        return null;
      }
    }
    // 无超时时间限制或未超时，正常获取相关缓存信息
    return AsyncStorage.getItem(key).then(value =>
      value !== null ? JSON.parse(value) : defaultValue,
    );
  }
  const message = 'Storage.get 参数 key 无效';
  const error = new Error(message);
  console.error(error);
  throw error;
}

/**
 * 设置缓存并添加超时时长
 * @param {*} key  key
 * @param {*} value 值
 * @param {*} expires 超时时长（单位：秒）
 */
async function set(key, value, expires) {
  if (key) {
    // 拼接超时key
    const expiresKey = key + EXPIRES_KEY_SUFFIX;
    if (expires) {
      // console.log("Storage set , expires = ", expires);
      // 包含超时时间参数
      // 计算超时时间（毫秒值）
      const expiresTime = new Date().getTime() + expires * 1000;
      // console.log("Storage set , expiresTime = ", expiresTime.toString());
      // 存储超时时间到缓存
      await AsyncStorage.setItem(expiresKey, expiresTime.toString());
    } else {
      // console.log("Storage set , 存在相同Key ,删除原 %s 缓存", expiresKey);
      // 相同 key 重复存储时，如果未设置超时，则删除超时 key 记录
      await AsyncStorage.removeItem(expiresKey);
    }
    return AsyncStorage.setItem(key, JSON.stringify(value));
  }
  const message = 'Storage.set 参数 key 无效, key' + key;
  const error = new Error(message);
  console.error(error);
  throw error;
}

function remove(key) {
  if (key) {
    return AsyncStorage.removeItem(key);
  }
  const message = 'Storage.remove 参数 key 无效';
  const error = new Error(message);
  console.error(error);
  throw error;
}

function multiGet(...keys) {
  return AsyncStorage.multiGet([...keys]).then(stores => {
    const data = {};
    stores.forEach((result, i, store) => {
      data[store[i][0]] = JSON.parse(store[i][1]);
    });
    return data;
  });
}

function multiRemove(...keys) {
  if (keys) {
    return AsyncStorage.multiRemove([...keys]);
  }
  const message = 'Storage.multiRemove 参数 keys 无效';
  console.error(message);
  const error = new Error(message);
  throw error;
}

export default {
  clear,
  get,
  set,
  remove,
  multiGet,
  multiRemove,
};
