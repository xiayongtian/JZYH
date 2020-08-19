"use strict";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";
import React, { Component, PureComponent } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput, FlatList
} from "react-native";
import { AutoText, AutoTextInput, MenuCell } from "../../../components";


class SearchBoxTextInput extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          const { statePerson } = this.props
          this.props.itemClick({
            type: "searchDetail",
          });
          this.props.dispatch({
            type: 'search/updategetDelPortalstate',
            payload: {
              statePerson
            }
          })
        }}
        style={{
          height: 44
        }}>
        <View style={{
          flex: 1,
          position: "relative",
        }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 26,
            }}
          >
            <View
              style={{
                flex: 1,
                height: 38
              }}>
              <View
                style={{
                  flex: 1,
                  height: 38,
                  backgroundColor: "#F6F6F4",
                  borderRadius: 19,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../../images/contacts/icon_search.png")}
                  style={{
                    width: 16.7,
                    height: 16.7,
                    marginRight: 12.6,
                  }}
                />
                <View>
                  <AutoText
                  style={{
                    color: '#9E9DA7',
                    fontSize: 15,
                  }}>搜索123</AutoText>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
});
export default connect(state => {
  return { ...state };
})(SearchBoxTextInput);

// export default SearchBoxTextInput;
