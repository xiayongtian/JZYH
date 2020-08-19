import React from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Linking
} from "react-native";
import { withNavigation } from "react-navigation";
import { connect } from "react-redux";
import { AutoText, Popover } from "../../components";
import { ToastUtils, Storage, LoadingUtils } from "../../utils";
import { CacheConfigConstants } from "../../config/cacheConfigConstants";
import commonRequestParamsConfig from "../../config/global/commonRequestParamsConfig";
import Proptypes from "prop-types";
import * as WeChat from "react-native-wechat";
import * as ContactsUtils from "../../utils/ContactsUtils";

class ContactDetail extends React.Component {
  static proptypes = {
    oldRightItem: Proptypes.string,
    callback: Proptypes.func // 树的根节点ID
  };

  // 设置 prop 默认值
  static defaultProps = {
    oldRightItem: "tree",
    callback: () => {
    } // 点击人员默认执行空函数
  };

  constructor(props) {
    super(props);
    this.state = {
      favoriteIconFlag: "未收藏",
      personId: "",
      person: "",
      isFinished: true,
    };
    WeChat.registerApp(commonRequestParamsConfig.CONTACT_WX_SHARE_APPID);
  }

  componentDidMount() {
    console.log("componentDidMount----");

    let {
      contactsPersonDetail: { personId },
      contactsTree: { personDetail }
    } = this.props;
    const person = {
      // Code: "214120",
      id: personDetail.id,
      company: personDetail.company,
      // CompanyId: "hrmsubcompany47661",
      department: personDetail.department,

      // DepartmentId: "hrmdepartment219771",
      email: personDetail.email,
      // id: "214120",
      // LoginId: "jiangzhenghong@sinochem.com2141201",
      userName: personDetail.userName,
      // PKey: null,
      parentCode: personDetail.postTitle,
      personDesc: personDetail.department,
      phone: personDetail.phone,
      post: personDetail.postTitle,
      // PostCode: null,
      // SCode: "FW",
      // SubsubcomId: "hrmsubcompany61",
      tel: personDetail.tel,
      // UserPhotoBase64: "",
      // Weight: 0
    }

    this.setState({ personId, person: person })
    this.initUserDetail();
    this.initVisitCache(person);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let {
      contactsPersonDetail: { personId } // 目标用户的 id (数字)
    } = this.props;
    console.log('-------componentWillReceiveProps-----', this.props, personId, this.state.person.id)

    // console.log("componentWillReceiveProps");
    // let fullScreenFlag = this.props.navigation.getParam("fullScreenFlag");
    // if (fullScreenFlag === "fullScreen") {
    //   personId = this.props.navigation.getParam("personId");
    // }
    // 最近访问 重新渲染数据
    if (personId !== this.state.person.id) {
      this.initUserDetail();
      // this.setState({ personId, person })

      // this.initVisitCache();

    }
  }

  initUserDetail = async () => {
    // const userOrgInfo = await Storage.get(CacheConfigConstants.user.USER_ORG);
    // let {
    //   login: {
    //     userInfo: { userId } // 带邮箱的用户名
    //   },
    let { contactsPersonDetail: { personId }, contactsTree: { personDetail } // 目标用户的 id (数字)
    } = this.props;
    // if (this.state.personId === personId) {
    //   return;
    // }
    // // console.log("拦截多次的人员详情请求");


    await this.setState({ personId, person: personDetail });
    // let fullScreenFlag = this.props.navigation.getParam("fullScreenFlag");
    // if (fullScreenFlag === "fullScreen") {
    //   personId = this.props.navigation.getParam("personId");
    // }
    // await this.getUserDetail(personId, userId, userOrgInfo);
    this.isFavorite(personDetail);

  };

  /**
   * 获取用户个人信息
   */
  getUserDetail = async (personId, userId, userOrgInfo) => {
    const newState = await this.props.dispatch({
      type: "contactsPersonDetail/getPersonDetail",
      payload: {
        uid: personId,
        userCode: userId,
        Scode: userOrgInfo.SCode,
        appID: commonRequestParamsConfig.APP_ID
      }
    });

    const {
      contactsPersonDetail: { person }
    } = newState;
    await this.setState({ person });
  };

