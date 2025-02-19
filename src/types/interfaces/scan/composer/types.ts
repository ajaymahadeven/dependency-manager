export interface PackageVersion {
  name: string;
  current: string;
  latest: string;
  recommended: string | null;
  status: string;
}

export interface Dependencies {
  [name: string]: string;
}
