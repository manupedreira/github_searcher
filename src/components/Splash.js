import React from "react";
import { Animated, StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    width: 360,
    height: 360
  }
});

class Splash extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasShown: false,
      progress: new Animated.Value(0)
    };

    this.animation = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    const { doAnimate, isLoaded } = this.props;
    const { hasShown } = this.state;

    if (!prevProps.doAnimate && doAnimate) {
      this.animate(false);
    } else if (
      isLoaded &&
      hasShown &&
      (!prevProps.isLoaded || !prevState.hasShown)
    ) {
      this.animate(true);
    }
  }

  animate(toFinish) {
    const { progress } = this.state;

    Animated.timing(progress, {
      toValue: toFinish ? 1 : 0.6,
      duration: toFinish ? 2000 : 3000,
      useNativeDriver: true
    }).start(
      toFinish
        ? this.props.onAnimationFinish
        : () => this.setState({ hasShown: true })
    );
  }

  render() {
    const { progress } = this.state;

    return (
      <View style={styles.container}>
        <LottieView
          ref={this.animation}
          source={require("src/assets/icons/logo/github_searcher.json")}
          style={styles.logo}
          loop={false}
          progress={progress}
        />
      </View>
    );
  }
}

export default Splash;
