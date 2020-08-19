import React from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, Linking, TouchableWithoutFeedback } from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { ToastUtils, LoadingUtils, Storage } from '../../utils';
import { SplitView, SplitViewType, AutoText } from '../../components';
import LeftTopComponents from './components/LeftTopComponents';
import RightTopList from './components/RightTopList';
import LastVisitComponents from './components/LastVisitComponents';
import ContactsRightComponent from './ContactsRightComponent';
import FavoriteTop from './FavoriteTop';
import { commonRequestParamsConfig } from '../../config';
import { commonStyle } from '../../config/global/commonStyle';
import SearchBox from './components/SearchBox';
import { CacheConfigConstants } from '../../config/cacheConfigConstants';
import commonParamsConfig from '../../config/global/commonParamsConfig';
import createSchema from '../../utils/Schema'

class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      realm: null,
      rightEditClick: false, // 收藏夹 - 编辑按钮
      clickedItem: 'tree', // 控制点击左侧菜单后，右侧的展示内容模块
      oldClickedItem: '',
      favoriteList: [], // 收藏夹 - 列表数据
      favoriteSelectAllBiaoshi: false, // 收藏夹 - 全选按钮
      sendEmail: false, // 控制 rightTopToolBar 是否是群发邮件状态
      emailList: [],
      title: '全集团', //右侧title
      selectedList: [], //被选中的收藏人员列表
      rightEditClickIn: false,
      hiddenEditButton: false,
      treeRootNodeId: {
        SubsubcomId: '',
        CompanyId: '',
        DepartmentId: '',
      },
    };
  }

  static navigationOptions = {
    title: '通讯录',
  };

  // 查询收藏夹列表数据-全部（不带分页）
  getList = async () => {
    // LoadingUtils.show(68);
    let favoriteList = await Storage.get('favorite');
    console.warn('favoriteList->>',favoriteList)
    this.setState({
      favoriteList
    })

  }
  componentWillUnmount() {
    // Close the realm if there is one open.
    // const { realm } = this.state;
    // if (realm !== null && !realm.isClosed) {
    //   realm.close();
    // }
  }

  componentDidMount() {
    console.log('naviga------', this.props)
    // 初始化数据库
    createSchema()

    let {
      contacts: {
        rightEditClick, // 收藏夹 - 编辑按钮
        clickedItem, // 控制点击左侧菜单后，右侧的展示内容模块
        favoriteList, // 收藏夹 - 列表数据
        favoriteSelectAllBiaoshi, // 收藏夹 - 全选按钮
      },
    } = this.props;
    this.setState({
      rightEditClick, // 收藏夹 - 编辑按钮
      clickedItem, // 控制点击左侧菜单后，右侧的展示内容模块
      favoriteList, // 收藏夹 - 列表数据
      favoriteSelectAllBiaoshi, // 收藏夹 - 全选按钮
    });
    this.setState({
      moreMenu: {
        showMoreMenu: false,
      },
    });
    // this.getAllRootTreeNodeId();


    // -------------------------------------------


  }

  getAllRootTreeNodeId = async () => {
    const userOrgInfo = await Storage.get(CacheConfigConstants.user.USER_ORG);
    const {
      SubsubcomId,
      CompanyId,
      DepartmentId,
    } = userOrgInfo;
    this.setState({
      treeRootNodeId: {
        SubsubcomId,
        CompanyId,
        DepartmentId,
      },
    });
  };

  componentDidUpdate() {
    const { portalstate, statePerson } = this.props.search;
    if (portalstate) {
      this.setState({
        clickedItem: statePerson,
      });
      this.props.dispatch({
        type: 'search/updategetDelPortalstate',
        payload: {
          portalstate: false,
        },
      });
    }
  }

  itemClick = async param => {
    // console.warn(param, 'sfsadfasfs');
    if (param && param.type) {
      const { clickedItem, oldClickedItem } = this.state;
      console.warn(clickedItem, oldClickedItem, param.type)
      let target = {
        clickedItem: param.type,
      };
      if (clickedItem !== oldClickedItem) {
        target['oldClickedItem'] = clickedItem;
      }
      if (param.type == 'searchDetail') {
        this.setState({
          clickedItem: param.type,
        });
      }
      if (param.type == 'contactsDetail') {

      }
      this.setState(target);
      return;
    }

    let arr = this.state.favoriteList
    let selected = this.state.selectedList;
    let favoriteList = arr.map(item => {
      if (item.id === param) {
        if (item.slt) {
          item.slt = undefined;
          selected.splice(item, 1);
        } else {
          item.slt = true;
          selected.push(item);
        }
      }
      return item;
    });
    console.warn('selected->>>>>>', favoriteList, selected)
    this.setState({
      favoriteList, // 收藏夹 -
      selectedList: selected,
    });
  };

  rightComponent = () => {
    return (
      <ContactsRightComponent
        rightEditClick={this.state.rightEditClick}
        favoriteList={this.state.favoriteList}
        rightItem={this.state.clickedItem}
        oldRightItem={this.state.oldClickedItem}
        navigation={this.props.navigation}
        itemClick={item => {
          this.itemClick(item);
        }}
        backButtonCallback={() => {
          LoadingUtils.show(70);
          this.getList();
        }}
      />
    );
  };

  leftClickCallBack = param => {
    console.warn('test', param)
    this.setState({
      clickedItem: param,
    });
    if (param === '收藏夹') {
      this.getList();
    }
    this.closeSelectButton();
    this.setState({
      sendEmail: false,
    });
    this.props.dispatch({
      type: 'contactsTree/clearTreeSelectedState',
    });
  };

  leftComponent = () => {
    return (
      <>
        <LeftTopComponents
          // currentRightShowType={this.state.clickedItem}
          // 点击左侧菜单按钮的回调
          leftClickCallBack={param => {
            if (param === '收藏夹') {
              this.leftClickCallBack(param);
            } else {
              let istree = param.substring(0, 4);
              let org = param.substring(4, param.length);
              const {
                treeRootNodeId: {
                  SubsubcomId,
                  CompanyId,
                  DepartmentId,
                },
              } = this.state;
              if (org && 'hrmsubcompany61' === org) {
                this.getTreeData(SubsubcomId, true);
                this.setState({
                  title: '全集团',
                });
              }
              if (org && org.search('subcompany') != -1 && 'hrmsubcompany61' != org) {
                this.getTreeData(CompanyId, true);
                this.setState({
                  title: '本公司',
                });
              }
              if (org && org.search('department') != -1) {
                this.getTreeData(DepartmentId, true);
                this.setState({
                  title: '同部门',
                });
              }
              this.leftClickCallBack(istree);
            }
          }}
        />
        <LastVisitComponents
          clickPerson={item => {
            this.itemClick(item);
          }}
        />
      </>
    );
  };

  /**
   * 查询树数据
   * @param {string} groupCode 当前节点的 ID
   * @param {boolean} isRoot 当前节点是否作为根节点
   */
  getTreeData = async (groupCode, isRoot) => {
    const { SubsubcomId, SCode } = await Storage.get(CacheConfigConstants.user.USER_ORG);
    const {
      login: {
        userInfo: { userId },
      },
      dispatch,
    } = this.props;
    await dispatch({
      type: 'contactsTree/getDepartmentTree',
      payload: {
        appID: commonParamsConfig.APP_ID,
        userCode: userId,
        groupcode: groupCode || SubsubcomId,
        IsRoot: isRoot ? 'Y' : 'N',
        SCode: SCode,
      },
    });
  };

  closeSelectButton = () => {
    this.props.dispatch({
      type: 'contactsTree/closeSelectButton',
      payload: false,
    });
  };

  //群发邮件操作
  sendGroupEmail = emailList => {
    console.log('发送邮件选择的人', emailList);
    let emailAry = [];
    if (emailList && emailList.length > 0) {
      emailList.map((item, index) => {
        emailAry.push(item.email);
      });
      let emailStr = emailAry.join(';');
      console.log(emailStr);
      Linking.canOpenURL(emailStr)
        .then(() => {
          console.log('emailStr=================', emailStr);
          Linking.openURL(`mailto:${emailStr}`);
          this.props.dispatch({
            type: 'contactsTree/clearTreeSelectedState',
          });
          this.props.dispatch({
            type: 'contactsTree/toggleShowSelectButton',
          });
          this.setState({
            sendEmail: false,
          });
        })
        .catch(err => {
          console.log('An error occurred', err);
          ToastUtils.show(`操作失败,请检查是否已登录邮箱:${err}`);
        });
    } else {
      ToastUtils.show('请选择邮件接收人');
      return;
    }
  };

  rightTopToolBar = () => {
    const {
      contactsTree: { selectedPerson },
    } = this.props;
    if (this.state.clickedItem === '收藏夹') {
      return (
        <FavoriteTop
          hiddenEditButton={this.state.hiddenEditButton}
          rightEditClickIn={this.state.rightEditClickIn}
          selectedList={this.state.selectedList}
          // 收藏夹 - 编辑按钮的回调
          callbackEdit={str => {
            this.setState({
              rightEditClick: str,
              rightEditClickIn: str,
            });
          }}
          // 收藏夹 - 全选按钮的回调
          callbackSelectAll={() => {
            if (this.state.selectedList.length === 0) {
              let selected = [];
              let arr2 = this.state.favoriteList.map(item => {
                item.slt = true;
                selected.push(item);
                return item;
              });
              this.setState({
                favoriteList: arr2,
                favoriteSelectAllBiaoshi: true,
                selectedList: selected,
              });
            } else {
              let selected = [];
              let arr2 = this.state.favoriteList.map(item => {
                item.slt = !this.state.favoriteSelectAllBiaoshi ? true : undefined;
                if (!this.state.favoriteSelectAllBiaoshi) {
                  selected.push(item);
                }
                return item;
              });
              this.setState({
                favoriteList: arr2,
                favoriteSelectAllBiaoshi: !this.state.favoriteSelectAllBiaoshi,
                selectedList: selected,
              });
            }
          }}
          // 收藏夹 - 删除按钮的回调
          callbackDel={() => {
            let arr2 = [],
              arr3 = [],
              arr4 = [];
            arr3 = this.state.favoriteList.filter(item => {
              if (!item.slt) {
                return item;
              }
            });
            arr3.map(item => {
              if (item) {
                arr4.push(item);
              }
            });
            arr2 = this.state.favoriteList.filter(item => {
              if (item.slt) {
                return item;
              }
            });
            if (arr2.length > 0) {
              const { userId, userCode } = this.props.login.userInfo;
              arr2.map(item => {
                if (item) {
                  let params = {
                    ContractID: item.ContractID,
                    SCode: 'FW',
                    UserCode: userId,
                    appID: commonRequestParamsConfig.APP_ID,
                    userid: userCode,
                  };
                  this.props.dispatch({
                    type: 'contacts/delPortalContact',
                    payload: {
                      ...params,
                    },
                  });
                }
              });
              this.setState({
                favoriteList: arr4,
                selectedList: [],
                rightEditClick: false,
                rightEditClickIn: false,
                hiddenEditButton: arr4.length === 0,
              });
              ToastUtils.show('删除成功');
            } else {
              return;
              //Alert.alert("您未选择待选项.");
            }
          }}
          // 收藏夹 - 全屏按钮的回调
          onFullScreen={() => {
            this.props.dispatch({
              type: 'contacts/updateLeftClick',
              payload: {
                clickedItem: this.state.clickedItem,
              },
            });

            this.props.dispatch({
              type: 'contacts/updateRightEditClick',
              payload: {
                rightEditClick: this.state.rightEditClick,
              },
            });

            this.props.dispatch({
              type: 'contacts/updateSelectAllBiaoshi',
              payload: {
                favoriteSelectAllBiaoshi: this.state.favoriteSelectAllBiaoshi,
              },
            });
            this.props.navigation.navigate('FavoriteFullScreen');
          }}
        />
      );
    } else if (this.state.clickedItem === 'contactsDetail') {
      return <View />;
    } else if (this.state.sendEmail) {
      //群发邮件状态下 rightTopToolBar 的样式
      return (
        <View
          style={{
            height: 44,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTopLeftRadius: 24,
          }}
        >
          <TouchableOpacity
            style={{ marginLeft: 13 }}
            onPress={() => {
              //this.toggleSelectButton();
              this.setState({
                sendEmail: false,
              });
              this.props.dispatch({
                type: 'contactsTree/clearTreeSelectedState',
              });
              this.props.dispatch({
                type: 'contactsTree/toggleShowSelectButton',
              });
            }}
          >
            <AutoText style={{ fontSize: 18, color: '#9E9DA7' }}>取消</AutoText>
          </TouchableOpacity>

          <AutoText style={{ fontSize: 17, color: commonStyle.darkBlack, fontWeight: 'bold' }}>
            群发邮件
          </AutoText>

          <TouchableWithoutFeedback
            style={{ marginRight: 15 }}
            onPress={() => {
              // this.toggleSelectButton();

              this.sendGroupEmail(selectedPerson);
            }}
          >
            <AutoText style={{ fontSize: 18, color: '#9E9DA7', marginRight: 15 }}>完成</AutoText>
          </TouchableWithoutFeedback>
        </View>
      );
    } else if (this.state.clickedItem === 'searchDetail') {
      return <></>;
    } else {
      return null;
    }
  };

  //右上角icon  点击展示菜单
  rightIcon = () => {
    return (
      <View>
        <RightTopList
          leftClickCallBack={param => {
            this.leftClickCallBack(param);
          }}
          changeToolBar={sendEmail => {
            this.setState({
              sendEmail,
            });
          }}
        />
      </View>
    );
  };

  render() {
    return (
      // <View style={{ flex: 1,backgroundColor:'pink' }}>
      //   <Text style={{ width: 100, height: 100, color: 'blue' }}>123</Text>
      // </View>

      // <View style={styles.container}>
      //   <Text>我的</Text>
      //   <TouchableOpacity style={styles.logout} onPress={this.logout}>
      //     <Text>退出登录</Text>
      //   </TouchableOpacity>
      // </View>

      <SplitView
        type={SplitViewType.ADDRESSBOOK}
        fullScreenBiaoshi={this.state.fullScreenBiaoshi}
        LeftComponent={this.leftComponent}
        RightComponent={this.rightComponent}
        rightTitle={this.state.title}
        rightIcon={this.rightIcon()}
        RightTopToolBar={this.rightTopToolBar()}
        onFullScreenChange={() => {
          console.log('跳转路由TreeFullScreen--------');
          this.props.navigation.navigate('TreeFullScreen', { title: this.state.title });
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logout: {
    marginTop: 10,
  },
});

export default connect(state => {
  return { ...state };
})(withNavigation(Contact));