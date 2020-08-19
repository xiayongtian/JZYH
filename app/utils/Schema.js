/**
 * 创建通讯录数据库，查询表
 */
import Realm from 'realm';
import Contacts from '../../app/pages/Contact/Contacts.json'
//用户表
const UserSchema = {
    name: 'User',
    // primaryKey: 'id',
    properties: {
        // id: 'int',
        email: 'string',
        mobile: 'string',
        mobile2: 'string',
        trueName: 'string',
        officeNo: 'string',
        userId: 'string',
        userName: 'string',
        workTel: 'string',
        idcNumber: 'string',
        // depts: 'Dept[]'
        // depts: { type: 'linkingObjects', objectType: 'Dept', property: 'users' }
    }
};

//部门表
const DeptSchema = {
    name: 'Dept',
    properties: {
        deptId: 'string',
        deptLevel: 'string',
        deptName: 'string',
        endFlag: 'string',
        orderNum: 'string',
        parentId: 'string',
        totalUserNum: 'string',
        fromUnit: 'string',
        unitType: 'string',
        // users: 'User[]',
    }
};

//部门和用户连接表
const LinkSchema = {
    name: 'Link',
    properties: {
        deptId: 'string',
        orderNum: 'string',
        userId: 'string',
        userCode: 'string',
        // cars: 'Car[]',
    }
};


/**
 * objects查询语句
 * @param {*} realm 实例
 * @param {*} objects 表对象
 * @param {*} selectFilter 过滤条件
 */
const selectSchema = (realm, objects, selectFilter) => {

    return realm.objects(objects).filtered(selectFilter);

}

/**
 * 创建数据库
 * @param {*} objects 表对象  如果objects传入数据，createSchema只是查询表
 * @param {*} selectFilter 过滤条件
 */
export default createSchema = async (objects, selectFilter) => {
    let result;
    await Realm.open({ schema: [UserSchema, DeptSchema, LinkSchema] })
        .then(realm => {
            // 创建表数据
            if (realm.objects('User').length == 0) {
                realm.write(() => {
                    for (let i = 0; i < Contacts.users.length; i++) {
                        realm.create('User', {
                            email: Contacts.users[i].email,
                            mobile:  Contacts.users[i].mobile,
                            mobile2:  Contacts.users[i].mobile2,
                            trueName:  Contacts.users[i].trueName,
                            officeNo:  Contacts.users[i].officeNo,
                            userId:  Contacts.users[i].userId,
                            userName:  Contacts.users[i].userName,
                            workTel:  Contacts.users[i].workTel,
                            idcNumber:  Contacts.users[i].idcNumber,
                        });
                    }

                    for (let i = 0; i < Contacts.links.length; i++) {
                        realm.create('Link', {
                            deptId: Contacts.links[i].deptId,
                            orderNum: Contacts.links[i].orderNum,
                            userId:Contacts.links[i].userId,
                            userCode: Contacts.links[i].userCode,
                        });
                    }

                    for (let i = 0; i < Contacts.depts.length; i++) {
                        realm.create('Dept', {
                            deptId: Contacts.depts[i].deptId,
                            deptLevel: Contacts.depts[i].deptLevel,
                            deptName: Contacts.depts[i].deptName,
                            endFlag: Contacts.depts[i].endFlag,
                            orderNum: Contacts.depts[i].orderNum,
                            parentId: Contacts.depts[i].parentId,
                            totalUserNum: Contacts.depts[i].totalUserNum,
                            fromUnit: Contacts.depts[i].fromUnit,
                            unitType: Contacts.depts[i].unitType,
                        });
                    }                        
                });
            }
            // alert(`Dept${realm.objects('Dept').length}`)
            // alert(`Link${realm.objects('Link').length}`)
            // alert(`User${realm.objects('User').length}`)
            // 查询数据
            if (objects) {
                result = selectSchema(realm, objects, selectFilter)
                console.log(`----------${objects}表数据查询结果----------`, result)
                return result
            }

        })
        .catch(error => {
            console.log(error);
        });
    return result;

}
