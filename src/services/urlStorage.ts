import AsyncStorage from '@react-native-async-storage/async-storage';

interface StoredURL {
    id: string;
    original: string;
    shortened: string;
    timestamp: number;
}

const STORAGE_KEY = 'shortened_urls';
const EXPIRY_DURATION = 60 * 60 * 1000;
const MAX_URLS = 3;

export const urlStorageService = {
    async getStoredUrls(): Promise<StoredURL[]> {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (!stored) return [];

            const urls: StoredURL[] = JSON.parse(stored);
            const now = Date.now();
            
            const validUrls = urls.filter(url => 
                now - url.timestamp < EXPIRY_DURATION
            );

            if (validUrls.length !== urls.length) {
                await this.storeUrls(validUrls);
            }

            return validUrls;
        } catch (error) {
            console.error('Error getting stored URLs:', error);
            return [];
        }
    },

    async addUrl(original: string, shortened: string): Promise<void> {
        try {
            const existingUrls = await this.getStoredUrls();
            
            const newUrl: StoredURL = {
                id: Date.now().toString(),
                original,
                shortened,
                timestamp: Date.now()
            };

            const updatedUrls = [newUrl, ...existingUrls];
            
            const limitedUrls = updatedUrls.slice(0, MAX_URLS);

            await this.storeUrls(limitedUrls);
        } catch (error) {
            console.error('Error adding URL:', error);
        }
    },

    async storeUrls(urls: StoredURL[]): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
        } catch (error) {
            console.error('Error storing URLs:', error);
        }
    },

    async clearExpiredUrls(): Promise<void> {
        const validUrls = await this.getStoredUrls();
        await this.storeUrls(validUrls);
    },

    async clearAllUrls(): Promise<void> {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Error clearing URLs:', error);
        }
    }
};