import React from 'react'
import {KeyboardAvoidingView, Text, TextInput,View, StyleSheet, Platform} from 'react-native'
import Button from 'apsl-react-native-button'

import CNTextInput from '../../components/CNTextInput'

import {apiLogin} from '../../api/index'
import storageUtil from '../../utils/storage'
import NavService from '../../services/navigator'

export default class LoginPage extends React.Component {
  static navigationOptions = {header: null}

  state = {
    account: '',
    passwd: '',
    isLoading: false
  }

  async componentWillMount() {
    let isLogin = await storageUtil.isLogin()
    if (isLogin) {
     return NavService.reset('MainPage')
    }
    storageUtil.getUserPwd().then(({account, passwd}) => {
      if(this._mounted) {
        this.setState({account, passwd})
      }
    }).catch(() => {
      console.log('没有保存密码')
    })
  }

  componentDidMount() {
    this._mounted = true
  }

  componentWillUnmount() {
    this._mounted = false
  }


  handleLogin() {
    this.setState({isLoading: true})
    apiLogin(this.state.account, this.state.passwd).then(resp => {
      storageUtil.save('userPwd', {account: this.state.account, passwd: this.state.passwd})
      storageUtil.save('user', resp.user)
      NavService.reset('MainPage')
    }).catch(err => {
      if (this._mounted) {
        this.setState({isLoading: false})
      }
      console.log('login', err)
    })
  }


  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : ''}>
        <View style={styles.content}>
          <Text style={styles.title}>大数据平台</Text>
          <CNTextInput style={styles.loginInput} placeholder="请输入账号" value={this.state.account} onChangeText={(account) => this.setState({account})} />
          <TextInput style={styles.loginInput} clearButtonMode='while-editing' placeholder="请输入密码" value={this.state.passwd} onChangeText={(passwd) => this.setState({passwd})} secureTextEntry={true}/>
          <Button style={styles.buttonStyle} isLoading={this.state.isLoading} textStyle={styles.textStyle} onPress={() => this.handleLogin()}>登录</Button>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20
  },
  title: {
    fontSize: 18,
    color: 'tomato'
  },
  loginInput: {
    height: 40,
    fontSize: 16,
    borderBottomWidth: .3,
    borderBottomColor: 'tomato',
    alignSelf: 'stretch',
    marginTop: 20,
  },
  buttonStyle: {
    borderWidth: 0,
    backgroundColor: 'tomato',
    marginTop: 20,
    height: 40,
  },
  textStyle: {
    color: 'white'
  }
})