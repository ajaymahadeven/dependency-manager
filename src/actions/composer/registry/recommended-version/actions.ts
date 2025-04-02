import axios from 'axios';

interface VersionPackages {
  dist: object;
  version: string;
  version_normalized: string;
  time: string;
  source: object;
  require: object;
}

export async function findRecommendedPackageVersion(
  packageName: string,
  current: string,
): Promise<string | null> {
  try {
    const response = await axios.get(
      `https://packagist.org/packages/${packageName}.json`,
    );

    if (!response?.data.package) {
      throw new Error('Package not found');
    }

    const versions: Record<string, VersionPackages> =
      response.data.package.versions;
    const versionStrings = Object.keys(versions);

    console.log('Type of the version is:', typeof versions);
    console.log('Versions are:', versionStrings);

    // Extract major version
    const currentMajorVersion = current.split('.')[0];
    const filteredVersions = versionStrings.filter((version) => {
      const majorVersion = version.split('.')[0];
      return majorVersion === currentMajorVersion;
    });

    console.log('Filtered versions are:', filteredVersions);

    // Get the latest recommended version
    const recommendedVersion = filteredVersions[0];

    console.log('Next version is:', recommendedVersion);

    return recommendedVersion || current;
  } catch (error) {
    console.error(`Error looking up ${packageName}:`, error);
    return null;
  }
}
