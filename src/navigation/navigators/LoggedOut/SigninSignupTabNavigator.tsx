import {colors} from '../../../constants/Colors';
import {RootLoggedOutStackList} from '../../navigation.props';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import SigninScreen from '../../../screens/LoggedOut/SigninScreen';
import SignupScreen from '../../../screens/LoggedOut/SignupScreen';
import {MottledGreenBackground} from '../../../components/specifics/LoggedOut/MottledGreenBackground';
import {Image, KeyboardAvoidingView, View} from 'react-native';
import {SigninSignupTopTabBar} from '../../../components/specifics/LoggedOut/SigninSignupTabBar';

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const TopTab = createMaterialTopTabNavigator<RootLoggedOutStackList>();

const YakkaLogo = require('../../../../assets/images/Title.png');

export const SigninSignupTabNavigator = () => {
  return (
    <MottledGreenBackground>
      <View
        style={{
          width: '100%',
          height: 200,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 50,
        }}
      >
        <Image
          source={YakkaLogo}
          resizeMode='contain'
          style={{width: '80%', height: 150}}
        />
      </View>
      <TopTab.Navigator
        style={{backgroundColor: colors.transparent}}
        sceneContainerStyle={{
          backgroundColor: colors.transparent,
          paddingHorizontal: 15,
        }}
        initialRouteName='Signin'
        tabBar={props => <SigninSignupTopTabBar {...props} />}
      >
        <TopTab.Screen
          name='Signin'
          component={SigninScreen}
          options={{title: 'Sign In'}}
        />
        <TopTab.Screen
          name='Signup'
          component={SignupScreen}
          options={{
            title: 'Sign Up',
          }}
        />
      </TopTab.Navigator>
    </MottledGreenBackground>
  );
};

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
