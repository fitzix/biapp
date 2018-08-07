import React from "react"
import {Button, Label, ListRow, Overlay, Theme} from "teaset"
import {ScrollView, View} from "react-native"


export default class SettingsScreen extends React.Component {

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