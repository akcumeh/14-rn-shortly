import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Colors } from '../constants/Colors';

interface ResponsiveHeaderProps {
    title: string;
    navigation: any;
}

const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({ title, navigation }) => {
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const isTabletOrDesktop = width >= 800;
    const [logoHover, setLogoHover] = useState(false);
    const [featuresHover, setFeaturesHover] = useState(false);
    const [pricingHover, setPricingHover] = useState(false);
    const [resourcesHover, setResourcesHover] = useState(false);
    const [loginHover, setLoginHover] = useState(false);
    const [signupHover, setSignupHover] = useState(false);
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
            paddingTop: height * 0.04,
            minHeight: height * 0.1,
        },
    };

    if (isTabletOrDesktop) {
        return (
            <View style={[styles.desktopHeader, dynamicStyles.desktopHeader]}>
                <View style={styles.leftNav}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Home')}
                        onPressIn={() => setLogoHover(true)}
                        onPressOut={() => setLogoHover(false)}
                    >
                        <Text style={[styles.logo, logoHover && styles.logoHover]}>Shortly</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Features')}
                        onPressIn={() => setFeaturesHover(true)}
                        onPressOut={() => setFeaturesHover(false)}
                    >
                        <Text style={[
                            styles.navItem,
                            title === 'Features' && styles.activeNavItem,
                            featuresHover && title !== 'Features' && styles.navItemHover
                        ]}>
                            Features
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Pricing')}
                        onPressIn={() => setPricingHover(true)}
                        onPressOut={() => setPricingHover(false)}
                    >
                        <Text style={[
                            styles.navItem,
                            title === 'Pricing' && styles.activeNavItem,
                            pricingHover && title !== 'Pricing' && styles.navItemHover
                        ]}>
                            Pricing
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Saved URLs')}
                        onPressIn={() => setResourcesHover(true)}
                        onPressOut={() => setResourcesHover(false)}
                    >
                        <Text style={[
                            styles.navItem,
                            title === 'Saved URLs' && styles.activeNavItem,
                            resourcesHover && title !== 'Saved URLs' && styles.navItemHover
                        ]}>
                            Resources
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.authButtons}>
                    <TouchableOpacity
                        onPress={() => {
                            console.log('Login button pressed');
                            navigation.navigate('Auth', { mode: 'login' });
                        }}
                        onPressIn={() => setLoginHover(true)}
                        onPressOut={() => setLoginHover(false)}
                    >
                        <Text style={[styles.loginButton, loginHover && styles.loginButtonHover]}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.signupButton, signupHover && styles.signupButtonHover]}
                        onPress={() => {
                            console.log('Signup button pressed');
                            navigation.navigate('Auth', { mode: 'signup' });
                        }}
                        onPressIn={() => setSignupHover(true)}
                        onPressOut={() => setSignupHover(false)}
                    >
                        <Text style={styles.signupButtonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.mobileHeader, dynamicStyles.mobileHeader, { paddingTop: insets.top + (height * 0.02) }]}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Text style={styles.mobileTitle}>Shortly</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.openDrawer()}
                style={styles.hamburgerButton}
            >
                <View style={styles.hamburgerIcon}>
                    <View style={styles.dash} />
                    <View style={styles.dash} />
                    <View style={styles.dash} />
                </View>
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
    logoHover: {
        opacity: 0.8,
    },
    navItem: {
        fontSize: 18,
        fontFamily: 'Poppins_500Medium',
        color: Colors.neutral.gray500,
        letterSpacing: -0.5,
    },
    navItemHover: {
        color: Colors.neutral.gray900,
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
    loginButtonHover: {
        color: Colors.primary.blue400,
    },
    signupButton: {
        backgroundColor: Colors.primary.blue400,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
    },
    signupButtonHover: {
        backgroundColor: 'hsl(180, 66%, 42%)',
    },
    signupButtonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
    },
    mobileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
    },
    hamburgerButton: {
        padding: 5,
    },
    hamburgerIcon: {
        width: 24,
        height: 18,
        justifyContent: 'space-between',
    },
    dash: {
        width: 24,
        height: 3,
        backgroundColor: Colors.neutral.gray500,
        borderRadius: 1,
    },
    mobileTitle: {
        fontSize: 36,
        fontFamily: 'Poppins_700Bold',
        color: Colors.neutral.gray950,
        letterSpacing: -0.5,
    },
});

export default ResponsiveHeader;