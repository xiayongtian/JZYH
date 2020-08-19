/**
 * 群发邮件
 * @author zhangyongxi
 */

import React from "react";
import { View, Image, FlatList, Modal, TouchableOpacity, Dimensions } from "react-native";
import { AutoText, MenuCell } from "../../../components";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";
import commonRequestParamsConfig from "../../../config/global/commonRequestParamsConfig";
import Orientation from "react-native-orientation";

class SendGroupEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false, //遮罩层开关
      selectedIndex: 0, //默认选中第一个公司
      screenHeight: null //屏幕高度
    };
  }

  componentDidMount() {
    //获取所有机构列表
    this.getOrganizationList();

    //动态设置机构列表高度
    this._onOrientationChange();
  }

  componentWillMount = () => {
    Orientation.addOrientationListener(this._onOrientationChange); //给屏幕高度添加监听事件
  };
  componentWillUnmount = () => {
    Orientation.removeOrientationListener(this._onOrientationChange); //移除屏幕高度事件
  };

  //动态设置机构列表高度
  _onOrientationChange = () => {
    const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
    this.setState({ screenHeight });
  };

  //遮罩层开关
  setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  //获取所有机构列表
  getOrganizationList = async () => {
    const { userId, userCode } = this.props.login.userInfo;
    const params = {
      appID: commonRequestParamsConfig.APP_ID,
      Scode: "FW",
      userCode: userId

      // appID: "aaabw10075",
      // Scode: "FW",
      // userCode: " haoyanyan01@sinochem.com",
    };

    const { dispatch } = this.props;
    dispatch({
      type: "contacts/getOrganizationList",
      payload: {
        ...params
      }
    });
  };

  //渲染所有机构列表
  renderOrganizationList = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ selectedIndex: index });
        }}
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: index == this.state.selectedIndex ? "#4A5FE2" : "#F6F6F4",
          borderRadius: 10,
          width: "30%",
          height: 44
        }}
      >
        <View>
          <AutoText
            style={{
              textAlign: "center",
              fontSize: 14,
              color: index == this.state.selectedIndex ? "#FFFFFF" : "#424141"
            }}
          >
            {item.GName}
          </AutoText>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {
      contacts: { organizationList }
    } = this.props;

    // console.log("=================================================render", organizationList);
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          // onRequestClose={() => {
          //   alert("Modal has been closed.");
          // }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "darkgrey",
              borderRadius: 1
            }}
          >
            <View
              style={{
                marginTop: 100,
                backgroundColor: "#FFFFFF",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24
              }}
            >
              {/* 头部栏 */}
              <View
                style={{
                  marginTop: 43,
                  paddingLeft: 15,
                  paddingRight: 20,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <AutoText style={{ fontSize: 22, color: "#252525" }}> 切换机构</AutoText>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      this.setModalVisible(!this.state.modalVisible);
                    }}
                  >
                    <Image
                      source={require("../../../images/contacts/icon_close.png")}
                      style={{ width: 15, height: 15, marginRight: 15 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* 机构列表栏 */}
              <View
                style={{ marginTop: 43, height: this.state.screenHeight - 230 }}
                ref="organizationListHeight"
              >
                <FlatList
                  data={organizationList.Data}
                  keyExtractor={(item, index) => item.GID}
                  horizontal={false}
                  numColumns={3}
                  columnWrapperStyle={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    marginBottom: 26
                  }}
                  renderItem={this.renderOrganizationList}
                />
              </View>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          onPress={() => {
            this.setModalVisible(true);
            // this.props.onClicked(false)
          }}
        >
          <AutoText style={{color: "#424141", fontSize: 16, height: 22}}>群发邮件</AutoText>
        </TouchableOpacity>
      </View>
    );
  }
}

export default connect(state => {
  return { ...state };
})(SendGroupEmail);


