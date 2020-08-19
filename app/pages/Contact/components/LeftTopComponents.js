/**
 * 全集团、本公司、同部门机构树切换按钮 模块 - 通讯录首页 左上角
 * @author liuyi
 */
import React from "react";
import { View, FlatList,Text, ImageBackground, Alert } from "react-native";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";
import { AutoText, MenuCell } from "../../../components";
import { MenuCellType } from "../../../components/MenuCell";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AlertUtils, Storage } from "../../../utils";
import { CacheConfigConstants } from "../../../config/cacheConfigConstants";
import Proptypes from "prop-types";

class LeftTopComponents extends React.Component {
  static proptypes = {
    currentRightShowType: Proptypes.string.isRequired, // 当前通讯录右侧展示的类型
    leftClickCallBack: Proptypes.func // 点击本组件区域的回调函数
  };

  // 设置 prop 默认值
  static defaultProps = {
    leftClickCallBack: () => {
    } // 点击本组件区域默认执行空函数
  };

  constructor(props) {
    super(props);
    this.state = {
      threeBox: [],
      favorites: []
    };
  }

  componentDidMount() {
    this.initState();
  }

  /**
   * 填充每个根节点的 ID
   */
  initState =  () => {
    let userOrgInfo =  Storage.get(CacheConfigConstants.user.USER_ORG);
    this.setState({
      threeBox: [
        {
          text: "全集团",
          backgroundImg: require("../../../images/contacts/bg_group.png"),
          nodeId: userOrgInfo.SubsubcomId
          // nodeId: '90'
        },
        {
          text: "本公司",
          backgroundImg: require("../../../images/contacts/bg_company.png"),
          nodeId: userOrgInfo.CompanyId
          // nodeId: '91'
        },
        {
          text: "同部门",
          backgroundImg: require("../../../images/contacts/bg_department.png"),
          nodeId: userOrgInfo.DepartmentId
          // nodeId: '93'
        }
      ],
      favorites: [
        {
          title: "收藏夹",
          img: "contactsFavorite.png",
          img_h: "contactsFavorite_h.png",
          type: MenuCellType.TEXT

        }
      ]
    });

  };

  /**
   * 切换树 根节点的方法
   * @param rootTreeNodeId
   */
  toggleTreeRootNode = (rootTreeNodeId) => {
    const { dispatch } = this.props;
    this.props.leftClickCallBack("tree" + rootTreeNodeId);
    dispatch({
      type: "contactsTree/updateRootTreeNodeId",
      payload: {
        rootTreeNodeId
      }
    });
  };

  /**
   * 绘制三个大盒子
   * @returns {*}
   */
  renderThreeBox = () => {
    const boxDOM = this.state.threeBox.map((item, index) => {
      // console.log("renderThreeBox---------",item)
      return (
        <TouchableOpacity
          key={index + ""}
          onPress={() => {
            this.toggleTreeRootNode(item.nodeId);
          }}
        >
          <ImageBackground
            source={item.backgroundImg}
            style={{
              width: 85,
              height: 120,
              borderRadius: 13
            }}
          >
            <AutoText
              style={{
                marginLeft: 10,
                marginTop: 18,
                color: "#fff"
              }}
            >
              {item.text}
            </AutoText>
          </ImageBackground>
        </TouchableOpacity>
      );
    });
    return (
      <View
        style={{
          minHeight: 100,
          paddingHorizontal: 17,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        {boxDOM}
      </View>
    );
  };

  /**
   * 渲染收藏夹 和 自定义 条目
   */
  renderFavorites = () => {
    
    let favorites=[
      {
        img: "contactsFavorite.png",
        img_h: "contactsFavorite_h.png",
        title: "收藏夹",
        type: 0

      }
    ]
    // const { currentRightShowType } = this.props;
    const currentRightShowType='收藏夹'
    let selectedCellIndex = 1;
    if (currentRightShowType === "收藏夹") {
      selectedCellIndex = 0
    }
    return (
      <FlatList
        contentContainerStyle={{
          marginBottom: 20,
          paddingLeft: 17
        }}
        data={favorites}
        keyExtractor={(item, index) => index + ""}
        renderItem={({ item, index }) => {
          return (
            <MenuCell
              key={index}
              selectedCellIndex={selectedCellIndex}
              onChangeSelectCell={(item, index) => {
                if (item.title === "收藏夹") {
                  this.props.leftClickCallBack("收藏夹");
                }
              }}
              // type={item.type}
              index={index}
              item={item}
              collection={true}
            />
          );
        }}
      />
    );
  };

  render() {
    return (
      <View
        style={{
          minHeight: 150,
          justifyContent: "flex-start"
          // backgroundColor: "yellow"
        }}
      >
        {this.renderThreeBox()}
        <View style={{ height: 30 }} />
        {this.renderFavorites()}
      </View>
    );
  }
}


export default connect((state) => {
  return { ...state };
})(LeftTopComponents);

// export default LeftTopComponents;

