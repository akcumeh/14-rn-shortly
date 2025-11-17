import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useFonts, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';

export default function PricingScreen() {
    const { width, height } = useWindowDimensions();
    const [paystackHover, setPaystackHover] = useState(false);
    const [otherMethodHover, setOtherMethodHover] = useState(false);
    
    const [fontsLoaded] = useFonts({
        Poppins_500Medium,
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    const dynamicStyles = {
        container: {
            flex: 1,
            paddingHorizontal: width * 0.075,
            paddingVertical: height * 0.05,
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
        },
        title: {
            fontSize: 32,
            textAlign: 'center' as const,
            marginBottom: height * 0.03,
        },
        paragraph: {
            fontSize: 18,
            textAlign: 'center' as const,
            marginBottom: height * 0.025,
        },
        buttonContainer: {
            flexDirection: 'row' as const,
            gap: 15,
            marginTop: height * 0.04,
        },
        button: {
            flex: 1,
            maxWidth: width * 0.4,
        },
    };

    return (
        <View style={[styles.container, dynamicStyles.container]}>
            <Text style={[styles.title, dynamicStyles.title]}>
                This app is free!
            </Text>
            
            <Text style={[styles.paragraph, dynamicStyles.paragraph]}>
                I know you just heaved a sigh of relief. haha.
            </Text>
            
            <Text style={[styles.paragraph, dynamicStyles.paragraph]}>
                Anyway, you can still support by buying me a coffee!
            </Text>
            
            <View style={[styles.buttonContainer, dynamicStyles.buttonContainer]}>
                <TouchableOpacity
                    style={[
                        styles.paymentButton,
                        dynamicStyles.button,
                        paystackHover && styles.paymentButtonHover
                    ]}
                    onPressIn={() => setPaystackHover(true)}
                    onPressOut={() => setPaystackHover(false)}
                >
                    <Text style={styles.buttonText}>Paystack</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.paymentButton,
                        dynamicStyles.button,
                        otherMethodHover && styles.paymentButtonHover
                    ]}
                    onPressIn={() => setOtherMethodHover(true)}
                    onPressOut={() => setOtherMethodHover(false)}
                >
                    <Text style={styles.buttonText}>Another Method</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    title: {
        fontFamily: 'Poppins_700Bold',
        color: 'hsl(260, 8%, 14%)',
    },
    paragraph: {
        fontFamily: 'Poppins_500Medium',
        color: 'hsl(257, 7%, 63%)',
        lineHeight: 26,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    paymentButton: {
        backgroundColor: 'hsl(180, 66%, 49%)',
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
    },
    paymentButtonHover: {
        backgroundColor: 'hsl(180, 66%, 42%)',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
    },
});