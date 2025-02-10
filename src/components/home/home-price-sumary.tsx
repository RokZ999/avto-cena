import { CarDataSummary } from "@/types/CarDataSummary";

export default function HomePriceSummary({
  data,
}: {
  data: CarDataSummary | null;
}) {
  if (!data) {
    return null;
  }
  return (
    <div className="mt-4 space-y-2">
      <div className="w-full flex space-x-1">
        <div className="w-1/2 p-3 border rounded shadow-sm">
          <p className="text-sm">Min cena: {data.min_calculated_price}€</p>
        </div>
        <div className="w-1/2 p-3 border rounded shadow-sm">
          <p className="text-sm">Max cena: {data.max_calculated_price}€</p>
        </div>
      </div>

      <div className="p-3 border rounded shadow-sm">
        <p className="text-sm">
          Razlika med 1. in TRENUTNO ceno:{" "}
          <span
            className={`${
              data.diff_first_last_price == 0
                ? ""
                : data.diff_first_last_price < 0
                ? " text-red-500"
                : " text-green-500"
            } p-2 rounded`}
          >
            {data.diff_first_last_price}€
          </span>
        </p>
      </div>

      <div className="p-3 border rounded shadow-sm">
        <p className="text-sm">
          Razlika med 1. in NAJNIŽJO ceno:{" "}
          <span
            className={`${
              data.diff_first_min_price == 0
                ? ""
                : data.diff_first_min_price < 0
                ? " text-red-500"
                : " text-green-500"
            } p-2 rounded`}
          >
            {data.diff_first_min_price}€
          </span>
        </p>
      </div>
      <div className="w-full flex space-x-1">
        <div className="w-1/2 p-3 border rounded shadow-sm">
          <p className="text-sm">
            Sprememba cene avto.net: {data.avtoNetDistinctPrice}x
          </p>
        </div>
        <div className="w-1/2 p-3 border rounded shadow-sm">
          <p className="text-sm">
            Sprememba cene doberavto.si: {data.doberAvtoDistinctPrice}x
          </p>
        </div>
      </div>
    </div>
  );
}
