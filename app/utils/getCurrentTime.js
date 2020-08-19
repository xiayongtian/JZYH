
/**
 * 生成当前时间YYYYMMddHHMMSS
 */
export default function getCurrentTime() {
    var date = new Date();
    return date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes())+pad2(date.getSeconds())
}

function pad2(n) { return n < 10 ? '0' + n : n }