  //添加最新访问缓存
  initVisitCache = async (person) => {

    const userOrgInfo = await Storage.get(CacheConfigConstants.user.USER_ORG);
    // let {
    //   login: {
    //     userInfo: { userId } // 带邮箱的用户名
    //   },
    //   contactsPersonDetail: { personId } // 目标用户的 id (数字)
    // } = this.props;
    // let fullScreenFlag = this.props.navigation.getParam("fullScreenFlag");
    // if (fullScreenFlag === "fullScreen") {
    //   personId = this.props.navigation.getParam("personId");
    // }

    // this.props
    //   .dispatch({
    //     type: "contactsPersonDetail/getPersonDetail",
    //     payload: {
    //       uid: personId,
    //       userCode: userId,
    //       Scode: userOrgInfo.SCode,
    //       appID: commonRequestParamsConfig.APP_ID
    //     }
    //   })
    //   .then(newState => {
    //     const {
    //       contactsPersonDetail: { person }
    //     } = newState;
    //     this.addVisitCache(person);
    //   });
    this.addVisitCache(person);
  };

  addVisitCache = async person => {
    // console.log("person======", person);
    let visitCache =
      (await Storage.get(CacheConfigConstants.lastVisit.LAST_VISIT)) == null
        ? []
        : await Storage.get(CacheConfigConstants.lastVisit.LAST_VISIT);
    let judgeRepeatVisit =
      (await Storage.get(CacheConfigConstants.lastVisit.JUDGE_REPEAT_VISIT)) == null
        ? []
        : await Storage.get(CacheConfigConstants.lastVisit.JUDGE_REPEAT_VISIT);
    // console.log(visitCache);
    // 判断是否重复
    if (judgeRepeatVisit.indexOf(person.id) == -1) {
      judgeRepeatVisit.push(person.id);
      await Storage.set(CacheConfigConstants.lastVisit.JUDGE_REPEAT_VISIT, judgeRepeatVisit);
      visitCache.unshift(person);
    } else {
      visitCache.map((item, index, arr) => {
        if (item.id == person.id) {
          arr.splice(index, 1);
          arr.unshift(person);
        }
      });
    }
    console.log("中间的visitCache======================", visitCache);
    await Storage.set(CacheConfigConstants.lastVisit.LAST_VISIT, visitCache);
    this.immediateVisit(visitCache);
    // console.log(visitCache)
  };

  //实时更新最新访问列表
  immediateVisit = lastVisitList => {
    const { dispatch } = this.props;
    // this.props.leftClickCallBack("tree");
    dispatch({
      type: "contacts/updateVisitList",
      payload: {
        lastVisitList
      }
    });
  };

  /**
   * 验证是否已收藏
   */
  isFavorite = async (personDetail) => {
    const favoriteList = await Storage.get('favorite');
    const favorite = favoriteList.find(item => {
      return item.id == personDetail.id
    })
    console.warn('haha=>>', favorite)
    this.setState({
      favoriteIconFlag: favorite ? "已收藏" : "未收藏"
    });
  };

