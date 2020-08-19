/**
 * 通讯录操作工具类
 * @author liuyi
 */
import { PermissionsAndroid, Platform, Alert } from "react-native";
import * as Contacts from "react-native-contacts";
import ToastUtils from "./toast";
import createSchema from './Schema'

/**
 * 将 person 对象中存储的信息添加到系统通讯录
 * @param item {object | array} 被添加的单个对象或数组
 */
export function addPersonToContacts(item) {
  if (Platform.OS === "ios") {
    addIOSContacts(item);
  } else {
    addAndroidContacts(item);
  }
}

/**
 * 点击树状图根据父节点parentId获取子节点数据
 * @param deptInfo {object | array} 点击当前节点部门信息
 */
export const getChildrenList = async (deptInfo) => {
  let childrenList = []
  let links = []
  let isPerson = true
  await createSchema('Dept', `parentId='${deptInfo.deptId}'`).then(async (deptList) => {
    // 判断当前节点的子节点是部门还是人员，
    if (deptList.length > 0) {
      isPerson = false

      // 查询dept表
      for (let tempDeptList of deptList) {
        const { deptId, deptName, deptLevel, endFlag, orderNum, parentId, totalUserNum, fromUnit, unitType } = tempDeptList
        childrenList.push({
          // ...tempDeptList,
          deptId,
          deptName,
          deptLevel,
          endFlag,
          orderNum,
          parentId,
          totalUserNum,
          fromUnit,
          unitType,

          title: deptName,
          children: [],
          name: 'xiwei',
          expansion: false,
          id: "hrmdepartment377338",
          selected: false,
          type: 0,
          weight: 2
        })
      }
    }
  })
  if (isPerson) {

    await createSchema('Link', `deptId='${deptInfo.deptId}'`).then((linkList) => {
      // 查询links表
      for (let tempLinkList of linkList) {
        console.log('linkList------进入', linkList.length)
        links.push({
          deptId: tempLinkList.userId,   //这里主要是分享邮件
          userId: tempLinkList.userId,
          // expansion: false,
          // id: "hrmdepartment4078",
          // selected: false,
          // deptName: tempLinkList.deptName,
          // type: 0,
          // weight: 0,
        })
      }
    })
    // "fromUnit":"1":部门  "fromUnit":"0":公司
    if (links.length > 0) {
      // 查询user表
      for (let i = 0; i < links.length; i++) {
        await createSchema('User', `userId='${links[i].userId}'`).then((userList) => {
          for (let tempUserList of userList) {
            childrenList.push({
              avatar: "",
              company: "中化辽宁公司",
              department: deptInfo.deptName,
              email: tempUserList.email,
              id: links[i].userId,
              deptId: links[i].deptId,
              phone: tempUserList.mobile,
              postTitle: deptInfo.deptName,
              selected: false,
              userName:tempUserList.userName,
              tel:tempUserList.workTel,
              slt:'',
              type: 1,
              weight: 0,
            })
          }
        })
      }
    }
  }
  console.log('childrenList----', childrenList)
  return childrenList
}

/**
 * 搜索
 * @param pageIndex {string | string} 分页长度,
 * @param deptInfo {object | array} 点击当前节点部门信息
 */
export const getSearchResultList = async (pageIndex,userName) => {
  let users = []
  let usersAndLinks = []
  let searchResultList = []
  let total;

  let startIndex = pageIndex * 10 -10  //开始索引
  let endIndex = pageIndex * 10-1  //结束索引

  console.warn(`查询从${startIndex}--${endIndex}`)
  // 查询出人员表
  await createSchema('User', `userName CONTAINS '${userName}'`).then(async (userList) => {
    console.log('UserList------进入', userList.length)
    total=userList.length
    for (let tempUserList of userList) {
      console.warn('UserList------遍历', userList.length)
      users.push({
        userName: tempUserList.userName,
        userId: tempUserList.userId,
        email:tempUserList.email,
        mobile: tempUserList.mobile,
        mobile2: tempUserList.mobile2,
      })
    }
  })
  console.warn('users结果>>>>>>>>>>>>>>', users)

  // 根据人员表连接link表
  for (let i = startIndex; i <= endIndex; i++) {
    console.warn('indo-------',users[i].userId)
    await createSchema('Link', `userId = '${users[i].userId}'`).then(async (linkList) => {
      console.log('LinkList------进入', linkList.length)

      for (let tempLinkList of linkList) {
        console.log('LinkList遍历------', tempLinkList)
        usersAndLinks.push({
          userName: users[i].userName,
          userId: users[i].userId,
          deptId: tempLinkList.deptId,
          email:users[i].email,
           mobile: users[i].mobile,
          mobile2: users[i].mobile2,
        })
      }
    })
  }
  console.warn('usersAndLinks结果->>>>>>>>>>>>>>', usersAndLinks)


  // 连接dept表
  for (let j = 0; j <= 9; j++) {
    await createSchema('Dept', `deptId = '${usersAndLinks[j].deptId}'`).then(async (deptList) => {
      console.log('deptList------进入', deptList.length)

      for (let tempDeptList of deptList) {
        // console.log('linkList------进入', userList.length)
        searchResultList.push({
          userName: usersAndLinks[j].userName,
          userId: usersAndLinks[j].userId,
          deptId: usersAndLinks[j].deptId,

          avatar: "",
          company: "中化辽宁公司",
          department: tempDeptList.deptName,
          email:  usersAndLinks[j].email,
          id: usersAndLinks[j].userId,
          loginId: "limin",
          phone: usersAndLinks[j].mobile,
          postTitle: tempDeptList.deptName,
          // post:"公司领导1",
          selected: false,
          tel: "0411-39057877",
          title: usersAndLinks[j].userName,
          type: 1,
          weight: 0,
          slt:'',
        })
      }
    })
  }
  console.warn('搜索结果数据->>>>>>>>>>>>>>', searchResultList)

  let searchResultListInfo={
    total,
    searchResultList
  }

  return searchResultListInfo

}

