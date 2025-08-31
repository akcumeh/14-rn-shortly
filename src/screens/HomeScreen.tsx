import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Animated } from 'react-native';
import { useFonts, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import IllustrationSvg from '../../assets/images/illustration-working.svg';

export default function HomeScreen() {
    const { width, height } = useWindowDimensions();
    const isDesktop = width >= 640;
    
    const imageFadeAnim = useRef(new Animated.Value(0)).current;
    const imageScaleAnim = useRef(new Animated.Value(0.95)).current;
    const imageTranslateY = useRef(new Animated.Value(30)).current;
    
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

            setTimeout(() => animateElement(imageFadeAnim, imageScaleAnim, imageTranslateY, 0), 0);
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
            alignItems: 'center' as const,
            justifyContent: isDesktop ? 'space-between' as const : 'flex-start' as const,
        },
        illustration: {
            width: isDesktop ? width * 0.5 : width,
        },
        contentPanel: {
            flex: isDesktop ? 1 : 0,
            alignItems: isDesktop ? 'flex-start' as const : 'center' as const,
            width: isDesktop ? width * 0.4 : '100%',
            paddingTop: isDesktop ? 0 : height * 0.05,
        },
        mainTitle: {
            fontSize: isDesktop ? 56 : 32,
            textAlign: isDesktop ? 'left' as const : 'center' as const,
            marginBottom: height * 0.03,
            lineHeight: isDesktop ? 64 : 38,
        },
        subtitle: {
            fontSize: 18,
            textAlign: isDesktop ? 'left' as const : 'center' as const,
            marginBottom: height * 0.05,
            lineHeight: 26,
        },
        getStartedButton: {
            width: isDesktop ? 200 : width * 0.6,
        },
    };

    return (
        <View style={[styles.container, dynamicStyles.container]}>
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
                        style={{
                            maxHeight: height * 0.35,
                        }}
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
                    <TouchableOpacity style={[styles.getStartedButton, dynamicStyles.getStartedButton]}>
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
                    <IllustrationSvg
                        width={dynamicStyles.illustration.width}
                    />
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    illustration: {
        resizeMode: 'contain' as const,
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