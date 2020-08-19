import React from "react";
import { View, Image, Text } from "react-native";
import PropTypes from "prop-types";
import { commonStyle } from "../config/global/commonStyle";
import AutoText from "../components/AutoText";
// 没数据类型
export const NoDataType = {
  SUBSCRIPTION_CONTENT: 0, // 订阅列表内容
  SUBSCRIPTION_MENU: 1, // 订阅菜单
  NETWORK_DISCONNECTION: 2, // 网络断开
  APPROVAL_TODO_ATTACHMENT: 3, // 审批代办附件
  APPROVAL_COMMENT_ATTACHMENT: 4, // 审批批注附件
  APPROVAL_COLLECTION_ATTACHMENT: 5, // 审批收藏附件
  APPROVAL_BUSINESS_CARD: 6, // 审批名片
  ADDRESSBOOK_ACCESS_RECORDS: 7, // 通讯录访问记录
  ADDRESSBOOK_CONTENT: 8, // 通讯录内容
  DATA_SHARING: 9, // 资料分享
  MEETINF_STYLE: 10, // 会议风采
  SEATINGMAP: 11, // 座位图
  SEATINGARRANGEMENT: 12, // 座次安排
  NOSEARCHRESULTS: 13, // 人员搜索结果
  NOVISITINFO: 14, //最近访问
  SUBSCRIPTION_LEVEL_TWO_MENU: 15,
};

class NoDataView extends React.Component {
  static propTypes = {
    type: PropTypes.number, // 类型
    title: PropTypes.string // 指定文案
  };

  // 获取当前类型 对应 没数据图片
  getNoDataImage = type => {
    let source;

    switch (type) {
      case NoDataType.SUBSCRIPTION_CONTENT:
        source = {
          img: require("../images/noData/subscription_content.png"),
          title: "还没有任何内容~"
        };
        break;
      case NoDataType.SUBSCRIPTION_MENU:
        source = {
          img: require("../images/noData/subscription_menu.png"),
          title: "还没有订阅任何栏目，\n" + "快去右上角添加订阅吧~"
        };
        break;
        case NoDataType.SUBSCRIPTION_LEVEL_TWO_MENU:
          source = {
            img: require("../images/noData/subscription_menu.png"),
            title: "此栏目含有二级分类，\n" + "点击左侧栏目即可呈现栏目内容"
          };
          break;
      case NoDataType.NETWORK_DISCONNECTION:
        source = {
          img: require("../images/noData/network_disconnection.png"),
          title: "啊哦，网络不太顺畅~"
        };
        break;
      case NoDataType.APPROVAL_TODO_ATTACHMENT:
        source = {
          img: require("../images/noData/approval_todoAttachment.png"),
          title: "还没有待办信息~"
        };
        break;
      case NoDataType.APPROVAL_COMMENT_ATTACHMENT:
        source = {
          img: require("../images/noData/approval_commentAttachment.png"),
          title: "还没有批注附件~"
        };
        break;
      case NoDataType.APPROVAL_COLLECTION_ATTACHMENT:
        source = {
          img: require("../images/noData/approval_collectionAttachment.png"),
          title: "还没有收藏附件~"
        };
        break;
      case NoDataType.APPROVAL_BUSINESS_CARD:
        source = {
          img: require("../images/noData/approval_businessCard.png"),
          title: "还没有收藏名片~"
        };
        break;
      case NoDataType.ADDRESSBOOK_ACCESS_RECORDS:
        source = {
          img: require("../images/noData/addressbook_accessRecords.png"),
          title: "还没有任何访问记录~"
        };
        break;
      case NoDataType.ADDRESSBOOK_CONTENT:
        source = {
          img: require("../images/noData/addressbook_content.png"),
          title: "未找到搜索结果~"
        };
        break;
      case NoDataType.DATA_SHARING:
        source = {
          img: require("../images/convention/nodatashow/no-share.png"),
          title: "暂无资料分享"
        };
        break;
      case NoDataType.SEATINGARRANGEMENT:
        source = {
          img: require("../images/convention/nodatashow/no-share.png"),
          title: "暂无座次安排"
        };
        break;
      case NoDataType.SEATINGMAP:
        source = {
          img: require("../images/convention/nodatashow/no-share.png"),
          title: "暂无座位图"
        };
        break;
      case NoDataType.MEETINF_STYLE:
        source = {
          img: require("../images/noData/approval_collectionAttachment.png"),
          title: "暂无会议风采"
        };
        break;
      case NoDataType.NOSEARCHRESULTS:
        source = {
          img: require("../images/noData/approval_collectionAttachment.png"),
          title: "暂无相关搜索结果"
        };
        break;
      case NoDataType.NOVISITINFO:
        source = {
          img: require("../images/noData/approval_collectionAttachment.png"),
          title: "暂无访问记录"
        };
        break;
      default:
        source = {
          img: require("../images/noData/subscription_content.png"),
          title: "还没有任何内容~"
        };
        break;
    }
    return source;
  };

  render() {
    const { title, type } = this.props;
    const source = this.getNoDataImage(type);

    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          backgroundColor: commonStyle.rightBackground,
          ...this.props.style
        }}
      >
        <Image source={source.img} />
        <AutoText style={{ fontSize: 14, color: "#979797", marginTop: 20,textAlign:"center" }}>
          {title || source.title}
        </AutoText>
      </View>
    );
  }
}

export default NoDataView;
