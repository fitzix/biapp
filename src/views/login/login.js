import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation'
import Button from 'apsl-react-native-button'
import { Checkbox } from 'teaset'

import { apiLogin } from '../../api/index'
import storageUtil from '../../utils/storage'

const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'MainPage' })
    ]
})

export default class LoginPage extends React.Component<> {
    static navigationOptions = { header: null }

    state = {
      account: '',
      passwd: '',
      isLoading: false,
      checked: true
    }

    async componentWillMount() {
      storageUtil.getUserPwd().then(ret => {
        this.setState({ account: ret.account, passwd: ret.passwd })
      }).catch(() =>{})

        if (await storageUtil.isLogin()) {
          this.props.navigation.dispatch(resetAction)
        }
    }

    handleLogin() {
        this.setState({ isLoading: true })
        apiLogin(this.state.account, this.state.passwd).then(resp => {
            if (this.state.checked) {
              storageUtil.save('userPwd', { account: this.state.account, passwd: this.state.passwd })
            }
            storageUtil.save('user', resp.user)
            this.props.navigation.dispatch(resetAction)
        }).catch(err => {
            this.setState({ isLoading: false })
            console.log(err)
        })
    }

    
    render() {
        return (
            <View style={ styles.container }>
                <Text style={ styles.appTitle }>BiApp</Text>
                <TextInput style={ styles.loginInput } placeholder="请输入账号" value={this.state.account} onChangeText={(account) => this.setState({account})} />
                <TextInput style={ styles.loginInput } clearButtonMode='while-editing' placeholder="请输入密码" value={this.state.passwd} onChangeText={(passwd) => this.setState({passwd})} secureTextEntry= {true} />
                <Checkbox style={ styles.remPwd } title='记住密码' checked={this.state.checked} onChange={checked => this.setState({checked})}/>
                <Button style={ styles.buttonStyle } isLoading={this.state.isLoading} textStyle={styles.textStyle} onPress={ () => this.handleLogin()}>登录</Button>
            </View>
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
    remPwd: {
      marginTop: 20,
      color: 'tomato',
      alignSelf: 'flex-end'
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