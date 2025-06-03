import axios from 'axios';
import semver from 'semver';

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

    const versions: Record<string, VersionPackages> =
      response.data.package.versions;
    const versionStrings = Object.keys(versions);

    // Filter only stable versions (exclude dev, alpha, beta, RC)
    const stableVersions = versionStrings.filter((v) => {
      // Exclude unstable versions by common keywords
      if (/dev|alpha|beta|rc/i.test(v)) return false;
      // Check if the version is a valid semver (strict)
      return semver.valid(v) !== null;
    });

    if (stableVersions.length === 0) {
      console.warn('No stable versions found');
      return null;
    }

    // Sort versions from newest to oldest using semver comparison
    stableVersions.sort(semver.rcompare);

    // Return the highest stable version string as-is
    return stableVersions[0];
  } catch (error) {
    console.error(`Error looking up ${packageName}:`, error);
    return null;
  }
}
