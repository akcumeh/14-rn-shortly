import { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Animated, ScrollView } from 'react-native';
import { useFonts, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { RootDrawerParamList } from '../types/navigation';
import IllustrationSvg from '../../assets/images/illustration-working.svg';

type HomeScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Home'>;

export default function HomeScreen() {
    const { width, height } = useWindowDimensions();
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const isDesktop = width >= 640;
    
    const imageFadeAnim = useRef(new Animated.Value(1)).current;
    const imageScaleAnim = useRef(new Animated.Value(1)).current;
    const imageTranslateY = useRef(new Animated.Value(0)).current;
    
    const titleFadeAnim = useRef(new Animated.Value(0)).current;
    const titleScaleAnim = useRef(new Animated.Value(0.95)).current;
    const titleTranslateY = useRef(new Animated.Value(30)).current;
    
    const subtitleFadeAnim = useRef(new Animated.Value(0)).current;
    const subtitleScaleAnim = useRef(new Animated.Value(0.95)).current;
    const subtitleTranslateY = useRef(new Animated.Value(30)).current;
    
    const buttonFadeAnim = useRef(new Animated.Value(0)).current;
    const buttonScaleAnim = useRef(new Animated.Value(0.95)).current;
    const buttonTranslateY = useRef(new Animated.Value(30)).current;
    
    const [fontsLoaded] = useFonts({
        Poppins_500Medium,
        Poppins_700Bold,
    });

    useEffect(() => {
        if (fontsLoaded) {
            const animateElement = (fade: Animated.Value, scale: Animated.Value, translateY: Animated.Value, delay: number) => {
                Animated.parallel([
                    Animated.timing(fade, {
                        toValue: 1,
                        duration: 800,
                        delay,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scale, {
                        toValue: 1,
                        duration: 800,
                        delay,
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateY, {
                        toValue: 0,
                        duration: 800,
                        delay,
                        useNativeDriver: true,
                    }),
                ]).start();
            };

            setTimeout(() => animateElement(titleFadeAnim, titleScaleAnim, titleTranslateY, 0), 100);
            setTimeout(() => animateElement(subtitleFadeAnim, subtitleScaleAnim, subtitleTranslateY, 0), 200);
            setTimeout(() => animateElement(buttonFadeAnim, buttonScaleAnim, buttonTranslateY, 0), 300);
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    const dynamicStyles = {
        container: {
            flex: 1,
            paddingHorizontal: width * 0.053,
            paddingVertical: height * 0.02,
            flexDirection: isDesktop ? 'row' as const : 'column' as const,
            justifyContent: isDesktop ? 'space-between' as const : 'flex-start' as const,
        },
        illustration: {
            width: isDesktop ? width * 0.5 : width,
            alignSelf: isDesktop ? 'auto' : 'flex-end',
        },
        contentPanel: {
            flex: isDesktop ? 1 : 0,
            alignItems: isDesktop ? 'flex-start' as const : 'center' as const,
            width: isDesktop ? width * 0.4 : '100%',
            paddingTop: isDesktop ? 0 : height * 0.05,
        },
        mainTitle: {
            fontSize: isDesktop ? 56 : 42.5,
            textAlign: isDesktop ? 'left' as const : 'center' as const,
            marginBottom: height * 0.025,
            lineHeight: isDesktop ? 64 : 54,
        },
        subtitle: {
            fontSize: 18,
            textAlign: isDesktop ? 'left' as const : 'center' as const,
            marginBottom: height * 0.04,
            lineHeight: 26,
        },
        getStartedButton: {
            width: isDesktop ? 200 : width * 0.6,
            marginBottom: '2.5rem',

        },
    };

    return (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={[styles.container, dynamicStyles.container]} showsVerticalScrollIndicator={false}>
            {!isDesktop && (
                <Animated.View
                    style={[
                        {
                            opacity: imageFadeAnim,
                            transform: [
                                { scale: imageScaleAnim },
                                { translateY: imageTranslateY }
                            ]
                        }
                    ]}
                >
                    <IllustrationSvg
                        width={dynamicStyles.illustration.width}
                    />
                </Animated.View>
            )}
            
            <View style={[styles.contentPanel, dynamicStyles.contentPanel]}>
                <Animated.Text 
                    style={[
                        styles.mainTitle, 
                        dynamicStyles.mainTitle,
                        {
                            opacity: titleFadeAnim,
                            transform: [
                                { scale: titleScaleAnim },
                                { translateY: titleTranslateY }
                            ]
                        }
                    ]}
                >
                    More than just shorter links
                </Animated.Text>
                
                <Animated.Text 
                    style={[
                        styles.subtitle, 
                        dynamicStyles.subtitle,
                        {
                            opacity: subtitleFadeAnim,
                            transform: [
                                { scale: subtitleScaleAnim },
                                { translateY: subtitleTranslateY }
                            ]
                        }
                    ]}
                >
                    Build your brand&apos;s recognition and get detailed insights on how your links are performing.
                </Animated.Text>
                
                <Animated.View
                    style={[
                        {
                            opacity: buttonFadeAnim,
                            transform: [
                                { scale: buttonScaleAnim },
                                { translateY: buttonTranslateY }
                            ]
                        }
                    ]}
                >
                    <TouchableOpacity 
                        style={[styles.getStartedButton, dynamicStyles.getStartedButton]}
                        onPress={() => navigation.navigate('Saved URLs')}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>

            {isDesktop && (
                <Animated.View
                    style={[
                        {
                            opacity: imageFadeAnim,
                            transform: [
                                { scale: imageScaleAnim },
                                { translateY: imageTranslateY }
                            ]
                        }
                    ]}
                >
                    <View style={{ 
                        height: height * 0.25, 
                        aspectRatio: 518 / 582,
                        alignSelf: 'flex-end' 
                    }}>
                        <IllustrationSvg
                            width="100%"
                            height="100%"
                            viewBox="0 0 518 582"
                        />
                    </View>
                </Animated.View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        backgroundColor: 'white',
        paddingBottom: 40,
    },
    contentPanel: {
    },
    mainTitle: {
        fontFamily: 'Poppins_700Bold',
        color: 'hsl(260, 8%, 14%)',
    },
    subtitle: {
        fontFamily: 'Poppins_500Medium',
        color: 'hsl(257, 7%, 63%)',
    },
    getStartedButton: {
        backgroundColor: 'hsl(180, 66%, 49%)',
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
    },
});