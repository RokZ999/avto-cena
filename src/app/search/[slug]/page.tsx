import HomeMain from "@/components/home/home-main";
import { fetchCarData } from "@/services/api";
import { CarData } from "@/types/CarData";
import { CarDataSummary } from "@/types/CarDataSummary";
import { convertDate_ISO_to_DD_MM_YYYY } from "@/utils/dateUtils";

interface Prop {
  params: { slug: string };
}

function convertCarDataToChartFormat(carData: CarData[]) {
  return carData
    .map((car) => ({
      datum: convertDate_ISO_to_DD_MM_YYYY(car.date_of_insert),
      cena: car.price,
      url: car.url,
    }))
    .reverse();
}

function countDistinctValues(data: CarData[], marketplaceSource: string) {
  const prices = data
    .filter((item) => item?.url?.includes(marketplaceSource))
    .map((item) => item.price);
  return new Set(prices).size;
}

function calculateCarDataSummary(carData: CarData[]) {
  const minPrice = carData.reduce(
    (min, p) => (p.price < min ? p.price : min),
    carData[0].price
  );
  const maxPrice = carData.reduce(
    (max, p) => (p.price > max ? p.price : max),
    carData[0].price
  );
  const firstPrice = carData[carData.length - 1].price;
  const lastPrice = carData[0].price;

  const avtoNetDistinctPrice = countDistinctValues(carData, "avto.net");
  const doberAvtoDistinctPrice = countDistinctValues(carData, "doberavto.si");

  const carDataSummary: CarDataSummary = {
    min_calculated_price: minPrice,
    max_calculated_price: maxPrice,
    diff_first_last_price: firstPrice - lastPrice,
    diff_first_min_price: firstPrice - minPrice,
    avtoNetDistinctPrice,
    doberAvtoDistinctPrice,
  };
  return carDataSummary;
}

export default async function ResultOfVinSearch({ params }: Prop) {
  if (params.slug.length !== 17) {
    return (
      <HomeMain
        carData={["NI_USTREZEN_VNOS"]}
        chartData={[]}
        carDataSummary={null}
      />
    );
  }
  const data = await fetchCarData(params.slug);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <HomeMain
        carData={["NI_PODATKOV"]}
        chartData={[]}
        carDataSummary={null}
      />
    );
  }

  const chartData = convertCarDataToChartFormat(data);
  const carDataSummary = calculateCarDataSummary(data);

  return (
    <HomeMain
      carData={data}
      chartData={chartData}
      carDataSummary={carDataSummary}
    />
  );
}
