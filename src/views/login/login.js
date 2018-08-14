import React from 'react'
import {KeyboardAvoidingView, Text, TextInput, StyleSheet} from 'react-native'
import Button from 'apsl-react-native-button'

import LLTextInput from '../../components/LLTextInput'

import {apiLogin} from '../../api/index'
import storageUtil from '../../utils/storage'
import NavService from '../../services/navigator'

export default class LoginPage extends React.Component<> {
  static navigationOptions = {header: null}

  state = {
    account: '',
    passwd: '',
    isLoading: false
  }

  componentWillMount() {
    storageUtil.getUserPwd().then(ret => {
      console.log(ret)
      this.setState({account: ret.account, passwd: ret.passwd})
    }).catch(() => {
      console.log('没有保存密码')
    })

    storageUtil.isLogin().then(ret => {
      if (ret) {
        NavService.reset('MainPage')
      }
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
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Text style={styles.appTitle}>BiApp</Text>
        <LLTextInput style={styles.loginInput} placeholder="请输入账号" value={this.state.account} onChangeText={(account) => this.setState({account})}/>
        <TextInput style={styles.loginInput} clearButtonMode='while-editing' placeholder="请输入密码" value={this.state.passwd} onChangeText={(passwd) => this.setState({passwd})} secureTextEntry={true}/>
        <Button style={styles.buttonStyle} isLoading={this.state.isLoading} textStyle={styles.textStyle} onPress={() => this.handleLogin()}>登录</Button>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  appTitle: {
    textAlign: 'center'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20
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