import type {
  AxiosResponseDataForNpm,
  SearchEngineResultsForNpm,
} from '@/types/interfaces/search-engine/types';
import axios from 'axios';

export const searchnpmRegistry = async (
  searchTerm: string,
  p0: { signal: AbortSignal },
) => {
  if (searchTerm === '') {
    return [];
  }
  try {
    const response = await axios.get(
      `https://registry.npmjs.org/-/v1/search?text=${searchTerm}&size=10`,
      { signal: p0.signal },
    );

    console.log('Response', response.data);

    const data = response.data.objects.map(
      (result: AxiosResponseDataForNpm) => ({
        id: result.package.name,
        name: result.package.name,
        description: result.package.description,
        version: result.package.version,
        monthlyDownloads: result.downloads?.monthly || 0,
        weeklyDownloads: result.downloads?.weekly || 0,
        type: 'npm',
        url: `https://www.npmjs.com/package/${result.package.name}`,
      }),
    );

    return data as SearchEngineResultsForNpm[];
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
