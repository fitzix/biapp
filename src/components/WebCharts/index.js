/* eslint-disable */
import React from 'react'
import {
  View,
  WebView,
  Platform,
} from 'react-native'

const os = Platform.OS

/**
 * props:
 *
 * option(Object): Param of chart.setOption(),
 *                 the setOption will auto execute when option is changed.
 * exScript(String): Any JavaScript that will execute when WebView is loaded.
 * oMessage(Function): The handler for the WebView's postMessage.
 *                     You will have to set postMessage in the exScript first.
 */
export default class WebChart extends React.Component {
  static defaultProps = {
    option: {},
    exScript: '',
    onMessage: () => {},
  }


  componentDidMount(){
    this._webChartHash = Math.random()
  }

  componentDidUpdate(prevProps, prevState) {
    const optionJson = JSON.stringify(this.props.option);
    if (optionJson !== JSON.stringify(prevProps.option)) {
      this.update(optionJson);
    }
  }
  update = (optionJson) => {
    this.webView.postMessage(optionJson);
  }
  render() {
    // 本地html安卓 切换页面会不显示  only for iOS
    const echartsSource = {
      html:
        `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style type="text/css">
          body,html,#main {
            height: 100%;
            width: 100%;
            margin: 0;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          }
          #main {
            margin-left: 5px;
          }
      </style>
      <title>ECharts</title>
      <script src="https://cdn.bootcss.com/echarts/4.1.0/echarts.common.min.js"></script>
      <script>
        function injectGetFormatter(type) {
          if (type === 'percent') {
            return function (value, index) {
              return +(value * 100).toFixed(2) + '%'
            }
          }
          return function (value, index) {
              if (value >= 1000) {
                value = value/1000 + 'k'
              }
              return value
          }
        }
      </script>
    </head>
    <body>
        <div id="main"></div>
    </body>
    </html>
    `
    }

    return (
      <View style={[this.props.style, {flex: 1}]}>
        <WebView
          ref={(elem) => { this.webView = elem; }}
          scrollEnabled={false}
          scalesPageToFit={os !== 'ios'}
          originWhitelist={['*']}
          source={os === 'ios' ? echartsSource : {uri: `http://adcdn.leuok.cn/app/biapp.html?key=${this._webChartHash}`}}
          injectedJavaScript={`
            const chart = echarts.init(document.getElementById('main'), null, { renderer: 'svg' });
            var receiveData = ${JSON.stringify(this.props.option)};
            receiveData.yAxis.axisLabel.formatter = injectGetFormatter(receiveData.yFormatter);
            chart.setOption(receiveData);
            document.addEventListener('message', (e) => {
              var temp = JSON.parse(e.data);
              temp.yAxis.axisLabel.formatter = injectGetFormatter(temp.yFormatter);
              chart.setOption(temp, true);
            });
            ${this.props.exScript}
          `}
          onMessage={(e) => { this.props.onMessage(JSON.parse(e.nativeEvent.data)); }}
        />
      </View>
    )
  }
}