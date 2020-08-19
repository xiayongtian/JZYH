import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text
} from "react-native";

import { connect } from "react-redux";
import { withNavigation } from "react-navigation";
import { commonStyle } from "../../config/global/commonStyle";

import Favorite from "./favorite";
import ContactsTree from "./components/ContactsTree";
import ContactDetail from "./ContactDetail";
import SearchBoxTextInput from "./components/SearchBoxTextInput";
import SearchBox from "./components/SearchBox";

/**
 * 通讯录 页面，右侧展示组件 （与通讯录展开页公用）
 * @author rwq
 */
class ContactsRightComponent extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { rightItem = "tree", contactsTree: { rootTreeNodeId } } = this.props;
    // const rightItem = "tree"
    // const rootTreeNodeId='9090'
    let list = null;
    // console.log("右侧显示内容", rightItem);
    if (rightItem === "收藏夹") {
      list = (
        <Favorite
          rightEditClick={this.props.rightEditClick}
          itemClick={this.props.itemClick}
          favoriteList={this.props.favoriteList}
          clickPerson={this.props.itemClick}
          fullScreenFlag={this.props.fullScreenFlag}
        />
      );
    } else if (rightItem === "tree") {
      list = (
        <>
          <SearchBoxTextInput
            itemClick={this.props.itemClick}
            statePerson={rightItem}
          />
          <ContactsTree
            rootTreeNodeId={rootTreeNodeId}
            clickPerson={this.props.itemClick}
          />
        </>
      );
    } else if (rightItem === "contactsDetail") {
      return (
        // <View><Text>123</Text></View>
        <ContactDetail
          navigation={this.props.navigation}
          backButtonCallback={this.props.backButtonCallback}
          oldRightItem={this.props.oldRightItem}
          callback={this.props.itemClick}
        />
      );
    } else if (rightItem === "searchDetail") {
      return <SearchBox clickPerson={this.props.itemClick} />;
    }
    return (
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          height: "auto",
          paddingHorizontal: 16, marginTop: 16, marginBottom: 30,
          backgroundColor: commonStyle.rightBackground,
          overflow: "hidden"
        }}
      >
        {list}
      </ScrollView>
    );
  }
}

export default connect(state => {
  return { ...state };
})(ContactsRightComponent);

// export default ContactsRightComponent;
