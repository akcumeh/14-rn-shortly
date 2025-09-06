import { config } from '../config/env';

interface ShortenResponse {
    shortened?: string;
    error?: string;
}

export async function shortenUrl(longUrl: string): Promise<string> {
    const trimmedUrl = longUrl.trim();
    
    // Try your backend first
    try {
        const response = await fetch(`${config.apiUrl}/api/shorten`, {
            method: 'POST',
            headers: {
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
        throw new Error('Backend unavailable');
    } catch (backendError) {
        console.log('Backend failed, trying CleanURI:', backendError);
        
        // Fallback to CleanURI (works on mobile devices)
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
                throw new Error(`CleanURI API error: ${data.error || 'No result_url'}`);
            } else {
                const errorText = await response.text();
                console.log('CleanURI HTTP error response:', errorText);
                throw new Error(`CleanURI HTTP ${response.status}: ${errorText}`);
            }
        } catch (cleanUriError) {
            console.log('CleanURI failed with error:', cleanUriError);
            throw new Error('Service unavailable');
        }
    }
}