"use client";
import { useEffect, useState, useRef, FormEventHandler } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import HomeTableCard from "./home-table-card";
import HomePlotCard from "./home-plot-card";
import HomePriceSummary from "./home-price-sumary";
import { CarData } from "@/types/CarData";
import { DatePriceChart } from "@/types/DatePriceChart";
import { CarDataSummary } from "@/types/CarDataSummary";
import { Icons } from "../icons";

const useVinForm = (slug: string) => {
  const [inputValue, setInputValue] = useState("");
  const [route, setRoute] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    const value = Array.isArray(slug) ? slug.join("") : slug || "";
    setInputValue(value);
    setRoute(value);
  }, [slug]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    setInputValue(value);
    setRoute(value);
    if (value.length >= 17) {
      setValidationMessage("");
    } else {
      setValidationMessage("VIN more vsebovati 17 znakov.");
      setTimeout(() => setValidationMessage(""), 1500);
    }
  };

  return { inputValue, route, validationMessage, handleInputChange };
};

export default function HomeMain({
  carData,
  chartData,
  carDataSummary,
}: {
  carData: CarData[] | any;
  chartData: DatePriceChart[];
  carDataSummary: CarDataSummary | null;
}) {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const { inputValue, route, validationMessage, handleInputChange } =
    useVinForm(slug);
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (!carData) {
      toastShownRef.current = false;
      return;
    }
    if (
      carData.message === "No data found for the given VIN." &&
      !toastShownRef.current
    ) {
      toast.error("Ni podatkov za navedeno VIN številko.");
      toastShownRef.current = true;
    } else if (carData.length > 1 && !toastShownRef.current) {
      toast.success("Podatki so bili uspešno pridobljeni.");
      toastShownRef.current = true;
    } else if (
      carData.message !== "No data found for the given VIN." &&
      carData.length !== 2
    ) {
      toastShownRef.current = false;
    }
  }, [carData]);

  const handleClick = (e: any) => {
    e.preventDefault();
    if (inputValue.length !== 17) {
      toast.error("VIN more vsebovati 17 znakov.");
    } else if (route === slug) {
      toast.info("Podatki so že prikazani.");
    } else {
      toast.info("Pridobivanje podatkov za vin: " + route);
      router.push(`/search/${route}`);
    }
  };

  const handleAvtologClick = () => {
    window.open(`https://avtolog.si/search/${route}`, "_blank");
  };

  return (
    <main className="flex flex-col items-center justify-start pt-3 w-full">
      <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 w-full max-w-5xl mx-auto px-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Sledite cenam rabljenih avtomobilov</CardTitle>
            <CardDescription>
              Vnesite številko VIN, da vidite zgodovino cen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="flex w-full items-center space-x-2"
              onSubmit={handleClick}
            >
              <Input
                type="text"
                placeholder="Vnesite VIN številko"
                value={inputValue}
                onChange={handleInputChange}
                className="flex-1"
              />
              <Button type="submit">
                <Icons.shadSearch />
              </Button>
              {slug && (
                <div className="">
                  <Button onClick={handleAvtologClick}>Avtolog</Button>
                </div>
              )}
            </form>
            {validationMessage && (
              <p className="text-red-500 mt-2">{validationMessage}</p>
            )}
            <HomePriceSummary data={carDataSummary} />
          </CardContent>
        </Card>
        <HomePlotCard data={chartData} />
      </div>

      <div className="flex flex-col w-full max-w-5xl mx-auto py-3 px-4">
        <HomeTableCard data={carData} />
      </div>
    </main>
  );
}
