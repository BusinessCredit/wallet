import React, { Component } from 'react';
import { Alert, Text, View, StyleSheet, TouchableHighlight, TextInput, FlatList } from 'react-native';
import { withNavigation } from 'react-navigation';
import { I18n } from '../../../language/i18n';
import { connect } from 'react-redux';
import actions from '../../store/action/lockToken';
import MaterialCommunityIcon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

class Record extends Component {
  render() {
    return (
      <View style={styles.record}>
        <Text style={styles.address}>{this.props.data.item}</Text>
        <TouchableHighlight
          style={styles.myTopBanConItem}
          underlayColor={'transparent'}
          onPress={() => {
            this.props.delete()
          }}
        >
          <View style={styles.delete}>
            <MaterialCommunityIcon name="block-helper" size={15} color="black" />
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}
class WatchAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      addresses: [
      ]
    };
    this.navigate = this.props.navigation.navigate;
  }

  componentDidMount() {
    _this = this;
    storage
      .load({
        key: 'watchLockTokenAddress'
      })
      .then(({ watchLockTokenAddress }) => {
        this.setState({
          addresses: watchLockTokenAddress
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  addAddress() {
    const address = this.state.address
    if (!web3.utils.isAddress(address)) {
      Alert.alert(null, I18n.t('lock.watchAddress.wrongAddress'))
    } else if (this.state.addresses.includes(address))
      Alert.alert(null, I18n.t('lock.watchAddress.existAddress'))
    else {
      storage.save({
        key: 'watchLockTokenAddress',
        data: {
          watchLockTokenAddress: [...this.state.addresses, address]
        },
        expires: null
      });
      this.setState({ addresses: [...this.state.addresses, address] })
    }
  }

  deleteAddress(address) {
    const aliveAddress = this.state.addresses.filter(
      (iter) => iter !== address.item
    )
    storage.save({
      key: 'watchLockTokenAddress',
      data: {
        watchLockTokenAddress: aliveAddress
      },
      expires: null
    });
    this.setState({ addresses: aliveAddress })
    
  }

  componentWillUnmount(){
    //this.props.addWatchAddresses([store.getState().walletInfo.wallet_address,...this.state.addresses] )
    this.props.watchAddress([store.getState().walletInfo.wallet_address,...this.state.addresses])
  }
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.addresses}
          renderItem={(item, index) => <Record data={item} key={index} delete={() => { this.deleteAddress(item) }} />}
          keyExtractor={(item, index) => index.toString()}
        />
        <TextInput
          style={{ height: 50, borderBottomWidth: 1, borderColor: '#ccc' }}
          placeholder={"0x"}
          underlineColorAndroid="transparent"
          value={this.state.address}
          onChangeText={(address) => {
            this.setState({
              address
            });
          }}
        />
        <Text
          style={[styles.bottom_fun_item, styles.bottom_fun_item_receipt]}
          onPress={() => {
            this.setState({ address: "" })
            this.addAddress()
          }}
        >
          {I18n.t('lock.watchAddress.addAddress')}
        </Text>
      </View>
    );
  }
}

export default connect((state) => state, actions)(withNavigation(WatchAddress));

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    padding: 20,
    backgroundColor: '#fff'
  },
  bottom_fun_item: {
    marginTop: 5,
    height: 50,
    color: '#fff',
    lineHeight: 50,
    textAlign: 'center',
  },
  bottom_fun_item_transfer: {
    backgroundColor: '#35ccbf'
  },
  bottom_fun_item_receipt: {
    backgroundColor: '#528bf7'
  },
  record: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  address: {
    fontSize: 12
  }
});
