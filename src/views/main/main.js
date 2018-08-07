import React from 'react'
import {createBottomTabNavigator} from 'react-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'

import RealTimePage from '../realtime'
import ReportPage from '../report'
import SharedPage from '../shared'


export default createBottomTabNavigator(
    {
        RealTimePage: RealTimePage,
        ReportPage: ReportPage,
        SharedPage: SharedPage,
    },
    {
        navigationOptions: ({navigation}) => ({
            tabBarIcon: ({focused, tintColor}) => {
                let iconName
                switch (navigation.state.routeName) {
                    case 'RealTimePage':
                        iconName = 'ios-pulse'
                        break
                    case 'ReportPage':
                        iconName = 'ios-document'
                        break
                    case 'SharedPage':
                        iconName = 'ios-paper-plane'
                        break
                }
                console.log(iconName)
                // You can return any component that you like here! We usually use an
                // icon component from react-native-vector-icons
                return <Ionicons name={iconName} size={25} color={tintColor}/>
            },
        }),
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
        },
    }
);