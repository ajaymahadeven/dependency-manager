import semver from 'semver';

export const getRecommendedVersion = (
  current: string,
  latest: string,
): string => {
  if (semver.valid(current) && semver.valid(latest)) {
    const currentMajor = semver.major(current);
    const latestMajor = semver.major(latest);

    // Recommend the latest patch/minor for the current major version
    if (currentMajor === latestMajor) {
      return latest;
    }

    // Recommend the highest version in the current major range
    return `${currentMajor}.x`;
  }

  // Fallback to latest if semver comparison fails
  return latest;
};
