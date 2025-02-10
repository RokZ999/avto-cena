import { CarData } from "@/types/CarData";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { carColumns } from "./columns";
import { DataTable } from "./data-table";
import { carColumnsMobile } from "./columns-monbile";

function countDistinctValues(data: CarData[], marketplaceSource: string) {
  const prices = data
    .filter((item) => item?.url?.includes(marketplaceSource))
    .map((item) => item.price);
  return new Set(prices).size;
}

export default function HomeTableCard({ data }: { data: CarData[] }) {
  const avtoNetDistinctPrice = countDistinctValues(data, "avto.net");
  const doberAvtoDistinctPrice = countDistinctValues(data, "doberavto");
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Zgodovina cene</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="hidden md:block">
          <DataTable columns={carColumns} data={data || []} />
        </div>
        <div className="block md:hidden">
          <DataTable columns={carColumnsMobile} data={data || []} />
        </div>
      </CardContent>
    </Card>
  );
}
