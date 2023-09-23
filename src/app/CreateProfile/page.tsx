"use client";
import LeftSidebar from "@/Components/LeftSidebar";
import axios from "axios";
import React, { FormEvent } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
const page = () => {
  const { user } = useUser();

  const userEamil = user && user.emailAddresses[0].emailAddress;
  const [data, setdata] = React.useState({
    RestaurantName: "",
    RestaurantType: "",
    Restaurantemail: userEamil,
    Restaurantphone: "",
    Restaurantaddress: "",
    RestaurantImage: "",
  });
  // console.log(data);
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const CreateFunction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setButtonDisabled(true);
    try {
      const response = await axios.post("/api/Admin/CreateProfile", data);
      if (!response.data.success) {
        if (response.data.error === "Restaurant already exists") {
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
        setdata({
          RestaurantName: "",
          RestaurantType: "",
          Restaurantemail: "",
          Restaurantphone: "",
          Restaurantaddress: "",
          RestaurantImage: "",
        });
      }
    } catch (error: any) {
      console.log("Error while Creating data", error);
      toast.error(error.message);
    } finally {
      setButtonDisabled(false);
    }
  };
  React.useEffect(() => {
    setdata({ ...data, Restaurantemail: userEamil });
  }, [userEamil]);
  return (
    <div>
      {user ? (
        <div className="flex flex-1">
          <>
            <LeftSidebar />
            <div className="w-full bg-yellow-50">
              <div className="flex  flex-col items-center sm:justify-center mt-5">
                <div className="w-full overflow-hidden rounded-xl shadow-xl  bg-white p-8 dark:bg-gray-800 sm:max-w-md sm:rounded-lg">
                  <div className="flex items-center justify-center">
                    <h1 className="text-xl font-bold mb-5">
                      Creat Restaurant Profile
                    </h1>
                  </div>

                  <form onSubmit={CreateFunction}>
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
                      <Select
                        placeholder=" Veg or Non-veg or both"
                        className="inline-block w-full py-2 rounded-md dark:text-gray-400 bg-gray-100 dark:bg-gray-900 border-transparent dark:border-gray-700 dark:hover:border-gray-700 dark:hover:focus:border-gray-700 focus:border-gray-300  hover:border-gray-300 hover:focus:border-gray-300 focus:ring-0 text-sm mt-1"
                        required
                        onChange={(e) =>
                          setdata({ ...data, RestaurantType: e?.value! })
                        }
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
                          setdata({
                            ...data,
                            Restaurantaddress: e.target.value,
                          })
                        }
                      />
                    </div>
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
            <ToastContainer />
          </>
        </div>
      ) : (
        <div className="flex h-screen justify-center items-center bg-yellow p-5 bg-yellow-50">
          <div className="p-5 flex items-center justify-center bg-gradient-to-b from-yellow-200 to-yellow-300 hover:to-red-300 active:from-yellow-400 focus:from-red-400 rounded-xl cursor-pointer">
            {" "}
            <SignInButton afterSignInUrl="/" afterSignUpUrl="/" />
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
