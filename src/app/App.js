import React from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import { Provider } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import Splash from "src/components/Splash";
import SearchScreen from "src/scenes/search/SearchScreen";
import { COLORS } from "src/config/theme";
import configureStore from "./store";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: COLORS.background_primary
  },
  background: {
    flex: 1,
    opacity: 0,
    backgroundColor: COLORS.background_secondary
  },
  gradient: {
    flex: 1,
    alignItems: "stretch",
    position: "absolute",
    top: 0,
    left: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  }
});

let store;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAnimating: false,
      isBooted: false,
      isLoaded: false
    };

    this.animValue = new Animated.Value(0);
    this.animation = React.createRef();
    this.toggleAnimation = this.toggleAnimation.bind(this);
  }

  async componentDidMount() {
    this.toggleAnimation();
    this.animate();
    await this.initializeStore();
  }

  animate() {
    Animated.timing(this.animValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start();
  }

  initializeStore() {
    if (store !== undefined) return this.setStoreLoaded();

    ({ store } = configureStore());
    return this.setStoreLoaded();
  }

  setStoreLoaded() {
    console.log("-------------------------Store loaded!");
    this.setState({ isLoaded: true });
  }

  toggleAnimation() {
    const { isAnimating } = this.state;

    this.setState({ isAnimating: !isAnimating, isBooted: isAnimating });
  }

  render() {
    const { isAnimating, isBooted, isLoaded } = this.state;

    return (
      <View style={styles.container}>
        <Animated.View
          style={[styles.background, { opacity: this.animValue }]}
        />
        <LinearGradient
          colors={[COLORS.background_primary, "transparent"]}
          style={styles.gradient}
        >
          {!isBooted ? (
            <Splash
              doAnimate={isAnimating}
              isLoaded={isLoaded}
              onAnimationFinish={this.toggleAnimation}
            />
          ) : (
            <Provider store={store}>
              <SearchScreen />
            </Provider>
          )}
        </LinearGradient>
      </View>
    );
  }
}

export default App;
