import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./home";
import Features from "./features";
import Pricing from "./pricing";
import Resources from "./resources";
import URLs from "./urls";

const Tabs = createBottomTabNavigator();

export default function RootLayout() {
    return (
        <NavigationContainer>
            <Tab.Navigator screenOptions={{ headerShown: false}}>
                <Tab.Screen name="Home" component={Home}>
                <Tab.Screen name="Features" component={Features}>
                <Tab.Screen name="Resources" component={Resources}>
                <Tab.Screen name="Pricing" component={Pricing}>
                <Tab.Screen name="Saved URLs" component={URLs}>
            </Tab.Navigator>
        </NavigationContainer>
    )
}