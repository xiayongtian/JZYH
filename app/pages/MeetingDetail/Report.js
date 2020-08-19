import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Linking,
} from 'react-native';
import { Storage, LoadingUtils, ToastUtils } from '../../utils';
import reactNativeAttachmentViewer from 'react-native-attachment-viewer';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import Preview from '../../pages/MeetingDetail/Preview';
import { cacheConfig } from '../../config';
import {
  getSuffix,
  isSupporOfficetAttachment,
  isSupportAttachment,
} from '../../utils/hori';
import getServerConfig from '../../config/server/config';
/**
 * 会议报告
 */
const serverConfig = getServerConfig();

class Report extends Component {
  static propTypes = {
    data: PropTypes.array, // 报告
  };
  constructor(props) {
    super(props);
    this.state = {
      reportImg: {
        pdf: require('../../images/meeting/icon_pdf2.png'),
        excel: require('../../images/meeting/icon_excel2.png'),
        xlsx: require('../../images/meeting/icon_excel2.png'),
        xls: require('../../images/meeting/icon_excel2.png'),
        ppt: require('../../images/meeting/icon_ppt2.png'),
        pptx: require('../../images/meeting/icon_ppt2.png'),
        docx: require('../../images/meeting/icon_word2.png'),
        doc: require('../../images/meeting/icon_word2.png'),
      },
    };
  }

  /**
   * 附件预览
   * @param fileId 附件id
   * @param fileName 附件名称
   */
  openFile = (fileId, fileName) => {
    // let url = `/view/file/getFile/?info=2&furl=http://218.240.159.110:11000/docker/oa/api/foreign/decisionmeeting/getfile/${fileId}`;
    // let url = `https://plist.horitech.com.cn:8086/ow/?furl=http://xiawei.vicp.io/oa/api/foreign/decisionmeeting/getfile/${fileId}`;
    // Linking.openURL(url)
    LoadingUtils.show('正在加载');
    var isSupport;
    var fileSuffix;
    if (fileName != '点击查看正文') {
      fileSuffix = getSuffix(fileName); //文件扩展名
      isSupport = isSupportAttachment(fileSuffix); //是否支持附件格式
    } else {
      isSupport = true;
      fileSuffix = 'doc';
    }
    if (isSupport) {
      //支持的内容

      // if (fileSuffix.indexOf("zip") != -1 || fileSuffix.indexOf("rar") != -1) { //压缩包文件
      //   localStorage.setItem("zipAttachementUrl", url);
      //   // LoadingUtils.hide();
      //   // $.hori.loadPage("viewhome/html/unZipList.html");
      //   return;
      // }
      // let url;
      if (fileSuffix.indexOf("xls") != -1 || fileSuffix.indexOf("xlsx") != -1) { //excel文件
        let url = `https://plist.horitech.com.cn:8086/ow/?furl=http://218.240.159.110:11000/docker/oa/api/foreign/decisionmeeting/getfile/${fileId}`
        this.props.navigation.navigate('Preview', { url, fileName });
        return;
      }
      // let url = `/view/file/getFile/ow/?info=2&furl=http://localhost:8088/aaa.pdf`
      let url = `/view/file/getFile/ow/?info=2&furl=http://218.240.159.110:11000/docker/oa/api/foreign/decisionmeeting/getfile/${fileId}`
      if (url.indexOf('?') != -1) {
        url = url + '&data-file-suffix=pdf';
      } else {
        url = url + '?data-file-suffix=pdf';
      }
      if (url == '') {
        ToastUtils.show('获取附件异常，请稍后再试。');
        return;
      }
      url = url.replace(/%/g, '');
      url = url.replace('(', '');
      url = url.replace(')', '');
      // url = $.hori.escapeData(url);
      // localStorage.setItem("attachmentUrl", url);
      // localStorage.setItem("fileSuffix", fileSuffix);
      // if (hori.isMobileBrowser()) { //浏览器
      //   // LoadingUtils.hide();
      //   // $.hori.loadPage("viewhome/html/attachmentShowForm.html","viewhome/xml/genertec.scene.xml");
      // } else { // 原生
      var officetype = isSupporOfficetAttachment(fileSuffix);
      if (officetype) {
        this.getFileContent(fileId, fileName, url);
      } else {
        // LoadingUtils.hide();
        // $.hori.loadPage("viewhome/html/attachmentShowForm.html","viewhome/xml/genertec.scene.xml");
      }

      // }
    } else {
      LoadingUtils.hide();
    }
  };
  getFileContent = async (fileId, fileName, url) => {
    this.props
      .dispatch({
        type: 'file/attchmentFile',
        payload: {
          url: url,
          // fileId:fileId
        },
      })
      .then(async (result) => {
        // 设置加载完成
        console.log('----------' + JSON.stringify(result));
        if (result.type == 'path') {
          await this.getFileImageUrl(result, fileName);
          LoadingUtils.hide();
        } else {
          ToastUtils.show('获取附件失败');
          LoadingUtils.hide();
        }
      });
  };

