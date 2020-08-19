'use strict';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import React, { Component, PureComponent } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
  Keyboard,
  Alert,
} from 'react-native';
import { commonStyle } from '../../../config/global/commonStyle';
import { AutoText, AutoTextInput, MenuCell, RefreshableList } from '../../../components';
import { LoadingUtils, Storage, ToastUtils } from '../../../utils';
import { CacheConfigConstants } from '../../../config/cacheConfigConstants';
import { commonRequestParamsConfig } from '../../../config';
import NoDataView, { NoDataType } from '../../../components/NoDataView';
import { RefreshState } from '../../../components/RefreshableList';
import { AppConfig, AppEnv } from '../../../config/appConfig';
// import { getDelPortalContact } from '../../../services/approvalDetailService';
import { getSearchResultList } from '../../../utils/ContactsUtils'

class SearchBox extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      messageNotice: [],
      updatas: false,
      showSearchResults: false,
      refreshState: 0,
      peopleSearchResults: [],
      pageIndex: 1,
      searchListTotal: 0
    };
  }

  componentDidMount() {
    // const { navigation } = this.props;
    // this.focusListener = navigation.addListener('didFocus', () => {
    //   console.log('切换页面回来执行了吗');
    //   this.cdb_searchindex();
    // });
    // this.cdb_searchindex();
  }

  componentDidUpdate() {
    if (this.state.updatas) {
      this.setState({
        updatas: false,
      });
    }
  }

  componentWillUnmount() {
  }

  sendSearchRequest = async () => {
    // let searchResultList = await getSearchResultList('zhongf')
    // console.warn('this.state.searchText------->',this.state.searchText)
    const { searchText, pageIndex } = this.state;
    console.warn('-------长度', this.state.peopleSearchResults.length, this.state.searchListTotal)
    if (this.state.searchListTotal > 0 && this.state.peopleSearchResults.length >= this.state.searchListTotal) {
      return
    }
    console.warn(pageIndex, 'pageIndexpageIndex');

    let searchResultListInfo = await getSearchResultList(pageIndex, searchText)
    const { total, searchResultList } = searchResultListInfo
    //  let total= searchResultList.splice(0,1)
    console.warn('searchResultList------>', total, searchResultList)

    let tempTotal = pageIndex * 10

    // if (res.ResultCode !== '0' || res.ResultMsg !== '成功') {
    //   LoadingUtils.hide();
    //   this.setState({ refreshState: RefreshState.Failure, showLoading: false });
    //   return;
    // }
    if (pageIndex === 1 && (searchResultList && searchResultList.length === 0)) {
      LoadingUtils.hide();
      this.setState({ refreshState: RefreshState.EmptyData, showLoading: false });
      Alert.alert('无相关搜索结果！');
      return;
    }
    let thisRefreshState = RefreshState.Idle;
    if (pageIndex > 1 && total < 10) {
      thisRefreshState = RefreshState.NoMoreData;
    }
    // LoadingUtils.hide();
    if (pageIndex === 1) {
      this.setState({
        peopleSearchResults: searchResultList,
        updatas: true,
        showSearchResults: true,
        searchListTotal: total
      });
    } else {
      let tempPeopleSearchResults = [...this.state.peopleSearchResults, ...searchResultList];
      console.warn('tempPeopleSearchResults', tempPeopleSearchResults)
      this.setState({
        peopleSearchResults: tempPeopleSearchResults,
        updatas: true,
        showSearchResults: true,
      });
    }

    // this.setState({
    //   peopleSearchResults: searchResultList,
    //   updatas: true,
    //   showSearchResults: true,
    // });
    this.setState({ peopleSearchResults, refreshState: thisRefreshState, showLoading: false });
    // this.setState({
    //   updatas: true,
    //   showSearchResults: true,
    // });
    // console.log(this.state, 'thisthis');









    // const { searchText, pageIndex } = this.state;
    // console.log(pageIndex, 'pageIndexpageIndex');


    // console.log(res, 'peopleSearchResultspeopleSearchResults');
    // {
    //   avatar: "",
    //   company: "中化辽宁公司",
    //   department: deptInfo.deptName,
    //   email: tempUserList.email,
    //   id: links[i].userId,
    //   deptId:links[i].deptId,
    //   loginId: "limin",
    //   phone: tempUserList.mobile,
    //   postTitle: deptInfo.deptName,
    //   // post:"公司领导1",
    //   selected: false,
    //   tel: "0411-39057877",
    //   title: `xiawei${i}`,
    //   type: 1,
    //   weight: 0,
    // }
    // if (res.ResultCode !== '0' || res.ResultMsg !== '成功') {
    //   LoadingUtils.hide();
    //   this.setState({ refreshState: RefreshState.Failure, showLoading: false });
    //   return;
    // }
    // if (pageIndex === 1 && (!res.Data || res.Data.length === 0)) {
    //   LoadingUtils.hide();
    //   this.setState({ refreshState: RefreshState.EmptyData, showLoading: false });
    //   Alert.alert('无相关搜索结果！');
    //   return;
    // }
    // let thisRefreshState = RefreshState.Idle;
    // if (pageIndex > 1 && res.Data.length < 15) {
    //   thisRefreshState = RefreshState.NoMoreData;
    // }
    // LoadingUtils.hide();
    // let peopleSearchResults = this.state.peopleSearchResults;
    // if (pageIndex === 1) {
    //   peopleSearchResults = res.Data;
    // } else {
    //   peopleSearchResults = peopleSearchResults.concat(res.Data);
    // }
    // this.setState({ peopleSearchResults, refreshState: thisRefreshState, showLoading: false });
    // this.setState({
    //   updatas: true,
    //   showSearchResults: true,
    // });
    // console.log(this.state, 'thisthis');


    // LoadingUtils.show(28);
    // getDelPortalContact({
    //   strSearch: searchText,
    //   Scode: 'FW',
    //   appID: commonRequestParamsConfig.APP_ID,
    //   userCode: this.props.login.userInfo.userId,
    //   pageIndex,
    //   pageSize: 15,
    // })
    //   .then((res) => {
    //     console.log(res, 'peopleSearchResultspeopleSearchResults');
    //     // {
    //     //   avatar: "",
    //     //   company: "中化辽宁公司",
    //     //   department: deptInfo.deptName,
    //     //   email: tempUserList.email,
    //     //   id: links[i].userId,
    //     //   deptId:links[i].deptId,
    //     //   loginId: "limin",
    //     //   phone: tempUserList.mobile,
    //     //   postTitle: deptInfo.deptName,
    //     //   // post:"公司领导1",
    //     //   selected: false,
    //     //   tel: "0411-39057877",
    //     //   title: `xiawei${i}`,
    //     //   type: 1,
    //     //   weight: 0,
    //     // }
    //     if (res.ResultCode !== '0' || res.ResultMsg !== '成功') {
    //       LoadingUtils.hide();
    //       this.setState({ refreshState: RefreshState.Failure, showLoading: false });
    //       return;
    //     }
    //     if (pageIndex === 1 && (!res.Data || res.Data.length === 0)) {
    //       LoadingUtils.hide();
    //       this.setState({ refreshState: RefreshState.EmptyData, showLoading: false });
    //       Alert.alert('无相关搜索结果！');
    //       return;
    //     }
    //     let thisRefreshState = RefreshState.Idle;
    //     if (pageIndex > 1 && res.Data.length < 15) {
    //       thisRefreshState = RefreshState.NoMoreData;
    //     }
    //     LoadingUtils.hide();
    //     let peopleSearchResults = this.state.peopleSearchResults;
    //     if (pageIndex === 1) {
    //       peopfleSearchResults = res.Data;
    //     } else {
    //       peopleSearchResults = peopleSearchResults.concat(res.Data);
    //     }
    //     this.setState({ peopleSearchResults, refreshState: thisRefreshState, showLoading: false });
    //     this.setState({
    //       updatas: true,
    //       showSearchResults: true,
    //     });
    //     console.log(this.state, 'thisthis');
    //   })
    //   .catch(() => {
    //     LoadingUtils.hide();
    //     this.setState({ refreshState: RefreshState.Failure, showLoading: false });
    //     Alert.alert('网络请求失败');
    //   });
  };

  getDoneList = async () => {
    this.setState(
      {
        pageIndex: 1,
        showDeleteIcon: true,
      },
      () => {
        this.sendSearchRequest();
      },
    );
    let userCache =
      (await Storage.get(CacheConfigConstants.searchHistory.SEARCH_HISTORY)) == null
        ? []
        : await Storage.get(CacheConfigConstants.searchHistory.SEARCH_HISTORY);
    userCache.push(this.state.searchText);
    let newuserCache = Array.from(new Set(userCache));
    if (newuserCache.length > 10) {
      // console.log(newuserCache.slice(1,11),'newuserCache.slice(0,10)')
      newuserCache = newuserCache.slice(1, 11);
    }
    Storage.set(CacheConfigConstants.searchHistory.SEARCH_HISTORY, newuserCache);
    this.cdb_searchindex();
  };

  _renderTextInputButton = (imgUrl, eventCallBack) => {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 30,
          height: 38,
          zIndex: 100,
          justifyContent: 'center',
          alignItems: 'center',
          // backgroundColor:'#bfa'
        }}
        onPress={() => {
          eventCallBack();
        }}
      >
        <Image source={imgUrl} />
      </TouchableOpacity>
    );
  };

  _clearSearchTex = () => {
    if (this.searchTextNode) {
      this.searchTextNode.focus();
    }
    this.setState(
      {
        searchText: '',
        showSearchResults: false,
      },
      () => {
      },
    );
  };

  render() {
    // const { refreshState, peopleSearchResults, pageIndex, showDeleteIcon } = this.state;
    const { refreshState } = this.state;

    const { peopleSearchResults } = this.state
    console.warn('peopleSearchResultsRender->>>>>>', this.state)

    // let refreshState = false;
    // let peopleSearchResults = [{
    //   avatar: "",
    //   company: "中化辽宁公司",
    //   department: "中化辽宁公司",
    //   email: "中化辽宁公司",
    //   id: "7878",
    //   deptId: "232131",
    //   loginId: "limin",
    //   phone: '18170873540',
    //   postTitle: "中化辽宁公司",
    //   // post:"公司领导1",
    //   selected: false,
    //   tel: "0411-39057877",
    //   title: `xiawei`,
    //   type: 1,
    //   weight: 0,
    // }];
    let pageIndex = 1;
    let showDeleteIcon = true
    //console.log('showDeleteIconshowDeleteIconshowDeleteIcon', showDeleteIcon);
    return (
      <View
        style={{
          flex: 1,
          position: 'relative',
          // backgroundColor: 'red',
        }}
      >
        <View
          style={{
            height: 40,
            flexDirection: 'row',
            marginHorizontal: 15,
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical: 26,
            // backgroundColor: 'red'
          }}
        >
          <View
            style={{
              flex: 1,
              height: 38,
              backgroundColor: '#F6F6F4',
              borderRadius: 19,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Image
              source={require('../../../images/contacts/icon_search.png')}
              style={{
                width: 16.7,
                height: 16.7,
                marginLeft: 15.7,
                marginRight: 12.6,
                marginVertical: 10.6,
              }}
            />
            <AutoTextInput
              ref={(r) => (this.searchTextNode = r)}
              style={{
                flex: 1,
                marginRight: 30,
                // backgroundColor: 'black',
              }}
              autoFocus={true}
              onSubmitEditing={() => {
                this.getDoneList();
              }}
              placeholder='搜索'
              // keyboardType={"default"}
              // onKeyPress={(res) => {
              //   console.warn(res,'resresres')
              // }}
              returnKeyType='search'
              onChangeText={(searchText) => {
                this.setState({
                  searchText: searchText,
                });
                if (searchText == '') {
                  this.setState({
                    showSearchResults: false,
                  });
                }
              }}
              value={this.state.searchText}
            />
            {!!this.state.searchText
              ? this._renderTextInputButton(
                require('../../../images/contacts/icon_shut.png'),
                this._clearSearchTex,
              )
              : null}
          </View>
          <View
            style={{
              height: 38,
              marginLeft: 15,
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
              onPress={() => {
                const { statePerson } = this.props.search;
                this.props.dispatch({
                  type: 'search/updategetDelPortalstate',
                  payload: {
                    statePerson,
                    portalstate: true,
                  },
                });
              }}
            >
              <AutoText
                style={{
                  fontSize: 16,
                  color: '#424141',
                }}
              >
                取消
              </AutoText>
            </TouchableOpacity>
          </View>

        </View>
        {!this.state.showSearchResults ? (
          <View
            style={{
              flex: 1,
              marginHorizontal: 5,
            }}
          >
            <View
              style={{
                height: 38,
                flexDirection: 'row',
                marginHorizontal: 15,
                marginTop: 26,
                marginBottom: 20,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <AutoText
                style={{
                  fontSize: 16,
                  color: '#252525',
                }}
              >
                搜索历史
              </AutoText>
              {showDeleteIcon ? (
                <TouchableOpacity
                  style={{
                    width: 20,
                    height: 20,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onPress={async () => {
                    await Storage.remove(CacheConfigConstants.searchHistory.SEARCH_HISTORY);
                    this.cdb_searchindex();
                    this.setState({
                      updatas: true,
                      showDeleteIcon: false,
                    });
                  }}
                >
                  {showDeleteIcon ? (
                    <Image
                      source={require('../../../images/contacts/icon_delete.png')}
                      style={{
                        width: 15,
                        height: 16,
                      }}
                    />
                  ) : null}
                </TouchableOpacity>
              ) : null}
            </View>
            <View
              style={{
                flex: 1,
                flexWrap: 'wrap',
                flexDirection: 'row',
              }}
            >
              {this.state.messageNotice.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={item + ' ' + index}
                    onPress={async () => {
                      await this.setState(
                        {
                          searchText: item,
                          pageIndex: 1,
                        },
                        () => {
                          this.sendSearchRequest();
                        },
                      );
                      Keyboard.dismiss();
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: '#F5F5F5',
                        borderRadius: 16,
                        marginLeft: 15,
                        marginVertical: 5,
                        alignSelf: 'flex-start',
                      }}
                    >
                      <AutoText
                        style={{
                          fontSize: 14,
                          paddingHorizontal: 26,
                          color: '#424141',
                          paddingVertical: 6,
                        }}
                      >
                        {item}
                      </AutoText>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
            <RefreshableList
              data={peopleSearchResults}
              refreshState={refreshState}
              onHeaderRefresh={() => {
                this.setState(
                  {
                    refreshState: RefreshState.HeaderRefreshing,
                    pageIndex: 1,
                  },
                  () => {
                    this.sendSearchRequest();
                  },
                );
              }}
              onFooterRefresh={() => {
                console.warn('onFooterRefresh上拉刷新->>>>>>')
                this.setState(
                  {
                    refreshState: RefreshState.FooterRefreshing,
                    pageIndex: pageIndex + 1,
                  },
                  () => {
                    this.sendSearchRequest();
                  },
                );
              }}
              keyExtractor={(item, index) => item.ID}
              renderItem={this.renderItem}
              ListEmptyComponent={() => (
                <NoDataView
                  type={NoDataType.NOSEARCHRESULTS}
                  style={{ backgroundColor: '#FAFAFA' }}
                />
              )}
            />
          )}
      </View>
    );
  }

  cdb_searchindex = async () => {
    let messageNotice =
      (await Storage.get(CacheConfigConstants.searchHistory.SEARCH_HISTORY)) == null
        ? []
        : await Storage.get(CacheConfigConstants.searchHistory.SEARCH_HISTORY);
    console.log('最新访问缓存================================', messageNotice);
    if (messageNotice.length > 0) {
      this.setState({ showDeleteIcon: true });

    }
    this.setState({
      messageNotice: messageNotice,
    });
  };

  goPersonDetail = (personId) => {
    console.log('点击的人员 ID 是', personId);
    this.props.dispatch({
      type: 'contactsPersonDetail/updatePersonId',
      payload: personId,
    });
    this.props.clickPerson({
      type: 'contactsDetail',
      personId,
    });
    // this.props.dispatch({
    //   type: 'search/updategetDelPortalstate',
    //   payload: {
    //     statePerson: 'contactsDetail',
    //     portalstate: true,
    //   }
    // })
  };

  renderItem = ({ item, index }) => {
    let photoBase64;
    if (item.UserPhotoBase64) {
      photoBase64 = { uri: 'data:image/png;base64,' + item.UserPhotoBase64 };
    } else {
      photoBase64 = require('../../../images/icons/userpic.png');
    }
    return (
      <TouchableOpacity
        onPress={() => {
          this.goPersonDetail(item.ID);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: '#ffffff',
            height: 108,
            marginTop: 12,
            borderRadius: 13,
            marginHorizontal: 15,
          }}
        >
          <View
            style={{
              flex: 1,
              marginVertical: 15,
              marginHorizontal: 15,
              flexDirection: 'row',
            }}
          >
            <Image
              source={photoBase64}
              style={{
                width: 40,
                height: 40,
                resizeMode: 'stretch',
                borderRadius: 20,
              }}
            />
            <View
              style={{
                flex: 1,
                marginLeft: 15,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View>
                  <AutoText
                    style={{
                      fontSize: 17,
                      color: '#424141',
                    }}
                    numberOfLines={1}
                  >
                    {item.title}
                  </AutoText>
                </View>
                <View>
                  <AutoText
                    style={{
                      fontSize: 14,
                      color: '#92949F',
                      paddingLeft: 15,
                    }}
                    numberOfLines={1}
                  >
                    {item.department}
                  </AutoText>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                <AutoText
                  style={{
                    fontSize: 16,
                    color: '#424141',
                  }}
                  numberOfLines={1}
                >
                  {item.phone}
                </AutoText>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'flex-start',
                }}
              >
                <AutoText
                  style={{
                    fontSize: 14,
                    color: '#92949F',
                  }}
                  numberOfLines={1}
                >
                  {item.company}
                </AutoText>
                {item.Company && item.Department ? (
                  <AutoText
                    style={{
                      fontSize: 14,
                      color: '#92949F',
                    }}
                  >
                    {' '}|{' '}
                  </AutoText>
                ) : null}
                <AutoText
                  style={{
                    fontSize: 14,
                    color: '#92949F',
                  }}
                  numberOfLines={1}
                >
                  {item.department}
                </AutoText>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
}

const styles = StyleSheet.create({
  container: {},
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    position: 'absolute',
    alignSelf: 'center',
    margin: 20,
  },
});

export default connect((state) => {
  return { ...state };
})(SearchBox);


// export default SearchBox;

