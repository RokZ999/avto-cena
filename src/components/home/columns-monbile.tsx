import { CarData } from "@/types/CarData";
import { convertDate_ISO_to_DD_MM_YYYY } from "@/utils/dateUtils";
import { extractIdFromUrl } from "@/utils/idExtractor";
import { ColumnDef } from "@tanstack/react-table";

export const carColumnsMobile: ColumnDef<CarData>[] = [
  {
    accessorKey: "price",
    header: () => "Cena",
    cell: (info) => `${info.getValue()}€`,
  },
  {
    accessorKey: "date_of_insert",
    header: () => "Vnos",
    cell: (info) => {
      const date = new Date(info.getValue() as string);
      return convertDate_ISO_to_DD_MM_YYYY(date);
    },
  },
  {
    accessorKey: "url",
    header: () => "URL",
    cell: (info) => (
      <a
        href={info.getValue() as string}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        {extractIdFromUrl(info.getValue() as string)}
      </a>
    ),
  },
];
