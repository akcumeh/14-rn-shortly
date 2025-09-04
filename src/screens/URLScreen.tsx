import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions, Animated, Linking } from 'react-native';
import { useFonts, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import Clipboard from '@react-native-clipboard/clipboard';
import isUrl from 'is-url';
import { Colors } from '../constants/Colors';
import BgShortenMobile from '../../assets/images/bg-shorten-mobile.svg';
import { shortenUrl as shortenURL } from '../services/urlConverter';

interface ShortenedURL {
    id: string;
    original: string;
    shortened: string;
}

export default function URLScreen() {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const [shortenedUrls, setShortenedUrls] = useState<ShortenedURL[]>([]);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { width, height } = useWindowDimensions();
    const buttonAnimations = useRef<{[key: string]: Animated.Value}>({}).current;
    
    const [fontsLoaded] = useFonts({
        Poppins_500Medium,
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    const validateUrl = (urlString: string) => {
        if (isUrl(urlString)) {
            return { isValid: true, finalUrl: urlString };
        }
        
        if (!urlString.match(/^(https?:\/\/|mailto:|ftp:\/\/|file:\/\/)/)) {
            const urlWithPrefix = `http://${urlString}`;
            if (isUrl(urlWithPrefix)) {
                return { isValid: true, finalUrl: urlWithPrefix };
            }
        }
        
        return { isValid: false, finalUrl: urlString };
    };

    const shortenUrl = async () => {
        setError('');
        setIsLoading(true);
        
        if (!url.trim()) {
            setError('Please add a link');
            setIsLoading(false);
            return;
        }

        const validation = validateUrl(url.trim());
        if (!validation.isValid) {
            setError('Please enter a valid URL');
            setIsLoading(false);
            return;
        }

        try {
            console.log('Attempting to shorten URL:', validation.finalUrl);
            const shortenedUrl = await shortenURL(validation.finalUrl);
            console.log('Successfully shortened URL:', shortenedUrl);
            
            const newShortenedUrl: ShortenedURL = {
                id: Date.now().toString(),
                original: validation.finalUrl,
                shortened: shortenedUrl
            };

            setShortenedUrls(prev => [newShortenedUrl, ...prev]);
            setUrl('');
        } catch (err) {
            console.error('URL shortening error:', err);
            setError(`Failed to shorten URL: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const getButtonAnimation = (id: string) => {
        if (!buttonAnimations[id]) {
            buttonAnimations[id] = new Animated.Value(0);
        }
        return buttonAnimations[id];
    };

    const copyToClipboard = (shortened: string, id: string) => {
        if (copiedId === id) return;
        
        Clipboard.setString(shortened);
        setCopiedId(id);
        
        const animation = getButtonAnimation(id);
        
        Animated.timing(animation, {
            toValue: 1,
            duration: 250,
            useNativeDriver: false,
        }).start();
        
        setTimeout(() => {
            setCopiedId(null);
            Animated.timing(animation, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false,
            }).start();
        }, 1500);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.shortenContainer}>
                <View style={styles.backgroundSolid} />
                <BgShortenMobile width={width - 40} height={200} style={styles.backgroundImage} />
                
                <View style={styles.formContent}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.input, error ? styles.inputError : null]}
                            placeholder="Shorten a link here..."
                            placeholderTextColor={error ? Colors.secondary.red400 : Colors.neutral.gray500}
                            value={url}
                            onChangeText={(text) => {
                                setUrl(text);
                                if (error) setError('');
                            }}
                            onSubmitEditing={shortenUrl}
                            returnKeyType="done"
                        />
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    </View>
                    
                    <TouchableOpacity 
                        style={[styles.shortenBtn, isLoading && styles.shortenBtnDisabled]} 
                        onPress={shortenUrl}
                        disabled={isLoading}
                    >
                        <Text style={styles.shortenbtnText}>
                            {isLoading ? 'Shortening...' : 'Shorten It!'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.urlsList}>
                {shortenedUrls.map((item) => (
                    <View key={item.id} style={styles.urlCard}>
                        <Text style={styles.originalUrl} numberOfLines={1}>{item.original}</Text>
                        <View style={styles.divider} />
                        <TouchableOpacity onPress={() => Linking.openURL(item.shortened)}>
                            <Text style={styles.shortenedUrl}>{item.shortened}</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            onPress={() => copyToClipboard(item.shortened, item.id)}
                            disabled={copiedId === item.id}
                        >
                            <Animated.View
                                style={{
                                    backgroundColor: getButtonAnimation(item.id).interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [Colors.primary.blue400, Colors.primary.purple950]
                                    }),
                                    borderRadius: 8,
                                    margin: 16,
                                    padding: 12,
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={styles.copybtnText}>
                                    {copiedId === item.id ? 'Copied!' : 'Copy'}
                                </Text>
                            </Animated.View>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            <View style={styles.ctaContainer}>
                <Text style={styles.ctaText}>
                    <TouchableOpacity>
                        <Text style={styles.ctaLink}>Login</Text>
                    </TouchableOpacity>
                    <Text style={styles.ctaText}> or </Text>
                    <TouchableOpacity>
                        <Text style={styles.ctaLink}>signup</Text>
                    </TouchableOpacity>
                    <Text style={styles.ctaText}> to store and access more of your Shortly history.</Text>
                </Text>
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
        paddingVertical: 40,
    },
    shortenContainer: {
        marginHorizontal: 20,
        marginBottom: 24,
        position: 'relative',
        borderRadius: 10,
        overflow: 'hidden',
        minHeight: 180,
    },
    backgroundSolid: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: Colors.primary.purple950,
        borderRadius: 10,
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: 0.7,
    },
    formContent: {
        padding: 24,
        zIndex: 2,
        borderRadius: 10,
    },
    inputContainer: {
        marginBottom: 12,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        color: Colors.neutral.gray950,
        borderWidth: 3,
        borderColor: 'transparent',
    },
    inputError: {
        borderColor: Colors.secondary.red400,
    },
    errorText: {
        color: Colors.secondary.red400,
        fontSize: 11,
        fontFamily: 'Poppins_500Medium',
        fontStyle: 'italic',
        marginTop: 3,
    },
    shortenBtn: {
        backgroundColor: Colors.primary.blue400,
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    shortenBtnDisabled: {
        backgroundColor: Colors.neutral.gray400,
    },
    shortenbtnText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
    },
    urlsList: {
        paddingHorizontal: 20,
    },
    urlCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 16,
    },
    originalUrl: {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        color: Colors.neutral.gray950,
        marginBottom: 8,
        marginHorizontal: 16,
        marginTop: 16,
    },
    shortenedUrl: {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        color: Colors.primary.blue400,
        marginBottom: 16,
        marginHorizontal: 16,
        marginTop: 8,
    },
    divider: {
        height: 1.5,
        backgroundColor: Colors.neutral.gray400,
        marginVertical: 4,
        width: '100%',
        marginHorizontal: 0,
    },
    copyBtn: {
        backgroundColor: Colors.primary.blue400,
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    copybtnText: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Poppins_700Bold',
    },
    copiedBtn: {
        backgroundColor: Colors.primary.purple950,
    },
    copiedbtnText: {
        color: 'white',
    },
    ctaContainer: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        alignItems: 'center',
    },
    ctaText: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
        color: Colors.neutral.gray500,
        textAlign: 'center',
        lineHeight: 20,
    },
    ctaLink: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
        color: Colors.primary.blue400,
    },
});