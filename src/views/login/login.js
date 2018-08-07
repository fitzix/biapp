import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { StackActions, NavigationActions } from 'react-navigation'
import Button from 'apsl-react-native-button'
import * as LoginAction from '../../redux/actions/login'
import { apiLogin } from '../../api/index'

const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'Main' })
    ]
})

class LoginPage extends React.Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props)
        this.state = { account: '', passwd: '', isLoading: false }
    }

    componentWillMount() {
        this.checkHasLogin()
    }

    checkHasLogin() {
        global.storage.load({
            key: 'user',
            autoSync: false
        }).then(ret => {
            if (ret && ret.name) {
                this.props.navigation.dispatch(resetAction)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
    }


    handleLogin() {
        this.setState({ isLoading: true })
        apiLogin(this.state.account, this.state.passwd).then(resp => {
            
        }).catch(err => {
            console.log(err)
        }).finally( _ => {
            this.setState({ isLoading: false })
        })
        // this.props.dispatch(LoginAction.logIn(this.state.account, this.state.passwd))
    }

    
    render() {
        return (
            <View style={ styles.container }>
                <Text>BiApp</Text>
                <TextInput style={ styles.loginInput } placeholder="请输入账号" value={this.state.account} onChangeText={(account) => this.setState({account})} />
                <TextInput style={ styles.loginInput } placeholder="请输入密码" value={this.state.passwd} onChangeText={(passwd) => this.setState({passwd})} secureTextEntry= {true} />
                <Button style={ styles.buttonStyle } isLoading={this.state.isLoading} textStyle={styles.textStyle} onPress={ () => this.handleLogin()}>登录</Button>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
        marginRight: 20
    },
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

const mapStateToProps = state => ({
    isLoggedIn: state.auth.isLoggedIn,
    user: state.auth.user,
    status: state.auth.status
})

export default connect(mapStateToProps)(LoginPage)