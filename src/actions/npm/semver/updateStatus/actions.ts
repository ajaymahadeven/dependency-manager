import semver from 'semver';

// A helper function to check if the version is a valid semver version
const isValidVersion = (version: string): boolean => {
  // If the version is a pre-release like 'dev-*', return false as it's not a valid semver
  if (version.startsWith('dev-')) {
    return false;
  }
  // Try to coerce the version into a valid semver format
  return semver.valid(semver.coerce(version)) !== null;
};

export const updateStatus = (latest: string, current: string): string => {
  console.log(`Checking update status for ${current} and ${latest}`);

  // Handle "Failed" cases
  if (latest === 'failed') {
    return 'failed';
  }

  // Normalize the versions by coercing shorthand versions like "^9" to "9.0.0"
  const normalizedCurrent = isValidVersion(current)
    ? (semver.coerce(current)?.version ?? current)
    : 'invalid';
  const normalizedLatest = isValidVersion(latest)
    ? (semver.coerce(latest)?.version ?? latest)
    : 'invalid';

  // If any version is invalid, return 'failed'
  if (normalizedCurrent === 'invalid' || normalizedLatest === 'invalid') {
    console.error(`Invalid version(s): current=${current}, latest=${latest}`);
    return 'failed';
  }

  let status: 'up-to-date' | 'outdated' | 'major-update' = 'outdated';
  try {
    if (semver.eq(normalizedCurrent, normalizedLatest)) {
      status = 'up-to-date';
      return status;
    } else if (
      semver.major(normalizedLatest) > semver.major(normalizedCurrent)
    ) {
      status = 'major-update';
      return status;
    }
  } catch (e) {
    console.error(e);
    return 'failed';
  }

  return 'outdated';
};
