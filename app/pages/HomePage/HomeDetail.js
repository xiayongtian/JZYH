import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    FlatList,
} from 'react-native';
import { connect } from 'react-redux';
// import Swiper from 'react-native-swiper';
class HomeDetail extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * 渲染头像
     */
    renderAvatar = () => {
        return (
            <View
                style={{
                    // position: 'absolute',
                    height: 35,
                    width: 35,
                    right: 10,
                    overflow: 'hidden',
                    borderRadius: 39,
                    backgroundColor: '#ccc',
                    alignSelf: 'center',
                    marginRight: 15
                }}
            />
        );
    };
    componentDidMount() {

    }


    render() {

        return (
            <View style={{ flex: 1, flexDirection: 'column', marginTop: 25 }}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Image
                            style={{ width: 30, height: 30, alignSelf: 'center', marginLeft: 15 }}
                            source={require('./icon/icon_filter.png')}
                        />
                        <Text style={{ fontSize: 20, alignSelf: 'center', marginLeft: 15 }}>国投移动OA办公111</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={{ alignSelf: 'center', fontSize: 18, color: 'grey', marginRight: 20 }}>XXX,上午11好!</Text>
                        {this.renderAvatar()}
                        <View style={{ backgroundColor: 'grey', width: 1, height: 15, alignSelf: 'center', marginRight: 15 }} />
                        <Image
                            style={{ width: 30, height: 30, alignSelf: 'center', marginRight: 20 }}
                            source={require('./icon/icon_filter.png')}
                        />
                    </View>
                </View>
                <View style={{ flex: 9, flexDirection: 'row' }}>

                    <View style={{ flex: 6 }}>
                        <View style={{ flex: 2 }}>
                            {/* <Swiper style={styles.wrapper} showsButtons={true}>
                                <View style={styles.slide1}>
                                    <Text style={styles.text}>Hello Swiper</Text>
                                </View>
                                <View style={styles.slide2}>
                                    <Text style={styles.text}>Beautiful</Text>
                                </View>
                                <View style={styles.slide3}>
                                    <Text style={styles.text}>And simple</Text>
                                </View>
                            </Swiper> */}
                        </View>

                        <View style={{ flex: 3, backgroundColor: 'red' }}>
                        </View>
                    </View>
                    <View style={{ flex: 4, backgroundColor: 'blue' }}>


                    </View>
                </View>
            </View>
        );
    }

}

export default connect((state) => {
    return { ...state };
})(HomeDetail);

// 定义通用的样式
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        borderColor: '#F2F2F2',
        borderStyle: 'solid',
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: 'white',
        height: 40,
        flexDirection: 'row'
    },
    headerLeft: {
        flex: 1,
        flexDirection: 'row'
    },
    headerRight: {
        flexDirection: 'row'
    },
    swiperImage: {

    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    }
});