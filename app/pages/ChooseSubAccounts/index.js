import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";
import { AutoText, AutoTextInput } from '../../components';
// import { createAction, Storage } from '../../../utils';
// import { cacheConfig } from '../../../config';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

/**
 * 子账户弹出框
 */
class ChooseSubAccounts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ModalIntroToggle: true,   // 模态框  默认false不显示
            // subAccountList: ['公司管理员', '培训与保障中心综合', '公司管理员'],
            subAccountList: [],
            chooseItemValue: ''  //选中的子账号
        };
    }

    componentDidMount() {
        //校验长效票据
        this.props.dispatch({
            type: 'subAccounts/verifyjwt',
            payload: {},
        }).then((res) => {
            // 票据有效
            if (res.status == 'success') {
                // 获取子账号数据
                this.props.dispatch({
                    type: 'subAccounts/chooseSubAccounts',
                    payload: {},
                }).then((res) => {
                    // console.log('------响应-----', res.subAccounts)
                    this.setState({
                        subAccountList: res.subAccounts,
                        chooseItemValue: res.subAccounts[0],  //默认选中第一个子账号
                    })
                });
            } else {
                // 票据失效退出到登录页
                this.props.dispatch({
                    type: 'user/logout',
                    payload: {},
                }).then((res) => {

                });
            }

        });


    }
    /**
     * 确定
     */
    submit = () => {
        this.props.dispatch({
            type: 'subAccounts/getUserId',
            payload: {
                choosedSubAccount: this.state.chooseItemValue
            },
        }).then((res) => {
            console.log('-----------', res)
            this.props.navigation.navigate('Home');
            this.ModalIntroToggleFun()
        });
    }
    /**
     * 选中事件
     * @param {String} value  选中的子账户值
     */
    chooseItem = (value) => {
        this.setState({
            chooseItemValue: value
        })
    }
    /**
     * 通过 Fun()  让模态框变量  取反
     */
    ModalIntroToggleFun() {
        this.setState({
            ModalIntroToggle: !this.state.ModalIntroToggle,
        })
    }
    /**
     * 模态框
     */
    ModalIntroToggleFunWrap() {
        return (
            <Modal
                isVisible={this.state.ModalIntroToggle}
                backdropOpacity={0.5}
                backdropColor={'#000'}
                style={{ margin: 0, alignItems: 'center', justifyContent: 'center' }}
            // onBackdropPress={() => this.setState({ ModalIntroToggle: false })}
            >
                <View
                // onPress={() => this.ModalIntroToggleFun()}
                >
                    <View style={styles.container}>
                        <View style={styles.title}>
                            <Text style={{ fontSize: 17 }}>请选择协同办公账号</Text>
                        </View>
                        <View style={styles.chooseJob}>
                            {this.state.subAccountList && this.state.subAccountList.map((item, index) => {
                                return (
                                    <TouchableOpacity key={index} style={{ ...styles.item, backgroundColor: this.state.chooseItemValue == item ? '#6da0f3' : '#f3f3f3' }} onPress={() => { this.chooseItem(item) }}>
                                        <Text style={{ ...styles.jobFontSize, color: this.state.chooseItemValue == item ? '#fff' : '#6c6c6c' }} >{item}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                        <TouchableOpacity style={styles.submit} onPress={() => this.submit()}>
                            <AutoText style={{ fontSize: 17, color: '#6da0f3' }}>确定</AutoText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
    render() {
        const { clickMeetingItem } = this.state;
        return (
            <>
                {this.ModalIntroToggleFunWrap()}
            </>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        width: 230,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    title: {
        height: 60,
        justifyContent: "center",
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f3f3',
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 15
    },
    chooseJob: {
        marginLeft: 15,
        marginRight: 15,
    },
    submit: {
        height: 50,
        justifyContent: "center",
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f3f3f3',
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    jobFontSize: {
        fontSize: 15,
        color: '#6c6c6c'
    },
    item: {
        height: 45,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: '#f3f3f3',
        marginBottom: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e5e5',
    }
});


export default connect(state => {
    return { ...state };
})(withNavigation(ChooseSubAccounts));


