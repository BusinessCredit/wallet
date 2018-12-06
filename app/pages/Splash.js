import React from 'react';
import { Dimensions, Animated } from 'react-native';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';

const maxHeight = Dimensions.get('window').height;
const maxWidth = Dimensions.get('window').width;
const splashImg = require('../../bcac_splash.png');

class Splash extends React.Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this.state = {
			isWallet: false
		};
	}

	componentDidMount() {
		setTimeout(() => {
			storage
				.load({
					key: 'walletInfo'
				})
				.then((res) => {
					//this.props.navigation.navigate('Home');
					const resetAction = StackActions.reset({
						index: 0,
						actions: [NavigationActions.navigate({ routeName: 'Home' })],
					});
					this.props.navigation.dispatch(resetAction);
				})
				.catch((err) => {
					const resetAction = StackActions.reset({
						index: 0,
						actions: [NavigationActions.navigate({ routeName: 'Guide' })],
					});
					this.props.navigation.dispatch(resetAction);
					//this.props.navigation.navigate('Guide');
				});
		}, 1500);
	}

	render() {
		return (
			<Animated.Image
				style={{
					width: maxWidth,
					height: maxHeight
				}}
				source={splashImg}
			/>
		);
	}
}

export default withNavigation(Splash);
