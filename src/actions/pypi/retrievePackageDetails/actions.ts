import type { PackageVersion } from '@/app/scan/pypi/page';
import axios from 'axios';

export const fetchPackageDetails = async (
  packageName: string,
  currentVersion: string,
): Promise<PackageVersion | string> => {
  console.log(`Looking up ${packageName} on PyPI registry`);
  try {
    const response = await axios.get(
      `https://pypi.org/pypi/${packageName}/json`,
    );
    const data = response.data;

    const latestVersion = data.info.version;
    const allVersions = Object.keys(data.releases as string); // Get all versions listed in the PyPI release data

    // Filter versions by the major version of the current version
    const [currentMajor] = currentVersion.split('.').map(Number);
    const validVersions = allVersions.filter((version) => {
      const [major, minor] = version.split('.').map(Number);
      console.log(`Checking version ${version}`);
      console.log(`Current major version: ${currentMajor}`);
      console.log(`Major version: ${major}`);
      console.log(`Minor version: ${minor}`);
      return major === currentMajor && !version.includes('b'); // Exclude versions with 'b' suffix
    });

    // Sort valid versions in descending order to find the latest
    validVersions.sort((a, b) => {
      const [aMajor, aMinor, aPatch] = a.split('.').map(Number);
      const [bMajor, bMinor, bPatch] = b.split('.').map(Number);
      if (aMajor !== bMajor) return bMajor - aMajor; // Compare major versions
      if (aMinor !== bMinor) return bMinor - aMinor; // Compare minor versions
      return bPatch - aPatch; // Compare patch versions
    });

    // The latest version in the same major version
    const recommendedVersion =
      validVersions.length > 0 ? validVersions[0] : currentVersion;

    // Determine the status
    let status: 'up-to-date' | 'outdated' | 'major-update';
    if (currentVersion === latestVersion) {
      status = 'up-to-date';
    } else if (latestVersion.split('.')[0] !== currentVersion.split('.')[0]) {
      status = 'major-update';
    } else {
      status = 'outdated';
    }

    const packageDetails: PackageVersion = {
      name: data.info.name,
      current: currentVersion,
      latest: latestVersion,
      recommended: recommendedVersion,
      status,
    };

    return packageDetails;
  } catch (error) {
    console.error(`Failed to fetch details for package: ${packageName}`, error);
    return 'failed';
  }
};
