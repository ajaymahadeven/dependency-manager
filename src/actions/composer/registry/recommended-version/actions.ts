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
    const response = await fetch(
      `https://repo.packagist.org/p2/${packageName}.json`,
    );
    if (!response.ok) {
      throw new Error('Package not found');
    }

    const data = await response.json();
    const versions: VersionPackages[] = data.packages[packageName];

    // Extract version strings
    const versionStrings = versions.map((version) => version.version);

    console.log('Type of the version is:', typeof versions);
    console.log('Versions are:', versionStrings);

    // Filter versions that have the same major version as 'current'
    const currentMajorVersion = current.split('.')[0];
    const filteredVersions = versionStrings.filter((version) => {
      const majorVersion = version.split('.')[0];
      return majorVersion === currentMajorVersion;
    });

    console.log('Filtered versions are:', filteredVersions);

    const recommendedVersion = filteredVersions[0];

    console.log('Next version is:', recommendedVersion);

    if (recommendedVersion) {
      return recommendedVersion;
    } else {
      console.log('No higher version found for the current version');
      return current;
    }
  } catch (error) {
    console.error(`Error looking up ${packageName}:`, error);
    return null;
  }
}
