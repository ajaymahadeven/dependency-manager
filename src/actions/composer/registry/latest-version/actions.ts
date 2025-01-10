interface VersionPackages {
  dist: object;
  version: string;
  version_normalized: string;
  time: string;
  source: object;
  require: object;
}

export async function packagistRegistryLookup(
  packageName: string,
  current: string,
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://repo.packagist.org/p2/${packageName}.json`,
    );
    if (!response.ok) {
      throw new Error('Package not found');
    }

    const data = await response.json();
    const versions: VersionPackages[] = data.packages[packageName];

    console.log('Type of the version is:', typeof versions);
    console.log('Versions are:', versions);

    const latestVersion = versions[0].version as string;

    console.log('Latest version is:', latestVersion);

    return latestVersion;
  } catch (error) {
    console.error(`Error looking up ${packageName}:`, error);
    return null;
  }
}
