import React from 'react';
import { 
  StyleSheet, 
  Text, 
  ScrollView, 
  View, 
  PixelRatio,
  Share,
  Dimensions,
  WebView
} from 'react-native';
import { withNavigation } from 'react-navigation';

const maxHeight = Dimensions.get('window').height;
//const maxWidth = Dimensions.get('window').width;


const contentStyles = `
  <head>
    <style type="text/css">
      body {
        font-size: 32px;
      }
    </style>
  </head>
`

const processContent = (content)=> {
  regExp = new RegExp("<br/>", "g");
  return contentStyles + content.replace(regExp, "")
}

class NewsContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: "链新闻",
    headerStyle: {
      borderBottomWidth: 0,
      // shadowColor: '#528bf7',
      // shadowOffset: {
      //   width: 0,
      //   height: 5
      // },
      // shadowOpacity: 0.2,
    }
  });

  render() {
    const {
      id,
      title,
      source,
      sourceUrl,
      cover,
      abstract,
      publishedTime,
      content
    } = this.props.navigation.state.params.item
    return (
      <ScrollView style={styles.container}>
        
        <View style={styles.title}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <WebView 
          style={styles.content} 
          source={{html:processContent(content)}}
          //injectedJavaScript={contentStyles}
          />
        <View style={styles.foot}>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content:{
    height: maxHeight - 72
  },
  title: {
    margin: 5,
    borderBottomColor: 'rgba(52, 52, 52, 0.2)',
    borderBottomWidth: 1,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "200"
  }
 })
export default withNavigation(NewsContent);
