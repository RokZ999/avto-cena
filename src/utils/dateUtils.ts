export function convertDate_ISO_to_DD_MM_YYYY(dateIn: any) {
  const isoString = dateIn as string;
  const date = new Date(isoString);

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  const convertedDate = `${day}.${month}.${year}`;
  return convertedDate;
}