  favoriteOps = async () => {
    // id: "8a80c6533629df2f01362e3b9a95023a"
    // company: "中化辽宁公司"
    // department: "财务部"
    // email: "6eY5klCjyhosiLAgM+4yCIozt4rioSYw"
    // personDesc: "财务部"
    // phone: "amT0mvbfbn200XMadTqDQA=="
    // tel: "0411-39057877"


    // const userOrgInfo = await Storage.get(CacheConfigConstants.user.USER_ORG);
    // let {
    //   login: { userInfo },
    //   contactsPersonDetail: { person, personId },
    //   dispatch
    // } = this.props;
    // let fullScreenFlag = this.props.navigation.getParam("fullScreenFlag");
    // if (fullScreenFlag === "fullScreen") {
    //   personId = this.props.navigation.getParam("personId");
    // }
    // if (this.state.favoriteIconFlag === "已收藏") {
    //   //取消收藏
    //   dispatch({
    //     type: "contacts/delPortalContact",
    //     payload: {
    //       ContractID: personId,
    //       UserCode: userInfo.userId,
    //       SCode: userOrgInfo.SCode,
    //       appID: commonRequestParamsConfig.APP_ID,
    //       userid: userInfo.userCode
    //     }
    //   }).then(result => {
    //     LoadingUtils.hide();
    //     if (result) {
    //       this.setState({
    //         favoriteIconFlag: "未收藏"
    //       });
    //       ToastUtils.show("取消收藏");
    //     } else {
    //       ToastUtils.show("操作失败");
    //     }
    //     this.setState({
    //       isFinished: true
    //     });
    //   });
    // } else {
    //进行收藏
    // dispatch({
    //   type: "contacts/addPortalContact",
    //   payload: {
    //     company: person.company,
    //     ContractID: person.id,
    //     department: person.department,
    //     DisplayName: person.userName,
    //     id: person.id,
    //     MName: person.userName,
    //     MTelNo: person.phone,
    //     post: person.post,
    //     SCode: userOrgInfo.SCode,
    //     UserCode: userInfo.userId,
    //     Weight: person.Weight,
    //     appID: commonRequestParamsConfig.APP_ID,
    //     loginId: person.LoginId,
    //     userid: userInfo.userCode
    //   }
    // }).then(result => {
    let tempFavoriteList = []
    const favoriteList = await Storage.get('favorite');
    console.warn('favoriteList====>', favoriteList)
    if (this.state.favoriteIconFlag === "已收藏") {
      this.setState({
        favoriteIconFlag: "未收藏"
      });
      // 删除Storage中保存的收藏数据
      if (favoriteList && favoriteList.length > 0) {
        let itemIndex;
        favoriteList.find((item, index) => {
          itemIndex = index
          return item.id == this.state.person.id
        })
        favoriteList.splice(itemIndex, 1)
        tempFavoriteList = favoriteList
      }
    } else {
      this.setState({
        favoriteIconFlag: "已收藏"
      });
      // 添加Storage中保存的收藏数据
      if (favoriteList && favoriteList.length > 0) {
        favoriteList.unshift(this.state.person)
        tempFavoriteList = favoriteList
      } else {
        tempFavoriteList.push(this.state.person)
      }
    }
    await Storage.set('favorite', tempFavoriteList);

    // LoadingUtils.hide();
    // if (result) {
    //   this.setState({
    //     favoriteIconFlag: "已收藏"
    //   });
    //   ToastUtils.show("收藏成功");
    // } else {
    //   ToastUtils.show("操作失败");
    // }
    this.setState({
      isFinished: true
    });
    // });
    // }
  };

  wechatShare = () => {
    // const {
    //   contactsPersonDetail: { person }
    // } = this.props;
    let person = {
      userName: 'xiawei',
      company: '辽宁',
      department: '山西',
      post: "90",
      email: '2290545426@qq.com',
      phone: '18170873540',
      tel: '18170873540'
    }
    let str = `姓名：${person.userName} \n公司：${person.company} \n部门：${person.department} \n职务：${person.post} \n邮箱：${person.email} \n手机：${person.phone} \n座机：${person.tel}`;
    WeChat.isWXAppInstalled().then(isInstalled => {
      if (isInstalled) {
        WeChat.shareToSession({
          type: "text",
          description: str
        }).catch(error => {
          ToastUtils.show(error.message);
        });
      } else {
        ToastUtils.show("没有安装微信软件，请您安装微信之后再试");
      }
    });
  };

  /**
   * 将联系人下载到通讯录
   */
  downloadContacts = () => {
    const { person } = this.state;
    const {
      id: id,
      userName: userName,
      phone: phone,
      tel: tel,
      email: email,
      post: postTitle,
      company: company
    } = person;
    ContactsUtils.addPersonToContacts({
      id,
      userName,
      phone,
      tel,
      email,
      postTitle,
      company
    });
  };

  ////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////
  /////////////////                            ///////////////////////
  /////////////////      以下是绘制页面部分      ///////////////////////
  /////////////////                           ////////////////////////
  ////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////

