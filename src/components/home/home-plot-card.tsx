import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { DatePriceChart } from "@/types/DatePriceChart";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { ZoomIn, ZoomOut } from "lucide-react";

const PRICE_ROUNDING = 500;
const MAX_DATA_POINTS = 4;

interface HomePlotCardProps {
  data: DatePriceChart[];
}

interface CustomLabelProps {
  x: number;
  y: number;
  value: number;
  color: string;
}

const CustomLabel = React.memo(({ x, y, value, color }: CustomLabelProps) => {
  return (
    <text
      x={x}
      y={y}
      dy={-4}
      dx={0}
      fill={color}
      fontSize={13}
      textAnchor="auto"
    >
      {`${value}€`}
    </text>
  );
});

CustomLabel.displayName = "CustomLabel";

const PriceChart = ({
  data,
  color,
  isZoomedOut,
}: {
  data: DatePriceChart[];
  color: string;
  isZoomedOut: boolean;
}) => (
  <div className="w-full h-72">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 20, right: 50, left: 0, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="datum" />
        <YAxis
          dataKey="cena"
          domain={([dataMin, dataMax]) =>
            !isZoomedOut
              ? [
                  0,
                  Math.ceil((dataMax * 1.1) / PRICE_ROUNDING) * PRICE_ROUNDING,
                ]
              : [
                  Math.floor((dataMin * 0.9) / PRICE_ROUNDING) * PRICE_ROUNDING,
                  Math.ceil((dataMax * 1.1) / PRICE_ROUNDING) * PRICE_ROUNDING,
                ]
          }
        />
        <Tooltip />
        <Legend />
        <Line dataKey="cena" type="monotone" stroke={color}>
          <LabelList
            dataKey="cena"
            content={(props: any) => <CustomLabel {...props} color={color} />}
          />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  </div>
);

PriceChart.displayName = "PriceChart";

const filterData = (data: DatePriceChart[], maxPoints: number) => {
  if (data.length <= maxPoints) return data;
  const step = Math.floor(data.length / (maxPoints - 1));
  return [
    data[0],
    ...data.slice(1, -1).filter((_, index) => index % step === 0),
    data[data.length - 1],
  ];
};

export default function HomePlotCard({ data }: HomePlotCardProps) {
  const [isZoomedOut, setIsZoomedOut] = useState(true);

  let avto_net_data = data.filter((item) => item.url?.includes("avto.net"));
  let dober_avto_data = data.filter((item) =>
    item.url?.includes("doberavto.si")
  );

  avto_net_data = useMemo(
    () => filterData(avto_net_data, MAX_DATA_POINTS),
    [data]
  );

  dober_avto_data = useMemo(
    () => filterData(dober_avto_data, MAX_DATA_POINTS),
    [data]
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Grafični prikaz</CardTitle>
          <div className="flex items-center space-x-2">
            <ZoomOut />
            <Switch
              id="zoom-out"
              checked={isZoomedOut}
              onCheckedChange={setIsZoomedOut}
            />
            <Label htmlFor="zoom-out">
              <ZoomIn />
            </Label>
          </div>
        </div>

        <CardDescription>
          Vnesite številko VIN, da vidite zgodovino cen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue={
            avto_net_data.length === 0 && dober_avto_data.length > 0
              ? "doberavto"
              : "avtonet"
          }
          className=""
        >
          <div className="items-center justify-center">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="avtonet">Avtonet</TabsTrigger>
              <TabsTrigger value="doberavto">Doberavto</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="avtonet">
            <PriceChart
              data={avto_net_data}
              color="#8884d8"
              isZoomedOut={isZoomedOut}
            />
          </TabsContent>
          <TabsContent value="doberavto">
            <PriceChart
              data={dober_avto_data}
              color="#ffd203"
              isZoomedOut={isZoomedOut}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

HomePlotCard.displayName = "HomePlotCard";
