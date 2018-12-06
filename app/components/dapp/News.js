import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import NewsQuery from './NewsQuery';

class NewsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: "BCAC News",
  });

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            
          </Text>
        </View>
        <NewsQuery />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    height: 1,
    backgroundColor: '#528bf7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#528bf7',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.4,
  },
 })
export default withNavigation(NewsPage);
