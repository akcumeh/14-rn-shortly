interface ShortenResponse {
    result_url?: string;
    error?: string;
}

export async function shortenUrl(longUrl: string): Promise<string> {
    const encodedUrl = encodeURIComponent(longUrl.trim());

    const response = await fetch('https://cleanuri.com/api/v1/shorten', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `url=${encodedUrl}`,
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ShortenResponse = await response.json();

    if (data.error) {
        throw new Error(data.error);
    }

    if (!data.result_url) {
        throw new Error('No shortened URL received');
    }

    return data.result_url.replace(/\\/g, '');
}