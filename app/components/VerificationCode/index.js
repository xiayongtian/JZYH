"use strict";

import React from 'react';
import PropTypes from 'prop-types';
import Toast from '../../utils/toast';

import {
    View,
    Text,
    TouchableOpacity,
    ViewPropTypes, StyleSheet
} from 'react-native';
import { connect } from 'react-redux';

const defaultShowText = '获取验证码';
/**
 * 验证码
 */
class VerificationCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timerCount: this.props.timerCount || 60,
            timerTitle: this.props.timerTitle || defaultShowText,
            counting: false,
            selfEnable: true,
        };
        this._shouldStartCount = this._shouldStartCount.bind(this);
        this._countDownAction = this._countDownAction.bind(this);
    }

    static propTypes = {
        style: ViewPropTypes.style,
        textStyle: Text.propTypes.style,
        onClick: PropTypes.func,
        // username: PropTypes.string,
        // password: PropTypes.string,
        disableColor: PropTypes.string,
        timerTitle: PropTypes.string,
        enable: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
        timerEnd: PropTypes.func,
        timerActiveTitle: PropTypes.array,
        executeFunc: PropTypes.func
    };

    /**
     * 倒计时
     */
    _countDownAction() {
        const codeTime = this.state.timerCount;
        const { timerActiveTitle, timerTitle } = this.props;
        const now = Date.now();
        const overTimeStamp = now + codeTime * 1000 + 100;
        /*过期时间戳（毫秒） +100 毫秒容错*/
        this.interval = setInterval(() => {
            const nowStamp = Date.now();
            if (nowStamp >= overTimeStamp) {
                this.interval && clearInterval(this.interval);
                this.setState({
                    timerCount: codeTime,
                    timerTitle: timerTitle || defaultShowText,
                    counting: false,
                    selfEnable: true
                });
                if (this.props.timerEnd) {
                    this.props.timerEnd()
                }
            } else {
                const leftTime = parseInt((overTimeStamp - nowStamp) / 1000, 10);
                let activeTitle = `重新获取(${leftTime}s)`;
                if (timerActiveTitle) {
                    if (timerActiveTitle.length > 1) {
                        activeTitle = timerActiveTitle[0] + leftTime + timerActiveTitle[1]
                    } else if (timerActiveTitle.length > 0) {
                        activeTitle = timerActiveTitle[0] + leftTime
                    }
                }
                this.setState({
                    timerCount: leftTime,
                    timerTitle: activeTitle,
                })
            }
        }, 1000)
    }
    /**
     * 是否开始倒计时
     * @param {} shouldStart true:开始倒计时 false:灰色不可点击
     */
    _shouldStartCount(shouldStart) {

        if (this.state.counting) {
            return
        }
        if (shouldStart) {
            this._countDownAction();
            this.setState({ counting: true, selfEnable: false })
        } else {
            this.setState({ selfEnable: true })
        }
    }

    componentDidMount() {
        const { executeFunc } = this.props;
        executeFunc && executeFunc(this._shouldStartCount);
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    /**
     * 校验登录名并发送短信验证码
     */
    checkLoginNameAndSendCode = () => {
        this.props.dispatch({
            type: 'user/checkLoginName',
            payload: {
                // authUsername: this.props.username,
                // authPassword: this.props.password,

                authUsername: 'appportal',
                authPassword: 'app@sdicin',
                loginName: this.props.loginName,
            },
        }).then(async result => {
            // 登录名校验成功
            if (result.success) {
                // 开始倒计时
                this.props.onClick(this._shouldStartCount)
                this.getCode(result.mobile)

            } else {
                Toast.show('您的用户名不存在,无法发送验证码!');

            }

        })
    }
    /**
     * 获取短信验证码
     * @param {String} mobile 电话
     */
    getCode = (mobile) => {
        this.props.dispatch({
            type: 'user/sendVerificationCode',
            payload: {
                mobile,
                templateType: "sms.send.resetpwd.template"   //定值
            },
        }).then(async result => {
            console.log('login, result测试 ========== ', result);
            // 登录名校验成功
            if (result.status) {
                let start = mobile.substring(0, 3)
                let end = mobile.substring(9)
                Toast.show(`验证码已成功发送至手机${start}xxxxxx${end},请注意查收!`);
            } else {
                Toast.show(result.message);
            }

        })
    }
    render() {
        const { onClick, style, textStyle, enable, disableColor } = this.props;
        const { counting, timerTitle, selfEnable } = this.state;
        return (
            <View style={[{ width: 120, height: 34 }, style]}>
                <TouchableOpacity
                    activeOpacity={counting ? 1 : 0.8}
                    onPress={() => {
                        const { loginName } = this.props
                        if ((!loginName || loginName.trim() == '')) {
                            Toast.show('用户名不能为空,无法发送验证码!');
                            return
                        } else {
                        }

                        if (!counting && enable && selfEnable) {
                            this.checkLoginNameAndSendCode()
                        }

                    }}
                    style={[styles.container,
                    { backgroundColor: ((!counting && enable && selfEnable) ? 'red' : disableColor || '#ccc') }
                    ]}
                >
                    <Text
                        style={[
                            styles.defaultText,
                            textStyle,
                        ]}>{timerTitle}</Text>
                </TouchableOpacity>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderRadius: 5,
        borderColor: "white",
    },
    defaultText: {
        fontSize: 16,
        color: "white",
    }
});

export default connect(state => {
    return { ...state };
})(VerificationCode);