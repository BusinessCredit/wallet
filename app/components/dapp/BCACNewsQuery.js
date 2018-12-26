import React from 'react';
import { withNavigation } from 'react-navigation';

import {formatDate} from '../../utils/timeSince'
import { getBCACNews } from '../../api'

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Dimensions,
  PixelRatio
} from 'react-native';


class BCACNewsQuery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      refreshing: true
    }
  }

  componentDidMount() {
    getBCACNews().then((result) => {
      return result.data;
    }).then(
      res => this.setState({ data: res })
    ).catch(function (error) {
      console.log(error)
    }).then(
      () => this.setState({refreshing: false})
    )
  }
  render() {
    return (
      <FlatList
        data={this.state.data}
        refreshing={this.state.refreshing}
        onRefresh={
          ()=>{
            this.setState({refreshing: true})
            getBCACNews().then((result) => {
              return result.data;
            }).then(
              res => this.setState({ data: res })
            ).catch(function (error) {
              console.log(error)
            }).then(
              () => this.setState({refreshing: false})
            )
          }
        }
        renderItem={({ item }) => {
          return (
            <TouchableOpacity 
              key={item.id}
              style={styles.news} onPress={
              () => {
                this.props.navigation.navigate("WebView", {
                  uri: "http://news.bcachain.org/newsDetail.html?id="+item.id,
                  title: "商信链新闻",
                })
              }
            }>
              <View>
                <TouchableHighlight style={styles.cardImage}>
                  <Image style={styles.cardImage} source={{ uri: "http://www.bcachain.org/" + item.thumb }} />
                </TouchableHighlight>
              </View>
              <View style={styles.content}>
                <Text
                  style={styles.title}>
                  {item.title}</Text>
                <Text
                  style={styles.source}>
                  {formatDate(parseInt(item.updatetime)*1000)}
                </Text>
              </View>

            </TouchableOpacity>
          );
        }}
      />
    );
  }
}

export default withNavigation(BCACNewsQuery);

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#fff'
  // },
  // loading: {
  //   margin: 50,
  // },
  news: {
    height: 74,
    margin: 3,

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    paddingBottom: 5,
    borderBottomColor: 'rgba(52, 52, 52, 0.2)',
    borderBottomWidth: 1 / PixelRatio.get(),
  },
  cardImage: {
    width: 90,
    height: 65,
    borderRadius: 4,
  },
  content: {
    width: Dimensions.get('window').width - 110,
    height: 74,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  title: {
    marginTop: 10,
    marginLeft: 8,
  },
  source: {
    marginBottom: 10,
    //marginRight: 10,
    fontSize: 12,
    fontWeight: "400",

    color: 'rgba(52, 52, 52, 0.6)',
    alignSelf: 'flex-end',
  },
  date: {

  }
});

