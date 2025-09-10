import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useFonts, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Colors } from '../constants/Colors';
import { authService } from '../lib/auth';

const CustomDrawerContent = (props: any) => {
    const { height, width } = useWindowDimensions();
    const [fontsLoaded] = useFonts({
        Poppins_500Medium,
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    const { navigation } = props;
    const user = authService.getUser();
    const isLoggedIn = authService.isAuthenticated();

    const dynamicStyles = {
        drawerContent: {
            flex: 1,
            backgroundColor: Colors.primary.purple950,
            borderRadius: 10,
            paddingVertical: height * 0.04,
            paddingHorizontal: width * 0.08,
            justifyContent: 'space-between',
        },
    };

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={[styles.drawerContent, dynamicStyles.drawerContent]}>
            <View style={styles.navigationSection}>
                <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => navigation.navigate('Features')}
                >
                    <Text style={styles.drawerItemText}>Features</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => navigation.navigate('Pricing')}
                >
                    <Text style={styles.drawerItemText}>Pricing</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => navigation.navigate('Saved URLs')}
                >
                    <Text style={styles.drawerItemText}>{isLoggedIn ? 'Saved URLs' : 'Resources'}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.authSection}>
                <TouchableOpacity 
                    style={styles.drawerItem}
                    onPress={() => navigation.navigate('Auth', { mode: 'login' })}
                >
                    <Text style={styles.drawerItemText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.signupButton}
                    onPress={() => navigation.navigate('Auth', { mode: 'signup' })}
                >
                    <Text style={styles.signupButtonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    drawerContent: {
    },
    navigationSection: {
        flex: 1,
    },
    authSection: {
        paddingBottom: 30,
    },
    drawerItem: {
        paddingVertical: 15,
        alignItems: 'center',
    },
    drawerItemText: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: 'white',
        textAlign: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.neutral.gray500,
        marginVertical: 20,
    },
    signupButton: {
        backgroundColor: Colors.primary.blue400,
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    signupButtonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
    },
});

export default CustomDrawerContent;