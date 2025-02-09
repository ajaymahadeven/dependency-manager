import axios from 'axios';
import semver from 'semver';

export const getRecommendedVersion = async (
  current: string,
  latest: string,
  packageName: string,
): Promise<string> => {
  if (!semver.valid(current) || !semver.valid(latest)) {
    console.warn(
      `[${packageName}] Invalid version(s) detected. Falling back to latest: ${latest}`,
    );
    return latest;
  }

  const currentMajor = semver.major(current);

  try {
    const response = await axios.get(
      `https://registry.npmjs.org/${packageName}`,
    );

    if (!response.data?.versions) {
      console.error(
        `[${packageName}] No version data found. Falling back to latest: ${latest}`,
      );
      return latest;
    }

    let versions = Object.keys(
      response.data.versions as Record<string, { version: string }>,
    ).filter((v) => semver.valid(v) !== null);

    console.log(`[${packageName}] Available versions:`, versions);

    // **Filter out beta, alpha, rc, and canary versions**
    versions = versions.filter((v) => semver.prerelease(v) === null);

    // Get all stable versions within the same major range (e.g., 20.x.x for major 20)
    const sameMajorVersions = versions.filter(
      (v) => semver.major(v) === currentMajor,
    );

    if (sameMajorVersions.length === 0) {
      console.warn(
        `[${packageName}] No stable versions found in major ${currentMajor}. Staying on ${current}`,
      );
      return current; // Stay on current if no compatible stable version is found
    }

    // Find the highest available stable patch version within the same major version
    const bestVersion = semver.sort(sameMajorVersions).reverse()[0];

    console.log(
      `[${packageName}] Recommended stable version: ${bestVersion || current}`,
    );
    return bestVersion || current;
  } catch (error) {
    console.error(`[${packageName}] Error fetching versions:`, error);
  }

  return latest; // Fallback if API call fails
};
