import axios from "axios";
import { API_URL } from ".";
import { useState, useEffect } from "react";
const motorformLocations = [
  "/Carbasicinfo",
  "/Carpolicyinfo",
  "/Carmodelyear",
  "/Carmaker",
  "/Carmodel",
  "/Carvariant",
  "/Carregisterlocation",
  "/Carspecification",
  "/Personaldetails",
  "/Nationality",
  "/Getquote",
  "/Lastclaim",
  "/Uaedrivingexp",
  "/Chasisno",
  "/Quotes",
  "/Selectedquotes",
  "/Payments",
  "/Comparision",
];
export const getData = (url) => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(url)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          console.log(e);
          reject(e);
        });
    } catch (error) {
      reject(error);
    }
  });
};
export const PostData = async (url, data) => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .post(url, data)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          console.log(e);
          reject(e);
        });
    } catch (error) {
      reject(error);
    }
  });
};
export const getCardetailsByEmail = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (localStorage.getItem("MotoformData")) {

        let leadid = JSON.parse(localStorage.getItem("MotoformData")).leadid;
        console.log({ leadid });
        if (leadid) {
          await axios
            .get(API_URL + "/api/getMotorInsuranceDetails?newLeadId=" + leadid)
            .then((res) => {
              console.log({ res });
              resolve(res.data.data);
            })
            .catch((e) => {
              reject(e);
            });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};


export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [Loading, setLoading] = useState(false)
  const [Error, setError] = useState(false)

  useEffect(() => {
    (async () => {
      setLoading(true)
      await axios.get(url).then((res) => {
        setLoading(false)
        setData(res)
      }).catch((error) => {
        setLoading(false)
        setError(true)
      })
    })()
  }, [url]);

  return [data, Loading, Error];
};
export const UpdatePolicy = async (
  id,
  plan_company_id,
  plan_id,
  final_price,
  ciphertext,
  policy_issued_date,
  bank_name
) => {
  try {
    await axios
      .put(`${API_URL}/api/updatePolicyDetails?id=${id}`, {
        plan_company_id,
        plan_id,
        final_price,
        paymentStatus: ciphertext,
        policy_issued_date: policy_issued_date
          ? policy_issued_date
          : new Date(),
        bank_name: bank_name ? bank_name : null,
      })
      .then((res) => {
        console.log({ res });
      })
      .catch((error) => {
        console.log({ error });
      });
  } catch (error) {
    console.log(error);
    // Handle the error here, such as showing an error message or fallback behavior.
  }
};
export const getCarDetails = async (
  car_maker,
  model_year,
  car_model,
  car_variant
) => {
  return new Promise(async (resolve, reject) => {
    console.log("function works")
    if (car_maker && model_year) {
      await axios
        .post(API_URL + "/api/getMotorDetails", {
          years: model_year,
          carMaker: car_maker,
        })
        .then((res) => {
          if (res && res.data.data?.length > 0) {
            resolve({ car_model: res?.data?.data });
          } else {
            reject("Data Not Found");
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error.response.data.message || "Data Not Found");
        });
    }
    if (car_maker && model_year && car_model) {
      await axios
        .post(API_URL + "/api/getMotorDetails", {
          years: model_year,
          carMaker: car_maker,
          carModel: car_model,
        })
        .then((res) => {
          if (res && res.data.data?.length > 0) {
            resolve({ car_variend: res?.data?.data });
          } else {
            reject("Data Not Found");
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error.response.data.message || "Data Not Found");
        });
    }
  });
};
export const ArrayofBusinesstypes = [
  "Select Business Type",
  "Sole Proprietorship",
  "Civil Company",
  "Limited Liability Company (LLC)",
  "Partnership",
  "Private Share Holding Company",
  "Public Share Holding Company",
  "Branch of Foreign Companies/Representative Office",
  "foreignBranch",
  "Branch of GCC Companies",
  "Branch of Free Zone Company",
  "Branch of Dubai Based Companies",
  "Branch of UAE Based Companies",
];
// if user goes to another page instead of motor form details remove motoform details 
export const handleRemoveMotorFormdataChange = () => {
  const currentIndex = motorformLocations.indexOf(window.location.pathname);
  if (currentIndex === -1) {
    localStorage.removeItem("clientmotorformdata");
  }
};

