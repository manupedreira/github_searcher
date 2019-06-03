import React from "react";
import {
  Animated,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
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
    fontSize: SIZES.subtitle
  },
  scrollView: {
    marginVertical: 20,
    marginHorizontal: -20
  },
  scrollViewContainer: {
    paddingHorizontal: 40
  },
  repo: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.text_secondary,
    paddingVertical: 20
  },
  name: {
    marginBottom: 5,
    color: COLORS.text_primary,
    fontFamily: FONTS.button,
    fontSize: SIZES.name
  },
  info: {
    marginTop: 5,
    color: COLORS.text_secondary,
    fontFamily: FONTS.text,
    fontSize: SIZES.text
  },
  url: {
    marginTop: 0,
    color: COLORS.accent_secondary
  },
  button: {
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
    width: 240,
    height: 60,
    elevation: 10,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 30,
    backgroundColor: COLORS.accent_primary
  },
  buttonText: {
    color: COLORS.text_primary,
    fontFamily: FONTS.button,
    fontSize: SIZES.button
  }
});

class ReposLayout extends React.Component {
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

  openUrl(url) {
    Linking.openURL(url).catch(err =>
      console.log("--------Url cannot be accesed: ", err)
    );
  }

  render() {
    const { lang: locale, user, repos, onRetry } = this.props;

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
        <Text style={styles.title}>
          {user} {lang[locale].repos}:
        </Text>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContainer}
          indicatorStyle="white"
        >
          {repos.map(repo => (
            <View style={styles.repo}>
              <Text style={styles.name}>{repo.name}</Text>
              {!!repo.description && (
                <Text style={styles.info}>
                  {lang[locale].description}: {repo.description}
                </Text>
              )}
              <Text style={styles.info}>
                {lang[locale].created}:{" "}
                {new Date(repo.created_at).toLocaleString(
                  locale === "es" ? "es-ES" : "en-US",
                  { year: "numeric", month: "2-digit", day: "2-digit" }
                )}
              </Text>
              <Text style={styles.info}>
                {lang[locale].updated}:{" "}
                {new Date(repo.updated_at).toLocaleString(
                  locale === "es" ? "es-ES" : "en-US",
                  { year: "numeric", month: "2-digit", day: "2-digit" }
                )}
              </Text>
              <Text style={styles.info}>{lang[locale].url}:</Text>
              <TouchableOpacity onPress={() => this.openUrl(repo.svn_url)}>
                <Text style={[styles.info, styles.url]}>{repo.svn_url}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
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

export default ReposLayout;