  /**
   * 绘制返回箭头
   */
  renderBackButton = () => {
    let { oldRightItem } = this.props;

    // oldRightItem = oldRightItem === "contactsDetail" ? "tree" : oldRightItem;
    oldRightItem = "contactsDetail"
    // console.log('oldRightItem===============',oldRightItem)
    return (
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 28,
          left: 15,
          zIndex: 4
        }}
        onPress={() => {

          // let fullScreenFlag = this.props.navigation.getParam("fullScreenFlag");
          let fullScreenFlag = "fullScreen"
          if (fullScreenFlag === "fullScreen") {
            console.log('--------', this.props)
            this.props.navigation.goBack();
          } else {
            this.props.backButtonCallback();
            this.props.callback({ type: oldRightItem });
          }
        }}
      >
        <Image source={require("../../images/contacts/icon_white_back.png")} />
      </TouchableOpacity>
    );
  };

  /**
   * 绘制头像部分
   */
  renderAvatar = (userName, photoBase64) => {
    // let fullScreenFlag = this.props.navigation.getParam("fullScreenFlag");
    if (photoBase64) {
      photoBase64 = { uri: "data:image/png;base64," + photoBase64 };
    } else {
      photoBase64 = require("../../images/contacts/icon_default_avatar.png");
    }
    return (
      <ImageBackground
        style={{
          height: 250,
          width: "100%",
          resizeMode: "cover",
          overflow: "hidden",
          // borderTopLeftRadius: fullScreenFlag === "fullScreen" ? 0 : 24,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          zIndex: 0
        }}
        imageStyle={{
          overflow: "hidden",
          // borderTopLeftRadius: fullScreenFlag === "fullScreen" ? 0 : 24,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          zIndex: 1
        }}
        blurRadius={1}
        source={photoBase64}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.24)",
            justifyContent: "center",
            alignItems: "flex-start",
            zIndex: 2
          }}
        >
          <Image
            style={{ marginLeft: 30, width: 60, height: 60, borderRadius: 29, zIndex: 3 }}
            source={photoBase64}
          />
          <AutoText
            style={{
              marginLeft: 30,
              fontWeight: "bold",
              fontSize: 22,
              color: "#fff",
              marginTop: 15,
              zIndex: 2
            }}
          >
            {userName}
          </AutoText>
        </View>
      </ImageBackground>
    );
  };

  /**
   * 绘制 收藏 分享 下载 三个按钮
   * @param personId 当前展示人员的 id
   */
  renderOtherButton = personId => {
    let favoriteIcon =
      this.state.favoriteIconFlag === "已收藏"
        ? require("../../images/contacts/icon_collected.png")
        : require("../../images/contacts/icon_collect.png");

    const buttons = [
      {
        text: "收藏",
        //icon: require("../../images/contacts/icon_star.png"),
        icon: favoriteIcon,
        onPress: () => {
          if (this.state.isFinished)
            this.setState({
              isFinished: false
            }, () => {
              // LoadingUtils.show(72);
              this.favoriteOps();
            });
        }
      },
      {
        text: "分享",
        icon: require("../../images/contacts/icon_share.png"),
        onPress: () => {
          this.wechatShare();
        }
      },
      {
        text: "下载",
        icon: require("../../images/contacts/icon_download.png"),
        onPress: () => {
          console.log('下载')
          this.downloadContacts();
        }
      }
    ];
    const buttonsDom = buttons.map((item, index) => {
      return (
        <TouchableOpacity
          key={index + ""}
          onPress={item.onPress}
          style={{
            width: 65,
            minHeight: 21,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Image style={{ width: 20, height: 20 }} source={item.icon} />
          <View
            style={{ minWidth: 20, minHeight: 20, justifyContent: "center", alignItems: "center" }}
          >
            <AutoText style={{ fontSize: 16, color: "#424141", marginLeft: 10 }}>
              {item.text}
            </AutoText>
          </View>
        </TouchableOpacity>
      );
    });
    return (
      <View
        style={{
          height: 73,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 13,
          backgroundColor: "#fff",
          marginHorizontal: 15
        }}
      >
        {buttonsDom}
      </View>
    );
  };

  /**
   * 绘制人员详情
   */
  renderDetail = personDetail => {
    // const {
    //   fontConfig: { fontScale }
    // } = this.props;
    console.log('职务', personDetail)
    let fontScale = 1
    return (
      <FlatList
        data={personDetail}
        contentContainerStyle={{
          marginTop: 30,
          marginLeft: 30,
          paddingBottom: 50
        }}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                height: 50 * fontScale,
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                marginVertical: 15
              }}
            >
              <View style={{ flex: 1 }}>
                <AutoText style={{ fontSize: 14, color: "#92949F", marginBottom: 15 }}>{item.title}</AutoText>
                <AutoText style={{ fontSize: 16, color: "#424141" }}>{item.content}</AutoText>
              </View>
              {item.icon ? (
                <TouchableOpacity
                  onPress={() => {
                    item.onPressIcon();
                  }}
                  style={{
                    width: 18,
                    height: 18,
                    marginRight: 31
                  }}
                >
                  <Image style={{ width: 18, height: 18 }} source={item.icon} />
                </TouchableOpacity>
              ) : null}
            </View>
          );
        }}
      />
    );
  };

  render() {

    // let fullScreenFlag = this.props.navigation.getParam("fullScreenFlag");
    let fullScreenFlag = "fullScreen"

    if (fullScreenFlag === "fullScreen") {
      // personId = this.props.navigation.getParam("personId");
      personId = '8a8044a25b85ba45015b88e519d903f5'
    }

    // const person = {
    //   Code: "214120",
    //   company: "中化能源股份有限公司",
    //   CompanyId: "hrmsubcompany47661",
    //   department: "公司领导",
    //   DepartmentId: "hrmdepartment219771",
    //   email: "test-jiangzhenghong@sinochem.com",
    //   id: "214120",
    //   LoginId: "jiangzhenghong@sinochem.com2141201",
    //   userName: "江正洪",
    //   PKey: null,
    //   parentCode: "公司领导",
    //   personDesc: "总经理",
    //   phone: "15901007286",
    //   post: "总经理",
    //   PostCode: null,
    //   SCode: "FW",
    //   SubsubcomId: "hrmsubcompany61",
    //   tel: "010-59569322",
    //   UserPhotoBase64: "",
    //   Weight: 0
    // }
    if (!this.state.personId || JSON.stringify(this.state.person) === "{}") {
      return <View />;
    }

    console.log('tete0-==========', this.state.person)
    return (
      <>
        {this.renderBackButton()}
        {this.renderAvatar(this.state.person.userName, this.state.person.UserPhotoBase64)}
        <View style={{ flex: 1, position: "relative", top: -37 }}>
          {this.renderOtherButton(personId)}
          {this.renderDetail(extractPersonDetailToArray(this.state.person))}
        </View>
      </>
    );
  }
}

