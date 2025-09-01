import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions, Alert } from 'react-native';
import { useFonts, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Colors } from '../constants/Colors';
import BgShortenMobile from '../../assets/images/bg-shorten-mobile.svg';

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
    const { width, height } = useWindowDimensions();
    
    const [fontsLoaded] = useFonts({
        Poppins_500Medium,
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    const validateUrl = (urlString: string) => {
        try {
            new URL(urlString);
            return true;
        } catch {
            return false;
        }
    };

    const shortenUrl = async () => {
        setError('');
        
        if (!url.trim()) {
            setError('Please add a link');
            return;
        }

        if (!validateUrl(url)) {
            setError('Please enter a valid URL');
            return;
        }

        // Generate a mock shortened URL
        const mockShortened = `https://rel.ink/${Math.random().toString(36).substr(2, 6)}`;
        
        const newShortenedUrl: ShortenedURL = {
            id: Date.now().toString(),
            original: url,
            shortened: mockShortened
        };

        setShortenedUrls(prev => [newShortenedUrl, ...prev]);
        setUrl('');
    };

    const copyToClipboard = (shortened: string, id: string) => {
        // Note: In a real app, you'd use Clipboard.setString(shortened)
        setCopiedId(id);
        Alert.alert('Copied!', 'URL copied to clipboard');
        
        setTimeout(() => {
            setCopiedId(null);
        }, 2000);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {/* URL Shortening Form */}
            <View style={styles.shortenContainer}>
                <BgShortenMobile width={width - 40} height={160} style={styles.backgroundImage} />
                
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
                        />
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    </View>
                    
                    <TouchableOpacity style={styles.shortenBtn} onPress={shortenUrl}>
                        <Text style={styles.shortenbtnText}>Shorten It!</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Shortened URLs List */}
            <View style={styles.urlsList}>
                {shortenedUrls.map((item) => (
                    <View key={item.id} style={styles.urlCard}>
                        <Text style={styles.originalUrl} numberOfLines={1}>{item.original}</Text>
                        <Text style={styles.shortenedUrl}>{item.shortened}</Text>
                        
                        <TouchableOpacity
                            style={[
                                styles.copyBtn,
                                copiedId === item.id ? styles.copiedBtn : null
                            ]}
                            onPress={() => copyToClipboard(item.shortened, item.id)}
                        >
                            <Text style={[
                                styles.copybtnText,
                                copiedId === item.id ? styles.copiedbtnText : null
                            ]}>
                                {copiedId === item.id ? 'Copied!' : 'Copy'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
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
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    formContent: {
        padding: 24,
        zIndex: 1,
    },
    inputContainer: {
        marginBottom: 16,
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
        fontSize: 12,
        fontFamily: 'Poppins_500Medium',
        fontStyle: 'italic',
        marginTop: 8,
    },
    shortenBtn: {
        backgroundColor: Colors.primary.blue400,
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
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
        padding: 16,
        marginBottom: 16,
    },
    originalUrl: {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        color: Colors.neutral.gray950,
        marginBottom: 8,
    },
    shortenedUrl: {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        color: Colors.primary.blue400,
        marginBottom: 16,
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
});