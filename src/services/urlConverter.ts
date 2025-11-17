import { config } from '../config/env';

interface ShortenResponse {
    shortened?: string;
    error?: string;
}

export async function shortenUrl(longUrl: string): Promise<string> {
    const trimmedUrl = longUrl.trim();
    // return `${config.apiUrl}/proxy/shorten`;
    try {
        console.log('Trying backend with URL:', trimmedUrl);
        const response = await fetch(`${config.apiUrl}/api/shorten`, {
            method: 'POST',
            headers: {
                'ngrok-skip-browser-warning': 'true',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: trimmedUrl }),
        });

        if (response.ok) {
            const data: ShortenResponse = await response.json();
            if (data.shortened && !data.error) {
                return data.shortened;
            }
        }

        if (response.status === 400) {
            const data: ShortenResponse = await response.json();
            if (data.error) {
                const errorMsg = data.error.toLowerCase();
                if (errorMsg.includes('blocked') || errorMsg.includes('domain blocked')) {
                    throw new Error('Sorry, you can\'t shorten this link');
                }
            }
        }

        throw new Error('Backend unavailable');
    } catch (backendError) {
        if (backendError instanceof Error && backendError.message === 'Sorry, you can\'t shorten this link right now.') {
            throw backendError;
        }
        console.log('Backend failed, trying CleanURI:', backendError);
        
        try {
            const encodedUrl = encodeURIComponent(trimmedUrl);
            console.log('Trying CleanURI with encoded URL:', encodedUrl);
            
            const response = await fetch('https://cleanuri.com/api/v1/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `url=${encodedUrl}`,
            });

            console.log('CleanURI response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('CleanURI response data:', data);

                if (data.result_url && !data.error) {
                    console.log('CleanURI success:', data.result_url);
                    return data.result_url.replace(/\\/g, '');
                }
                if (data.error) {
                    const errorMsg = data.error.toLowerCase();
                    if (errorMsg.includes('blocked') || errorMsg.includes('domain blocked')) {
                        throw new Error('Sorry, you can\'t shorten this link');
                    }
                }
                throw new Error('Service unavailable');
            } else {
                const errorText = await response.text();
                console.log('CleanURI HTTP error response:', errorText);
                throw new Error('Service unavailable');
            }
        } catch (cleanUriError) {
            console.log('CleanURI failed with error:', cleanUriError);
            if (cleanUriError instanceof Error && cleanUriError.message === 'Sorry, you can\'t shorten this link') {
                throw cleanUriError;
            }
            throw new Error('Service unavailable');
        }
    }
}