import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import { Container, Row, Modal, Button, Accordion, Table } from 'react-bootstrap';
import filePath from '../../webroot/sample-files/motor-comprehensive-plans.xlsx';
import filePath1 from '../../webroot/sample-files/motor-tpl-plans.xlsx';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import Multiselect from 'multiselect-react-dropdown';


const MotorPlan = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [uploadid, setUploadid] = useState('');
  const [viewfile, setViewfile] = useState('');
  const [file, setFile] = useState('');
  const [visible, setVisible] = useState(false);
  const [excelfile, setExcelfile] = useState("");
  const [motorpermission, setMotorPermission] = useState([]);
  const [insurancecompany, setInsuranceCompany] = useState([]);
  const [policytype, setPolicyType] = useState([]);
  const [planname, setPlanName] = useState([]);
  const [status, setStatus] = useState(2);
  const [selectedcompany, setSelectedCompany] = useState('');
  const [selectedpolicytype, setSelectedPolicyType] = useState('');
  const [nodata, setNodata] = useState('');
  const [bodytypelist, setBodyTypeList] = useState([]);
  const [selectedbodytype, setSelectedBodyType] = useState('');
  const [planfor, setPlanFor] = useState([]);
  const [selectedplanfor, setSelectedPlanFor] = useState('');
  const [plan_category, setPlanCategory] = useState([]);
  const [selectedplan_category, setSelectedPlanCategory] = useState('');
  // const [electric_vehicle, setElectricVehicle] = useState('');
  const [selectedelectric_vehicle, setSelectedElectricVehicle] = useState(2);
  const [repair_condition, setRepairCondition] = useState([]);
  const [selectedrepair_condition, setSelectedRepairCondition] = useState('');
  const [showalcarvalueModal, setShowalcarvalueModal] = useState(false);
  const [make_motor, setMakeMotor] = useState([]);
  const [modelmotor, setModelMotor] = useState([]);
  const [motormodel, setMotorModel] = useState([]);
  const [modelvariant, setModelVariant] = useState([]);
  const [companiesPlans, setCompaniesPlans] = useState([])
  const [showMakeTable, setshowMaketable] = useState('')
  const [userLocations, setUserLocations] = useState('')
  const [limitedData, setLimitedShowData] = useState({})
  const [showLimitedModal, setShowLimitedModal] = useState(false)
  const [natureOfPlan, setNatureOfPlan] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      getMotorPlans(page, perPage);
      const userdata = JSON.parse(localStorage.getItem('user'));
      console.log(">>>>>>>>>>>>>>>>> login user data", userdata.location)
      let userLoc = userdata?.location?.map((itm) => itm.loc_id).join(',')
      setUserLocations(userLoc)
      console.log(userLoc, ">>>>>>>>>>>>>>>>>mapped locations")
      const motor_permission = userdata?.motor_permission?.[0] || {};
      setMotorPermission(motor_permission);
      getlistCompany();
      getpolicytypelist();
      exportlistdata();
      exportlistdata1();
      getbodytypelist();
      planforlist();
      plancategorylist();
      repairconditionlist();
      getlistMakeMotor();
      getCompaniesPlans()
      NatureOfPlan()
    }
  }, []);

  useEffect(() => {
    getmodelmotor();
  }, [make_motor]);

  useEffect(() => {
    getMotorPlans(page, perPage);
    getCompaniesPlans()
  }, [selectedcompany, selectedpolicytype, planname, status, selectedbodytype, selectedplanfor, selectedplan_category, selectedelectric_vehicle, selectedrepair_condition]);

  const collectExceldata = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('xlFile', excelfile)
    let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/addBulkMotterPlan",
      {
        method: "post",
        body: fd,
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          swal({
            text: data.message,
            icon: "success",
            button: false
          })
          getMotorPlans(page, perPage);
          getCompaniesPlans()
          setTimeout(() => {
            swal.close()
          }, 1000);
        }
        else {
          swal({
            title: "Error!",
            text: data.message,
            icon: "error",
            button: false,
          })
          getMotorPlans(page, perPage);
          getCompaniesPlans()
          setTimeout(() => {
            swal.close()
          }, 1000);
        }
      });
  }

  const getMotorPlans = (page, perPage) => {
    setPlans([]);

    console.log("selectedcompany", selectedcompany)
    console.log("selectedpolicytype", selectedpolicytype)
    console.log("planname", planname)
    console.log("status", status)



    const requestOptions = {
      method: 'post',
      body: JSON.stringify({
        companyId: selectedcompany,
        policy_typeId: selectedpolicytype
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getMotorPlan?page=${page}&limit=${perPage}&name=${planname}&status=${status}&body_type=${selectedbodytype}&plan_for=${selectedplanfor}&plan_category=${selectedplan_category}&electric_vehicle=${selectedelectric_vehicle}&repair_type=${selectedrepair_condition}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data.data);
        setNodata(data.message)
        const total = data.total;
        const slice = total / perPage;
        const pages = Math.ceil(slice);
        setPageCount(pages);
        // setPlans(data.data);
        // console.log(data.data,">>>>>>>>>>>>>>> these are plans")
      });
  }

  const [exportlist, setExportlist] = useState([]);
  const [exportlist1, setExportlist1] = useState([]);
  const exportlistdata = () => {
    const requestOptions = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch('https://insuranceapi-3o5t.onrender.com/api/getMotorPlan?policy_type=Comprehensive', requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log("comprehensive", data.data)
        setExportlist(data.data);
      });
  }
  const exportlistdata1 = () => {
    const requestOptions = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch('https://insuranceapi-3o5t.onrender.com/api/getMotorPlan?policy_type=TPL', requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log("TPL", data.data)

        setExportlist1(data.data);
      });
  }
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", exportlist)

  const fileType = 'xlsx'
  const exporttocsv1 = () => {

    const updatedData = exportlist.map((item, index) => {
      return {
        'Policy Type': item.policy_type[0].policy_type_name,
        'Company Name': item.company[0].company_name,
        'Plan Name': item.plan_name,
        'Plan Category': item.plan_category_id[0].plan_category_name,
        'Plan Label': item.plan_label,
        'Nature Of Plan': item.nature_of_plan_id[0].nature_of_plan_name,
        'Body Type': item.body_type[0].body_type_name,
        'Repair Condition': item.repair_type_id[0].repair_type_name,
        'Electriv Vehicle': item.electric_vehicle,
        'Plan For': item.plan_for[0].plan_for_name,
        'Business Type': item.business_type_id[0].business_type_name,
        'Car Value': item.car_value[0].car_valueMin - item.car_value[0].car_valueMax,
        'Excess': item.car_value[0].excess,
        'Rate': item.car_value[0].rate,
        'Min Premium': item.min_premium,
        'Age': item.age_or_topup.map((val) => val.ageMin - val.ageMax).join(",") * 1,
        'Topup (Age)': item.age_or_topup.map((val) => val.agetopup).join(","),
        'Driving Experience': item.drivingexp_or_topup.map((val) => val.drivingExpMin - val.drivingExpMax).join(",") * 1,
        'Topup (Driving Experience)': item.drivingexp_or_topup.map((val) => val.drivingexptopup).join(","),
        'Home Country Driving Experience': item.homedrivingexp_or_topup.map((val) => val.homeDrivingExpMin - val.homeDrivingExpMax).join(",") * 1,
        'Topup (Home Country Driving Experience)': item.homedrivingexp_or_topup.map((val) => val.homedrivingexptopup).join(","),
        'No Claim Year': item.claimyears_or_topup.map((val) => val.claimyears).join(","),
        'No Claim Discount': item.claimyears_or_topup.map((val) => val.claimyeardisc).join(","),
        'Last Year Policy Type': item.last_year_policy_type_or_topup.map((val) => val.last_year_policy_type).join(","),
        'Topup (Last Year Policy Type)': item.last_year_policy_type_or_topup.map((val) => val.last_year_policy_type_topup).join(","),
        'GCC / NON-GCC': item.plan_for_gcc_spec_name_or_topup.map((val) => val.plan_for_gcc_spec_name).join(","),
        'Topup (GCC / NON-GCC)': item.plan_for_gcc_spec_name_or_topup.map((val) => val.gccspecstopup).join(","),
        'Nationality': item.nationality_or_topup.map((val) => val.nationality_name),
        '(Topup) Nationality': item.nationality_or_topup.map((val) => val.nationalitytopup),
        'Car Model': item.make_motor,
        // 'Age Of The Car': item.age_of_the_car_or_topup,
        // 'Topup (Age Of The Car)': item.age_of_the_car_or_topup,
        // 'Add Option Condition Description': item.add_option_condition_description,
        // 'Topup (Add Option Condition Description)': item.add_option_condition_description,
        // 'Vat Able': item.vat_able,
        // 'JDV Commision': item.jdv_commision,
        // 'Sales Person Commision': item.sales_person_commision,
        // 'location': item.location?.map((val)=>val.location_name).join(", "),

      }
    })
    console.log('updatedData', updatedData)


    // const ws = XLSX.utils.json_to_sheet(updatedData);
    // const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    // const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
    // const newdata = new Blob([excelBuffer], { type: fileType });
    // FileSaver.saveAs(newdata, "Motor-Model-Details" + ".xlsx")
  }

  const exporttocsv2 = () => {

    // const updatedData = exportlist1.map((item, index) => {
    //     return {
    //         'Policy Type': item.policy_type[0].policy_type_name,
    //         'Company Name': item.company[0].company_name,
    //         'Plan Name': item.plan_name,
    //         'Plan Category': item.plan_category_id,
    //         'Plan Label': item.plan_label,
    //         'Nature Of Plan': item.nature_of_plan_id,
    //         'Body Type': item.body_type[0].body_type_name,
    //         'Repair Condition': item.repair_type_id,
    //         'Electric Vehicle': item.electric_vehicle,
    //         'Plan For': item.plan_for,
    //         'Business Type': item.business_type_id,
    //         'Car Value': car_value,
    //         'Rate': item.rate,
    //         'Min Premium': item.min_premium,
    //         'Excess': item.excess,
    //         'Age': item.age_of_the_car_or_topup,
    //         'Topup (Age)': item.age_or_topup,
    //         'Driving Experience': item.drivingexp_or_topup,
    //         'Topup (Driving Experience)': item.drivingexp_or_topup,
    //         'Home Country Driving Experience':item.homedrivingexp_or_topup,
    //         'Topup (Home Country Driving Experience)':item.homedrivingexp_or_topup,

    //         'No Claim Year': item.claim,
    //         'No Claim Discount': item.claim_discount,
    //         'Last Year Policy Type': item.lastpolicy_type,
    //         'Topup (Last Year Policy Type)': item.lastpolicy_type,
    //         'GCC / NON-GCC': item.gcc_or_nongcc,
    //         'Topup (GCC / NON-GCC)': item.gcc_or_nongcc,
    //         'Nationality': item.Nationality,
    //         '(Topup) Nationality': item.Nationality,
    //         'Car Model': item.car_model,
    //         'Age Of The Car': item.age_of_the_car_or_topup,
    //         'Topup (Age Of The Car)': item.age_of_the_car_or_topup,
    //         'Add Option Condition Description': item.add_option_condition_description,
    //         'Topup (Add Option Condition Description)': item.add_option_condition_description,
    //         'Vat Able': item.vat_able,
    //         'JDV Commision': item.jdv_commision,
    //         'Sales Person Commision': item.sales_person_commision,

    //     }
    // })
    // console.log('updatedData', updatedData)


    // const ws = XLSX.utils.json_to_sheet(updatedData);
    // const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    // const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
    // const newdata = new Blob([excelBuffer], { type: fileType });
    // FileSaver.saveAs(newdata, "Motor-Model-Details" + ".xlsx")
  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setPage(selectedPage + 1);
    getMotorPlans(selectedPage + 1, perPage);
  };
  const NatureOfPlan = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getNatureOfPlan`, requestOptions)
      .then(response => response.json())
      .then(data => {
        setNatureOfPlan(data.data);
      });
  }
  const deactivatePlan = (id, status) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/updatestatusMotorPlan/${id}/${status}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          swal({
            text: data.message,
            icon: "success",
            button: false,
          })
          getCompaniesPlans()
          getMotorPlans(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);
        }
        else {
          swal({
            title: "Error!",
            text: data.message,
            icon: "error",
            button: false,
          })
          getCompaniesPlans()
          getMotorPlans(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);
        }
      });
  }

  const handlemodal = (id, policywording) => {
    setShowModal(true);
    setUploadid(id);
    setViewfile(policywording);
  }
  const HandleLocationModal = (id, location) => {
    setShowLocationModal(true)
  }
  const handleFileuploads = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('policywordings_file', file);
    formData.append('id', uploadid);

    const requestOptions = {
      method: 'POST',
      body: formData,
    };

    await fetch("https://insuranceapi-3o5t.onrender.com/api/upload_policywordings_file", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));

    setShowModal(false);
    swal({
      text: "Policy Wordings File Uploaded Successfully",
      icon: "success",
      button: false,
    })
    setTimeout(() => {
      swal.close()
    }, 1000);
  }
  const deleteItem = (id) => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMotorMaster/?id=${id}&type=plan`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          swal({
            text: data.message,
            icon: "success",
            button: false,
          })
          getMotorPlans(page, perPage);
          getCompaniesPlans()
          setTimeout(() => {
            swal.close()
          }, 1000);
        }
        else {
          swal({
            title: "Error!",
            text: data.message,
            icon: "error",
            button: false,
          })
          getMotorPlans(page, perPage);
          getCompaniesPlans()
          setTimeout(() => {
            swal.close()
          }, 1000);
        }

      })
  }
  const startFrom = (page - 1) * perPage;


  const getlistCompany = () => {

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getCompany`, requestOptions)
      .then(response => response.json())
      .then(data => {
        setInsuranceCompany(data.data);
      });
  }

  const getpolicytypelist = async () => {


    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/get_all_policiy_type`, requestOptions)
      .then(response => response.json())
      .then(data => {
        setPolicyType(data.data);
      });
  }

  const getbodytypelist = async () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/get_all_body_type`, requestOptions)
      .then(response => response.json())
      .then(data => {
        setBodyTypeList(data.data);
      }
      );
  }

  const planforlist = async () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getPlanFor`, requestOptions)
      .then(response => response.json())
      .then(data => {
        setPlanFor(data.data);
      }
      );
  }

  const plancategorylist = async () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getPlanCategory`, requestOptions)
      .then(response => response.json())
      .then(data => {
        setPlanCategory(data.data);
      }
      );
  }

  const repairconditionlist = async () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getRepairCondition`, requestOptions)
      .then(response => response.json())
      .then(data => {
        setRepairCondition(data.data);
      }
      );
  }

  const HandlecarvalueModal = (id) => {
    setModelMotor([]);
    setMotorModel([]);
    setModelVariant([]);
    setShowalcarvalueModal(true)
  }


  const getlistMakeMotor = () => {
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        make: "Make"
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch('https://insuranceapi-3o5t.onrender.com/api/getblacklistedvehicle', requestOptions)
      .then(response => response.json())
      .then(data => {
        const list = data.data;
        setMakeMotor(list);

      });
  }


  const getmodelmotor = () => {
    return (e) => {


      const make_motor = e.target.value;
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
          makeId: [make_motor]
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
      fetch(`https://insuranceapi-3o5t.onrender.com/api/getblacklistedvehicle`, requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data.data, "data.data")
          const motormodeldt = data.data.map((val) => ({ label: val.motor_model_name, value: val._id }));
          console.log(motormodeldt, "motormodeldt")
          setModelMotor(motormodeldt);
          // getmodelvariant(motormodeldt.map((val) => (val.value))) 
          const model_variant = motormodeldt.map((val) => (val.value));

          const requestOptions = {
            method: 'POST',
            body: JSON.stringify({
              modelId: model_variant
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          };
          fetch(`https://insuranceapi-3o5t.onrender.com/api/getblacklistedvehicle`, requestOptions)
            .then(response => response.json())
            .then(data => {
              console.log(data.data, "data.data")
              const motormodeldt = data.data.map((val) => ({ label: val.motor_model_detail_name, value: val._id }));
              console.log(motormodeldt, "motormodeldt")
              setModelVariant(motormodeldt);
            }
            );


        });
    }
  }
  // console.log(modelmotor, "modelmotor")
  // console.log(motormodel, "motormodel")

  const getCompaniesPlans = () => {

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getCompaniesPlans?name=${planname}&policy_typeId=${selectedpolicytype}&companyId=${selectedcompany}&status=${status}&body_type=${selectedbodytype}&plan_for=${selectedplanfor}&plan_category=${selectedplan_category}&electric_vehicle=${selectedelectric_vehicle}&repair_type=${selectedrepair_condition}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const modelmotordt = data.data;
        setCompaniesPlans(modelmotordt);
        console.log("Companies motor plans >>>>>>>", modelmotordt)
      });

  }
  const ShowFeilds = (e, company, type) => {

    if (type == 'comprehensive') {
      motor_plan_details(e._id, company)
    } else if (type == 'tpl') {
      motor_plan_details_tpl(e._id, company)
    }

  }

  const motor_plan_details = (id, company) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/motor_plan_details/${id}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data.data, "single data >>>>>>>>>>>>>>>>>>>")
        const body_type = data.data?.body_type;

        let bodytypes = body_type?.map((bodytyye) => bodytyye.body_type_name)?.join(', ')
        let business_type_obj = '';

        const business_type = data.data.business_type_id;
        if (business_type.length) {
          business_type_obj = business_type?.map((bt) => bt.business_type_name)?.join(', ')
        }

        const age = data.data.age_or_topup;
        const age_dt = age.length;
        const age_obj = [];
        for (let i = 0; i < age_dt; i++) {
          let age_obj1;
          if (age[i]['ageMin'] == age[i]['ageMax']) {
            age_obj1 = age[i]['ageMin'];
          }
          else {
            age_obj1 = age[i]['ageMin'] + '-' + age[i]['ageMax'];
          }
          age_obj.push(age_obj1);
        }
        var ageValues = age_obj.join(',');

        const driving = data.data.drivingexp_or_topup;
        const driving_dt = driving.length;
        const driving_obj = [];

        for (let i = 0; i < driving_dt; i++) {
          let driving_obj1;
          if (driving[i]['drivingExpMin'] == driving[i]['drivingExpMax']) {
            driving_obj1 = driving[i]['drivingExpMin'];
          }
          else {
            driving_obj1 = driving[i]['drivingExpMin'] + '-' + driving[i]['drivingExpMax'];
          }
          driving_obj.push(driving_obj1);
        }
        var drivingValues = driving_obj.join(',');

        const gcc_specs = data.data.plan_for_gcc_spec_name_or_topup;
        let gcc_specs_dt = gcc_specs?.map((gcc) => gcc.plan_for_gcc_spec_name)?.join(", ");


        let nature_of_plan = natureOfPlan?.find((item) => item._id == data.data?.nature_of_plan_id)
        const limitObj = {
          insurancecompany: company,
          plan_name: data.data?.plan_name,
          nature_of_plan: nature_of_plan?.nature_of_plan_name,
          body_type: bodytypes,
          cylinder: '',
          premium: '',
          electric_vehicle: data.data?.electric_vehicle == 1 ? 'YES' : 'NO',
          business_type: business_type_obj,
          driver_age: ageValues,
          driving_experience: drivingValues,
          gcc_nongcc: gcc_specs_dt,
          type: 'comprehensive'
        }
        setLimitedShowData(limitObj)
      });
    setShowLimitedModal(true)

  }
  const motor_plan_details_tpl = (id, company) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/motor_plan_details/${id}`, requestOptions)
      .then(response => response.json())
      .then(data => {

        const body_type = data.data?.body_type;
        console.log(body_type, ">>>>>> body type")

        const body_type_dt = body_type.length;

        const bodytypeObj = [];
        const cylinder_obj = [];
        const body_premium = [];
        let bodytypeNames = ''
        let cylinderNames = ''
        let car__premium = ''
        const premium = [];
        if (body_type[0].min_premium) {
          for (let i = 0; i < body_type_dt; i++) {
            bodytypeObj.push({
              _id: body_type[i]["_id"],
              body_type_name: body_type[i]["body_type_name"]
            })
            cylinder_obj.push({
              id: body_type[i]['cylinder'],
              cylinder: body_type[i]['cylinder'],
              min_primium: body_type[i]['min_premium'],
              premium: body_type[i]['premium']
            })
          }
          function removeDuplicateObjects(array, key) {
            const seen = new Set();
            return array.filter((item) => {
              const keyValue = item[key];
              if (!seen.has(keyValue)) {
                seen.add(keyValue);
                return true;
              }
              return false;
            });
          }
          const uniqueCylinders = removeDuplicateObjects(cylinder_obj, 'cylinder');
          cylinderNames = uniqueCylinders?.map((cylinder) => cylinder.cylinder)?.join(', ')

          for (let k = 0; k < uniqueCylinders.length; k++) {
            body_premium.push(uniqueCylinders[k].min_primium)
            premium.push(uniqueCylinders[k].premium)
          }
          const uniqueBodyTypes = removeDuplicateObjects(bodytypeObj, 'body_type_name');
          bodytypeNames = uniqueBodyTypes.map((cylinder) => cylinder.body_type_name)?.join(", ")

          car__premium = premium.length > 1 ? premium.join(",") : premium[0]

        }
        let business_type_obj = '';

        const business_type = data.data.business_type_id;
        if (business_type.length) {
          business_type_obj = business_type?.map((bt) => bt.business_type_name)?.join(', ')
        }

        const age = data.data.age_or_topup;
        const age_dt = age.length;
        const age_obj = [];
        for (let i = 0; i < age_dt; i++) {
          let age_obj1;
          if (age[i]['ageMin'] == age[i]['ageMax']) {
            age_obj1 = age[i]['ageMin'];
          }
          else {
            age_obj1 = age[i]['ageMin'] + '-' + age[i]['ageMax'];
          }
          age_obj.push(age_obj1);
        }
        var ageValues = age_obj.join(',');

        const driving = data.data.drivingexp_or_topup;
        const driving_dt = driving.length;
        const driving_obj = [];

        for (let i = 0; i < driving_dt; i++) {
          let driving_obj1;
          if (driving[i]['drivingExpMin'] == driving[i]['drivingExpMax']) {
            driving_obj1 = driving[i]['drivingExpMin'];
          }
          else {
            driving_obj1 = driving[i]['drivingExpMin'] + '-' + driving[i]['drivingExpMax'];
          }
          driving_obj.push(driving_obj1);
        }
        var drivingValues = driving_obj.join(',');

        const gcc_specs = data.data.plan_for_gcc_spec_name_or_topup;
        let gcc_specs_dt = gcc_specs?.map((gcc) => gcc.plan_for_gcc_spec_name)?.join(", ");


        let nature_of_plan = natureOfPlan?.find((item) => item._id == data.data?.nature_of_plan_id)
        const limitObj = {
          insurancecompany: company,
          plan_name: data.data?.plan_name,
          nature_of_plan: nature_of_plan?.nature_of_plan_name,
          body_type: bodytypeNames,
          cylinder: cylinderNames,
          premium: car__premium,
          electric_vehicle: data.data?.electric_vehicle == 1 ? 'YES' : 'NO',
          business_type: business_type_obj,
          driver_age: ageValues,
          driving_experience: drivingValues,
          gcc_nongcc: gcc_specs_dt,
          type: 'tpl'
        }
        setLimitedShowData(limitObj)
      })
    setShowLimitedModal(true)
  }
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card" >
            <div className="card-header">
              <div className="row">
                <div className="col-md-6">
                  <h4 className="card-title">Motor Plans</h4>
                </div>
                <div className="col-md-6" >
                  {motorpermission.motor_plan?.includes('create') ?
                    <a onClick={() => navigate("/AddMotorPlan")} className="btn btn-primary" style={{ float: "right", marginLeft: '4px' }}>Add Comprehensive Motor Plan</a>
                    : ''}
                  {motorpermission.motor_plan?.includes('create') ?
                    <a onClick={() => navigate("/AddThirdPartyPlan")} className="btn btn-primary" style={{ float: "right", marginLeft: '4px' }}>Add Third Party Motor Plan</a>
                    : ''}
                </div>
              </div>
            </div>
            <div className="card-body" style={{ overflow: 'scroll' }}>

              <div className="card-header">
                <div className="col-md-12" style={{ textAlign: 'right' }}>
                  {motorpermission.motor_plan?.includes('download') ?
                    <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginLeft: '4px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Comprehensive Motor Plan Sample File</a>
                    : ''}
                  {motorpermission.motor_plan?.includes('download') ?
                    <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginLeft: '4px' }} href={filePath1} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Third Party Motor Plan Sample File</a>
                    : ''}
                  {motorpermission.motor_plan?.includes('upload') ?
                    <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginLeft: '4px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
                    : ''}
                  {/* {motorpermission.motor_plan?.includes('export') ?
                    <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv1}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Comprehensive Data to excel</button>
                    : ''}
                     {motorpermission.motor_plan?.includes('export') ?
                    <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv2}><i className="fa fa-file-excel" aria-hidden="true"></i> Export TPL Data to excel</button>
                    : ''} */}
                </div>
              </div>
              <Accordion defaultActiveKey="0" >
                <Accordion.Item eventKey="0">
                  <Accordion.Header className='modifyaccordian'>Filters </Accordion.Header>
                  <Accordion.Body>

                    <div className='card-header'>
                      <div className='row'>
                        <div className='col-lg-3'>
                          <label><strong>Select Insurance co.</strong></label><br />
                          <select
                            className='form-control'
                            value={selectedcompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                          >
                            <option value="">-- All --</option>
                            {insurancecompany?.map((item, index) => (
                              <option key={index} value={item._id}>{item.company_name}</option>
                            ))}

                          </select>
                        </div>
                        <div className='col-lg-3'>
                          <label><strong>Select Policy Type (TPL or comprehensive)</strong></label><br />
                          <select
                            className='form-control'
                            value={selectedpolicytype}
                            onChange={(e) => setSelectedPolicyType(e.target.value)}
                          >
                            <option value="">-- All --</option>
                            {policytype?.map((item, index) => (
                              <option key={index} value={item._id}>{item.policy_type_name}</option>
                            ))}
                          </select>
                        </div>
                        <div className='col-lg-3'>
                          <label><strong>Plan Name</strong></label><br />
                          <input type="text" className="form-control" placeholder="Search Plan" onChange={(e) => setPlanName(e.target.value)} />
                        </div>
                        <div className='col-lg-3'>
                          <label><strong>Select Status</strong></label><br />
                          <select className='form-control'
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                          >
                            <option value={2}>-- All --</option>
                            <option value={1}>Active</option>
                            <option value={0}>Inactive</option>
                          </select>
                        </div>
                        <div className='col-lg-3'>
                          <label><strong>Select Body Type</strong></label><br />
                          <select className='form-control'
                            value={selectedbodytype}
                            onChange={(e) => setSelectedBodyType(e.target.value)}
                          >
                            <option value=''>-- All --</option>
                            {bodytypelist?.map((item, index) => (
                              <option key={index} value={item._id}>{item.body_type_name}</option>
                            ))}
                          </select>
                        </div>
                        <div className='col-lg-3'>
                          <label><strong>Select Plan For(Company/Individual)</strong></label><br />
                          <select className='form-control'
                            value={selectedplanfor}
                            onChange={(e) => setSelectedPlanFor(e.target.value)}
                          >
                            <option value=''>-- All --</option>
                            {planfor?.map((item, index) => (
                              <option key={index} value={item._id}>{item.plan_for_name}</option>
                            ))}

                          </select>
                        </div>
                        <div className='col-lg-3'>
                          <label><strong>Select Plan Category(Basic/Enhanced etc)</strong></label><br />
                          <select className='form-control'
                            value={selectedplan_category}
                            onChange={(e) => setSelectedPlanCategory(e.target.value)}
                          >
                            <option value=''>-- All --</option>
                            {plan_category?.map((item, index) => (
                              <option key={index} value={item._id}>{item.plan_category_name}</option>
                            ))}

                          </select>
                        </div>
                        <div className='col-lg-3'>
                          <label><strong>Select Electric vehicle</strong></label><br />
                          <select className='form-control'
                            value={selectedelectric_vehicle}
                            onChange={(e) => setSelectedElectricVehicle(e.target.value)}
                          >
                            <option value={2}>-- All --</option>
                            <option value={1}>Yes</option>
                            <option value={0}>No</option>
                          </select>
                        </div>

                        <div className='col-lg-3'>
                          <label><strong>Repair Condition</strong></label><br />
                          <select className='form-control'
                            value={selectedrepair_condition}
                            onChange={(e) => setSelectedRepairCondition(e.target.value)}
                          >
                            <option value=''>-- All --</option>
                            {repair_condition?.map((item, index) => (
                              <option key={index} value={item._id}>{item.repair_type_name}</option>
                            ))}
                          </select>
                        </div>


                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    {/* <thead className=" text-primary">
                      <tr>
                        <th>Sr No.</th>
                        <th>Company Name</th>
                        <th>Policy Type</th>
                        <th>Plan Name</th>
                        <th>Body Type</th>
                        <th>Repair Type</th>
                        <th>Action</th>
                      </tr>
                    </thead> */}
                    <tbody>
                      {plans && plans.length > 0 ?
                        <>
                          {
                            plans.map((plan, index) => (
                              <React.Fragment key={index}>
                                <tr key={index}>
                                  <td>{startFrom + index + 1}</td>
                                  <td>{plan.company[0]['company_name']}</td>
                                  <td>{plan.policy_type[0]['policy_type_name']}</td>
                                  <td className={plan.status == 1 ? 'text-success' : 'text-danger'}>{plan.plan_name}</td>
                                  <td>{[...new Set(plan.body_type.map((val) => val.body_type_name))].join(", ")}</td>
                                  <td>{plan.repair_type_id?.map((val) => val.repair_type_name).join(", ")}</td>

                                  <td>
                                    {motorpermission.motor_plan?.includes('edit') && (
                                      <div className="btn-group" role="group" aria-label="Basic example">
                                        {plan.policy_type_id == "641161a4591c2f02bcddf51c" ? (
                                          <a href={`/EditMotorPlan?id=${plan._id}`} className="btn btn-primary">Edit</a>

                                        ) : (
                                          <a href={`/EditTPLMotorPlan?id=${plan._id}`} className="btn btn-primary">Edit</a>
                                        )}
                                      </div>
                                    )}
                                    {' '}
                                    {motorpermission.motor_plan?.includes('delete') && (
                                      <>
                                        {
                                          plan.status === 1 ?
                                            <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deactivatePlan(plan._id, 0) }}>Deactivate</button></div> :
                                            <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deactivatePlan(plan._id, 1) }}>Activate</button></div>
                                        }
                                      </>
                                    )}
                                    {' '}
                                    {motorpermission.motor_plan?.includes('edit') && (
                                      <div className="btn-group" role="group" aria-label="Basic example">
                                        <button className="btn btn-success" onClick={() => handlemodal(plan._id, plan.policywordings_file)}>T & C</button>
                                      </div>
                                    )}
                                    {' '}
                                    {motorpermission.motor_plan?.includes('edit') && (
                                      <div className="btn-group" role="group" aria-label="Basic example">
                                        <a href={`/ViewStandardCover?id=${plan._id}&type=motor`} className="btn btn-info">Standard Cover</a>
                                      </div>
                                    )}
                                    {' '}
                                    {motorpermission.motor_plan?.includes('edit') && (
                                      <div className="btn-group" role="group" aria-label="Basic example">
                                        <a href={`/ViewAdditionalCover?id=${plan._id}&type=motor`} className="btn btn-warning">Additional Cover</a>
                                      </div>
                                    )}
                                    {' '}
                                    {/* { motorpermission.motor_plan?.includes('edit') && (
                            <div className="btn-group" role="group" aria-label="Basic example">
                            <button className="btn btn-primary" onClick={()=>HandleLocationModal(plan._id,plan.location)}>Locations</button>
                          </div>
                          )} */}
                                    {' '}
                                    {motorpermission.motor_plan?.includes('edit') && (
                                      <div className="btn-group" role="group" aria-label="Basic example">
                                        <button className="btn btn-info" onClick={() => HandlecarvalueModal(plan._id)}>Car Value</button>
                                      </div>
                                    )}
                                    {' '}
                                    {motorpermission.motor_plan?.includes('edit') && (
                                      <div className="btn-group" role="group" aria-label="Basic example">
                                        <a href={`/Nonapplicablenationality?id=${plan._id}`} className="btn btn-dark">Nationality (Plan Non-Applicable)</a>
                                      </div>
                                    )}
                                    {' '}
                                    {motorpermission.motor_plan?.includes('edit') && (
                                      <div className="btn-group" role="group" aria-label="Basic example">
                                        <a href={`/blacklistvehicle?id=${plan._id}`} className="btn btn-secondary">Black List vehicle</a>
                                      </div>
                                    )}
                                    {' '}
                                    {motorpermission.motor_plan?.includes('delete') && (
                                      <div className="btn-group" role="group" aria-label="Basic example">
                                        <button className="btn btn-warning" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(plan._id) }}>Delete</button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              </React.Fragment>
                            ))
                          }
                        </>
                        : ""
                        // <tr><td colSpan="17" style={{ textAlign: 'center' }}><strong>{nodata}</strong></td></tr>
                      }
                    </tbody>
                  </table>
                  {companiesPlans?.map((itm1, indx) =>
                    <div className='col-md-12' key={indx}>
                      <h6
                        className='text-primary'
                      > {itm1?._id != showMakeTable ?
                        <button onClick={() => setshowMaketable(itm1?._id)}
                          className='btn btn-success text-light'><i className='fa fa-angle-right'></i></button> :
                        <button className='btn btn-success text-light' onClick={() => setshowMaketable('')}><i className='fa fa-angle-down'></i></button>} {itm1?.company_name}</h6>

                      {/*Comprehensive plans from here*/}

                      {itm1?._id == showMakeTable && itm1?.comprehensive_plans?.map((plan, planindex) =>
                        <tr key={planindex}>
                          {planindex == 0 ? <div className='mx-4 d-flex'>
                            {/* <button className='btn btn-success btn-sm text-light'> */}
                            {/* <i className='fa fa-check'></i> */}
                            {/* </button> */}
                            <h6 className='mx-2 text-light bg-danger'>Comprehensive</h6></div> : ''}

                          {userLocations.includes(plan?.plan_created_by) || userLocations.includes('64116415591c2f02bcddf51e') ?
                            <div className='d-flex my-1' style={{ marginLeft: '30px' }} >
                              <div className='mx-3'>
                                <button className='btn btn-success btn-sm text-white'><i className='fa fa-check'></i></button>
                              </div>
                              <div className=' col-md-1 mx-1 my-1' style={{ fontWeight: '700', color: 'red', }}>
                                {plan?.plan_name?.slice(0, 15)}{plan?.plan_name?.length > 15 ? '....' : ''}
                              </div>

                              <div className='col-md-12 table-responsive'>
                                {motorpermission.motor_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    {plan.policy_type_id == "641161a4591c2f02bcddf51c" ? (
                                      <a href={`/EditMotorPlan?id=${plan._id}`} className="btn btn-primary">Edit</a>

                                    ) : (
                                      <a href={`/EditTPLMotorPlan?id=${plan._id}`} className="btn btn-primary">Edit</a>
                                    )}
                                  </div>
                                )}
                                {' '}
                                {motorpermission.motor_plan?.includes('delete') && (
                                  <>
                                    {
                                      plan.status === 1 ?
                                        <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deactivatePlan(plan._id, 0) }}>Deactivate</button></div> :
                                        <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deactivatePlan(plan._id, 1) }}>Activate</button></div>
                                    }
                                  </>
                                )}
                                {' '}
                                {motorpermission.motor_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <button className="btn btn-success" onClick={() => handlemodal(plan._id, plan.policywordings_file)}>T & C</button>
                                  </div>
                                )}
                                {' '}
                                {motorpermission.motor_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/ViewStandardCover?id=${plan._id}&type=motor`} className="btn btn-info">Standard Cover</a>
                                  </div>
                                )}
                                {' '}
                                {motorpermission.motor_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/ViewAdditionalCover?id=${plan._id}&type=motor`} className="btn btn-warning">Additional Cover</a>
                                  </div>
                                )}
                                {' '}
                                {/* { motorpermission.motor_plan?.includes('edit') && (
                            <div className="btn-group" role="group" aria-label="Basic example">
                            <button className="btn btn-primary" onClick={()=>HandleLocationModal(plan._id,plan.location)}>Locations</button>
                          </div>
                          )} */}
                                {' '}
                                {motorpermission.motor_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <button className="btn btn-info" onClick={() => HandlecarvalueModal(plan._id)}>Car Value</button>
                                  </div>
                                )}
                                {' '}
                                {motorpermission.motor_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/Nonapplicablenationality?id=${plan._id}`} className="btn btn-dark">Nationality (Plan Non-Applicable)</a>
                                  </div>
                                )}
                                {' '}
                                {motorpermission.motor_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/blacklistvehicle?id=${plan._id}`} className="btn btn-secondary">Black List vehicle</a>
                                  </div>
                                )}
                                {' '}
                                {motorpermission.motor_plan?.includes('delete') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <button className="btn btn-warning" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(plan._id) }}>Delete</button>
                                  </div>
                                )}
                              </div>
                            </div>
                            : <div className='d-flex col-md-12 my-1' style={{ marginLeft: '30px' }}>
                              <div className='mx-3'>
                                <button className='btn btn-success btn-sm text-white'>
                                  <i className='fa fa-check'></i></button>
                              </div>
                              <div className=' col-md-3 mx-1 my-1' style={{ fontWeight: '700', color: 'red', }}>
                                {plan?.plan_name?.slice(0, 15)}{plan?.plan_name?.length > 15 ? '....' : ''}
                              </div>
                              <div className='col-md-3'><button className='btn btn-primary' onClick={() => ShowFeilds(plan, itm1?.company_name, 'comprehensive')}>View</button></div>
                            </div>}
                        </tr>
                      )
                      }

                      {/*Third party plans from here*/}

                      {itm1?._id == showMakeTable && itm1?.tpl_plans?.map((plan, planindex) =>
                        <tr key={planindex}>
                          {planindex == 0 ? <div className='mx-4 d-flex'>
                            {/* <button className='btn btn-success btn-sm text-light'>
                            <i className='fa fa-check'></i>
                          </button> */}
                            <h6 className='mx-2 text-light bg-danger'>Third Party Liability (TPL)</h6></div> : ''}

                          {userLocations.includes(plan?.plan_created_by) || userLocations.includes('64116415591c2f02bcddf51e') ?
                            <div className='d-flex my-1' style={{ marginLeft: '30px' }} >
                              <div className='mx-3'>
                                <button className='btn btn-success btn-sm text-white'><i className='fa fa-check'></i></button>
                              </div><div className=' col-md-1 mx-1 my-1' style={{ fontWeight: '700', color: 'red', }}>
                                {plan?.plan_name?.slice(0, 15)}{plan?.plan_name?.length > 15 ? '....' : ''}</div>
                              <div className='col-md-12 table-responsive'>
                                {motorpermission.motor_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    {plan.policy_type_id == "641161a4591c2f02bcddf51c" ? (
                                      <a href={`/EditMotorPlan?id=${plan._id}`} className="btn btn-primary">Edit</a>

                                    ) : (
                                      <a href={`/EditTPLMotorPlan?id=${plan._id}`} className="btn btn-primary">Edit</a>
                                    )}
                                  </div>
                                )}
                                {' '}
                                {motorpermission.motor_plan?.includes('delete') && (
                                  <>
                                    {
                                      plan.status === 1 ?
                                        <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deactivatePlan(plan._id, 0) }}>Deactivate</button></div> :
                                        <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deactivatePlan(plan._id, 1) }}>Activate</button></div>
                                    }
                                  </>
                                )}
                                {' '}
                                {motorpermission.motor_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <button className="btn btn-success" onClick={() => handlemodal(plan._id, plan.policywordings_file)}>T & C</button>
                                  </div>
                                )}
                                {' '}
                                {motorpermission.motor_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/ViewStandardCover?id=${plan._id}&type=motor`} className="btn btn-info">Standard Cover</a>
                                  </div>
                                )}
                                {' '}
                                {motorpermission.motor_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/ViewAdditionalCover?id=${plan._id}&type=motor`} className="btn btn-warning">Additional Cover</a>
                                  </div>
                                )}
                                {' '}
                                {/* { motorpermission.motor_plan?.includes('edit') && (
                            <div className="btn-group" role="group" aria-label="Basic example">
                            <button className="btn btn-primary" onClick={()=>HandleLocationModal(plan._id,plan.location)}>Locations</button>
                          </div>
                          )} */}
                                {' '}
                                {motorpermission.motor_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <button className="btn btn-info" onClick={() => HandlecarvalueModal(plan._id)}>Car Value</button>
                                  </div>
                                )}
                                {' '}
                                {motorpermission.motor_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/Nonapplicablenationality?id=${plan._id}`} className="btn btn-dark">Nationality (Plan Non-Applicable)</a>
                                  </div>
                                )}
                                {' '}
                                {motorpermission.motor_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/blacklistvehicle?id=${plan._id}`} className="btn btn-secondary">Black List vehicle</a>
                                  </div>
                                )}
                                {' '}
                                {motorpermission.motor_plan?.includes('delete') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <button className="btn btn-warning" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(plan._id) }}>Delete</button>
                                  </div>
                                )}
                              </div>
                            </div>
                            : <div className='d-flex my-1' style={{ marginLeft: '30px' }}>
                              <div className='mx-3'>
                                <button className='btn btn-success btn-sm text-white'><i className='fa fa-check'></i></button>
                              </div>
                              <div className=' col-md-3 mx-1 my-1' style={{ fontWeight: '700', color: 'red', }}>
                                {plan?.plan_name?.slice(0, 15)}{plan?.plan_name?.length > 15 ? '....' : ''}
                              </div>
                              <div className='col-md-3 table-responsive'>
                                <button className='btn btn-primary'
                                  onClick={() => ShowFeilds(plan, itm1?.company_name, 'tpl')}>View</button></div>
                            </div>}
                        </tr>
                      )
                      }
                      <hr />
                    </div>)}
                  {/* <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination justify-content-end"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                    activeClassName={"active"}
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="name">Policy Wordings/T&C</label>
                  <input type="file" className="form-control" id="file" name="file" onChange={(event) => setFile(event.target.files[0])} />
                </div>
              </div>
              {viewfile == '' || viewfile == null
                || viewfile == undefined ||
                viewfile == 'undefined' || viewfile.length == 0 ?
                "" :
                <div className="col-md-6">
                  <a className="btn btn-warning" href={`https://insuranceapi-3o5t.onrender.com/uploads/${viewfile}`} style={{ position: 'relative', top: '23px' }} rel="noreferrer" target='_blank'>view</a>
                </div>
              }
            </Row>
          </Container>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleFileuploads}>
            Upload
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal size='lg' show={showLocationModal} onHide={() => setShowLocationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Locations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <div className="col-md-6">
                <div className="form-group">
                  <table className="table table-bordered yatchplanss123">
                    <tr>
                      <th>Location</th>
                      <th>Description</th>
                      <th>Rate</th>
                    </tr>
                    <tbody>
                      <tr>
                        <td>this is location</td>
                        <td>this is rate</td>
                        <td>
                          <input type="text" name="" className="form-control" />
                        </td>
                      </tr>
                    </tbody>
                  </table>

                </div>
              </div>

            </Row>
          </Container>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleFileuploads}>
            Submit
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>Upload Excel File</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div >
            <input type="file" className="form-control" id="DHA" defaultValue="" required
              onChange={(e) => setExcelfile(e.target.files[0])} />
          </div>

        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={collectExceldata} href={'/motor-make'}>Upload</CButton>
        </CModalFooter>
      </CModal>


      <Modal size='lg' show={showalcarvalueModal} onHide={() => setShowalcarvalueModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Car Value Topup</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <div className="card-body">
                      <form action="/" method="POST" >
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group mb-3">
                              <label><strong>Make Motor</strong></label>
                              <select className="form-control" name="make_motor" onChange={getmodelmotor()}>
                                <option value="" hidden>Select Make Motor</option>
                                {
                                  make_motor.map((item, index) => {
                                    return (
                                      <option key={index} value={item._id}>{item.make_motor_name}</option>
                                    )
                                  })
                                }
                              </select>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="form-group mb-3">
                              <label><strong>Model Motor</strong></label>
                              {/* <select className="form-control" name="model_motor"  onChange={getmotormodel()}>
                                                                <option value="">Select Model Motor</option>
                                                                {
                                                                    modelmotor.map((item, index) => {
                                                                        return (
                                                                            <option selected ={index == 0} key={index} value={item.value}>{item.label}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </select> */}

                              <Multiselect
                                options={modelmotor}
                                selectedValues={modelmotor}
                                displayValue="label"
                                onSelect={setMotorModel}
                                onRemove={setMotorModel}
                                placeholder="Select Model"
                                showCheckbox={true}
                                closeOnSelect={false}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="form-group mb-3">
                              <label><strong>Model Motor Details</strong></label>
                              {/* <select className="form-control" name="motor_model_details_id">
                                                                <option value="">Select Model Motor Details</option>
                                                                {
                                                                    motormodel.map((item, index) => {
                                                                        return (
                                                                            <option selected ={index == 0} key={index} value={item.value}>{item.label}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </select> */}

                              <Multiselect
                                options={modelvariant}
                                selectedValues={modelvariant}
                                displayValue="label"
                                onSelect={setModelVariant}
                                onRemove={setModelVariant}
                                placeholder="Select Variant"
                                showCheckbox={true}
                                closeOnSelect={false}
                                required
                              />



                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right", bottom: "-58%" }}>Save</button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowalcarvalueModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <CModal size='lg' alignment="center" visible={showLimitedModal} onClose={() => setShowLimitedModal(false)}>
        <CModalHeader onClose={() => setShowLimitedModal(false)}>
          <CModalTitle>Plan Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className='row'>
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label className='text-danger'>Insurance Company Name</label>
                <input type='text' className='form-control' value={limitedData?.insurancecompany} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label className='text-danger'>Plan Name</label>
                <input type='text' className='form-control' value={limitedData?.plan_name} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label className='text-danger'>Nature of Plan</label>
                <input type='text' className='form-control' value={limitedData?.nature_of_plan} />
              </div>
            </div>
            <div className='col-md-6'>
              <div className="form-group mb-3">
                <label className='text-danger'>Body Type</label>
                <textarea rows={2} type='text' className='form-control' value={limitedData?.body_type} />
              </div>
            </div>
            {limitedData.type == 'tpl' ?
              <div className='col-md-6'>
                <div className="form-group mb-3">
                  <label className='text-danger'>Cylinders</label>
                  <input type='text' className='form-control' value={limitedData.cylinder} />
                </div>
              </div> : ''}
            {limitedData.type == 'tpl' ?
              <div className='col-md-6'>
                <div className="form-group mb-3">
                  <label className='text-danger'>Premium</label>
                  <input type='text' className='form-control' value={limitedData?.premium} />
                </div>
              </div> : ''}
            <div className='col-md-6'>
              <div className="form-group mb-3">
                <label className='text-danger'>Electric Vehicle</label>
                <input type='text' className='form-control' value={limitedData?.electric_vehicle} />
              </div>
            </div>
            <div className='col-md-6'>
              <div className="form-group mb-3">
                <label className='text-danger'>Business Type</label>
                <input type='text' className='form-control' value={limitedData?.business_type} />
              </div>
            </div>
            <div className='col-md-6'>
              <div className="form-group mb-3">
                <label className='text-danger'>Driver Age</label>
                <input type='text' className='form-control' value={limitedData?.driver_age} />
              </div>
            </div>
            <div className='col-md-6'>
              <div className="form-group mb-3">
                <label className='text-danger'>Driving Experiance</label>
                <input type='text' className='form-control' value={limitedData?.driving_experience} />
              </div>
            </div>
            <div className='col-md-6'>
              <div className="form-group mb-3">
                <label className='text-danger'>GCC/ Non-GCC</label>
                <input type='text' className='form-control' value={limitedData?.gcc_nongcc} />
              </div>
            </div>
          </div>

        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowLimitedModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

    </div>
  )
}

export default MotorPlan