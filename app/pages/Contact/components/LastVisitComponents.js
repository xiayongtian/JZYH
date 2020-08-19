/**
 * 最近访问模块 - 通讯录首页 左下角
 * @author liuyi zhangyongxi
 */
import React from "react";
import { View, Image, FlatList, Text, Linking, TouchableOpacity } from "react-native";
import { AutoText } from "../../../components";
import { LoadingUtils, Storage } from "../../../utils";
import { CacheConfigConstants } from "../../../config/cacheConfigConstants";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";
import NoDataView, { NoDataType } from "../../../components/NoDataView";

class LastVisitComponents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { navigation } = this.props;
    // console.log("componentDidMount--------");
    // this.focusListener = navigation.addListener("didFocus", () => {
    //   console.log("切换页面回来执行了吗");
    //   this.getVisitCache();
    // });
    this.getVisitCache();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    // console.log("componentWillReceiveProps---------", nextProps);
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    // console.log("shouldComponentUpdate---------", nextProps);
    // const {
    //   contacts: {
    //     lastVisitList //最新访问数据
    //   }
    // } = this.props;
   
    // return !(lastVisitList.length == 0 && nextProps.contacts.lastVisitList.length == 0);
    return true
  }

  getVisitCache = async () => {
    let visitCache = await Storage.get(CacheConfigConstants.lastVisit.LAST_VISIT);
    // console.log("最新访问缓存================================", visitCache);
    if (visitCache) {
      if (visitCache.length == 0) {
        
        // this.props.contacts.deleteButton = false;
      }
    } else {
      // this.props.contacts.deleteButton = false;
    }
    this.immediateVisit(visitCache);
  };

  removeVisitCache = () => {
    let visitCache = [];
    this.immediateVisit(visitCache);

    Storage.remove(CacheConfigConstants.lastVisit.LAST_VISIT);
    Storage.remove(CacheConfigConstants.lastVisit.JUDGE_REPEAT_VISIT);
    // console.log("是不是清空访问缓存了================================", visitCache);
  };

  /**
   * 跳转到人员详情
   */
  goPersonDetail = async treeNode => {
    console.log("点击的人员 id 是", treeNode.id);
    const {
      contactsPersonDetail: { personId: oldPersonId }
    } = this.props;
    let personId = treeNode.id;
    if (oldPersonId != personId) {
      // LoadingUtils.show(18);
    }
    this.props.dispatch({
      type: "contactsPersonDetail/updatePersonId",
      payload: personId
    });
    // // 执行人员回调
    this.props.clickPerson({
      type: "contactsDetail",
      personId
    });
    await this.props.dispatch({
      type: "contactsTree/savePersonDetail",
      payload: {
        treeNode
      }
    });

    //添加最新访问缓存
    let visitCache =
      (await Storage.get(CacheConfigConstants.lastVisit.LAST_VISIT)) == null
        ? []
        : await Storage.get(CacheConfigConstants.lastVisit.LAST_VISIT);
    let judgeRepeatVisit =
      (await Storage.get(CacheConfigConstants.lastVisit.JUDGE_REPEAT_VISIT)) == null
        ? []
        : await Storage.get(CacheConfigConstants.lastVisit.JUDGE_REPEAT_VISIT);
    // console.log(visitCache);
    if (judgeRepeatVisit.indexOf(personId) == -1) {
      judgeRepeatVisit.push(personId);
      await Storage.set(CacheConfigConstants.lastVisit.JUDGE_REPEAT_VISIT, judgeRepeatVisit);
      visitCache.unshift(treeNode);
    } else {
      visitCache.map((item, index, arr) => {
        if (item.id == personId) {
          arr.splice(index, 1);
          arr.unshift(treeNode);
        }
      });
    }
    await Storage.set(CacheConfigConstants.lastVisit.LAST_VISIT, visitCache);
    this.immediateVisit(visitCache);
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
    // LoadingUtils.hide();
  };

  //渲染最近访问列表
  renderList = () => {
    let {
      contacts: {
        lastVisitList //最新访问数据
      }
    } = this.props;
    console.log('渲染访问缓存================================',lastVisitList);
    return (
      // <View><Text>12345</Text></View>

      <FlatList
        contentContainerStyle={{
          paddingTop: lastVisitList && lastVisitList.length > 0 ? 43 : 5,
          flexDirection: "column"
        }}
        data={lastVisitList}
        keyExtractor={(item, index) => index + ""}
        // ItemSeparatorComponent={<View style={{height: 10,}} />}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              // onPress={() => {
              //   console.log('点击了===================发送email')
              //   Linking.canOpenURL('zhangyongxiit@163.com')
              //     .then(supported => {
              //       // if (!supported) {
              //       //   console.log("Can't handle url: " + 'item.email');
              //       // } else {
              //         return Linking.openURL("mailto:zhangyongxiit@163.com");
              //       // }
              //     })
              //     .catch(err => console.error("An error occurred", err));
              // }}
              onPress={() => {
                this.goPersonDetail(item);
              }}
              key={item.id}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  marginBottom: 31,
                  marginLeft: 30
                }}
              >
                {/* 头像图片 */}
                <View
                  style={{
                    width: 40,
                    height: 40,
                    marginRight: 15,
                    marginTop: 5,
                    borderRadius: 20,
                    overflow: "hidden"
                  }}
                >
                  <Image
                    source={
                      item.UserPhotoBase64
                        ? { uri: "data:image/png;base64," + item.UserPhotoBase64 }
                        : require("../../../images/icons/userpic.png")
                    }
                    style={{
                      width: "100%",
                      height: "100%"
                      // borderTopLeftRadius: 20,
                      // borderTopRightRadius: 20,
                      // borderBottomRightRadius: 20,
                      // borderBottomLeftRadius: 20,
                      // overflow: "hidden"
                    }}
                  />
                </View>
                {/* 右侧文字 */}
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                    textAlign: "center"
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "flex-end",
                      marginBottom: 5
                    }}
                  >
                    <View style={{ marginRight: 15 }}>
                      <AutoText style={{ fontSize: 17, color: "#424141" }}>{item.userName}</AutoText>
                    </View>
                    <AutoText style={{ fontSize: 14, color: "#92949F" }}>{item.post}</AutoText>
                  </View>
                  {item.phone ? (
                    <View style={{}}>
                      <AutoText style={{ color: "#424141" }}>{item.phone}</AutoText>
                    </View>
                  ) : null}
                  <AutoText
                    style={{ width: 210, marginTop: 7, fontSize: 14, color: "#92949F" }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.company}|{item.department}
                  </AutoText>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={() => (
          <NoDataView type={NoDataType.NOVISITINFO} style={{ backgroundColor: "#fff" }}/>
        )}
      />
    );
  };

  render() {
    console.log('------test--------',this.props)
    // let {
    //   contacts: {
    //     deleteButton //最新访问数据
    //   }
    // } = this.props;

    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          borderRadius: 13,
          backgroundColor: "#fff"
        }}
      >
        <View
          style={{
            marginTop: 20,
            marginHorizontal: 30,
            height: 30,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <AutoText style={{ fontSize: 20, color: "#252525", fontWeight: "bold" }}>
            常用联系人
          </AutoText>
          <TouchableOpacity onPress={this.removeVisitCache}>
            <Image
              source={true ? require("../../../images/contacts/icon_delete.png") : null}
              style={{ width: 15, height: 16 }}
            />
          </TouchableOpacity>
        </View>

        {this.renderList()}
      </View>
    );
  }
}

export default connect(state => {
  return { ...state };
})(LastVisitComponents);
// export default LastVisitComponents;

