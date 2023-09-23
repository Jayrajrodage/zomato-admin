"use client";
import LeftSidebar from "@/Components/LeftSidebar";
import React, { FormEvent } from "react";
//import { Select } from "antd";
import Select from "react-select";
import { useUser } from "@clerk/nextjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BothHotelMenuOptions,
  VegHotelMenuOptions,
  NonVegHotelMenuOptions,
} from "@/FoodItems/Food";
import axios from "axios";

const page = () => {
  const { user } = useUser();

  const userEamil = user && user.emailAddresses[0].emailAddress;
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [data, setdata] = React.useState({
    vegorNonveg: "",
    FoodType: "",
    FoodName: "",
    FoodPrice: "",
    FoodImage: "",
  });

  const CreateFunction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setButtonDisabled(true);
      const response = await axios.post("/api/Admin/AddFood", data, {
        headers: {
          Email: userEamil,
        },
      });
      if (!response.data.success) {
        if (response.data.error === "Food already exists") {
          toast.error(`${response.data.error}`);
        } else {
          response?.data?.error.forEach((message: string) => {
            toast.error(message);
          });
        }
      } else {
        toast.success(`${response.data.message}`);
        setdata({
          vegorNonveg: "",
          FoodType: "",
          FoodName: "",
          FoodPrice: "",
          FoodImage: "",
        });
      }
    } catch (error: any) {
      console.log("Error while Creating FOOD", error);
      toast.error(error.message);
    } finally {
      setButtonDisabled(false);
    }
  };
  return (
    <div className="flex flex-1  bg-yellow-50">
      <LeftSidebar />
      <div className="w-full">
        <div className="flex flex-col items-center sm:justify-center mt-5">
          <div className="w-full overflow-hidden rounded-xl shadow-xl  bg-white p-8 dark:bg-gray-800 sm:max-w-md sm:rounded-lg">
            <div className="flex items-center justify-center">
              <h1 className="text-xl font-bold mb-5">Create Your Menu</h1>
            </div>

            <form onSubmit={CreateFunction}>
              <div>
                <label
                  className="block text-sm font-medium text-gray-800 dark:text-gray-400"
                  htmlFor="Veg or Non-veg"
                >
                  Veg or Non-veg
                </label>
                <Select
                  placeholder=" Veg or Non-veg or both"
                  className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                  onChange={(e) => setdata({ ...data, vegorNonveg: e?.value! })}
                  options={[
                    {
                      value: "Pure-veg",
                      label: "Pure-veg",
                    },
                    {
                      value: "Non-veg",
                      label: "Non-veg",
                    },
                    ,
                    {
                      value: "Both",
                      label: "Both",
                    },
                  ]}
                />
              </div>
              <div className="mt-4">
                <label
                  className="block text-sm font-medium text-gray-800 dark:text-gray-400"
                  htmlFor="Restaurant Name"
                >
                  Food Type
                </label>
                <Select
                  className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                  onChange={(e) => setdata({ ...data, FoodType: e?.value! })}
                  options={[
                    {
                      value: "MainCourse",
                      label: "MainCourse",
                    },
                    {
                      value: "starters",
                      label: "starters",
                    },
                    {
                      value: "desserts",
                      label: "desserts",
                    },
                    {
                      value: "Roti",
                      label: "Roti",
                    },
                    {
                      value: "Rice",
                      label: "Rice",
                    },
                  ]}
                />
              </div>
              <div className="mt-4">
                <label
                  className="block text-sm font-medium text-gray-800 dark:text-gray-400 z-50"
                  htmlFor="Select Dish"
                >
                  Select Dish
                </label>
                {data.vegorNonveg === "Pure-veg" ? (
                  <>
                    {" "}
                    {data.FoodType === "MainCourse" ? (
                      <Select
                        className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1 "
                        onChange={(e) =>
                          setdata({ ...data, FoodName: e?.value! })
                        }
                        options={VegHotelMenuOptions.MainCourse}
                      />
                    ) : data.FoodType === "starters" ? (
                      <Select
                        className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                        onChange={(e) =>
                          setdata({ ...data, FoodName: e?.value! })
                        }
                        options={VegHotelMenuOptions.starters}
                      />
                    ) : data.FoodType === "desserts" ? (
                      <Select
                        className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                        onChange={(e) =>
                          setdata({ ...data, FoodName: e?.value! })
                        }
                        options={VegHotelMenuOptions.Desserts}
                      />
                    ) : data.FoodType === "Roti" ? (
                      <Select
                        className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                        onChange={(e) =>
                          setdata({ ...data, FoodName: e?.value! })
                        }
                        options={VegHotelMenuOptions.Roti}
                      />
                    ) : data.FoodType === "Rice" ? (
                      <Select
                        className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                        onChange={(e) =>
                          setdata({ ...data, FoodName: e?.value! })
                        }
                        options={VegHotelMenuOptions.Rice}
                      />
                    ) : (
                      <select
                        className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                        placeholder="Please Select Food type"
                      ></select>
                    )}
                  </>
                ) : data.vegorNonveg === "Both" ? (
                  <>
                    {data.FoodType === "MainCourse" ? (
                      <Select
                        className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1 "
                        onChange={(e) =>
                          setdata({ ...data, FoodName: e?.value! })
                        }
                        options={BothHotelMenuOptions.MainCourse}
                      />
                    ) : data.FoodType === "starters" ? (
                      <Select
                        className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                        onChange={(e) =>
                          setdata({ ...data, FoodName: e?.value! })
                        }
                        options={BothHotelMenuOptions.starters}
                      />
                    ) : data.FoodType === "desserts" ? (
                      <Select
                        className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                        onChange={(e) =>
                          setdata({ ...data, FoodName: e?.value! })
                        }
                        options={BothHotelMenuOptions.Desserts}
                      />
                    ) : data.FoodType === "Roti" ? (
                      <Select
                        className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                        onChange={(e) =>
                          setdata({ ...data, FoodName: e?.value! })
                        }
                        options={BothHotelMenuOptions.Roti}
                      />
                    ) : data.FoodType === "Rice" ? (
                      <Select
                        className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                        onChange={(e) =>
                          setdata({ ...data, FoodName: e?.value! })
                        }
                        options={BothHotelMenuOptions.Rice}
                      />
                    ) : (
                      <select
                        className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                        placeholder="Please Select Food type"
                      ></select>
                    )}
                  </>
                ) : (
                  <>
                    {data.FoodType === "MainCourse" ? (
                      <Select
                        className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1 "
                        onChange={(e) =>
                          setdata({ ...data, FoodName: e?.value! })
                        }
                        options={NonVegHotelMenuOptions.MainCourse}
                      />
                    ) : data.FoodType === "starters" ? (
                      <Select
                        className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                        onChange={(e) =>
                          setdata({ ...data, FoodName: e?.value! })
                        }
                        options={NonVegHotelMenuOptions.starters}
                      />
                    ) : data.FoodType === "desserts" ? (
                      <Select
                        className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                        onChange={(e) =>
                          setdata({ ...data, FoodName: e?.value! })
                        }
                        options={NonVegHotelMenuOptions.Desserts}
                      />
                    ) : data.FoodType === "Roti" ? (
                      <Select
                        className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                        onChange={(e) =>
                          setdata({ ...data, FoodName: e?.value! })
                        }
                        options={NonVegHotelMenuOptions.Roti}
                      />
                    ) : data.FoodType === "Rice" ? (
                      <Select
                        className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                        onChange={(e) =>
                          setdata({ ...data, FoodName: e?.value! })
                        }
                        options={NonVegHotelMenuOptions.Rice}
                      />
                    ) : (
                      <select
                        className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                        placeholder="Please Select Food type"
                      ></select>
                    )}
                  </>
                )}
              </div>
              <div className="mt-4">
                <label
                  className="block text-sm font-medium text-gray-800 dark:text-gray-400"
                  htmlFor="Food price"
                >
                  Food price
                </label>
                <input
                  className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                  id="Food price"
                  type="text"
                  name="Food price"
                  placeholder="400"
                  required
                  value={data.FoodPrice}
                  onChange={(e) =>
                    setdata({ ...data, FoodPrice: e.target.value })
                  }
                />
              </div>
              <div className="mt-4">
                <label
                  className="block text-sm font-medium text-gray-800 dark:text-gray-400"
                  htmlFor="Food Image"
                >
                  Food Image URL
                </label>
                <input
                  className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                  id="Food price"
                  type="text"
                  name="Food Image URL"
                  placeholder="Food Image URL"
                  required
                  value={data.FoodImage}
                  onChange={(e) =>
                    setdata({ ...data, FoodImage: e.target.value })
                  }
                />
              </div>

              <div className="mt-4 flex items-center justify-center">
                <button
                  type="submit"
                  disabled={buttonDisabled}
                  className="ml-4 inline-flex items-center rounded-lg  p-4 text-xs font-bold bg-gradient-to-b from-yellow-200 to-yellow-300 hover:to-red-300 active:from-yellow-400 focus:from-red-400"
                >
                  {buttonDisabled ? "loading" : "Submit"}
                </button>
              </div>
            </form>
          </div>

          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default page;
