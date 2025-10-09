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
import { Drawer, Radio } from "antd";

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

interface CartItem {
  id: number;
  dish: ResDishInfo;
  sub: string | null;
  quantity: number;
  price: string;
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
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [cartOpen, setCartOpen] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<ResDishInfo | null>(null);

  const [userBox, setUserBox] = useState(false);

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
          <p className="text-gray-600 font-medium">
            Loading restaurant menu...
          </p>
        </div>
      </div>
    );
  }

  if (resinfo.isError || resdishinfo.isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t load the restaurant information. Please try again
            later.
          </p>
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

    let dishes: ResDishInfo[] = [];

    // If there's a search query, search across all categories
    if (searchQuery.trim()) {
      const resdishinfoData = resdishinfo.data as ResDishInfo[][];
      // Flatten all dishes from all categories
      const allDishes = resdishinfoData.flat();

      // Filter by search query first
      dishes = allDishes.filter((dish) =>
        dish.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );
    } else {
      // If no search query, get dishes from current category
      const resdishinfoData = resdishinfo.data as ResDishInfo[][];
      const currentDishData = resdishinfoData.find(
        (dish) => dish[0].catName === currentDish
      );
      dishes = currentDishData || [];
    }

    // Apply food type filter
    if (foodType === FoodType.VEG) {
      return dishes.filter((val) => val.vegNonVeg === "0");
    } else if (foodType === FoodType.NON_VEG) {
      return dishes.filter((val) => val.vegNonVeg === "1");
    }

    return dishes;
  };

  const getSearchResultsCount = (): number => {
    if (!searchQuery.trim()) return 0;
    return getDishList().length;
  };

  // Cart functions
  const addToCart = (dish: ResDishInfo, sub: string | null = null) => {
    const price = sub
      ? sub === dish.sub1
        ? dish.price1
        : sub === dish.sub2
        ? dish.price2
        : sub === dish.sub3
        ? dish.price3
        : sub === dish.sub4
        ? dish.price4
        : dish.price
      : dish.price;

    const cartItemId = Date.now();
    const newCartItem: CartItem = {
      id: cartItemId,
      dish,
      sub,
      quantity: 1,
      price: price || dish.price,
    };

    setCart((prev) => [...prev, newCartItem]);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + parseFloat(item.price) * item.quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Helper functions for dish cart management
  const getDishQuantityInCart = (dishId: string) => {
    const cartItems = cart.filter((item) => item.dish.Id === dishId);
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getSimpleDishInCart = (dishId: string) => {
    return cart.find((item) => item.dish.Id === dishId && !item.sub);
  };

  const getAnyDishInCart = (dishId: string) => {
    return cart.find((item) => item.dish.Id === dishId);
  };

  const removeDishFromCart = (dishId: string) => {
    // First try to remove simple dish
    const simpleDish = getSimpleDishInCart(dishId);
    if (simpleDish) {
      if (simpleDish.quantity > 1) {
        updateQuantity(simpleDish.id, simpleDish.quantity - 1);
      } else {
        removeFromCart(simpleDish.id);
      }
      return;
    }

    // If no simple dish, remove any variant of this dish
    const anyDish = getAnyDishInCart(dishId);
    if (anyDish) {
      if (anyDish.quantity > 1) {
        updateQuantity(anyDish.id, anyDish.quantity - 1);
      } else {
        removeFromCart(anyDish.id);
      }
    }
  };

  const addDishToCartSmart = (dish: ResDishInfo) => {
    const hasVariants = dish.sub1 || dish.sub2 || dish.sub3 || dish.sub4;

    if (hasVariants) {
      // For variant items, check if there's any variant already in cart
      const existingVariant = getAnyDishInCart(dish.Id);
      if (existingVariant && existingVariant.sub) {
        // If there's a variant in cart, increment that variant
        updateQuantity(existingVariant.id, existingVariant.quantity + 1);
      } else {
        // If no variant in cart, open variant selection
        setSelectedDish(dish);
        setVariantModalOpen(true);
      }
    } else {
      // For simple items, add or increment
      const existingItem = getSimpleDishInCart(dish.Id);
      if (existingItem) {
        updateQuantity(existingItem.id, existingItem.quantity + 1);
      } else {
        addToCart(dish);
      }
    }
  };

  const addSimpleDishToCart = (dish: ResDishInfo) => {
    const existingItem = getSimpleDishInCart(dish.Id);
    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      addToCart(dish);
    }
  };

  const handleAddToCart = (dish: ResDishInfo) => {
    const hasVariants = dish.sub1 || dish.sub2 || dish.sub3 || dish.sub4;

    if (hasVariants) {
      setSelectedDish(dish);
      setVariantModalOpen(true);
    } else {
      addSimpleDishToCart(dish);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cart Drawer */}
      <Drawer
        title={
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">Your Cart</span>
            <span className="bg-rose-500 text-white px-2 py-1 rounded-full text-sm">
              {getCartItemCount()} items
            </span>
          </div>
        }
        placement="right"
        size="large"
        onClose={() => setCartOpen(false)}
        open={cartOpen}
        footer={
          cart.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-xl font-bold text-rose-600">
                  ₹{getCartTotal().toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => {
                  console.log(userBox);
                  console.log("working");
                  // window.location.href = 'https://onelink.to/1651';
                  setUserBox(true);
                }}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600  text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform cursor-pointer"
              >
                Proceed to Checkout
              </button>
            </div>
          )
        }
      >
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M7 13l1.5 1.5M17 19a2 2 0 100-4 2 2 0 000 4zM9 19a2 2 0 100-4 2 2 0 000 4z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500 mb-4">
              Add some delicious items to get started!
            </p>
            <button
              onClick={() => setCartOpen(false)}
              className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <VegNonVeg vegNonVeg={item.dish.vegNonVeg === "0"} />
                      <h4 className="font-semibold text-gray-900">
                        {item.dish.title}
                      </h4>
                    </div>
                    {item.sub && (
                      <p className="text-sm text-gray-600 mb-1">
                        Variant: <span className="font-medium">{item.sub}</span>
                      </p>
                    )}
                    <p className="text-lg font-bold text-rose-600">
                      ₹{item.price}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="font-semibold px-3">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Subtotal</p>
                    <p className="font-bold text-gray-900">
                      ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Drawer
          title={<p className="text-lg font-bold">User Information</p>}
          placement="right"
          size="large"
          onClose={() => setUserBox(false)}
          open={userBox}
        >
          <p>User information form will go here.</p>
        </Drawer>
      </Drawer>

      {/* Variant Selection Modal */}
      <Drawer
        title={`Choose ${selectedDish?.title} Variant`}
        placement="bottom"
        onClose={() => {
          setVariantModalOpen(false);
          setSelectedDish(null);
        }}
        open={variantModalOpen}
        height={400}
      >
        {selectedDish && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <VegNonVeg vegNonVeg={selectedDish.vegNonVeg === "0"} />
              <h3 className="text-lg font-semibold">{selectedDish.title}</h3>
            </div>

            <div className="space-y-3">
              {/* Only show variants, not the base option */}
              {selectedDish.sub1 && (
                <button
                  onClick={() => {
                    addToCart(selectedDish, selectedDish.sub1);
                    setVariantModalOpen(false);
                    setSelectedDish(null);
                  }}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-rose-500 hover:bg-rose-50 transition-all text-left"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{selectedDish.sub1}</span>
                    <span className="font-bold text-rose-600">
                      ₹{selectedDish.price1}
                    </span>
                  </div>
                </button>
              )}

              {selectedDish.sub2 && (
                <button
                  onClick={() => {
                    addToCart(selectedDish, selectedDish.sub2);
                    setVariantModalOpen(false);
                    setSelectedDish(null);
                  }}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-rose-500 hover:bg-rose-50 transition-all text-left"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{selectedDish.sub2}</span>
                    <span className="font-bold text-rose-600">
                      ₹{selectedDish.price2}
                    </span>
                  </div>
                </button>
              )}

              {selectedDish.sub3 && (
                <button
                  onClick={() => {
                    addToCart(selectedDish, selectedDish.sub3);
                    setVariantModalOpen(false);
                    setSelectedDish(null);
                  }}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-rose-500 hover:bg-rose-50 transition-all text-left"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{selectedDish.sub3}</span>
                    <span className="font-bold text-rose-600">
                      ₹{selectedDish.price3}
                    </span>
                  </div>
                </button>
              )}

              {selectedDish.sub4 && (
                <button
                  onClick={() => {
                    addToCart(selectedDish, selectedDish.sub4);
                    setVariantModalOpen(false);
                    setSelectedDish(null);
                  }}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-rose-500 hover:bg-rose-50 transition-all text-left"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{selectedDish.sub4}</span>
                    <span className="font-bold text-rose-600">
                      ₹{selectedDish.price4}
                    </span>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
      </Drawer>
      <div className="px-4 mx-auto pt-4">
        {/* Restaurant Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-rose-50 rounded-full">
              <FluentBuildingShop20Regular className="scale-125 text-rose-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {resinfo.data.name}
            </h1>
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
          {/* Desktop Layout */}
          <div className="hidden lg:flex lg:items-center justify-between gap-4 mb-4">
            {/* Menu Title (Left) */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-full">
                <FluentFood24Regular className="scale-125 text-orange-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Menu</h2>
            </div>

            {/* VEG/NON-VEG Filter (Center) */}
            <div className="flex justify-center">
              <Radio.Group
                options={options}
                value={foodType}
                optionType="button"
                buttonStyle="solid"
                onChange={(value) => {
                  setFoodType(value.target.value as FoodType);
                }}
                className="mx-auto rounded-lg p-1 "
              />
            </div>

            {/* Search Bar (Right) */}
            <div className="flex justify-end">
              <div className="relative w-full max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg
                      className="h-4 w-4 text-gray-400 hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden mb-4">
            {/* Menu Title with VEG/NON-VEG Filter */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-full">
                  <FluentFood24Regular className="scale-125 text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
              </div>

              {/* VEG/NON-VEG Filter - Right side on Mobile */}
              <div className="flex-shrink-0">
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
            </div>

            {/* Search Bar - Full Width on Mobile */}
            <div className="mb-4">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Categories and Dishes Grid */}
          <div className="lg:grid lg:grid-cols-10 gap-4">
            {/* Categories Sidebar */}
            <div className="lg:col-span-2 mb-4 lg:mb-0">
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                  Categories
                </h3>
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
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full ${
                            currentDish === catName.name
                              ? "bg-white/20 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
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
              {/* Search Results Header */}
              {searchQuery.trim() && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Search results for &ldquo;{searchQuery}&rdquo;
                      </p>
                      <p className="text-xs text-gray-600">
                        {getSearchResultsCount()} dish
                        {getSearchResultsCount() !== 1 ? "es" : ""} found
                      </p>
                    </div>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-sm text-rose-600 hover:text-rose-800 font-medium"
                    >
                      Clear search
                    </button>
                  </div>
                </div>
              )}

              {getDishList().length === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <div className="text-blue-600 mb-2">
                    <FluentFood24Regular className="scale-150 mx-auto" />
                  </div>
                  {searchQuery.trim() ? (
                    <>
                      <p className="text-blue-800 font-medium">
                        No dishes found for &ldquo;{searchQuery}&rdquo;
                      </p>
                      <p className="text-blue-600 text-sm mt-1">
                        Try a different search term or clear the search to
                        browse categories
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-blue-800 font-medium">
                        No dishes available in this category
                      </p>
                      <p className="text-blue-600 text-sm mt-1">
                        Try selecting a different category or filter
                      </p>
                    </>
                  )}
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
                    searchQuery={searchQuery}
                    category={dish.catName}
                    onAddToCart={handleAddToCart}
                    cart={cart}
                    onAddSmart={addDishToCartSmart}
                    onRemoveSmart={removeDishFromCart}
                    getAnyDishInCart={getAnyDishInCart}
                    getDishQuantityInCart={getDishQuantityInCart}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Button */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-rose-300"
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M7 13l1.5 1.5M17 19a2 2 0 100-4 2 2 0 000 4zM9 19a2 2 0 100-4 2 2 0 000 4z"
            />
          </svg>
          <span>Cart</span>
        </div>
        {getCartItemCount() > 0 && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {getCartItemCount()}
          </div>
        )}
      </button>

      {/* Bottom spacing for fixed button */}
      <div className="h-20"></div>
    </div>
  );
};

export default RestaurentDish;

interface DishItemProps {
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
  searchQuery?: string;
  category?: string;
  onAddToCart?: (dish: ResDishInfo) => void;
  cart: CartItem[];
  onAddSmart: (dish: ResDishInfo) => void;
  onRemoveSmart: (dishId: string) => void;
  getAnyDishInCart: (dishId: string) => CartItem | undefined;
  getDishQuantityInCart: (dishId: string) => number;
}

const DishItem = (props: DishItemProps) => {
  const hasVariants = props.sub1 || props.sub2 || props.sub3 || props.sub4;

  // Function to highlight search terms
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const dishData: ResDishInfo = {
    Id: props.id.toString(),
    catName: props.category || "",
    title: props.name,
    price: props.price,
    vegNonVeg: props.vegNonVeg,
    isCustomizable: props.isCustomizable,
    price1: props.price1,
    price2: props.price2,
    price3: props.price3,
    price4: props.price4,
    sub1: props.sub1,
    sub2: props.sub2,
    sub3: props.sub3,
    sub4: props.sub4,
  };

  const cartItem = props.getAnyDishInCart(props.id.toString());
  const totalQuantity = props.getDishQuantityInCart(props.id.toString());

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-3">
      {/* Main dish info */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <VegNonVeg vegNonVeg={props.vegNonVeg === "0"} />
            <h3 className="text-base font-semibold text-gray-900 leading-tight">
              {props.searchQuery
                ? highlightSearchTerm(props.name, props.searchQuery)
                : props.name}
            </h3>
            {props.isCustomizable === "1" && (
              <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                Custom
              </span>
            )}
          </div>
          {/* Show category when searching */}
          {props.searchQuery && props.category && (
            <div className="mb-1">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {props.category}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-rose-600">
              ₹{props.price}
            </span>
            {/* Show +/- buttons if any variant of this item is in cart, otherwise show Add button */}
            {cartItem ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => props.onRemoveSmart(props.id.toString())}
                  className="w-8 h-8 flex items-center justify-center border border-rose-500 text-rose-500 rounded-full hover:bg-rose-50 transition-colors"
                >
                  -
                </button>
                <span className="font-semibold px-2 min-w-[2rem] text-center">
                  {totalQuantity}
                </span>
                <button
                  onClick={() => props.onAddSmart(dishData)}
                  className="w-8 h-8 flex items-center justify-center border border-rose-500 text-rose-500 rounded-full hover:bg-rose-50 transition-colors"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={() => props.onAddToCart?.(dishData)}
                className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add
              </button>
            )}
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
                <span className="font-semibold text-gray-900">
                  ₹{props.price1}
                </span>
              </div>
            )}
            {props.sub2 && (
              <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded text-xs">
                <span className="text-gray-700">{props.sub2}</span>
                <span className="font-semibold text-gray-900">
                  ₹{props.price2}
                </span>
              </div>
            )}
            {props.sub3 && (
              <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded text-xs">
                <span className="text-gray-700">{props.sub3}</span>
                <span className="font-semibold text-gray-900">
                  ₹{props.price3}
                </span>
              </div>
            )}
            {props.sub4 && (
              <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded text-xs">
                <span className="text-gray-700">{props.sub4}</span>
                <span className="font-semibold text-gray-900">
                  ₹{props.price4}
                </span>
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
