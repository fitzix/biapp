import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { NavigationActions } from 'react-navigation'
import Button from 'apsl-react-native-button'

import * as LoginAction from '../../redux/actions/login'

const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'Main' })
    ]
})

export default class LoginPage extends React.Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props)
        this.state = { account: '', passwd: '' }
    }

    componentWillMount() {

    }

    checkHasLogin() {
        
    }

    
    render() {
        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 20,
                marginRight: 20
            }}>
                <Text>BiApp</Text>
                <TextInput style={styles.loginInput} placeholder="请输入账号" value={this.state.account} onChangeText={(account) => this.setState({account})} />
                <TextInput style={styles.loginInput} placeholder="请输入密码" value={this.state.passwd} onChangeText={(passwd) => this.setState({passwd})} secureTextEntry= {true} />
                <Button style={styles.buttonStyle} textStyle={styles.textStyle} onPress={ () => this.props.navigation.navigate('Main')}>登录</Button>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loginInput: {
        height: 40,
        fontSize: 16,
        borderBottomWidth: .3,
        borderBottomColor: '#f39c12',
        alignSelf: 'stretch',
        marginTop: 20,
    },
    buttonStyle: {
        borderColor: '#f39c12',
        backgroundColor: '#f1c40f',
        marginTop: 20,
        height: 40,
    },
    textStyle: {
        color: 'white'
    },
})