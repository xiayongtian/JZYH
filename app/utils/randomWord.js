/**
 * 生成随机字符串
 * @param {boolean} randomFlag 产生任意长度随机字母数字组合
 * @param {number} min 是否任意长度 min 任意长度最小位[固定位数]
 * @param {number} max 任意长度最大位
 */
export default function randomWord(randomFlag, min, max) {
    let str = "",
        range = min,
        // arr = [
        //     'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
        //     'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        //     'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
        //     'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',];

        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;// 任意长度
    }
    for (let i = 0; i < range; i++) {
        let pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }

    return str;
}