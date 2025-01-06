import axios from 'axios';

export const npmRegistryLookUp = async (
  packageName: string,
): Promise<string> => {
  try {
    console.log(`Looking up ${packageName} on NPM registry`);
    const responseData = await axios.get(
      `https://registry.npmjs.org/${packageName}`,
    );

    const data = responseData.data;
    const latestVersion = data['dist-tags'].latest;

    console.log(`Latest version of ${packageName} is ${latestVersion}`);

    return latestVersion as string;
  } catch (e) {
    console.error(e);
    return 'Failed';
  }
};
