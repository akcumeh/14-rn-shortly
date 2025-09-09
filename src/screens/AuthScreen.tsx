import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useWindowDimensions, Alert } from 'react-native';
import { useFonts, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { RootDrawerParamList } from '../types/navigation';
import { authService } from '../lib/auth';
import { Colors } from '../constants/Colors';

interface AuthScreenProps {
    onAuthSuccess?: () => void;
}

type AuthScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Auth'>;

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps = {}) {
    const navigation = useNavigation<AuthScreenNavigationProp>();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'signup' | 'login' | 'otp'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPhone, setCurrentPhone] = useState('');
    const { width, height } = useWindowDimensions();

    const [fontsLoaded] = useFonts({
        Poppins_500Medium,
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    const handleSignup = async () => {
        if (!name.trim() || !email.trim() || !phone.trim()) {
            setError('All fields are required');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const result = await authService.signup(name.trim(), email.trim(), phone.trim());

            if (result.success) {
                setCurrentPhone(phone.trim());
                setStep('otp');
                Alert.alert('Success', 'Account created! Now request OTP to login.');
            } else {
                setError(result.error || 'Signup failed');
            }
        } catch (error: any) {
            setError(error.message || 'Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestOtp = async () => {
        if (!phone.trim()) {
            setError('Phone number is required');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const result = await authService.requestOtp(phone.trim());

            if (result.success) {
                setCurrentPhone(phone.trim());
                setStep('otp');
                if (result.otp) {
                    Alert.alert('Development Mode', `Your OTP is: ${result.otp}`);
                } else {
                    Alert.alert('Success', 'OTP sent to your phone!');
                }
            } else {
                setError(result.error || 'Failed to send OTP');
            }
        } catch (error: any) {
            setError(error.message || 'Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp.trim() || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const result = await authService.verifyOtp(currentPhone, otp.trim());

            if (result.success) {
                onAuthSuccess();
            } else {
                setError(result.error || 'Invalid OTP');
            }
        } catch (error: any) {
            setError(error.message || 'Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setEmail('');
        setPhone('');
        setOtp('');
        setError('');
        setCurrentPhone('');
    };

    const dynamicStyles = {
        container: {
            paddingHorizontal: width * 0.075,
            paddingVertical: height * 0.05,
        },
    };

    return (
        <View style={[styles.container, dynamicStyles.container]}>
            <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => navigation.goBack()}
            >
                <View style={styles.closeIcon}>
                    <View style={[styles.closeDash, styles.closeDash1]} />
                    <View style={[styles.closeDash, styles.closeDash2]} />
                </View>
            </TouchableOpacity>
            
            <Text style={styles.title}>
                {step === 'signup' ? 'Create Account' :
                    step === 'login' ? 'Welcome Back' :
                        'Verify OTP'}
            </Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {step === 'signup' && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor={Colors.neutral.gray500}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        placeholderTextColor={Colors.neutral.gray500}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        placeholderTextColor={Colors.neutral.gray500}
                    />

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleSignup}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.skipButton}
                        onPress={() => navigation.navigate('Saved URLs')}
                    >
                        <Text style={styles.skipButtonText}>Skip signup</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { resetForm(); setStep('login'); }}>
                        <Text style={styles.switchText}>
                            Already have an account? Sign in
                        </Text>
                    </TouchableOpacity>
                </>
            )}

            {step === 'login' && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        placeholderTextColor={Colors.neutral.gray500}
                    />

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleRequestOtp}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Sending OTP...' : 'Request OTP'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { resetForm(); setStep('signup'); }}>
                        <Text style={styles.switchText}>
                            Don&apos;t have an account? Sign up
                        </Text>
                    </TouchableOpacity>
                </>
            )}

            {step === 'otp' && (
                <>
                    <Text style={styles.otpInfo}>
                        Enter the 6-digit OTP sent to {currentPhone}
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="numeric"
                        maxLength={6}
                        placeholderTextColor={Colors.neutral.gray500}
                    />

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleVerifyOtp}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Verifying...' : 'Verify OTP'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { resetForm(); setStep('login'); }}>
                        <Text style={styles.switchText}>
                            Back to login
                        </Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    title: {
        fontSize: 32,
        fontFamily: 'Poppins_700Bold',
        color: Colors.neutral.gray950,
        textAlign: 'center',
        marginBottom: 40,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.neutral.gray400,
        borderRadius: 8,
        padding: 16,
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        marginBottom: 16,
        color: Colors.neutral.gray950,
    },
    button: {
        backgroundColor: Colors.primary.blue400,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonDisabled: {
        backgroundColor: Colors.neutral.gray400,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
    },
    skipButton: {
        backgroundColor: 'transparent',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.neutral.gray400,
    },
    skipButtonText: {
        color: Colors.neutral.gray500,
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
    },
    switchText: {
        textAlign: 'center',
        color: Colors.primary.blue400,
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
    },
    error: {
        color: Colors.secondary.red400,
        textAlign: 'center',
        marginBottom: 16,
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
    },
    otpInfo: {
        textAlign: 'center',
        color: Colors.neutral.gray500,
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
        marginBottom: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
        padding: 10,
    },
    closeIcon: {
        width: 20,
        height: 20,
        position: 'relative',
    },
    closeDash: {
        position: 'absolute',
        width: 20,
        height: 2,
        backgroundColor: Colors.neutral.gray600,
        top: 9,
    },
    closeDash1: {
        transform: [{ rotate: '45deg' }],
    },
    closeDash2: {
        transform: [{ rotate: '-45deg' }],
    },
});