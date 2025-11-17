import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions, Animated, Linking } from 'react-native';
import { useFonts, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { RootDrawerParamList } from '../types/navigation';
import * as Clipboard from 'expo-clipboard';
import isUrl from 'is-url';
import { Colors } from '../constants/Colors';
import BgShortenMobile from '../../assets/images/bg-shorten-mobile.svg';
import BgShortenDesktop from '../../assets/images/bg-shorten-desktop.svg';
import { shortenUrl as shortenURL } from '../services/urlConverter';
import { urlStorageService } from '../services/urlStorage';

interface ShortenedURL {
    id: string;
    original: string;
    shortened: string;
}

type URLScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Saved URLs'>;

export default function URLScreen() {
    const navigation = useNavigation<URLScreenNavigationProp>();
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const [shortenedUrls, setShortenedUrls] = useState<ShortenedURL[]>([]);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [shortenBtnHover, setShortenBtnHover] = useState(false);
    const [hoveredUrlId, setHoveredUrlId] = useState<string | null>(null);
    const [hoveredCopyId, setHoveredCopyId] = useState<string | null>(null);
    const [loginHover, setLoginHover] = useState(false);
    const [signupHover, setSignupHover] = useState(false);
    const { width } = useWindowDimensions();
    const isDesktop = width >= 800;
    const buttonAnimations = useRef<{[key: string]: Animated.Value}>({}).current;
    
    const [fontsLoaded] = useFonts({
        Poppins_500Medium,
        Poppins_700Bold,
    });

    useEffect(() => {
        loadStoredUrls();
    }, []);

    const loadStoredUrls = async () => {
        const stored = await urlStorageService.getStoredUrls();
        setShortenedUrls(stored);
    };

    if (!fontsLoaded) {
        return null;
    }

    const validateUrl = (urlString: string) => {
        if (isUrl(urlString)) {
            return { isValid: true, finalUrl: urlString };
        }
        
        if (!urlString.match(/^(https?:\/\/|mailto:|ftp:\/\/|file:\/\/)/)) {
            const urlWithPrefix = `https://${urlString}`;
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
            
            await urlStorageService.addUrl(validation.finalUrl, shortenedUrl);
            await loadStoredUrls();
            setUrl('');
        } catch (err) {
            console.error('URL shortening error:', err);
            const error = err as any;
            setError(error.message || 'Failed to shorten URL');
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

    const copyToClipboard = async (shortened: string, id: string) => {
        if (copiedId === id) return;
        
        await Clipboard.setStringAsync(shortened);
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
            <View style={[styles.contentWrapper, isDesktop && styles.desktopContentWrapper]}>
                <View style={[styles.shortenContainer, isDesktop && styles.desktopShortenContainer]}>
                    <View style={styles.backgroundSolid} />
                    {isDesktop ? (
                        <BgShortenDesktop width={width} height={180} style={styles.backgroundImage} />
                    ) : (
                        <BgShortenMobile width={width} height={200} style={styles.backgroundImage} />
                    )}

                    <View style={[styles.formContent, isDesktop && styles.desktopFormContent]}>
                        <View style={[styles.inputContainer, isDesktop && styles.desktopInputContainer]}>
                            <TextInput
                                style={[styles.input, error ? styles.inputError : null, isDesktop && styles.desktopInput]}
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
                            {error && !isDesktop ? <Text style={styles.errorText}>{error}</Text> : null}
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.shortenBtn,
                                isDesktop && styles.desktopShortenBtn,
                                isLoading && styles.shortenBtnDisabled,
                                shortenBtnHover && !isLoading && styles.shortenBtnHover
                            ]}
                            onPress={shortenUrl}
                            disabled={isLoading}
                            onPressIn={() => setShortenBtnHover(true)}
                            onPressOut={() => setShortenBtnHover(false)}
                        >
                            <Text style={styles.shortenbtnText}>
                                {isLoading ? 'Shortening...' : 'Shorten It!'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {error && isDesktop ? <Text style={[styles.errorText, styles.desktopErrorText]}>{error}</Text> : null}
                </View>

                <View style={styles.urlsList}>
                    {shortenedUrls.map((item) => (
                        <View key={item.id} style={[styles.urlCard, isDesktop && styles.desktopUrlCard]}>
                            <View style={isDesktop && styles.desktopUrlContent}>
                                <Text style={styles.originalUrl} numberOfLines={1}>{item.original}</Text>
                                {!isDesktop && <View style={styles.divider} />}
                            </View>
                            <View style={isDesktop && styles.desktopUrlActions}>
                                <TouchableOpacity
                                    onPress={() => Linking.openURL(item.shortened)}
                                    onPressIn={() => setHoveredUrlId(item.id)}
                                    onPressOut={() => setHoveredUrlId(null)}
                                >
                                    <Text style={[
                                        styles.shortenedUrl,
                                        hoveredUrlId === item.id && styles.shortenedUrlHover
                                    ]}>
                                        {item.shortened}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => copyToClipboard(item.shortened, item.id)}
                                    disabled={copiedId === item.id}
                                    onPressIn={() => setHoveredCopyId(item.id)}
                                    onPressOut={() => setHoveredCopyId(null)}
                                >
                                    <Animated.View
                                        style={[
                                            {
                                                backgroundColor: getButtonAnimation(item.id).interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [Colors.primary.blue400, Colors.primary.purple950]
                                                }),
                                                borderRadius: 8,
                                                padding: 12,
                                                alignItems: 'center',
                                            },
                                            isDesktop ? styles.desktopCopyBtn : styles.mobileCopyBtn,
                                            hoveredCopyId === item.id && copiedId !== item.id && styles.copyBtnHover
                                        ]}
                                    >
                                        <Text style={styles.copybtnText}>
                                            {copiedId === item.id ? 'Copied!' : 'Copy'}
                                        </Text>
                                    </Animated.View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={[styles.ctaContainer, isDesktop && styles.desktopCtaContainer]}>
                    <Text style={styles.ctaText}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Auth', { mode: 'login' })}
                            onPressIn={() => setLoginHover(true)}
                            onPressOut={() => setLoginHover(false)}
                        >
                            <Text style={[styles.ctaLink, loginHover && styles.ctaLinkHover]}>Login</Text>
                        </TouchableOpacity>
                        {' or '}
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Auth', { mode: 'signup' })}
                            onPressIn={() => setSignupHover(true)}
                            onPressOut={() => setSignupHover(false)}
                        >
                            <Text style={[styles.ctaLink, signupHover && styles.ctaLinkHover]}>signup</Text>
                        </TouchableOpacity>
                        {' to store and access more of your Shortly history.'}
                    </Text>
                </View>
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
    contentWrapper: {
        width: '100%',
        alignItems: 'center',
    },
    desktopContentWrapper: {
        maxWidth: 1024,
        paddingHorizontal: 80,
        alignSelf: 'center',
    },
    shortenContainer: {
        width: '90%',
        marginBottom: 24,
        position: 'relative',
        borderRadius: 10,
        overflow: 'hidden',
        minHeight: 180,
    },
    desktopShortenContainer: {
        width: '100%',
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
        paddingHorizontal: 0,
        width: '90%',
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
        alignSelf: 'center',
        flexDirection: 'column'
    },
    ctaText: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
        color: Colors.neutral.gray500,
        textAlign: 'center',
        alignItems: 'center',
        lineHeight: 20,
    },
    ctaLink: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
        color: Colors.primary.blue400,
        textDecorationLine: 'none',
        alignItems: 'center',
    },
    desktopCtaContainer: {
        maxWidth: 640,
        alignSelf: 'center',
        width: '100%',
    },
    desktopFormContent: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'flex-start',
        maxWidth: 640,
        alignSelf: 'center',
        width: '100%',
    },
    desktopInputContainer: {
        flex: 1,
        marginBottom: 0,
    },
    desktopInput: {
        flex: 1,
    },
    desktopShortenBtn: {
        paddingHorizontal: 32,
        paddingVertical: 16,
        minWidth: 160,
        flexShrink: 0,
    },
    shortenBtnHover: {
        backgroundColor: 'hsl(180, 66%, 42%)',
    },
    desktopErrorText: {
        paddingHorizontal: 24,
        paddingBottom: 12,
    },
    desktopUrlCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        maxWidth: 640,
        alignSelf: 'center',
        width: '100%',
    },
    desktopUrlContent: {
        flex: 1,
        marginRight: 20,
    },
    desktopUrlActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    shortenedUrlHover: {
        textDecorationLine: 'underline',
    },
    mobileCopyBtn: {
        margin: 16,
    },
    desktopCopyBtn: {
        margin: 0,
        minWidth: 100,
    },
    copyBtnHover: {
        transform: [{ scale: 1.05 }],
    },
    ctaLinkHover: {
        textDecorationLine: 'underline',
    },
});