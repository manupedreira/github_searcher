import React from "react";
import { NativeModules, View } from "react-native";
import { connect } from "react-redux";
import { bootActions } from "src/core/boot";
import SearchLayout from "./SearchLayout";
import ErrorLayout from "./ErrorLayout";
import ReposLayout from "./ReposLayout";

class SearchScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lang: "en",
      search: "",
      noUserRepos: false,
      repos: []
    };

    this.searchAgain = this.searchAgain.bind(this);
    this.searchUser = this.searchUser.bind(this);
  }

  componentDidMount() {
    this.getLocale();
  }

  getLocale() {
    NativeModules.Language.getDeviceLanguage(
      (err, lang) => !!lang && this.setState({ lang })
    );
  }

  searchAgain() {
    this.setState({
      search: "",
      noUserRepos: false,
      repos: []
    });
  }

  async searchUser(user) {
    const { addToPrev } = this.props;

    this.setState({ search: user });
    addToPrev(user);

    const response = await fetch(
      `https://api.github.com/users/${user}/repos`
    ).then(async res => await res.json());

    if (
      (response.message && response.message === "Not Found") ||
      response.length === 0
    ) {
      this.setState({ noUserRepos: true });
    } else if (!!response.length) {
      this.setState({ repos: [...response] });
    }
  }

  render() {
    const { previousSearches } = this.props;
    const { lang, search, noUserRepos, repos } = this.state;

    if (search === "") {
      return (
        <SearchLayout
          lang={lang}
          prev={previousSearches}
          onSearch={this.searchUser}
        />
      );
    } else if (noUserRepos) {
      return (
        <ErrorLayout lang={lang} user={search} onRetry={this.searchAgain} />
      );
    } else if (repos.length) {
      return (
        <ReposLayout
          lang={lang}
          user={search}
          repos={repos}
          onRetry={this.searchAgain}
        />
      );
    }
    return <View />;
  }
}

function mapStateToProps(state) {
  return {
    previousSearches: state.boot.prev
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addToPrev: search => dispatch(bootActions.addToPrev(search))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchScreen);
