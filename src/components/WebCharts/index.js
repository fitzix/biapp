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
            background: white;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          }
      </style>
      <title>ECharts</title>
      <script src="https://cdn.bootcss.com/echarts/4.1.0/echarts.common.min.js"></script>
    </head>
    <body>
        <div id="main"></div>
    </body>
    </html>
    `
    }

    return (
      <View style={this.props.style}>
        <WebView
          ref={(elem) => { this.webView = elem; }}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
          scrollEnabled={false}
          scalesPageToFit={os !== 'ios'}
          originWhitelist={['*']}
          domStorageEnabled={true}
          source={echartsSource}
          injectedJavaScript={`
            const chart = echarts.init(document.getElementById('main'), null, { renderer: 'svg' });
            chart.setOption(${JSON.stringify(this.props.option)});
            document.addEventListener('message', (e) => {
              chart.setOption(JSON.parse(e.data), true);
            });
            ${this.props.exScript}
          `}
          onMessage={(e) => { this.props.onMessage(JSON.parse(e.nativeEvent.data)); }}
        />
      </View>
    )
  }
}