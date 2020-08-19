import { ToastUtils} from './toast';
//获取文件扩展名
export function getSuffix(fileName){
    var suffix = "";
    var lastIndex = fileName.lastIndexOf(".");
    if (lastIndex != -1) { //存在.
        var tmpName = fileName.substring(lastIndex + 1); //截取.后内容
        //判断后面是否有？及&
        var endIndex = tmpName.indexOf("?");
        if (endIndex == -1) {
            endIndex = tmpName.indexOf("&");
        }
        if (endIndex != -1) { //存在其它符号,截取.与其它符号间的内容做为扩展名
            suffix = tmpName.substring(0, endIndex);
        } else { //文件名为url最后内容
            suffix = fileName.substring(lastIndex + 1);
        }
        suffix = suffix.toLowerCase();
        return suffix.replace(/\n/g, "");
    }
    return "";
}
/**
 * 判断是否为支持的office附件类型
 */
export function isSupporOfficetAttachment(fileSuffix) {
    if (fileSuffix == undefined) {
        ToastUtils.show("$.hori.isSupporOfficetAttachment():调用错误，没有传递文件扩展名参数");
        return false;
    }
    var isSupport = false; //是否为支持的文件
    switch (fileSuffix) {
        case "doc":
            isSupport = true;
            break;
        case "docx":
            isSupport = true;
            break;
        case "xls":
            isSupport = true;
            break;
        case "xlsx":
            isSupport = true;
            break;
        case "ppt":
            isSupport = true;
            break;
        case "pptx":
            isSupport = true;
            break;
        case "pdf":
            isSupport = true;
            break;
        case "wps":
            isSupport = true;
            break;
        default:
            isSupport = false;
    }
    return isSupport;
}
/**
 * 判断是否为支持的附件类型
 */
export function isSupportAttachment(fileSuffix) {
    if (fileSuffix == undefined) {
        ToastUtils.show("$.hori.isSupportAttachment():调用错误，没有传递文件扩展名参数");
        return false;
    }
    var isSupport = false; //是否为支持的文件
    switch (fileSuffix) {
        case "doc":
            isSupport = true;
            break;
        case "docx":
            isSupport = true;
            break;
        case "xls":
            isSupport = true;
            break;
        case "xlsx":
            isSupport = true;
            break;
        case "XLS":
            isSupport = true;
            break;
        case "XLSX":
            isSupport = true;
            break;
        case "ppt":
            isSupport = true;
            break;
        case "pptx":
            isSupport = true;
            break;
        case "pdf":
            isSupport = true;
            break;
        case "txt":
            isSupport = true;
            break;
        case "jpg":
            isSupport = true;
            break;
        case "png":
            isSupport = true;
            break;
        case "wps":
            isSupport = true;
            break;
        case "zip":
            isSupport = true;
            break;
        case "rar":
            isSupport = true;
            break;
        default:
            isSupport = false;
    }
    if (!isSupport) {
        ToastUtils.show("系统不能预览此文件！");
        $.hori.loading("hide");
    }
    return isSupport;
}
export function setUserStoreUrl(url) {
    console.log("=======setUserStoreUrl"+url);
    // const dataUserstore = await Storage.get(cacheConfig.user.USERSTORE);
    console.log("=========setUserStoreUrl,dataUserstore"+dataUserstore);
    return targetUrl;
  }
export default {
    getSuffix,isSupporOfficetAttachment,isSupportAttachment,setUserStoreUrl
};