  getFileImageUrl = async (result, fileName) => {
    let total = result.total;
    let path = result.path;
    let type = result.type; //path type
    let content = result.content;
    if (type == 'path') {
      //图片路径
      if (path.indexOf('?') != -1) {
        path = path + '&data-random=' + Math.random();
      } else {
        path = path + '?data-random=' + Math.random();
      }
      path = serverConfig.baseUrl + "/" + path;
      // path = getFullUrl(path); //构造http地址
      console.log('请求的地址============' + path);
      LoadingUtils.hide();
      reactNativeAttachmentViewer.showAttchment(total + '', fileName, path);
    }
  };
  render() {
    return (
      <View style={styles.reportContain}>
        <ScrollView>
          {this.props.data &&
            this.props.data.map((item, index) => {
              return (
                <View style={styles.reportItem} key={index}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reportTitle}>{item.meetingTitle}</Text>
                    <View style={styles.reporthuibao}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, color: '#666666' }}>
                          汇报人：{item.reportUserName} ({item.attendUnitName})
                        </Text>
                      </View>
                      <View style={{ flexBasis: 170, marginLeft: 35 }}>
                        <Text style={{ fontSize: 13, color: '#666666' }}>
                          汇报时长：{item.timeLength}分钟
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row', paddingRight: 10 }}>
                    {item.fileList &&
                      item.fileList.map((fileItem, index) => {
                        let source;
                        console.log('------类型-----', fileItem.fileType)
                        switch (fileItem.fileType) {
                          case 'pdf':
                            source = this.state.reportImg.pdf;
                            break;
                          case 'excel':
                            source = this.state.reportImg.excel;
                            break;
                          case 'xlsx':
                            source = this.state.reportImg.xlsx;
                            break;
                          case 'xls':
                            source = this.state.reportImg.xls;
                            break;
                          case 'ppt':
                            source = this.state.reportImg.ppt;
                            break;
                          case 'pptx':
                            source = this.state.reportImg.pptx;
                            break;
                          case 'docx':
                            source = this.state.reportImg.docx;
                            break;
                          case 'doc':
                            source = this.state.reportImg.doc;
                            break;
                        }
                        return (
                          <TouchableOpacity
                            style={{ width: '25%' }}
                            key={index}
                            onPress={() => {
                              this.openFile(fileItem.fileId, fileItem.fileName);
                            }}>
                            <ImageBackground
                              source={source}
                              imageStyle={{}}
                              style={styles.pdfTitle}></ImageBackground>
                            <Text
                              style={{
                                fontSize: 12,
                                lineHeight: 20,
                                paddingLeft: 7,
                                paddingRight: 7,
                                // backgroundColor:'pink',
                                // paddingRight:15,
                                textAlign: 'center',
                              }}>
                              {fileItem.fileName}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    {/* <View style={styles.pishi}>
                    <TouchableOpacity >
                      <View style={styles.btn}>
                        <Text style={styles.btnText}>批示</Text>
                      </View>
                    </TouchableOpacity>
                  </View> */}
                  </View>
                </View>
              );
            })}
        </ScrollView>
      </View>
    );
  }
}

// export default Report;
export default connect((state) => {
  return { ...state };
})(withNavigation(Report));

const styles = StyleSheet.create({
  btn: {
    textAlign: 'center',
    marginRight: 30,
    color: '#fff',
    width: 80,
    height: 35,
    borderColor: '#409eff',
    borderWidth: 1,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    color: '#409eff',
    fontWeight: 'bold',
  },
  reportContain: {
    flex: 3,
    padding: 10,
    paddingBottom: 0,
    borderWidth: 1,
    borderColor: '#f4f4f4',
    backgroundColor:'#fff',
    borderLeftWidth: 0,
  },
  reportItem: {
    // height: 200,
    // flex:1,
    // paddingBottom:10,
    borderWidth: 1,
    marginRight: 5,
    borderColor: '#f4f4f4',
    marginBottom: 10,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    // marginRight:10
  },
  reportTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
  },
  reporthuibao: {
    flex: 1,
    flexDirection: 'row',
    fontWeight: 'bold',
    // backgroundColor: 'pink',
    // justifyContent:'space-around',
    marginTop: 10,
    marginBottom: 5,
    color: '#666666',
  },
  pdfTitle: {
    width: 45,
    height: 45,
    margin: 5,
    alignSelf: 'center',
  },
  pishi: {
    width: 120,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});