export default connect(state => {
  return { ...state };
})(ContactDetail);

// export default ContactDetail;


/**
 * 将人员详情 从 接口数据中变成数组,方便画 DOM
 * @param originObj 源对象
 */
function extractPersonDetailToArray(originObj) {
  let personDetail = [];
  personDetail.push({
    title: "公司",
    content: originObj.company,
    icon: null,
    onPressIcon: null
  });
  personDetail.push({
    title: "部门",
    content: originObj.department,
    icon: null,
    onPressIcon: null
  });
  personDetail.push({
    title: "职务",
    content: originObj.post, //postTitle
    icon: null,
    onPressIcon: null
  });
  personDetail.push({
    title: "手机号",
    content: originObj.phone,
    icon: null,
    onPressIcon: null
  });
  personDetail.push({
    title: "座机",
    content: originObj.tel,
    // icon: require("../../images/contacts/icon_message.png"),
    onPressIcon: null
  });
  personDetail.push({
    title: "邮箱",
    content: originObj.email,
    icon: require("../../images/contacts/icon_email.png"),
    onPressIcon: () => sendEmail(originObj.email)
  });
  return personDetail;
}

//发送邮件操作
const sendEmail = email => {
  Linking.canOpenURL(email)
    .then(() => {
      // console.log('emailStr=================',emailStr)
      Linking.openURL(`mailto:${email}`);
    })
    .catch(err => {
      console.log("An error occurred", err);
      ToastUtils.show(`操作失败,请检查是否已登录邮箱:${err}`);
    });
};
