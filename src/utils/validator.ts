export function getUrl(url: string) {
  const defaultUrl = url.match(/^(https?|ftp):\/\/|^ftps?:\/\/|^www\./i)
    ? url
    : `https://${url}`;

  let name: string;
  try {
    const urlObject = new URL(defaultUrl);
    console.log(urlObject.hostname);

    return { Url: urlObject, defaultUrl };
  } catch (error) {
    console.error("Error parsing URL:", error);
  }
  return { Url: null, defaultUrl };
}
