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

export async function findRecommendedPackageVersion(
  packageName: string,
  current: string,
): Promise<string | null> {
  try {
    const response = await axios.get(
      `https://packagist.org/packages/${packageName}.json`,
    );

    const versions = Object.keys(
      response.data.package.versions as Record<string, VersionPackages>,
    );

    const currentCoerced = semver.coerce(current);
    if (!currentCoerced || /^dev-|\.x-dev$/.test(current)) {
      throw new Error(`Invalid current version: ${current}`);
    }

    const currentMajor = currentCoerced.major;

    const filtered = versions.filter((version) => {
      const v = semver.coerce(version);
      return (
        v && v.major === currentMajor && !/dev|alpha|beta|RC/i.test(version)
      );
    });

    const recommended = filtered.sort((a, b) =>
      semver.rcompare(semver.coerce(a)!, semver.coerce(b)!),
    )[0];

    return recommended || null;
  } catch (error) {
    console.error(`Error looking up ${packageName}:`, error);
    return null;
  }
}
