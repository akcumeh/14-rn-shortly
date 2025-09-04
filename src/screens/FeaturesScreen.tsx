import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, useWindowDimensions } from 'react-native';
import { useFonts, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Colors } from '../constants/Colors';
import BrandRecognitionIcon from '../../assets/images/icon-brand-recognition.svg';
import DetailedRecordsIcon from '../../assets/images/icon-detailed-records.svg';
import FullyCustomizableIcon from '../../assets/images/icon-fully-customizable.svg';

const features = [
    {
        title: 'Brand Recognition',
        description: 'Boost your brand recognition with each click. Generic links don\'t mean a thing. Branded links help instil confidence in your content.',
        icon: BrandRecognitionIcon,
    },
    {
        title: 'Detailed Records',
        description: 'Gain insights into who is clicking your links. Knowing when and where people engage with your content helps inform better decisions.',
        icon: DetailedRecordsIcon,
    },
    {
        title: 'Fully Customizable',
        description: 'Improve brand awareness and content discoverability through customizable links, supercharging audience engagement.',
        icon: FullyCustomizableIcon,
    },
];

export default function FeaturesScreen() {
    const { width } = useWindowDimensions();
    const isDesktop = width >= 640;

    const headerFadeAnim = useRef(new Animated.Value(0.7)).current;
    const headerScaleAnim = useRef(new Animated.Value(0.95)).current;
    const headerTranslateY = useRef(new Animated.Value(30)).current;

    const subtitleFadeAnim = useRef(new Animated.Value(0.7)).current;
    const subtitleScaleAnim = useRef(new Animated.Value(0.95)).current;
    const subtitleTranslateY = useRef(new Animated.Value(30)).current;

    const featureAnims = useRef(
        features.map(() => ({
            scale: new Animated.Value(0.95),
            translateY: new Animated.Value(30),
        }))
    ).current;

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

            const animateFeature = (scale: Animated.Value, translateY: Animated.Value, delay: number) => {
                Animated.parallel([
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

            setTimeout(() => animateElement(headerFadeAnim, headerScaleAnim, headerTranslateY, 0), 100);
            setTimeout(() => animateElement(subtitleFadeAnim, subtitleScaleAnim, subtitleTranslateY, 0), 200);
            
            featureAnims.forEach((anim, index) => {
                setTimeout(() => animateFeature(anim.scale, anim.translateY, 0), 300 + (index * 150));
            });
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Animated.Text 
                    style={[
                        styles.headerTitle,
                        {
                            opacity: headerFadeAnim,
                            transform: [
                                { scale: headerScaleAnim },
                                { translateY: headerTranslateY }
                            ]
                        }
                    ]}
                >
                    Advanced Statistics
                </Animated.Text>
                
                <Animated.Text 
                    style={[
                        styles.subtitle,
                        {
                            opacity: subtitleFadeAnim,
                            transform: [
                                { scale: subtitleScaleAnim },
                                { translateY: subtitleTranslateY }
                            ]
                        }
                    ]}
                >
                    Track how your links are performing across the web with our advanced statistics dashboard.
                </Animated.Text>
            </View>

            <View style={styles.featuresGrid}>
                <View style={[styles.connectingLine, { height: (features.length - 1) * 400 }]} />
                
                {features.map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                        <Animated.View
                            key={feature.title}
                            style={[
                                styles.featureCard,
                                {
                                    transform: [
                                        { scale: featureAnims[index].scale },
                                        { translateY: featureAnims[index].translateY }
                                    ]
                                }
                            ]}
                        >
                            <View style={styles.iconContainer}>
                                <IconComponent width={40} height={40} />
                            </View>
                            
                            <Text style={styles.featureTitle}>{feature.title}</Text>
                            <Text style={styles.featureDescription}>{feature.description}</Text>
                        </Animated.View>
                    );
                })}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f9fc',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: '5%',
        paddingVertical: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    headerTitle: {
        fontFamily: 'Poppins_700Bold',
        color: Colors.neutral.gray950,
        textAlign: 'center',
        lineHeight: 42,
        fontSize: 28,
        marginBottom: 20,
    },
    subtitle: {
        fontFamily: 'Poppins_500Medium',
        color: Colors.neutral.gray500,
        textAlign: 'center',
        lineHeight: 28,
        fontSize: 18,
        marginBottom: 60,
    },
    featuresGrid: {
        width: '100%',
        position: 'relative',
        alignItems: 'center',
    },
    featureCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 32,
        alignItems: 'center',
        position: 'relative',
        zIndex: 2,
        width: '90%',
        marginBottom: 80,
    },
    connectingLine: {
        position: 'absolute',
        left: '50%',
        top: 120,
        width: 3,
        backgroundColor: Colors.primary.blue400,
        zIndex: 1,
        marginLeft: -1.5,
        opacity: 1,
    },
    iconContainer: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: Colors.primary.purple950,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        overflow: 'hidden',
    },
    featureTitle: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 22,
        color: Colors.neutral.gray950,
        textAlign: 'center',
        marginBottom: 16,
    },
    featureDescription: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 15,
        color: Colors.neutral.gray500,
        textAlign: 'center',
        lineHeight: 26,
    },
});