function addIOSContacts(item) {
  Contacts.checkPermission((err, permission) => {
    if (err) throw err;
    // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
    if (permission === "undefined") {
      Contacts.requestPermission((err, permission) => {
        if (err) throw err;
        if (permission === "denied") {
          // 拒绝
          Alert.alert("访问通讯录权限没打开", "请在iPad的“设置-隐私”选项中,允许访问您的通讯录");
          return;
        }
        if (permission === "authorized") {
          // 同意!
          addDataToContacts(item);
        }
      });
      return;
    }
    if (permission === "denied") {
      // 已经拒绝
      Alert.alert("访问通讯录权限没打开", "请在iPad的“设置-隐私”选项中,允许访问您的通讯录");
      return;
    }
    if (permission === "authorized") {
      // 同意!
      addDataToContacts(item);
    }
  });
}
// 添加读写权限
requestReadPermission = async () => {
  try {
    //返回string类型
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BODY_SENSORS
    )


    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("你已获取了读写权限")
    } else {
      console.log("获取读写权限失败", granted)
    }
  } catch (err) {
    this.show(err.toString())
  }
};
async function addAndroidContacts(item) {
  try {

    // 同时获取通讯录的读、写权限
    const permissions = [
      PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    ]
    const granteds = await PermissionsAndroid.requestMultiple(permissions, {
      title: "申请读取通讯录权限",
      message:
        "需要使用您的通讯录权限方便进行保存到通讯录操作。",
      buttonNeutral: "等会再问我",
      buttonNegative: "不行",
      buttonPositive: "好吧"
    })

    if (granteds["android.permission.WRITE_CONTACTS"] === "granted" && granteds["android.permission.READ_CONTACTS"] === "granted") {
      console.log("现在你获得通讯录权限了");
      addDataToContacts(item);
    } else {
      console.log("用户并不屌你", granteds);
    }
  } catch (err) {
    console.warn(err);
  }
}


/**
 * 判断被添加的数据是单个人员还是数组, 动态选择处理方式
 * @param item 被添加的数据
 */
function addDataToContacts(item) {
  if (!item) {
    ToastUtils.show("添加失败");
    return;
  }
  if (Array.isArray(item)) {
    for (const person of item) {
      addContacts(person);
    }
    return;
  }
  addContacts(item);
}


/**
 * 将单个用户添加到通讯录
 * @param person 被添加的人
 */
function addContacts(person) {
  console.log("保存到通讯录的 person = ", person);
  const {
    id: personId,
    title: personName,
    phone,
    tel,
    email,
    postTitle: jobTitle,
    company
  } = person;
  const newPerson = { recordID: personId, givenName: personName };
  if (phone || tel) {
    const phoneNumbers = [];
    if (phone) {
      phoneNumbers.push({
        label: "手机",
        number: phone
      });
    }
    if (tel) {
      phoneNumbers.push({
        label: "座机",
        number: tel
      });
    }
    newPerson["phoneNumbers"] = phoneNumbers;
  }
  if (email) {
    newPerson["emailAddresses"] = [{
      label: "工作",
      email: email
    }];
  }
  if (jobTitle) {
    newPerson["jobTitle"] = jobTitle;
  }
  if (company) {
    newPerson["company"] = company;
  }
  console.log("保存到通讯录的数据 = ", JSON.stringify(newPerson));
  // ToastUtils.show("保存到通讯录成功");
  Contacts.addContact(newPerson, (err) => {
    if (err) {
      ToastUtils.show("保存到通讯录失败");
      throw err;
    }
    ToastUtils.show("保存到通讯录成功");
  });
}
