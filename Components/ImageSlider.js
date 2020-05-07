import React from 'react'
import { Animated, StyleSheet, View, Image, Text, Dimensions, ImageBackground, ScrollView, TouchableOpacity, Button } from 'react-native'
import ENV from '../environment'
import { TouchableHighlight } from 'react-native-gesture-handler';
import PinchZoomView from 'react-native-pinch-zoom-view';
import Icon from 'react-native-vector-icons/Ionicons'

const DEVICE_WIDTH = Dimensions.get("window").width;

class ImageSlider extends React.Component {
    scrollRef = React.createRef();
    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: 0
        };
        this.scrollRef = React.createRef();
        this.fullscreen = false
    }



    setSelectedIndex = event => {
        const contentOffset = event.nativeEvent.contentOffset;
        const viewSize = event.nativeEvent.layoutMeasurement;

        const selectedIndex = Math.floor(contentOffset.x / viewSize.width);
        this.setState({ selectedIndex });
    };

    setFullScreen() {
        this.fullscreen = !this.fullscreen;
    }

    render() {
        const { images, setImageFullScreen } = this.props;


        return (
            <View style={{ height: "100%", width: "100%" }}>
                <ScrollView
                    horizontal
                    pagingEnabled
                    onMomentumScrollEnd={this.setSelectedIndex}
                    ref={this.scrollRef}
                    scrollEnabled={!this.fullscreen}
                >

                    {images.map(image => this.fullscreen ?
                        (<PinchZoomView
                            scalable={this.fullscreen}
                            minScale={0.5}
                            maxScale={5}
                            key={image}>
                            <Image
                                style={styles.backgroundImage}
                                source={{ uri: image }}
                                key={image}
                            />

                        </PinchZoomView>) :
                        (<TouchableHighlight
                            disabled={this.fullscreen}
                            onPress={() => { setImageFullScreen(this.setFullScreen.bind(this)); this.fullscreen = !this.fullscreen }}
                            activeOpacity={.6}
                            underlayColor={"white"}
                            key={image}
                        >
                            <Image
                                style={styles.backgroundImage}
                                source={{ uri: image }}
                                key={image}
                            />
                        </TouchableHighlight>)

                    )}
                </ScrollView>
            </View>
        )
    }



}

const styles = StyleSheet.create({
    backgroundImage: {
        height: "100%",
        width: Dimensions.get("window").width,
        resizeMode: 'center'
    },
    circleDiv: {
        position: "absolute",
        bottom: 15,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: 10
    },
    whiteCircle: {
        width: 6,
        height: 6,
        borderRadius: 3,
        margin: 5,
        backgroundColor: "#fff"
    }
});

export default ImageSlider;