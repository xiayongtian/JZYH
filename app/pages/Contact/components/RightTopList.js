/**
 * 右上角ICON  点击展开菜单
 * @author  zhangyongxi
 */
import React from "react";
import { View, Image, FlatList, Text, Linking, TouchableOpacity } from "react-native";
import { AutoText, Popover } from "../../../components";
import { LoadingUtils, Storage } from "../../../utils";
import { CacheConfigConstants } from "../../../config/cacheConfigConstants";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";
import ChangeOrganization from "./ChangeOrganization";

class RightTopList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moreMenu: {
        showMoreMenu: false, //是否显示更多
        mainButton: null
      },
      modalList: [{ title: "群发邮件" }, { title: "切换机构" }]
    };
  }

  componentDidMount() {
    // this.toggleRightTopList('yes')
  }

  handelMorePress = buttonRef => {
    // console.log("点击更多按钮, 按钮对象：", buttonRef);
    console.log("更多按钮内容：", this.state.footerMoreButtonMenuList);
    console.log('buttonRef', buttonRef)
    this.setState({
      moreMenu: {
        showMoreMenu: true,
        mainButton: buttonRef
      }
    });
  };

  //点击的小ICON
  pressButton = (test, moreMenuButtons) => {
    return (
      <TouchableOpacity
        onPress={() => this.handelMorePress(this.clickButton)}
        ref={c => {
          this.clickButton = c;
        }}
      >
        <View
          style={{
            marginRight: 5,
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Image
            source={require("../../../images/contacts/icon_more.png")}
          // style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  onChangeState(state) {
    // console.log('state==============',state)
    this.setState({
      moreMenu: {
        showMoreMenu: state
      }
    });
  }
  //右上角菜单列表开关
  // toggleRightTopList = showRightTopList => {
  //   const { dispatch } = this.props;
  //   // this.props.leftClickCallBack("tree");
  //   dispatch({
  //     type: "contacts/toggleRightTopList",
  //     payload: {
  //       showRightTopList
  //     }
  //   });
  // };

  toggleSelectButton = () => {
    this.props.dispatch({
      type: "contactsTree/toggleShowSelectButton"
    });
  };

  render() {
    // console.log('-----',this.state)
    console.log('this.state', this.state)

    const {
      moreMenu: { showMoreMenu, mainButton }
    } = this.state;
    // const showMoreMenu=true
    // const {
    //   contacts: { showRightTopList }
    // } = this.props;
    //点击之后弹出的DOM元素
    let moreMenuButtons = this.state.modalList.map((item, index) => {
      console.log(' this.state.modalList', this.state.modalList)
      return (
        <View key={index} style={{}}>
          {/* <Text>123</Text> */}
          {item.title == "切换机构" ? (
            // <ChangeOrganization onClicked={this.onChangeState.bind(this)} />
            <ChangeOrganization leftClickCallBack={this.props.leftClickCallBack} onClicked={this.onChangeState.bind(this)} />
          ) : (
              <TouchableOpacity
                onPress={() => {
                  // console.log(this.props)
                  this.props.changeToolBar(true);
                  this.toggleSelectButton();
                  this.setState({
                    moreMenu: {
                      showMoreMenu: false
                    }
                  });
                }}
                style={{ width: 198, height: 70, flexDirection: "row", justifyContent: "center", alignItems: "center" }}
              >
                <AutoText style={{ fontSize: 16, color: "#424141" }}>{item.title}</AutoText>
              </TouchableOpacity>
            )}
        </View>
      );
    });
    console.log('---------000----------', showMoreMenu, moreMenuButtons)
    return (
      <View>
        {this.pressButton(showMoreMenu, moreMenuButtons)}
        {showMoreMenu && moreMenuButtons ? (
          <Popover
            // showRightTopList={showRightTopList}
            flag={true}
            renderButton={moreMenuButtons}
            mainButton={mainButton}
            popoverWidth={100}
            popoverHeight={70}
            destroy={() => {
              // console.log("回调关闭弹窗");
              this.setState({
                moreMenu: {
                  showMoreMenu: false
                }
              });
            }}
          />
        ) : null}
      </View>
    );
  }
}

export default connect(state => {
  return { ...state };
})(RightTopList);


