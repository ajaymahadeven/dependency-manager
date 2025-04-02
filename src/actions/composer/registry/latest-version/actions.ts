import axios from 'axios';

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
): Promise<string | null> {
  try {
    const response = await axios.get(
      `https://packagist.org/packages/${packageName}.json`,
    );

    if (!response?.data.package) {
      throw new Error('Package not found');
    }

    console.log('Response Data', response.data);

    const versions: Record<string, VersionPackages> =
      response.data.package.versions;
    const versionStrings = Object.keys(versions);

    console.log('Type of the version is:', typeof versions);
    console.log('Versions are:', versionStrings);

    const latestVersion = versionStrings[0];

    console.log('Latest version is:', latestVersion);

    return latestVersion;
  } catch (error) {
    console.error(`Error looking up ${packageName}:`, error);
    return null;
  }
}
