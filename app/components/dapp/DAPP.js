import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TouchableHighlight, Image, Dimensions } from 'react-native';

import { withNavigation } from 'react-navigation';

class DAPP extends Component {

  onGotoTokenlock() {
    this.props.navigation.navigate("LockToken", {
      
    })
  }

  onGotoNodeSystem(){
    this.props.navigation.navigate("WebView", {
      uri: "https://www.bapuwind.com",
      title: "节点系统",
      scrollEnabled: false,
    })
  }

  onGotoMarketSystem(){
    this.props.navigation.navigate("WebView", {
      uri: "https://mall.bapuwind.com",
      title: "圆团商城",
      //shareMessage: (url)=> "圆团商城想要和你分享一个链接: "
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            
          </Text>
        </View>
        <View style={styles.body}>
          <Card
            color={styles.gray}
            onPress={this.onGotoTokenlock.bind(this)}
            logo={require('../../assets/images/dapp/bank.png')}
            title="BCAC持币生息"
            content="持币生息是 BCAC 团队为 BCAC 持币用户提供的理财服务。"
          />
          <Card
            color={styles.gold}
            onPress={this.onGotoNodeSystem.bind(this)}
            logo={require('../../assets/images/dapp/node.png')}
            title="商信链节点系统"
            content="商信链节点是商信链社群自发形成的节点组织，节点系统为社群提供了高效的管理和激励功能。"
          />
          <Card
            color={styles.teal}
            onPress={this.onGotoMarketSystem.bind(this)}
            logo={require('../../assets/images/dapp/market.png')}
            title="圆团商城"
            content="BCAC圆团商场是一个基于区块链的新零售商城，基于创新的区块链经济激励体系，为BCAC落地赋能。"
          />
        </View>
        <View style={styles.bottom}>
        </View>
      </View>

    )
  }
}

class Card extends Component {
  render() {
    return (
      <TouchableOpacity style={[styles.card, this.props.color]} onPress={this.props.onPress}>
        <View>
          <TouchableHighlight style={styles.cardImage}>
            <Image style={styles.cardImage} source={this.props.logo} />
          </TouchableHighlight>
        </View>
        <View>
          <Text
            style={styles.cardTitle}>
            {this.props.title}</Text>
          <Text
            style={styles.cardContent}>
            {this.props.content}</Text>
        </View>

      </TouchableOpacity>
    )
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
  body: {
    marginTop: 7
  },
  title: {
    color: '#fff',
    fontSize: 20
  },
  card: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    margin: 10,
    height: 100,
    shadowColor: '#888888',
    shadowOffset: {
      width: 2,
      height: 2
    },
    shadowOpacity: 0.4,

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  cardImage: {
    width: 70,
    height: 70,
  },
  cardTitle: {
    marginLeft: 15,
    height: 40,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardContent: {
    marginLeft: 15,
    width: Dimensions.get('window').width - 110,
    color: '#fff',
    fontSize: 12,
  },
  gray: {
    backgroundColor: '#41ABEB',
  },
  gold: {
    backgroundColor: '#EA891D'
  },
  teal: {
    backgroundColor: '#B361FD'
  },
  whiteFont: {
    color: '#fff'
  }
})

export default withNavigation(DAPP);