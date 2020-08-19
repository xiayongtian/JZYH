import React, { Component } from "react";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";
import {
  BackHandler,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Text,
  FlatList
} from "react-native";
import { commonStyle } from "../../config/global/commonStyle";
import { ToastUtils, getPrettyDate, Storage, LoadingUtils } from "../../utils";
import { CacheConfigConstants } from "../../config/cacheConfigConstants";
import { RefreshableList, AutoText, NavHeader, AutoTextInput } from "../../components";
// import console = require("console");

/**
 * 收藏夹
 */
class Favorite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favoriteList: []
    };
  }

  componentDidMount = () => {

  }

  goPersonDetail = async (personId) => {
    console.log("点击的人员 ID 是", personId);
    this.props.dispatch({
      type: "contactsPersonDetail/updatePersonId",
      payload: personId
    });
    // this.props.dispatch({
    //   type: 'search/updategetDelPortalstate',
    //   payload: {
    //     statePerson: 'contactsDetail',
    //     portalstate: true,
    //   }
    // })
    // 执行人员回调
    this.props.clickPerson({
      type: "contactsDetail",
      personId
    });
    //   //添加最新访问缓存
    //   let visitCache =
    //   (await Storage.get(CacheConfigConstants.lastVisit.LAST_VISIT)) == null
    //     ? []
    //     : await Storage.get(CacheConfigConstants.lastVisit.LAST_VISIT);
    // let judgeRepeatVisit =
    //   (await Storage.get(CacheConfigConstants.lastVisit.JUDGE_REPEAT_VISIT)) == null
    //     ? []
    //     : await Storage.get(CacheConfigConstants.lastVisit.JUDGE_REPEAT_VISIT);
    // // console.log(visitCache);
    // if (judgeRepeatVisit.indexOf(personId) == -1) {
    //   judgeRepeatVisit.push(personId);
    //   await Storage.set(CacheConfigConstants.lastVisit.JUDGE_REPEAT_VISIT, judgeRepeatVisit);
    //   visitCache.unshift(treeNode);
    // } else {
    //   visitCache.map((item, index, arr) => {
    //     if (item.id == personId) {
    //       arr.splice(index, 1);
    //       arr.unshift(treeNode);
    //     }
    //   });
    // }
    // await Storage.set(CacheConfigConstants.lastVisit.LAST_VISIT, visitCache);
    // this.immediateVisit(visitCache);
  };

  //实时更新最新访问列表
  // immediateVisit = lastVisitList => {
  //   const { dispatch } = this.props;
  //   // this.props.leftClickCallBack("tree");
  //   dispatch({
  //     type: "contacts/updateVisitList",
  //     payload: {
  //       lastVisitList
  //     }
  //   });
  // };

  /**
   * 绘制留言列表项
   */
  renderListItem = ({ item, index }) => {
    let rightEditClick = this.props.rightEditClick;
    let itemClick = this.props.itemClick;
    let fullScreenFlag = this.props.fullScreenFlag;

    return (
      //外层渲染框
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          borderRadius: 10,
          backgroundColor: commonStyle.white,
          paddingHorizontal: 15,
          paddingVertical: 10
        }}
      >
        {rightEditClick ? (
          <TouchableOpacity
            onPress={() => {
              console.warn('yyyyyy---', item)
              itemClick(item.id);
              //itemClick("17679");
            }}
            style={{
              width: 40,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                height: 18,
                width: 18,
                borderStyle: "solid",
                borderWidth: 2,
                borderColor: !item.slt ? "#BEBEBC" : "#4A5FE2",
                borderRadius: 9,
                backgroundColor: !item.slt ? commonStyle.white : "#4A5FE2"
              }}
            ></View>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row"
          }}
          onPress={() => {
            if (!rightEditClick) {
              if (fullScreenFlag === "fullScreen") {
                this.props.navigation.navigate("ContactDetail", { "fullScreenFlag": "fullScreen", "personId": item.ContractID });
              } else {
                this.goPersonDetail(item.ContractID)
              }
            }
          }}
        >
          {/* 左侧头像部分开始 */}
          <View
            style={{
              width: 70
            }}
          >
            {item.UserPhotoBase64 ? (
              <Image
                source={{
                  uri: `data:image/png;base64,${item.UserPhotoBase64}`
                }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  marginLeft: 15,
                  marginTop: 5
                }}
              ></Image>
            ) : (
                <Image
                  source={require("../../images/icons/userpic.png")}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginLeft: 15,
                    marginTop: 5
                  }}
                ></Image>
              )}
          </View>
          {/* 左侧头像部分结束 */}
          {/* 右侧开始 */}
          <View
            style={{
              flex: 1
            }}
          >
            {/* 第一行开始 */}
            <View
              style={{
                height: 30,
                flex: 1,
                flexDirection: "row"
              }}
            >
              <AutoText
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  color: "#424141",
                  height: 30
                }}
              >
                {item.userName}
              </AutoText>
              <AutoText
                style={{
                  fontSize: 14,
                  color: "#92949F",
                  marginLeft: 20,
                  height: 30,
                  marginTop: 3
                }}
              >
                {item.Post}
              </AutoText>
            </View>
            {/* 第一行结束 */}
            {/* 第二行开始 */}
            <View
              style={{
                height: 30,
                flex: 1,
                flexDirection: "row",
                marginTop: 3
              }}
            >
              <AutoText
                style={{
                  fontSize: 16,
                  color: "#424141"
                }}
              >
                {item.phone}
              </AutoText>
            </View>
            {/* 第二行结束 */}
            {/* 第三行开始 */}
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                marginTop: 3
              }}
            >
              <AutoText
                style={{
                  fontSize: 14,
                  color: "#92949F"
                }}
              >
                {item.company + `  |  ` + item.department}
              </AutoText>
            </View>
            {/* 第三行结束 */}
          </View>
          {/* 右侧结束 */}
        </TouchableOpacity>
      </View>
    );
  };

  renderListItemSeparator = () => {
    return <View style={{ height: 15, width: "100%", backgroundColor: "#fafafa" }} />;
  };

  render() {

    let favoriteList = this.props.favoriteList;

    console.warn("favoriteList------------90", favoriteList)
    if (favoriteList) {
      return (
        <View style={{ flex: 1 }}>
          {/* 引入文件数据列表组件 */}
          {favoriteList.length > 0 ? (
            // <View><Text>123</Text></View>
            <FlatList
              data={favoriteList}
              keyExtractor={(item, index) => index + ""}
              renderItem={this.renderListItem}
              ItemSeparatorComponent={this.renderListItemSeparator}
              rightEditClick={this.props.rightEditClick}
            />
          ) : (
              <View
                style={{
                  flex: 1,
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Image
                  source={require("../../images/convention/nodatashow/no-message.png")}
                  style={{
                    width: 200,
                    height: 153
                  }}
                />
                <AutoText
                  style={{
                    color: "#979BA4",
                    fontSize: 14,
                    marginTop: 20
                  }}
                >
                  {"暂无收藏"}
                </AutoText>
              </View>
            )}
        </View>
      );
    } else {
      return null;
    }
  }
}

// export default connect(state => {
//   return { ...state };
// })(withNavigation(Favorite));
export default Favorite
