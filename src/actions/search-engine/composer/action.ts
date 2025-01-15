import type { AxiosResponseDataForComposer } from '@/types/interfaces/search-engine/types';
import axios from 'axios';

export const searchComposerRegistry = async (
  searchTerm: string,
  p0: { signal: AbortSignal },
) => {
  try {
    if (searchTerm === '') {
      return [];
    }
    const response = await axios.get(
      `https://packagist.org/search.json?q=${searchTerm}`,
      { signal: p0.signal },
    );

    console.log('Response', response.data);

    const data = response.data.results.map(
      (result: AxiosResponseDataForComposer) => ({
        id: result.name,
        name: result.name,
        description: result.description,
        downloads: result.downloads,
        type: 'composer',
        url: result.url,
      }),
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return [];
      }
      if (error.name === 'CanceledError') {
        console.log('Request was canceled.');
        return [];
      }
    }
    console.error('Unexpected error:', error);
    throw error;
  }
};
