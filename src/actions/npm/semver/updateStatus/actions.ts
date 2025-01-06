import semver from 'semver';

export const updateStatus = (latest: string, current: string): string => {
  console.log(`Checking update status for ${current} and ${latest}`);

  // Handle "Failed" cases
  if (latest === 'Failed') {
    return 'Failed';
  }

  // Normalize the versions by coercing shorthand versions like "^9" to "9.0.0"
  const normalizedCurrent = semver.coerce(current)?.version ?? current;
  const normalizedLatest = semver.coerce(latest)?.version ?? latest;

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
    return 'Failed';
  }

  return 'outdated';
};
