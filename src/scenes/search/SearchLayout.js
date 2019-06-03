import React from "react";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
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
  inputContainer: {
    marginHorizontal: 20,
    borderBottomColor: COLORS.text_secondary,
    borderBottomWidth: 1
  },
  input: {
    height: 32,
    margin: 0,
    padding: 0,
    color: COLORS.text_primary,
    fontFamily: FONTS.text,
    fontSize: SIZES.input
  },
  selectorContainer: {
    elevation: 5,
    marginHorizontal: 20,
    marginTop: 5,
    backgroundColor: COLORS.background_primary
  },
  selector: {
    padding: 12
  },
  selectorText: {
    color: COLORS.text_primary,
    fontFamily: FONTS.text,
    fontSize: SIZES.input
  },
  button: {
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
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

class SearchLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      recentSearch: ""
    };

    this.animValue = new Animated.Value(0);
    this.animSelector = new Animated.Value(0);
    this.input = React.createRef();

    this.searchUser = this.searchUser.bind(this);
    this.selectUser = this.selectUser.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
  }

  componentDidMount() {
    this.animate();
  }

  componentDidUpdate(prevProps, prevState) {
    const { recentSearch } = this.state;

    if (prevState.recentSearch !== recentSearch && recentSearch !== "") {
      this.animateSelector(false);
    }
  }

  animate(out, callback) {
    Animated.timing(this.animValue, {
      toValue: out ? 0 : 1,
      duration: 500,
      useNativeDriver: true
    }).start(out && callback);
  }

  animateSelector(out, callback) {
    Animated.timing(this.animSelector, {
      toValue: out ? 0 : 1,
      duration: 500,
      useNativeDriver: true
    }).start(out && callback);
  }

  searchUser() {
    const { onSearch } = this.props;
    const { search } = this.state;

    Keyboard.dismiss();
    this.animate(true, () => onSearch(search));
  }

  selectUser() {
    const { recentSearch } = this.state;

    this.setState({ search: recentSearch, recentSearch: "" });
    this.animateSelector(true, () => {});
  }

  updateSearch(text) {
    const { prev } = this.props;
    const { recentSearch } = this.state;
    let newSearch = "";

    this.setState({ search: text }, () => {
      prev.forEach(element => {
        if (element.indexOf(text) >= 0 && newSearch === "") newSearch = element;
      });

      if (recentSearch !== newSearch) {
        this.animateSelector(true, () =>
          this.setState({ recentSearch: newSearch })
        );
      }
    });
  }

  render() {
    const { lang: locale } = this.props;
    const { search, recentSearch } = this.state;

    const translation = this.animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0]
    });

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="height" enabled>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Animated.View
            style={[
              styles.container,
              {
                transform: [{ translateY: translation }],
                opacity: this.animValue
              }
            ]}
          >
            <Text style={styles.title}>{lang[locale].search}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                ref={this.input}
                style={styles.input}
                placeholder={lang[locale].user}
                placeholderTextColor={COLORS.text_secondary}
                value={search}
                onChangeText={text => this.updateSearch(text.trim())}
              />
            </View>
            {recentSearch !== "" && (
              <Animated.View
                style={[
                  styles.selectorContainer,
                  {
                    transform: [{ scaleY: this.animSelector }],
                    opacity: this.animSelector
                  }
                ]}
              >
                <LinearGradient
                  colors={[COLORS.background_primary, COLORS.background_medium]}
                >
                  <TouchableOpacity
                    style={styles.selector}
                    onPress={this.selectUser}
                  >
                    <Text style={styles.selectorText}>{recentSearch}</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </Animated.View>
            )}
            <TouchableOpacity style={styles.button} onPress={this.searchUser}>
              <Text style={styles.buttonText}>{lang[locale].submit}</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

export default SearchLayout;
