/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  FluentBuildingShop20Regular,
  FluentCall32Regular,
  FluentFood24Regular,
  FluentLocation28Regular,
} from "@/componenet/icons";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import type { CheckboxGroupProps } from "antd/es/checkbox";
import { Radio } from "antd";

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
        "https://dabbawala.live/websites/dropmev2/app/api/api.php",
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
        "https://dabbawala.live/websites/dropmev2/app/api/api.php",
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading restaurant menu...</p>
        </div>
      </div>
    );
  }

  if (resinfo.isError || resdishinfo.isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">We couldn&apos;t load the restaurant information. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-rose-500 hover:bg-rose-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
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
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 mx-auto pt-4">
        {/* Restaurant Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-rose-50 rounded-full">
              <FluentBuildingShop20Regular className="scale-125 text-rose-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{resinfo.data.name}</h1>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-sm font-medium">Cuisines:</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {resinfo.data.cuisineServed}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <FluentLocation28Regular className="text-gray-500 scale-75" />
              <p className="text-sm">{resinfo.data.address}</p>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <FluentCall32Regular className="text-gray-500 scale-75" />
              <p className="text-sm font-medium">{resinfo.data.phone1}</p>
            </div>
          </div>
        </div>
        {/* Menu Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-full">
                <FluentFood24Regular className="scale-125 text-orange-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Menu</h2>
            </div>
            
            <Radio.Group
              options={options}
              value={foodType}
              optionType="button"
              buttonStyle="solid"
              onChange={(value) => {
                setFoodType(value.target.value as FoodType);
              }}
              className="bg-gray-100 rounded-lg p-1"
            />
          </div>
          
          {/* Categories and Dishes Grid */}
          <div className="lg:grid lg:grid-cols-10 gap-4">
            {/* Categories Sidebar */}
            <div className="lg:col-span-2 mb-4 lg:mb-0">
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Categories</h3>
                <div className="lg:space-y-1 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
                  {gettype().map((catName: DishTypeInfo, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentDish(catName.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap lg:whitespace-normal text-sm ${
                        currentDish === catName.name
                          ? "bg-rose-500 text-white shadow-md"
                          : "bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600 shadow-sm"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{catName.name}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          currentDish === catName.name 
                            ? "bg-white/20 text-white" 
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {catName.count}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Dishes List */}
            <div className="lg:col-span-8">
              {getDishList().length === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <div className="text-blue-600 mb-2">
                    <FluentFood24Regular className="scale-150 mx-auto" />
                  </div>
                  <p className="text-blue-800 font-medium">No dishes available in this category</p>
                  <p className="text-blue-600 text-sm mt-1">Try selecting a different category or filter</p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        </div>
      </div>
      
      {/* Order Now Button */}
      <button
        onClick={() => {
          window.location.href = `https://onelink.to/1651`;
        }}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-rose-300"
      >
        🛒 Order Now
      </button>
      
      {/* Bottom spacing for fixed button */}
      <div className="h-20"></div>
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
  const hasVariants = props.sub1 || props.sub2 || props.sub3 || props.sub4;
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-3">
      {/* Main dish info */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <VegNonVeg vegNonVeg={props.vegNonVeg === "0"} />
            <h3 className="text-base font-semibold text-gray-900 leading-tight">
              {props.name}
            </h3>
            {props.isCustomizable === "1" && (
              <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                Custom
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-rose-600">₹{props.price}</span>
          </div>
        </div>
      </div>

      {/* Variants */}
      {hasVariants && (
        <div className="border-t border-gray-100 pt-2 mt-2">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Options:</h4>
          <div className="space-y-1">
            {props.sub1 && (
              <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded text-xs">
                <span className="text-gray-700">{props.sub1}</span>
                <span className="font-semibold text-gray-900">₹{props.price1}</span>
              </div>
            )}
            {props.sub2 && (
              <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded text-xs">
                <span className="text-gray-700">{props.sub2}</span>
                <span className="font-semibold text-gray-900">₹{props.price2}</span>
              </div>
            )}
            {props.sub3 && (
              <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded text-xs">
                <span className="text-gray-700">{props.sub3}</span>
                <span className="font-semibold text-gray-900">₹{props.price3}</span>
              </div>
            )}
            {props.sub4 && (
              <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded text-xs">
                <span className="text-gray-700">{props.sub4}</span>
                <span className="font-semibold text-gray-900">₹{props.price4}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const VegNonVeg = ({ vegNonVeg }: { vegNonVeg: boolean }) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`h-5 w-5 rounded border-2 flex items-center justify-center ${
          vegNonVeg 
            ? "border-green-600 bg-green-50" 
            : "border-red-600 bg-red-50"
        }`}
      >
        <div
          className={`h-2.5 w-2.5 rounded-full ${
            vegNonVeg ? "bg-green-600" : "bg-red-600"
          }`}
        />
      </div>
    </div>
  );
};
