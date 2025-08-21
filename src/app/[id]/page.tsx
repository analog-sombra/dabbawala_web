/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  FluentBuildingShop20Regular,
  FluentCall32Regular,
  FluentFood24Regular,
} from "@/componenet/icons";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import type { CheckboxGroupProps } from "antd/es/checkbox";
import { Alert, Radio } from "antd";

interface ResDishInfo {
  Id: string;
  catName: string;
  title: string;
  price: string;
  vegNonVeg: string;
  isCustomizable: string;
  price1: string | null;
  price2: string | null;
  price3: string | null;
  price4: string | null;
  sub1: string | null;
  sub2: string | null;
  sub3: string | null;
  sub4: string | null;
}

const RestaurentDish = () => {
  const [currentDish, setCurrentDish] = useState<string | null>(null);
  const { id } = useParams<{ id: string | string[] }>();
  const idString = Array.isArray(id) ? id[0] : id;
  const resId = parseInt(idString, 10);

  enum FoodType {
    ALL = "ALL",
    VEG = "VEG",
    NON_VEG = "NON_VEG",
  }

  const options: CheckboxGroupProps<string>["options"] = [
    { label: "All", value: FoodType.ALL },
    { label: "Veg", value: FoodType.VEG },
    { label: "NonVeg", value: FoodType.NON_VEG },
  ];
  const [foodType, setFoodType] = useState<FoodType>(FoodType.ALL);

  const resinfo = useQuery({
    queryKey: ["resinfo"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await axios.post(
        "https://dabbawala.live/websites/dropmev3/app/api/api.php",
        {
          f: "findOneRestaurant1",
          Id: resId,
        }
      );

      if (!response.data) {
        throw new Error("No data found");
      }

      if (response.data.data.length < 0) {
        throw new Error("No data found");
      }
      return response.data.data[0];
    },
  });

  const resdishinfo = useQuery({
    queryKey: ["getdishbyid"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await axios.post(
        "https://dabbawala.live/websites/dropmev3/app/api/api.php",
        {
          f: "getDishesByRestaurantIdCategoryWise2",
          resId: resId,
        }
      );

      if (!response.data) {
        throw new Error("No data found");
      }

      return response.data.data;
    },
  });

  interface DishTypeInfo {
    name: string;
    count: number;
  }

  const gettype = (): DishTypeInfo[] => {
    if (!resdishinfo.data) return [];
    const resdishinfoData = resdishinfo.data as ResDishInfo[][];

    if (resdishinfoData.length < 0) {
      return [];
    }

    const dishTypeInfo: DishTypeInfo[] = [];

    if (foodType == FoodType.ALL) {
      resdishinfoData.map((dish: ResDishInfo[]) => {
        const category = dish[0].catName;
        const count = dish.length;
        dishTypeInfo.push({ name: category, count });
      });
    } else if (foodType == FoodType.VEG) {
      resdishinfoData.map((dish: ResDishInfo[]) => {
        const category = dish[0].catName;
        const count = dish.filter((val) => val.vegNonVeg === "0").length;
        dishTypeInfo.push({ name: category, count });
      });
    } else if (foodType == FoodType.NON_VEG) {
      resdishinfoData.map((dish: ResDishInfo[]) => {
        const category = dish[0].catName;
        const count = dish.filter((val) => val.vegNonVeg === "1").length;
        dishTypeInfo.push({ name: category, count });
      });
    }

    return dishTypeInfo;
  };

  useEffect(() => {
    if (gettype().length > 0) {
      setCurrentDish(gettype()[0].name);
    }
  }, [resdishinfo.data]);

  if (resinfo.isLoading || resdishinfo.isLoading) {
    return <div>Loading...</div>;
  }

  if (resinfo.isError || resdishinfo.isError) {
    return (
      <div className="m-4">
        <Alert message="Error: Something went wrong" type="error" showIcon />
      </div>
    );
  }

  const getDishList = (): ResDishInfo[] => {
    if (!resdishinfo.data) return [];
    if (foodType == FoodType.ALL) {
      const resdishinfoData = resdishinfo.data as ResDishInfo[][];
      const currentDishData = resdishinfoData.find(
        (dish) => dish[0].catName === currentDish
      );
      return currentDishData || [];
    } else if (foodType == FoodType.VEG) {
      const resdishinfoData = resdishinfo.data as ResDishInfo[][];
      const currentDishData = resdishinfoData.find(
        (dish) => dish[0].catName === currentDish
      );
      return currentDishData?.filter((val) => val.vegNonVeg === "0") || [];
    } else if (foodType == FoodType.NON_VEG) {
      const resdishinfoData = resdishinfo.data as ResDishInfo[][];
      const currentDishData = resdishinfoData.find(
        (dish) => dish[0].catName === currentDish
      );
      return currentDishData?.filter((val) => val.vegNonVeg === "1") || [];
    }
    return [];
  };

  return (
    <div className="px-4 md:w-5/6 lg:w-4/6 mx-auto">
      <div className="flex items-center gap-2 pt-2">
        <FluentBuildingShop20Regular className="scale-150" />
        <h1 className="text-2xl font-medium">{resinfo.data.name}</h1>
      </div>
      <p className="leading-4 text-lg text-gray-800">
        Cuisines Served : {resinfo.data.cuisineServed}
      </p>
      <p className="leading-4 mt-1 text-lg text-gray-900">
        {resinfo.data.address}
      </p>
      <div className="flex items-center border-2 mt-2 justify-center gap-2 rounded-md border-gray-600 w-32">
        <FluentCall32Regular />
        <p>{resinfo.data.phone1}</p>
      </div>
      <div className="flex items-center gap-2 py-2">
        <FluentFood24Regular className="scale-150" />
        <h1 className="text-2xl font-semibold">MENU</h1>
        <div className="grow"></div>
        <Radio.Group
          block
          options={options}
          defaultValue={foodType}
          optionType="button"
          buttonStyle="solid"
          onChange={(value) => {
            setFoodType(value.target.value as FoodType);
          }}
        />
      </div>
      <div className="w-full bg-gray-800 h-[1px] mb-2"></div>
      <div className="grid grid-cols-10 gap-2 ">
        <div className="col-span-2">
          {gettype().length === 0 && (
            <Alert message="No dishes available" type="info" showIcon />
          )}
          {gettype().map((catName: DishTypeInfo, index) => (
            <div
              key={index}
              role="button"
              onClick={() => setCurrentDish(catName.name)}
              className={`text-left text-xl cursor-pointer text-gray-700 my-2 ${
                currentDish === catName.name
                  ? "bg-gradient-to-r from-transparent to-rose-500/30 text-rose-500 border-r-4"
                  : "hover:text-rose-500"
              }`}
            >
              {catName.name} ({catName.count})
            </div>
          ))}
        </div>
        <div className="col-span-8">
          {getDishList().map((dish) => (
            <DishItem
              key={dish.Id}
              id={parseInt(dish.Id)}
              name={dish.title}
              price={dish.price}
              vegNonVeg={dish.vegNonVeg}
              isCustomizable={dish.isCustomizable}
              price1={dish.price1}
              price2={dish.price2}
              price3={dish.price3}
              price4={dish.price4}
              sub1={dish.sub1}
              sub2={dish.sub2}
              sub3={dish.sub3}
              sub4={dish.sub4}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurentDish;

interface DishItem {
  id: number;
  name: string;
  price: string;
  vegNonVeg: string;
  isCustomizable: string;
  price1: string | null;
  price2: string | null;
  price3: string | null;
  price4: string | null;
  sub1: string | null;
  sub2: string | null;
  sub3: string | null;
  sub4: string | null;
}

const DishItem = (props: DishItem) => {
  return (
    <div className="border border-gray-300 px-4 py-2 rounded-lg shadow-md mb-3">
      <div className="flex gap-2 items-center">
        <VegNonVeg vegNonVeg={props.vegNonVeg == "0" ? true : false} />
        <h2 className="text-lg font-medium text-gray-800">{props.name}</h2>
      </div>
      <p>₹ {props.price}</p>

      {props.sub1 ? (
        <div className="h-[1px] w-full bg-gray-300 my-1"></div>
      ) : null}

      {props.sub1 ? (
        <p className="text-sm text-gray-800">
          - {props.sub1} : ₹ {props.price1}
        </p>
      ) : null}
      {props.sub2 ? (
        <p className="text-sm text-gray-800">
          - {props.sub2} : ₹ {props.price2}
        </p>
      ) : null}
      {props.sub3 ? (
        <p className="text-sm text-gray-800">
          - {props.sub3} : ₹ {props.price3}
        </p>
      ) : null}
      {props.sub4 ? (
        <p className="text-sm text-gray-800">
          - {props.sub4} : ₹ {props.price4}
        </p>
      ) : null}
    </div>
  );
};

const VegNonVeg = ({ vegNonVeg }: { vegNonVeg: boolean }) => {
  return (
    <div
      className={` h-4 w-4 grid place-items-center border-2 ${
        vegNonVeg ? "border-emerald-500" : "border-red-500"
      }`}
    >
      <div
        className={`h-2 w-2 rounded-full ${
          vegNonVeg ? "bg-emerald-500" : "bg-red-500"
        }`}
      ></div>
    </div>
  );
};
