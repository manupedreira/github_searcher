import React from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS, FONTS, SIZES } from "src/config/theme";
import { lang } from "src/config/lang";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    padding: 20
  },
  title: {
    color: COLORS.text_primary,
    fontFamily: FONTS.title,
    fontSize: SIZES.title
  },
  error: {
    paddingHorizontal: 20,
    color: COLORS.text_primary,
    fontFamily: FONTS.text,
    fontSize: SIZES.text
  },
  button: {
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
    width: 240,
    height: 60,
    elevation: 10,
    marginTop: 20,
    borderRadius: 30,
    backgroundColor: COLORS.accent_primary
  },
  buttonText: {
    color: COLORS.text_primary,
    fontFamily: FONTS.button,
    fontSize: SIZES.button
  }
});

class ErrorLayout extends React.Component {
  constructor(props) {
    super(props);

    this.animValue = new Animated.Value(0);
  }

  componentDidMount() {
    this.animate();
  }

  animate(out, callback) {
    Animated.timing(this.animValue, {
      toValue: out ? 0 : 1,
      duration: 500,
      useNativeDriver: true
    }).start(out && callback);
  }

  render() {
    const { lang: locale, user, onRetry } = this.props;

    const translation = this.animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0]
    });

    return (
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY: translation }],
            opacity: this.animValue
          }
        ]}
      >
        <Text style={styles.title}>{lang[locale].oops}</Text>
        <Text style={styles.error}>
          {lang[locale].error_1} {user} {lang[locale].error_2}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.animate(true, onRetry)}
        >
          <Text style={styles.buttonText}>{lang[locale].again}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

export default ErrorLayout;
