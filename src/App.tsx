import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useWindowDimensions } from 'react-native';
import type { RootDrawerParamList } from './types/navigation';
import HomeScreen from './screens/HomeScreen';
import FeaturesScreen from './screens/FeaturesScreen';
import PricingScreen from './screens/PricingScreen';
import URLScreen from './screens/URLScreen';
import { Colors } from './constants/Colors';
import ResponsiveHeader from './components/ResponsiveHeader';
import CustomDrawerContent from './components/CustomDrawerContent';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export default function App() {
    const { width, height } = useWindowDimensions();
    const isLargeScreen = width >= 640;

    return (
        <NavigationContainer>
            <Drawer.Navigator 
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={({ navigation, route }) => ({
                    headerShown: true,
                    drawerPosition: 'right',
                    header: () => (
                        <ResponsiveHeader 
                            title={route.name} 
                            navigation={navigation} 
                        />
                    ),
                    sceneContainerStyle: {
                        backgroundColor: 'white',
                    },
                    swipeEnabled: !isLargeScreen,
                    drawerStyle: isLargeScreen ? { width: 0 } : {
                        width: width * 0.7,
                        height: height * 0.5,
                        backgroundColor: 'transparent',
                        borderRadius: 10,
                    },
                    overlayColor: 'rgba(0, 0, 0, 0.3)',
                })}
            >
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="Features" component={FeaturesScreen} />
                <Drawer.Screen name="Pricing" component={PricingScreen} />
                <Drawer.Screen name="Saved URLs" component={URLScreen} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}