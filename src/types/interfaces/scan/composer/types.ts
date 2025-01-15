export interface PackageVersion {
  name: string;
  current: string;
  latest: string;
  recommended: string;
  status: string;
}

export interface Dependencies {
  [name: string]: string;
}
