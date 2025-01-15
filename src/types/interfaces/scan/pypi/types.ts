export interface PackageVersion {
  name: string;
  current: string;
  latest: string;
  recommended: string;
  status: 'up-to-date' | 'outdated' | 'major-update';
}
