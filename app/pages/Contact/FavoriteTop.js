import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { withNavigation } from "react-navigation";
import { connect } from "react-redux";
import AutoText from "../../components/AutoText";
import { commonStyle } from "../../config/global/commonStyle";

class FavoriteTop extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
  }

  render() {
    let callbackDel = this.props.callbackDel;
    let callbackEdit = this.props.callbackEdit;
    let callbackSelectAll = this.props.callbackSelectAll;
    let onFullScreen = this.props.onFullScreen;
    let selectedList = this.props.selectedList;
    let hiddenEditButton = this.props.hiddenEditButton;
    if (!this.props.rightEditClickIn) {
      return (
        <View
          style={{
            height: 44,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderTopLeftRadius: 24
          }}
        >
          <TouchableOpacity
            style={{ marginLeft: 13 }}
            onPress={() => {
              onFullScreen();
            }}
          >
            <Image
              source={require("../../images/common/icon_fullScreen.png")}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>

          <AutoText
            style={{
              fontSize: 17,
              color: commonStyle.darkBlack,
              fontWeight: "bold"
            }}
          >
            {"收藏夹"}
          </AutoText>

          {!hiddenEditButton ? (
            <TouchableOpacity
              style={{ marginRight: 13 }}
              onPress={() => {
                callbackEdit(true);
              }}
            >
              <AutoText
                style={{
                  fontSize: 16,
                  color: "#9E9DA7"
                }}
              >
                {"编辑"}
              </AutoText>
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </View>
      );
    } else {
      return (
        <View
          style={{
            height: 44,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderTopLeftRadius: 24
          }}
        >
          <TouchableOpacity
            style={{ marginLeft: 13 }}
            onPress={() => {
              callbackEdit(false);
            }}
          >
            <AutoText
              style={{
                fontSize: 16,
                color: "#9E9DA7"
              }}
            >
              {"取消"}
            </AutoText>
          </TouchableOpacity>

          <AutoText
            style={{
              fontSize: 17,
              color: commonStyle.darkBlack,
              fontWeight: "bold"
            }}
          >
            {"收藏夹"}
          </AutoText>

          <View
            style={{
              flexDirection: "row"
            }}
          >
            <TouchableOpacity
              style={{ marginRight: 13 }}
              onPress={() => {
                callbackSelectAll();
              }}
            >
              <AutoText
                style={{
                  fontSize: 16,
                  color: "#9E9DA7"
                }}
              >
                {"全选"}
              </AutoText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginRight: 13 }}
              onPress={() => {
                callbackDel();
              }}
            >
              <AutoText
                style={{
                  fontSize: 16,
                  color: selectedList.length>0?"#C23332":"#BEBEBC"
                }}
              >
                {"删除"}
              </AutoText>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}

// export default connect(state => {
//   return { ...state };
// })(withNavigation(FavoriteTop));

export default FavoriteTop;
