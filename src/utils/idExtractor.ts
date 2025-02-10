export function extractIdFromUrl(url: string) {
  if (!url) {
    return "";
  }

  if (url.includes("avto.net")) {
    return url.split("=")[1];
  }

  if (url.includes("doberavto.si")) {
    return url.split("oglas/")[1];
  }

  debugger;

  const urlParts = url.split("/");
  return urlParts[urlParts.length - 2];
}
