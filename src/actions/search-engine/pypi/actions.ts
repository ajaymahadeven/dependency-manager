import axios from 'axios';

//TODO: This is too precise, we should make it more generic.
export const searchPyPiRegistry = async (
  searchTerm: string,
  p0: { signal: AbortSignal },
) => {
  try {
    if (searchTerm === '') {
      return [];
    }
    const response = await axios.get(
      `https://pypi.org/pypi/${searchTerm}/json`,
      { signal: p0.signal },
    );

    const data = response.data;

    console.log('PyPi Response', data);

    const transformedData = {
      id: data.info.name,
      name: data.info.name,
      description: data.info.summary,
      version: data.info.version,
      downloads: data.info.downloads,
      type: 'pypi',
      url: `https://pypi.org/project/${searchTerm}`,
    };

    const transformedArray = [transformedData];

    console.log('PyPi Clean Response', transformedData);

    return transformedArray;
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
