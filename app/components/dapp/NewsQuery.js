import React from 'react';
import { withNavigation } from 'react-navigation';
import { graphql, ApolloProvider } from 'react-apollo';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from "graphql-tag";

import timeSince from '../../utils/timeSince'

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

const FeedWithData = graphql(
  gql`
    query getCurrentClassifyArticles($id:Int!,$pageN:Int!,$pageS:Int!){
      getCurrentClassifyArticles(id:$id,pageNumber:$pageN,pageSize:$pageS){
        code
        message
        articles{
          id
          title
          source
          sourceUrl
          cover
          abstract
          publishedTime
          content
        }
      }
    }
  `,
  {
    options: {
      notifyOnNetworkStatusChange: true,
      variables: {
        id: 2,
        pageN: 1,
        pageS: 20
      },
    },
  }
)(Feed);

function FeedList({ data, navigation }) {
  if (data.networkStatus === 1) {
    return <ActivityIndicator style={styles.loading} />;
  }

  if (data.error) {
    return <Text>Error: {data.error.message}</Text>;
  }

  return (
    <FlatList
      data={data.getCurrentClassifyArticles.articles}
      refreshing={data.networkStatus === 4}
      onRefresh={() => data.refetch()}
      onEndReachedThreshold={0.5}
      onEndReached={() => {
        // The fetchMore method is used to load new data and add it
        // to the original query we used to populate the list
        data.fetchMore({
          variables: {
            id: 2,
            pageN: (data.getCurrentClassifyArticles.articles.length / 20) + 1,
            pageS: 20
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            // Don't do anything if there weren't any new items
            if (!fetchMoreResult || fetchMoreResult.getCurrentClassifyArticles.articles.length === 0) {
              return previousResult;
            }

            return {
              // Concatenate the new feed results after the old ones
              getCurrentClassifyArticles: {
                code: fetchMoreResult.getCurrentClassifyArticles.code,
                message: fetchMoreResult.getCurrentClassifyArticles.message,
                __typename: fetchMoreResult.getCurrentClassifyArticles.__typename,
                articles: previousResult.getCurrentClassifyArticles.articles.concat(fetchMoreResult.getCurrentClassifyArticles.articles)
              }
            };
          },
        });
      }}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity style={styles.news} onPress={
            ()=>{
              navigation.navigate("NewsContent", {
                item: item
              })
            }
          }>
            <View style={styles.content}>
              <Text
                style={styles.title}>
                {item.title}</Text>
              <Text
                style={styles.source}>
                {timeSince(item.publishedTime)}</Text>
            </View>
            <View>
              <TouchableHighlight style={styles.cardImage}>
                <Image style={styles.cardImage} source={{uri:item.cover}} />
              </TouchableHighlight>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}


class NewsQuery extends React.Component {
  createClient() {
    // Initialize Apollo Client with URL to our server
    return new ApolloClient({
      networkInterface: createNetworkInterface({
        uri: 'https://api.liantuan.vip/graphql',
      }),
    });
  }

  render() {
    return (
      <ApolloProvider client={this.createClient()}>
        <FeedWithData navigation={this.props.navigation}/>
      </ApolloProvider>
    );
  }
}

function Feed({ data, navigation }) {
  return (
    <View style={styles.container}>
      <FeedList data={data} navigation={navigation}/>
    </View>
  );
}

export default withNavigation(NewsQuery);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  loading: {
    margin: 50,
  },
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
    width: 99,
    height: 70,
    borderRadius: 4,
  },
  content: {
    width: Dimensions.get('window').width - 110,
    height: 74,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  title:{
    marginTop: 10,
  },
  source:{
    marginBottom: 10,
    marginRight: 10,
    fontSize: 12,
    fontWeight: "400",

    color: 'rgba(52, 52, 52, 0.6)',
    alignSelf: 'flex-end',
  },
  date: {

  }
});

