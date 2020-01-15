import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from './containers/HomeScreen';
import AboutScreen from './containers/AboutScreen';

const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  About: {screen: AboutScreen},
});

const App = createAppContainer(MainNavigator);

export default App;