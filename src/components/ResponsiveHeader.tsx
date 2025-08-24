import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface ResponsiveHeaderProps {
    title: string;
    navigation: any;
}

const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({ title, navigation }) => {
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const isTabletOrDesktop = width >= 640;
    const [fontsLoaded] = useFonts({
        Poppins_500Medium,
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    const dynamicStyles = {
        desktopHeader: {
            paddingHorizontal: width * 0.053,
            paddingVertical: height * 0.02,
        },
        mobileHeader: {
            paddingHorizontal: width * 0.053,
            paddingBottom: height * 0.018,
            minHeight: height * 0.1,
        },
    };

    if (isTabletOrDesktop) {
        return (
            <View style={[styles.desktopHeader, dynamicStyles.desktopHeader]}>
                <View style={styles.leftNav}>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                        <Text style={styles.logo}>Shortly</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Features')}>
                        <Text style={[styles.navItem, title === 'Features' && styles.activeNavItem]}>Features</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Pricing')}>
                        <Text style={[styles.navItem, title === 'Pricing' && styles.activeNavItem]}>Pricing</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Saved URLs')}>
                        <Text style={[styles.navItem, title === 'Saved URLs' && styles.activeNavItem]}>Resources</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.authButtons}>
                    <TouchableOpacity>
                        <Text style={styles.loginButton}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.signupButton}>
                        <Text style={styles.signupButtonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.mobileHeader, dynamicStyles.mobileHeader, { paddingTop: insets.top }]}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Text style={styles.mobileTitle}>Shortly</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.openDrawer()}
                style={styles.hamburgerButton}
            >
                <Ionicons
                    name="menu"
                    size={24}
                    color={Colors.neutral.gray500}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    desktopHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
    },
    leftNav: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 30,
    },
    logo: {
        fontSize: 36,
        fontFamily: 'Poppins_700Bold',
        color: Colors.neutral.gray950,
        letterSpacing: -0.5,
    },
    navItem: {
        fontSize: 18,
        fontFamily: 'Poppins_500Medium',
        color: Colors.neutral.gray500,
        letterSpacing: -0.5,
    },
    activeNavItem: {
        backgroundColor: Colors.neutral.gray500,
        color: 'white',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        overflow: 'hidden',
    },
    authButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    loginButton: {
        fontSize: 18,
        fontFamily: 'Poppins_500Medium',
        color: Colors.neutral.gray500,
        letterSpacing: -0.5,
    },
    signupButton: {
        backgroundColor: Colors.primary.blue400,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
    },
    signupButtonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
    },
    mobileHeader: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        backgroundColor: 'white',
    },
    hamburgerButton: {
        padding: 5,
    },
    mobileTitle: {
        fontSize: 36,
        fontFamily: 'Poppins_700Bold',
        color: Colors.neutral.gray950,
        letterSpacing: -0.5,
    },
});

export default ResponsiveHeader;