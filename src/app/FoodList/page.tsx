"use client";
import LeftSidebar from "@/Components/LeftSidebar";
import { useRouter } from "next/navigation";
import axios from "axios";
import React from "react";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Modal, Space } from "antd";
import { ToastContainer, toast } from "react-toastify";
import {
  BothHotelMenuOptions,
  VegHotelMenuOptions,
  NonVegHotelMenuOptions,
} from "@/FoodItems/Food";
import Select from "react-select";
import { useUser } from "@clerk/nextjs";
import "react-toastify/dist/ReactToastify.css";
const page = () => {
  const { user } = useUser();
  const userEamil = user && user.emailAddresses[0].emailAddress;
  const router = useRouter();
  const [food, setfood] = React.useState([]);
  const [open, setopen] = React.useState(false);
  const [loading, setloading] = React.useState(false);
  const [selectedFoodType, setSelectedFoodType] = React.useState("MainCourse");
  const [FoodSerch, setFoodSerch] = React.useState("");
  const [data, setdata] = React.useState({
    id: "",
    vegorNonveg: "",
    FoodType: "",
    FoodName: "",
    FoodPrice: "",
    FoodImage: "",
  });

  //get all of food  function
  const getdata = async () => {
    try {
      if (userEamil) {
        setloading(true);
        const response = await axios.get("/api/Admin/Food", {
          headers: {
            Email: userEamil,
            foodType: `${selectedFoodType}`,
            Search: FoodSerch,
          },
        });
        if (!response.data.success) {
          toast.error(`${response.data.error}`);
        } else {
          setfood(response.data.foodItems);
          console.log(response.data.foodItems);
          //toast.success(`${response.data.message}`);
        }
      }
    } catch (error: any) {
      console.log("Error while getting data", error);
      //toast.error(error.message);
    } finally {
      setloading(false);
    }
  };
  //delete function for food
  const DeleteFood = async (id: string) => {
    try {
      const response = await axios.delete("/api/Admin/Food", {
        headers: {
          Foodid: `${id}`,
        },
      });
      if (!response.data.success) {
        toast.error(`${response.data.error}`);
      } else {
        toast.success(
          `${response.data.food.FoodName}  ${response.data.message}`
        );
        getdata();
      }
    } catch (error: any) {
      console.log("Error while Deleting product", error);
      toast.error(error.message);
    }
  };
  //edit function for food
  const HandleEidt = async () => {
    try {
      console.log(data);
      const response = await axios.put("/api/Admin/Food", data, {
        headers: {
          Email: userEamil,
          Search: FoodSerch,
        },
      });
      if (!response.data.success) {
        response?.data?.error.forEach((message: string) => {
          toast.error(message);
        });
      } else {
        toast.success(`${response.data.message}`);
        setopen(false);
        getdata();
      }
    } catch (error: any) {
      console.log("Error while editing product", error);
      toast.error(error.message);
    }
  };
  const { confirm } = Modal;
  const showDeleteConfirm = (id: string) => {
    confirm({
      title: "Are you sure delete this food Item?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        DeleteFood(id);
      },
    });
  };

  const handleFoodTypeChange = (event: any) => {
    setSelectedFoodType(event.target.value);
  };

  React.useEffect(() => {
    getdata();
  }, [selectedFoodType, userEamil, FoodSerch]);

  return (
    <div className="flex-1 flex">
      <LeftSidebar />

      <div className="text-gray-600 body-font bg-yellow-50 flex-1 p-3">
        <div className="flex flex-wrap gap-1 md:gap-3 xl:gap-5">
          {" "}
          <div className="w-[11rem] mb-8">
            <label
              htmlFor="manufacturer"
              className="text-sm font-medium text-stone-600"
            >
              Select Food type
            </label>
            <select
              id="manufacturer"
              className="mt-2 block w-full rounded-md border border-gray-100 bg-gray-100 px-2 py-2 shadow-sm outline-none focus:border-yellow-500 focus:ring focus:yellow-blue-200 focus:ring-opacity-50"
              onChange={handleFoodTypeChange} // Attach onChange event handler
              value={selectedFoodType}
            >
              <option value="MainCourse">Main Course</option>
              <option value="starters">Starters</option>
              <option value="desserts">Desserts</option>
              <option value="Roti">Roti</option>
              <option value="Rice">Rice</option>
            </select>
          </div>
          <div className="text-gray-600 mb-10 flex flex-col">
            <label
              htmlFor="manufacturer"
              className="text-sm font-medium ml-1 text-stone-600 "
            >
              Search for Food
            </label>
            <input
              className="border-2 mt-3 border-gray-300 bg-white h-10 px-5 pr-16 w-[13rem] rounded-lg text-sm focus:outline-none"
              type="search"
              name="search"
              placeholder="Search"
              onChange={(e) => setFoodSerch(e.target.value)}
            />
          </div>
        </div>
        {loading ? (
          <>
            <div className="">
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-warning motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            {" "}
            <div className="container  mx-auto">
              <div className="flex flex-wrap -m-4">
                {food.length > 0 ? (
                  <>
                    {food.map((food: any) => (
                      <div
                        className="lg:w-1/4 md:w-1/2 p-4 w-full rounded-xl shadow-xl border"
                        key={food._id}
                      >
                        <a className="block relative h-48 rounded overflow-hidden">
                          <img
                            alt="ecommerce"
                            className="object-cover object-center w-full h-full block hover:scale-125 transition duration-500 cursor-pointer "
                            src={food.FoodImage}
                          />
                        </a>
                        <div className="flex justify-between p-2">
                          <div>
                            <div className="mt-4">
                              <h3 className="text-gray-700 text-xs tracking-widest title-font mb-1">
                                {food.vegorNonveg}
                              </h3>
                              <h3 className="text-gray-700 text-sm tracking-widest title-font mb-1">
                                {food.FoodType}
                              </h3>
                              <h2 className="text-gray-900 title-font text-lg font-medium">
                                {food.FoodName}
                              </h2>
                              <p className="mt-1">₹{food.FoodPrice}</p>
                            </div>
                          </div>
                          {open && (
                            <div className="main-modal fixed w-full h-100 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster bg-inherit">
                              <div className="border border-teal-500 shadow-lg modal-container bg-white w-11/12 md:max-w-md mx-auto rounded  z-50 overflow-y-auto">
                                <div className="modal-content py-4 text-left px-6">
                                  {/*Title*/}
                                  <div className="flex justify-between items-center pb-3">
                                    <p className="text-2xl font-bold">
                                      Edit your Food item
                                    </p>
                                    <div
                                      className="modal-close cursor-pointer z-50"
                                      onClick={() => setopen(false)}
                                    >
                                      <svg
                                        className="fill-current text-black"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={18}
                                        height={18}
                                        viewBox="0 0 18 18"
                                      >
                                        <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                                      </svg>
                                    </div>
                                  </div>
                                  {/*Body*/}
                                  <div className="my-5">
                                    <div>
                                      <div className="mt-4">
                                        <label
                                          className="block text-sm font-medium text-gray-800 dark:text-gray-400"
                                          htmlFor="vegorNonveg"
                                        >
                                          veg or Non-veg
                                        </label>
                                        <input
                                          disabled
                                          className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                                          id="vegorNonveg"
                                          type="text"
                                          name="veg or Non-veg"
                                          required
                                          value={data.vegorNonveg}
                                          onChange={(e) =>
                                            setdata({
                                              ...data,
                                              vegorNonveg: e.target.value,
                                            })
                                          }
                                        />
                                      </div>

                                      <div className="mt-4">
                                        <label
                                          className="block text-sm font-medium text-gray-800 dark:text-gray-400"
                                          htmlFor="FoodType"
                                        >
                                          Food price
                                        </label>
                                        <input
                                          disabled
                                          className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                                          id="FoodType"
                                          type="text"
                                          name="FoodType"
                                          required
                                          value={data.FoodType}
                                          onChange={(e) =>
                                            setdata({
                                              ...data,
                                              FoodType: e.target.value,
                                            })
                                          }
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
                                            {data.FoodType === "MainCourse" ? (
                                              <Select
                                                defaultInputValue={
                                                  data.FoodName
                                                }
                                                className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1 "
                                                onChange={(e) =>
                                                  setdata({
                                                    ...data,
                                                    FoodName: e?.value!,
                                                  })
                                                }
                                                options={
                                                  VegHotelMenuOptions.MainCourse
                                                }
                                              />
                                            ) : data.FoodType === "starters" ? (
                                              <Select
                                                defaultInputValue={
                                                  data.FoodName
                                                }
                                                className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                                                onChange={(e) =>
                                                  setdata({
                                                    ...data,
                                                    FoodName: e?.value!,
                                                  })
                                                }
                                                options={
                                                  VegHotelMenuOptions.starters
                                                }
                                              />
                                            ) : data.FoodType === "desserts" ? (
                                              <Select
                                                defaultInputValue={
                                                  data.FoodName
                                                }
                                                className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                                                onChange={(e) =>
                                                  setdata({
                                                    ...data,
                                                    FoodName: e?.value!,
                                                  })
                                                }
                                                options={
                                                  VegHotelMenuOptions.Desserts
                                                }
                                              />
                                            ) : data.FoodType === "Roti" ? (
                                              <Select
                                                defaultInputValue={
                                                  data.FoodName
                                                }
                                                className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                                                onChange={(e) =>
                                                  setdata({
                                                    ...data,
                                                    FoodName: e?.value!,
                                                  })
                                                }
                                                options={
                                                  VegHotelMenuOptions.Roti
                                                }
                                              />
                                            ) : data.FoodType === "Rice" ? (
                                              <Select
                                                defaultInputValue={
                                                  data.FoodName
                                                }
                                                className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                                                onChange={(e) =>
                                                  setdata({
                                                    ...data,
                                                    FoodName: e?.value!,
                                                  })
                                                }
                                                options={
                                                  VegHotelMenuOptions.Rice
                                                }
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
                                                defaultInputValue={
                                                  data.FoodName
                                                }
                                                className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1 "
                                                onChange={(e) =>
                                                  setdata({
                                                    ...data,
                                                    FoodName: e?.value!,
                                                  })
                                                }
                                                options={
                                                  BothHotelMenuOptions.MainCourse
                                                }
                                              />
                                            ) : data.FoodType === "starters" ? (
                                              <Select
                                                defaultInputValue={
                                                  data.FoodName
                                                }
                                                className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                                                onChange={(e) =>
                                                  setdata({
                                                    ...data,
                                                    FoodName: e?.value!,
                                                  })
                                                }
                                                options={
                                                  BothHotelMenuOptions.starters
                                                }
                                              />
                                            ) : data.FoodType === "desserts" ? (
                                              <Select
                                                defaultInputValue={
                                                  data.FoodName
                                                }
                                                className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                                                onChange={(e) =>
                                                  setdata({
                                                    ...data,
                                                    FoodName: e?.value!,
                                                  })
                                                }
                                                options={
                                                  BothHotelMenuOptions.Desserts
                                                }
                                              />
                                            ) : data.FoodType === "Roti" ? (
                                              <Select
                                                defaultInputValue={
                                                  data.FoodName
                                                }
                                                className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                                                onChange={(e) =>
                                                  setdata({
                                                    ...data,
                                                    FoodName: e?.value!,
                                                  })
                                                }
                                                options={
                                                  BothHotelMenuOptions.Roti
                                                }
                                              />
                                            ) : data.FoodType === "Rice" ? (
                                              <Select
                                                defaultInputValue={
                                                  data.FoodName
                                                }
                                                className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                                                onChange={(e) =>
                                                  setdata({
                                                    ...data,
                                                    FoodName: e?.value!,
                                                  })
                                                }
                                                options={
                                                  BothHotelMenuOptions.Rice
                                                }
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
                                                  setdata({
                                                    ...data,
                                                    FoodName: e?.value!,
                                                  })
                                                }
                                                options={
                                                  NonVegHotelMenuOptions.MainCourse
                                                }
                                              />
                                            ) : data.FoodType === "starters" ? (
                                              <Select
                                                className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                                                onChange={(e) =>
                                                  setdata({
                                                    ...data,
                                                    FoodName: e?.value!,
                                                  })
                                                }
                                                options={
                                                  NonVegHotelMenuOptions.starters
                                                }
                                              />
                                            ) : data.FoodType === "desserts" ? (
                                              <Select
                                                className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                                                onChange={(e) =>
                                                  setdata({
                                                    ...data,
                                                    FoodName: e?.value!,
                                                  })
                                                }
                                                options={
                                                  NonVegHotelMenuOptions.Desserts
                                                }
                                              />
                                            ) : data.FoodType === "Roti" ? (
                                              <Select
                                                className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                                                onChange={(e) =>
                                                  setdata({
                                                    ...data,
                                                    FoodName: e?.value!,
                                                  })
                                                }
                                                options={
                                                  NonVegHotelMenuOptions.Roti
                                                }
                                              />
                                            ) : data.FoodType === "Rice" ? (
                                              <Select
                                                className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                                                onChange={(e) =>
                                                  setdata({
                                                    ...data,
                                                    FoodName: e?.value!,
                                                  })
                                                }
                                                options={
                                                  NonVegHotelMenuOptions.Rice
                                                }
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
                                            setdata({
                                              ...data,
                                              FoodPrice: e.target.value,
                                            })
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
                                          id="Food Image"
                                          type="text"
                                          name="Food Image"
                                          placeholder="Food Image URL"
                                          required
                                          value={data.FoodImage}
                                          onChange={(e) =>
                                            setdata({
                                              ...data,
                                              FoodImage: e.target.value,
                                            })
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  {/*Footer*/}
                                  <div className="flex justify-end pt-2">
                                    <button
                                      className="focus:outline-none modal-close px-4 bg-gray-400 p-3 rounded-lg text-black hover:bg-gray-300"
                                      onClick={() => setopen(false)}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      className="focus:outline-none px-4 bg-teal-500 p-3 ml-3 rounded-lg text-white hover:bg-teal-400"
                                      onClick={() => HandleEidt()}
                                    >
                                      Confirm
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          <Space wrap>
                            <div className="flex flex-col gap-4 mt-[1.7rems] px-2 py-5">
                              <Button
                                type="text"
                                className="text-white text-sm  bg-green-600"
                                //onClick={(e: any) => console.log(food)}
                                onClick={() => {
                                  setdata({
                                    id: food._id,
                                    vegorNonveg: food.vegorNonveg,
                                    FoodType: food.FoodType,
                                    FoodName: food.FoodName,
                                    FoodPrice: food.FoodPrice,
                                    FoodImage: food.FoodImage,
                                  }),
                                    setopen(true);
                                }}
                              >
                                Edit
                              </Button>

                              <Button
                                type="text"
                                className=" text-white text-sm  bg-red-600"
                                onClick={() => showDeleteConfirm(food._id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </Space>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="ml-10 font-bold text-2xl">
                      <h1>Food Not Found...!🙄 </h1>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default page;
