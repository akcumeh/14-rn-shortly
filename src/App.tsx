import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import type { RootDrawerParamList } from './types/navigation';
import HomeScreen from './screens/HomeScreen';
import FeaturesScreen from './screens/FeaturesScreen';
import PricingScreen from './screens/PricingScreen';
import URLScreen from './screens/URLScreen';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export default function App() {
    return (
        <NavigationContainer>
            <Drawer.Navigator 
                screenOptions={{ 
                    headerShown: false,
                    drawerPosition: 'right'
                }}
            >
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="Features" component={FeaturesScreen} />
                <Drawer.Screen name="Pricing" component={PricingScreen} />
                <Drawer.Screen name="Saved URLs" component={URLScreen} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}