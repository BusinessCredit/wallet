import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableHighlight, TextInput } from 'react-native';
import { withNavigation } from 'react-navigation';
import { I18n } from '../../../language/i18n';
import RNRestart from 'react-native-restart';

let _this = null;
class WebSetting extends Component {
	constructor(props) {
		super(props);
		this.state = {
			url: window.host
		};
		this.navigate = this.props.navigation.navigate;
	}

	static navigationOptions = ({ navigation }) => ({
		headerRight: (
			<TouchableHighlight
				underlayColor={'transparent'}
				onPress={() => {
					storage.save({
						key: 'webHost',
						data: {
							webHost: _this.state.url
						},
						expires: null
					});
					RNRestart.Restart();
				}}
			>
				<Text style={{ marginRight: 10 }}>
					{I18n.t('public.save')}
					{/* 保存 */}
				</Text>
			</TouchableHighlight>
		)
	});

	componentDidMount() {
		_this = this;
		storage
			.load({
				key: 'webHost'
			})
			.then(({ webHost }) => {
				this.setState({
					url: webHost
				});
			})
			.catch((e) => {
				console.log(e);
			});
	}

	render() {
		return (
			<View style={styles.container}>
				<Text>{I18n.t('my.webSetting.nodeURL')}</Text>

				<TextInput
					style={{ height: 50, borderBottomWidth: 1, borderColor: '#ccc' }}
					placeholder={this.state.url}
					underlineColorAndroid="transparent"
					onChangeText={(url) => {
						this.setState({
							url
						});
					}}
				/>
				<Text style={styles.url_title}>
					{I18n.t('my.webSetting.predefinedURL')}
				</Text>
				<Text
					style={styles.url_item}
					onPress={() => {
						this.setState({ url: "https://mainnet.infura.io" })
					}}
				>
					https://mainnet.infura.io
			</Text>
				<Text
					style={styles.url_item}
					onPress={() => {
						this.setState({ url: "http://118.190.120.63" })
					}}
				>
					http://118.190.120.63
				</Text>
			</View>
		);
	}
}

export default withNavigation(WebSetting);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#fff'
	},
	url_title: {
		marginTop: 40,
		height: 50,
		lineHeight: 50,
	},
	url_item: {
		height: 50,
		lineHeight: 50,
		textAlign: 'left',
		width: Dimensions.get('window').width
	}
});


// <Picker
// selectedValue={this.state.language}
// style={{ height: 50, width: 100 }}
// onValueChange={(itemValue, itemIndex) => this.setState({ language: itemValue })}>
// <Picker.Item label="Java" value="java" />
// <Picker.Item label="JavaScript" value="js" />
// </Picker>