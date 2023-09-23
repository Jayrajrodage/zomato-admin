"use client";
import LeftSidebar from "@/Components/LeftSidebar";
import axios from "axios";
import React, { FormEvent } from "react";
import { useUser } from "@clerk/nextjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const page = () => {
  const { user } = useUser();
  const userEamil = user && user.emailAddresses[0].emailAddress;
  const [data, setdata] = React.useState({
    RestaurantName: "",
    RestaurantType: "",
    Restaurantemail: "",
    Restaurantphone: "",
    Restaurantaddress: "",
    RestaurantImage: "",
  });
  const [Edit, setEdit] = React.useState(false);

  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const getdata = async () => {
    try {
      if (userEamil) {
        const response = await axios.get("/api/Admin/Profile", {
          headers: {
            Email: userEamil,
          },
        });
        if (!response.data.success) {
          toast.error(`${response.data.error}`);
        } else {
          setdata(response.data.user);
          console.log(response.data.user);
          //toast.success(`${response.data.message}`);
        }
      }
    } catch (error: any) {
      console.log("Error while getting data", error);
      toast.error(error.message);
    }
  };
  const EditFunction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setButtonDisabled(true);
    try {
      const response = await axios.put("/api/Admin/EditProfile", data);
      if (!response.data.success) {
        if (response.data.error === "Restaurant Not Found") {
          toast.error(`${response.data.error}`);
        } else {
          response?.data?.error.forEach((message: string) => {
            toast.error(message);
          });
        }
      } else {
        toast.success(`${response.data.message}`);
        localStorage.setItem(
          "Restaurantemail",
          `${response.data.savedRestaurant.Restaurantemail}`
        );

        setEdit(false);
        getdata();
      }
    } catch (error: any) {
      console.log("Error while Updating data", error);
      toast.error(error.message);
    } finally {
      setButtonDisabled(false);
    }
  };
  React.useEffect(() => {
    getdata();
  }, [userEamil]);
  return (
    <div className="flex flex-1">
      <LeftSidebar />
      {Edit ? (
        <div className="w-full bg-yellow-50">
          <div className="flex  flex-col items-center sm:justify-center mt-5">
            <div className="w-full overflow-hidden rounded-xl shadow-xl  bg-white p-8 dark:bg-gray-800 sm:max-w-md sm:rounded-lg">
              <div className="flex justify-end">
                <div
                  onClick={() => setEdit(false)}
                  className="cursor-pointer hover:underline "
                >
                  ❎
                </div>
              </div>
              <div className="flex items-center justify-center">
                <h1 className="text-xl font-bold mb-5">
                  Edit Restaurant Profile
                </h1>
              </div>

              <form onSubmit={EditFunction}>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-800 dark:text-gray-400"
                    htmlFor="Restaurant Name"
                  >
                    Restaurant Name
                  </label>
                  <input
                    className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                    id="Restaurant Name"
                    type="text"
                    name="Restaurant Name"
                    placeholder="Restaurant Name"
                    required
                    value={data.RestaurantName}
                    onChange={(e) =>
                      setdata({ ...data, RestaurantName: e.target.value })
                    }
                  />
                </div>
                <div className="mt-4">
                  <label
                    className="block text-sm font-medium text-gray-800 dark:text-gray-400"
                    htmlFor="Restaurant Name"
                  >
                    Restaurant Type
                  </label>
                  <input
                    className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                    id="Restaurant Type"
                    type="text"
                    name="Restaurant Type"
                    placeholder="Pure veg / Non-veg / Bar"
                    required
                    value={data.RestaurantType}
                    onChange={(e) =>
                      setdata({ ...data, RestaurantType: e.target.value })
                    }
                  />
                </div>
                <div className="mt-4">
                  <label
                    className="block text-sm font-medium text-gray-800 dark:text-gray-400"
                    htmlFor="email"
                  >
                    Restaurant Email
                  </label>
                  <input
                    className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300 hover:focus:border-gray-700 hover:border-gray-300 focus:ring-0 text-sm mt-1 "
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Your email address"
                    required
                    value={userEamil!}
                    disabled
                  />
                </div>
                <div className="mt-4">
                  <label
                    className="block text-sm font-medium text-gray-800 dark:text-gray-400"
                    htmlFor="Phone"
                  >
                    Restaurant Phone
                  </label>
                  <input
                    className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1 "
                    id="Phone"
                    type="text"
                    name="Phone"
                    placeholder="Phone number"
                    required
                    value={data.Restaurantphone}
                    onChange={(e) =>
                      setdata({ ...data, Restaurantphone: e.target.value })
                    }
                  />
                </div>
                <div className="mt-4">
                  <label
                    className="block text-sm font-medium text-gray-800 dark:text-gray-400"
                    htmlFor="Address"
                  >
                    Restaurant Address
                  </label>
                  <input
                    className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1 "
                    id="Address"
                    type="text"
                    name="Address"
                    placeholder="Address"
                    required
                    value={data.Restaurantaddress}
                    onChange={(e) =>
                      setdata({ ...data, Restaurantaddress: e.target.value })
                    }
                  />
                </div>{" "}
                <div className="mt-4">
                  <label
                    className="block text-sm font-medium text-gray-800 dark:text-gray-400"
                    htmlFor="Image"
                  >
                    Restaurant Image
                  </label>
                  <input
                    className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1 "
                    id="Image"
                    type="text"
                    name="Image"
                    placeholder="Restaurant Image URL"
                    required
                    value={data.RestaurantImage}
                    onChange={(e) =>
                      setdata({ ...data, RestaurantImage: e.target.value })
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
          </div>
        </div>
      ) : (
        <>
          <div className="w-full bg-yellow-50">
            <div className="flex  flex-col items-center sm:justify-center mt-5">
              <div className="w-full overflow-hidden rounded-xl shadow-xl  bg-white p-8 dark:bg-gray-800 sm:max-w-md sm:rounded-lg">
                <div className="flex justify-end">
                  <div
                    onClick={() => setEdit(true)}
                    className="  cursor-pointer hover:underline"
                  >
                    Edit✏️
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <h1 className="text-xl font-bold mb-5 mt-3">
                    Restaurant Profile Information
                  </h1>
                </div>

                <form>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-800 dark:text-gray-400"
                      htmlFor="Restaurant Name"
                    >
                      Restaurant Name
                    </label>
                    <input
                      className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                      id="Restaurant Name"
                      type="text"
                      name="Restaurant Name"
                      placeholder="Restaurant Name"
                      required
                      value={data.RestaurantName}
                    />
                  </div>
                  <div className="mt-4">
                    <label
                      className="block text-sm font-medium text-gray-800 dark:text-gray-400"
                      htmlFor="Restaurant Name"
                    >
                      Restaurant Type
                    </label>
                    <input
                      className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                      id="Restaurant Type"
                      type="text"
                      name="Restaurant Type"
                      placeholder="Pure veg / Non-veg / Bar"
                      required
                      value={data.RestaurantType}
                    />
                  </div>
                  <div className="mt-4">
                    <label
                      className="block text-sm font-medium text-gray-800 dark:text-gray-400"
                      htmlFor="email"
                    >
                      Restaurant Email
                    </label>
                    <input
                      className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300 hover:focus:border-gray-700 hover:border-gray-300 focus:ring-0 text-sm mt-1 "
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Your email address"
                      required
                      value={data.Restaurantemail}
                    />
                  </div>
                  <div className="mt-4">
                    <label
                      className="block text-sm font-medium text-gray-800 dark:text-gray-400"
                      htmlFor="Phone"
                    >
                      Restaurant Phone
                    </label>
                    <input
                      className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1 "
                      id="Phone"
                      type="text"
                      name="Phone"
                      placeholder="Phone number"
                      required
                      value={data.Restaurantphone}
                    />
                  </div>
                  <div className="mt-4">
                    <label
                      className="block text-sm font-medium text-gray-800 dark:text-gray-400"
                      htmlFor="Address"
                    >
                      Restaurant Address
                    </label>
                    <input
                      className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1 "
                      id="Address"
                      type="text"
                      name="Address"
                      placeholder="Address"
                      required
                      value={data.Restaurantaddress}
                    />
                  </div>
                  <div className="mt-4">
                    <label
                      className="block text-sm font-medium text-gray-800 dark:text-gray-400"
                      htmlFor="Address"
                    >
                      Profile Picture
                    </label>
                    <img
                      src={data.RestaurantImage}
                      className="block mt-2 text-sm font-medium text-gray-800 dark:text-gray-400"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      <ToastContainer />
    </div>
  );
};

export default page;
