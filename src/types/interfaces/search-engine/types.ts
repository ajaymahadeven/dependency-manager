export interface SearchEngineResultsForNpm {
  id: string;
  name: string;
  description: string;
  version: string;
  monthlyDownloads: string;
  weeklyDownloads: string;
  stars: string;
  type: string;
  url: string;
  publiser: string;
}

export interface AxiosResponseDataForNpm {
  downloads: {
    monthly: string;
    weekly: string;
  };
  package: {
    name: string;
    description: string;
    version: string;
    publisher: {
      username: string;
    };
  };
}

export type SearchRegistryType = 'npm' | 'pypi' | 'composer' | 'all';

export interface AxiosResponseDataForComposer {
  name: string;
  description: string;
  url: string;
  repository: string;
  downloads: string;
  favers: string;
}
