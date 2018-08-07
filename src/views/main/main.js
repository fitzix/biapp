import React from 'react'
import {createBottomTabNavigator} from 'react-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'

import {View, Text, Image, ScrollView, TouchableWithoutFeedback, Dimensions} from 'react-native'

import {Theme, NavigationPage, ListRow, Overlay, Label, Button, Checkbox} from 'teaset'

class HomeScreen extends React.Component {
    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Home!</Text>
            </View>
        );
    }
}

class SettingsScreen extends React.Component {

    showDefault(transparent, modal, text) {
        let overlayView = (
            <Overlay.View
                style={{alignItems: 'center', justifyContent: 'center'}}
                modal={modal}
                overlayOpacity={transparent ? 0 : null}
                ref={v => this.overlayView = v}
            >
                <View style={{
                    backgroundColor: transparent ? '#333' : Theme.defaultColor,
                    padding: 40,
                    borderRadius: 15,
                    alignItems: 'center'
                }}>
                    <Label type='danger' size='xl' text={text}/>
                    {modal ? <View style={{height: 20}}/> : null}
                    {modal ?
                        <Button title='Close' onPress={() => this.overlayView && this.overlayView.close()}/> : null}
                </View>
            </Overlay.View>
        );
        Overlay.show(overlayView);
    }

    showPull(side, modal, text, rootTransform) {
        let overlayView = (
            <Overlay.PullView side={side} modal={modal} rootTransform={rootTransform} ref={v => this.overlayPullView = v}>
                <View style={{backgroundColor: Theme.defaultColor, minWidth: 300, minHeight: 260, justifyContent: 'center', alignItems: 'center'}}>
                    <Label type='title' size='xl' text={text} />
                    {modal ? <View style={{height: 60}} /> : null}
                    {modal ? <Button title='Close' onPress={() => this.overlayPullView && this.overlayPullView.close()} /> : null}
                </View>
            </Overlay.PullView>
        );
        Overlay.show(overlayView);
    }

    render() {
        return (
            <ScrollView style={{flex: 1}}>
                <ListRow title='Translucent' onPress={() => this.showDefault(false, false, 'Translucent')} />
                <ListRow title='Pull from left' onPress={() => this.showPull('left', false, 'Pull from left')} />
                <ListRow title='Translucent' onPress={() => this.showDefault(false, false, 'Translucent')} />
            </ScrollView>
        );
    }
}

export default createBottomTabNavigator(
    {
        Home: HomeScreen,
        Settings: SettingsScreen,
    },
    {
        navigationOptions: ({navigation}) => ({
            tabBarIcon: ({focused, tintColor}) => {
                const {routeName} = navigation.state;
                let iconName;
                if (routeName === 'Home') {
                    iconName = `ios-information-circle${focused ? '' : '-outline'}`;
                } else if (routeName === 'Settings') {
                    iconName = 'ios-options'
                }
                // You can return any component that you like here! We usually use an
                // icon component from react-native-vector-icons
                return <Ionicons name={iconName} size={25} color={tintColor}/>;
            },
        }),
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
        },
    }
);