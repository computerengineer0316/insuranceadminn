import React, { useRef } from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import Multiselect from "multiselect-react-dropdown";
import swal from 'sweetalert';
import { useToaster } from 'rsuite';


const EditTPLMotorPlan = () => {
    const navigate = useNavigate();

    const [bodyType, setBodyType] = useState([]);
    const [planFor, setPlanFor] = useState([]);
    const [businessType, setBusinessType] = useState([]);
    const [businessTypes, setBusinessTypes] = useState([]);
    const [gccspecs, setGccSpecs] = useState([]);
    const [nationality, setNationality] = useState([]);
    const [modelmotor, setModelMotor] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [rowsData, setRowsData] = useState([]);
    const [motor_plan_id, setMotorPlanId] = useState('');
    const [age, setAge] = useState('');
    const [age_topup, setAgeTopup] = useState('');
    const [driving, setDriving] = useState('');
    const [driving_topup, setDrivingTopup] = useState('');
    const [home, setHome] = useState('');
    const [home_topup, setHomeTopup] = useState('');
    const [claimyear, setClaimyear] = useState('');
    const [claimyear_topup, setClaimyearTopup] = useState('');
    const [gcc_spec, setGccSpec] = useState('');
    const [gcc_spec_topup, setGccSpecsTopup] = useState('');
    const [National, setNational] = useState('');
    const [NationalTopup, setNationalityTopup] = useState('');
    const [MakeMotor, setMakeMotor] = useState('');
    const [maketopup, setMakeTopup] = useState('')
    const [age_of_the_car, setAgeOfTheCar] = useState('');
    const [age_of_the_car_topup, setAgeOfTheCarTopup] = useState('');
    const [add_op_con_desc, setAddopcondesc] = useState('');
    const [add_op_con_desc_topup, setAddopcondesctopup] = useState('');
    const [vat, setVat] = useState('');
    const [bodytypes, setBodyTypes] = useState('');
    const [cylinder, setCylinder] = useState([]);
    const [cylinders, setCylinders] = useState([]);
    const [carValue, setCarValue] = useState('');
    const [carValueTopup, setCarValueTopup] = useState('');
    const [policytype, setPolicyTypid] = useState('')
    const [location, setLocation] = useState([]);
    const [defaultlocation, setDefaultLocation] = useState([]);
    const [defaultplanfor, setDefaultplanFor] = useState([])
    const [defplanfortopup, setPlanForTopup] = useState('')
    const [carPremium, setCArPremium] = useState('')
    const [premium, setPrimium] = useState('')
    const [natureOfPlan, setNatureOfPlan] = useState([])
    const [errmsg, setErrmsg] = useState({
        status: false,
        name: ''
    })

    const checkValues = {
        company_id: "Company Name",
        plan_name: "Plan Name",
        plan_category_id: "Plan Category",
        plan_label: "Plan Label",
        nature_of_plan_id: "Nature of Plan",
        electric_vehicle: "Electric Vehicle",
        car_value: "Car Value",
        car_value_topup: "Car Value Topup",
        rate: "Rate",
        min_premium: "Minimum Premium",
        premium: "Premium",
        excess: "Excess",
        age: "Age",
        agetopup: "Age Topup",
        drivingexp: "Driving Experience",
        drivingexptopup: "Driving Experience Topup",
        homedrivingexp: "Home Driving Experience",
        homedrivingexptopup: "Home Driving Experience Topup",
        claimyears: "Claim Years",
        claimyeardisc: "Claim Years Discount",
        last_year_policy_type_topup: "Last Years Policy Type Topup",
        gccspecstopup: "GCC Spec Topup",
        nationalitytopup: "Nationality Topup",
        age_of_the_car: "Age of The Car",
        age_of_the_car_topup: "Age of The Car",
        add_op_con_desc: "Additionial Option Condition Description",
        add_op_con_desc_topup: "Additionial Option Condition Description Topup",
        vat: "Vat",
        jdv_comm: "JDV Commission",
        sales_person_comm: "Sales Person Commissioin",
        body_type_name: "Body Type",
        repair_type_name: "Repair Type",
        business_type_name: "Buisness Type",
        plan_for_name: "Plan For"

    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            const url = window.location.href;
            const url1 = url.split("/")[3];
            const url2 = url1.split("?")[1];
            const id = url2.split("=")[1];
            setMotorPlanId(id);
            company_list();
            // Plancategory();
            NatureOfPlan();
            BodyType();
            // repair_condition();
            plan_for();
            business_type();
            gcc_specs();
            nationality_list();
            model_motor();
            motor_plan_details(id);
            locationList()

            const cylinder_list = [
                { id: 12, cylinder: '12' },
                { id: 10, cylinder: '10' },
                { id: 8, cylinder: '8' },
                { id: 6, cylinder: '6' },
                { id: 4, cylinder: '4' },
                { id: 2, cylinder: '2' },
            ];
            setCylinder(cylinder_list);
        }
    }, []);

    console.log(cylinder)
    const locationList = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_location`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const locationdt = data.data;
                const locData = [];
                for (let i = 0; i < locationdt.length; i++) {
                    locData.push({
                        label: locationdt[i].location_name,
                        value: locationdt[i]._id
                    })

                }
                setLocation(locData);
            });
    }

    const BodyType = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getBodyType`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const body_type = data.data;
                const body_type_dt = body_type.length;
                const body_type_obj = [];
                for (let i = 0; i < body_type_dt; i++) {
                    const body_type_obj1 = { _id: body_type[i]['_id'], body_type_name: body_type[i]['body_type_name'] };
                    body_type_obj.push(body_type_obj1);
                }
                setBodyType(body_type_obj);
            });
    }


    const plan_for = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getPlanFor`, requestOptions)
            .then(response => response.json())
            .then(data => {
                let plandata = data.data;
                setPlanFor(plandata);
            });
    }

    const business_type = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getBusinessType`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const btypes = data.data
                console.log(btypes, ">>>>>>>>> busness types options")
                const business_type_dt = btypes?.length;
                const business_type_obj = [];
                for (let i = 0; i < business_type_dt; i++) {
                    const business_type_obj1 = { _id: btypes[i]['_id'], business_type_name: btypes[i]['business_type_name'] };
                    business_type_obj.push(business_type_obj1);
                }
                setBusinessType(business_type_obj);
            });
    }

    const gcc_specs = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getGccSpecs`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setGccSpecs(data.data);
            });
    }

    const nationality_list = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getNationality`, requestOptions)
            // .then(response => response.json())
            // .then(data => {
            //     setNationality(data.data);
            // });
            .then(response => response.json())
            .then(data => {
                const nationalitydt = data.data;
                // const nationality_len = nationalitydt.length;
                // const nationality_list = [];
                // for(let i = 0; i < nationality_len; i++)
                // {
                //     const nationality_obj = {label: nationalitydt[i].nationality_name, value: nationalitydt[i]._id};
                //     nationality_list.push(nationality_obj);
                // }
                setNationality(nationalitydt);
            });
    }

    const model_motor = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getModelMotor`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setModelMotor(data.data);
            });
    }

    const company_list = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/company_list`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setCompanyList(data.data);
            });
    }

    const motor_plan_details = (id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/motor_plan_details/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setRowsData(data.data);
                console.log("data >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", data.data)

                setDefaultplanFor(data.data?.plan_for)
                const planfor = data.data?.plan_for

                if (planfor.length) {
                    const planfortotpupArr = [];
                    for (let j = 0; j < planfor.length; j++) {
                        planfortotpupArr.push(planfor[j].plan_for_topup);;

                    }
                    const topupvals = planfortotpupArr.join(",")
                    setPlanForTopup(topupvals)
                }
                setDefaultLocation(data.data?.location)
                setPolicyTypid(data.data?.policy_type_id)
                const body_type = data.data?.body_type;
                console.log(body_type, ">>>>>> body type")

                const body_type_dt = body_type.length;

                const bodytypeObj = [];
                const cylinder_obj = [];
                const body_premium = [];
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
                    for (let k = 0; k < uniqueCylinders.length; k++) {
                        body_premium.push(uniqueCylinders[k].min_primium)
                        premium.push(uniqueCylinders[k].premium)
                    }
                    const uniqueBodyTypes = removeDuplicateObjects(bodytypeObj, 'body_type_name');
                    console.log(">>>>>>>>>>>>>>>", uniqueCylinders, "<<<<<<<<<<<<")
                    setCylinders(uniqueCylinders);
                    let car_value_premium = body_premium.length > 1 ? body_premium.join(",") : body_premium[0]
                    let car__premium = premium.length > 1 ? premium.join(",") : premium[0]

                    setCArPremium(car_value_premium);
                    setPrimium(car__premium)
                    setBodyTypes(uniqueBodyTypes);

                    console.log(uniqueCylinders, ">>>>>>>>>>>>>>> Unique Cylinders")
                    console.log(uniqueBodyTypes, ">>>>>>>>>>>>>>> Unique body Types")
                }

                const repair_type = data.data.repair_type_id;
                const repair_type_dt = repair_type.length;
                const repair_type_obj = [];
                for (let i = 0; i < repair_type_dt; i++) {
                    const repair_type_obj1 = { _id: repair_type[i]['_id'], repair_type_name: repair_type[i]['repair_type_name'] };
                    repair_type_obj.push(repair_type_obj1);
                }

                const business_type = data.data.business_type_id;
                console.log(business_type, ">>>>>>>>>> this is business type")
                const business_type_dt = business_type?.length;
                const business_type_obj = [];
                for (let i = 0; i < business_type_dt; i++) {
                    const business_type_obj1 = { _id: business_type[i]['_id'], business_type_name: business_type[i]['business_type_name'] };
                    business_type_obj.push(business_type_obj1);
                }
                setBusinessTypes(business_type_obj);

                const age = data.data.age_or_topup;
                const age_dt = age.length;
                const age_obj = [];
                const age_topup = [];
                for (let i = 0; i < age_dt; i++) {
                    let age_obj1;
                    if (age[i]['ageMin'] == age[i]['ageMax']) {
                        age_obj1 = age[i]['ageMin'];
                    }
                    else {
                        age_obj1 = age[i]['ageMin'] + '-' + age[i]['ageMax'];
                    }
                    age_obj.push(age_obj1);

                    const age_topup1 = age[i]['agetopup'];
                    age_topup.push(age_topup1);
                }
                var ageValues = age_obj.join(',');
                var ageTopupValues = age_topup.join(',');
                setAge(ageValues);

                setAgeTopup(ageTopupValues);


                const car_value = data.data?.car_value;
                const car_value_dt = car_value.length;
                const car_value_obj = [];
                const car_value_topup = [];
                const car_premium = [];
                for (let i = 0; i < car_value_dt; i++) {
                    let car_value_obj1;
                    if (car_value[i]['car_valueMin'] == car_value[i]['car_valueMax']) {
                        car_value_obj1 = car_value[i]['car_value_topup'];
                    }
                    else {
                        car_value_obj1 = car_value[i]['car_valueMin'] + '-' + car_value[i]['car_valueMax'];
                    }
                    car_value_obj.push(car_value_obj1);

                    const car_value_topup1 = car_value[i]['car_value_topup'];

                    car_value_topup.push(car_value_topup1);

                }
                var car_valueValues = car_value_obj.length > 1 ? car_value_obj.join(',') : car_value_obj[0];
                var car_valueTopupValues = car_value_topup.join(',');

                setCarValueTopup(car_valueTopupValues);


                setCarValue(car_valueValues);

                if (car_value[0]?.excess) {
                    let car_value_premium = car_premium.length > 1 ? car_premium.join(",") : car_premium[0]
                    setCArPremium(car_value_premium)
                }


                const driving = data.data.drivingexp_or_topup;
                const driving_dt = driving.length;
                const driving_obj = [];
                const driving_topup = [];
                for (let i = 0; i < driving_dt; i++) {
                    let driving_obj1;
                    if (driving[i]['drivingExpMin'] == driving[i]['drivingExpMax']) {
                        driving_obj1 = driving[i]['drivingExpMin'];
                    }
                    else {
                        driving_obj1 = driving[i]['drivingExpMin'] + '-' + driving[i]['drivingExpMax'];
                    }
                    driving_obj.push(driving_obj1);

                    const driving_topup1 = driving[i]['drivingexptopup'];
                    driving_topup.push(driving_topup1);
                }
                var drivingValues = driving_obj.join(',');
                var drivingTopupValues = driving_topup.join(',');
                setDriving(drivingValues);
                setDrivingTopup(drivingTopupValues);

                const home = data.data.homedrivingexp_or_topup;
                const home_dt = home.length;
                const home_obj = [];
                const home_topup = [];
                for (let i = 0; i < home_dt; i++) {
                    let home_obj1;
                    if (home[i]['homeDrivingExpMin'] == home[i]['homeDrivingExpMax']) {
                        home_obj1 = home[i]['homeDrivingExpMin'];
                    }
                    else {
                        home_obj1 = home[i]['homeDrivingExpMin'] + '-' + home[i]['homeDrivingExpMax'];
                    }
                    home_obj.push(home_obj1);

                    const home_topup1 = home[i]['homedrivingexptopup'];
                    home_topup.push(home_topup1);
                }
                var homeValues = home_obj.join(',');
                var homeTopupValues = home_topup.join(',');
                setHome(homeValues);
                setHomeTopup(homeTopupValues);

                const claimyear = data.data?.claimyears_or_topup;
                const claimyear_dt = claimyear.length;
                const claimyear_obj = [];
                const claimyear_topup = [];
                for (let i = 0; i < claimyear_dt; i++) {
                    const claimyear_obj1 = claimyear[i]['claimyears'];
                    claimyear_obj.push(claimyear_obj1);

                    const claimyear_topup1 = claimyear[i]['claimyeardisc'];
                    claimyear_topup.push(claimyear_topup1);
                }
                var claimyearValues = claimyear_obj.join(',');
                if (claimyear_topup[0] == '') {
                    var claimyearTopupValues = claimyear_topup.join(',');

                } else {
                    var claimyearTopupValues = claimyear_topup.join(',');
                }
                setClaimyear(claimyearValues);
                setClaimyearTopup(claimyearTopupValues);

                const gcc_specs = data.data.plan_for_gcc_spec_name_or_topup;
                const gcc_specs_dt = gcc_specs.length;
                const gcc_specs_obj = [];
                const gcc_specs_topup = [];

                for (let i = 0; i < gcc_specs_dt; i++) {
                    const gcc_specs_obj1 = { _id: gcc_specs[i]['_id'], plan_for_gcc_spec_name: gcc_specs[i]['plan_for_gcc_spec_name'] };
                    gcc_specs_obj.push(gcc_specs_obj1);

                    const gcc_specs_topup1 = gcc_specs[i]['gccspecstopup'];
                    gcc_specs_topup.push(gcc_specs_topup1);
                }

                // var gcc_specsValues = gcc_specs_obj;
                var gcc_specsTopupValues = gcc_specs_topup.join(',');
                setGccSpec(gcc_specs_obj);
                setGccSpecsTopup(gcc_specsTopupValues);

                const nationality = data.data.nationality_or_topup;
                console.log(nationality, ">>>>>>>>>>>>>>>>>>>>>nationality obj")

                const nationality_dt = nationality.length;
                const nationality_obj = [];
                const nationality_topup = [];

                for (let i = 0; i < nationality_dt; i++) {
                    const nationality_obj1 = { _id: nationality[i]['_id'], nationality_name: nationality[i]['nationality_name'] };
                    nationality_obj.push(nationality_obj1);

                    const nationality_topup1 = nationality[i]['nationalitytopup'];
                    nationality_topup.push(nationality_topup1);
                }
                var nationalityTopupValues = nationality_topup.join(',');
                setNational(nationality_obj);
                setNationalityTopup(nationalityTopupValues);

                const age_of_the_car = data.data.age_of_the_car_or_topup;
                const age_of_the_car_dt = age_of_the_car.length;
                const age_of_the_car_obj = [];
                const age_of_the_car_topup = [];

                for (let i = 0; i < age_of_the_car_dt; i++) {
                    let age_of_the_car_obj1;
                    if (age_of_the_car[i]['age_of_the_car_min'] == age_of_the_car[i]['age_of_the_car_max']) {
                        age_of_the_car_obj1 = age_of_the_car[i]['age_of_the_car_min'];
                    }
                    else {
                        age_of_the_car_obj1 = age_of_the_car[i]['age_of_the_car_min'] + '-' + age_of_the_car[i]['age_of_the_car_max'];
                    }
                    age_of_the_car_obj.push(age_of_the_car_obj1);

                    const age_of_the_car_topup1 = age_of_the_car[i]['age_of_the_car_or_topup'];
                    age_of_the_car_topup.push(age_of_the_car_topup1);
                }

                var age_of_the_carValues = age_of_the_car_obj.join(',');
                var age_of_the_carTopupValues = age_of_the_car_topup.join(',');
                setAgeOfTheCar(age_of_the_carValues);
                setAgeOfTheCarTopup(age_of_the_carTopupValues);

                const add_op_con_desc = data.data.add_op_con_desc;
                const add_op_con_desc_dt = add_op_con_desc.length;
                const add_op_con_desc_obj = [];
                const add_op_con_desc_topup = [];
                const vat = [];
                for (let i = 0; i < add_op_con_desc_dt; i++) {
                    const add_op_con_desc_obj1 = add_op_con_desc[i]['add_op_con_desc'];
                    add_op_con_desc_obj.push(add_op_con_desc_obj1);

                    const add_op_con_desc_topup1 = add_op_con_desc[i]['add_op_con_desc_topup'];
                    add_op_con_desc_topup.push(add_op_con_desc_topup1);

                    const vat1 = add_op_con_desc[i]['vat'];
                    vat.push(vat1);
                }
                var add_op_con_descValues = add_op_con_desc_obj.join(',');
                var add_op_con_desc_topupValues = add_op_con_desc_topup.join(',');
                var vatValues = vat.join(',');

                setAddopcondesc(add_op_con_descValues);
                setAddopcondesctopup(add_op_con_desc_topupValues);
                setVat(vatValues);

                const make_motor = data.data.make_motor;
                const make_motor_dt = make_motor.length;
                const make_motor_obj = [];
                const make_motor_topupObj = []
                for (let i = 0; i < make_motor_dt; i++) {
                    const make_motor_obj1 = { _id: make_motor[i]['_id'], make_motor_name: make_motor[i]['make_motor_name'] };
                    make_motor_obj.push(make_motor_obj1);
                    make_motor_topupObj.push(make_motor[i].make_motor_topup ? make_motor[i].make_motor_topup : 0)

                }
                let makemotortopups = make_motor_topupObj.join(",")
                setMakeTopup(makemotortopups)
                setMakeMotor(make_motor_obj);
            });
    }



    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        // if(bodytypes.length != cylinders.length && rowsData.policy_type_id != "641161a4591c2f02bcddf51c"){
        //     Swal.fire({
        //         title: 'warning',
        //         text: `Number of Body Types and Cylinders Must be equal`,
        //         icon: 'warning',
        //         confirmButtonText: 'Ok'
        //     })
        //     return;
        // }
        for (const [fieldName, value] of data.entries()) {
            if (!value) {
                if (fieldName == "search_name_input" || fieldName == "plan_label" || fieldName == "electric_vehicle" || fieldName == "homedrivingexp" ||
                    fieldName == "homedrivingexptopup" || fieldName == "nationality_name" || fieldName == "agetopup" ||
                    fieldName == "claimyear" || fieldName == "claimyeardisc" || fieldName == "gccspecstopup" || fieldName == "car_value" ||
                    fieldName == "nationalitytopup" || fieldName == "age_of_the_car" || fieldName == "age_of_the_car_topup"
                    || fieldName == "add_op_con_desc" || fieldName == "add_op_con_desc_topup" || fieldName == "drivingexptopup"
                    || fieldName == "vat" || fieldName == "jdv_comm" || fieldName == "car_value_topup" || fieldName == "car_value" ||
                    fieldName == "drivingexp" || fieldName == "car_model_topup" || fieldName == "plan_for_topup" || fieldName == "business_type_name") {
                    continue;
                } else {
                    Swal.fire({
                        title: 'warning',
                        text: `${checkValues[fieldName]} is required`,
                        icon: 'warning',
                        confirmButtonText: 'Ok'
                    })
                    return;
                }
            }
        }
        if (!bodytypes.length) {
            Swal.fire({
                title: 'warning',
                text: `Body Types is required`,
                icon: 'warning',
                confirmButtonText: 'Ok'
            })
            return;
        }
        if (!defaultplanfor.length) {
            Swal.fire({
                title: 'warning',
                text: `Plan For is required`,
                icon: 'warning',
                confirmButtonText: 'Ok'
            })
            return;
        }

        const company_id = data.get('company_id');
        const plan_name = data.get('plan_name');
        const body_types = bodytypes;
        const cylinder = cylinders;
        const electric_vehicle = data.get('electric_vehicle');
        const nature_of_plan_id = data.get('nature_of_plan_id')
        const car_value = data.get('car_value');
        const plan_for_topup = data.get('plan_for_topup')
        const car_value_topup = data.get('car_value_topup');
        const min_premium = data.get('min_premium');
        const premium = data.get('premium');
        const age = data.get('age');
        const age_topup = data.get('agetopup');
        const drivingexp = data.get('drivingexp');
        const drivingexptopup = data.get('drivingexptopup');
        const homedrivingexp = data.get('homedrivingexp');
        const homedrivingexptopup = data.get('homedrivingexptopup');
        const claimyears = data.get('claimyear');
        const claimyeardisc = data.get('claimyeardisc');
        const gccspec = gcc_spec;
        const gccspecstopup = data.get('gccspecstopup');
        const Nationality = National;
        const NationalTopup = data.get('nationalitytopup');
        const make_motor = MakeMotor;
        const make_motor_topup = data.get('car_model_topup')
        const age_of_the_car = data.get('age_of_the_car');
        const age_of_the_car_topup = data.get('age_of_the_car_topup');
        const add_op_con_desc = data.get('add_op_con_desc');
        const add_op_con_desc_topup = data.get('add_op_con_desc_topup');
        const vat = data.get('vat');
        const jdv_comm = data.get('jdv_comm');





        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                company_id: company_id,
                form_type: 'TPL',
                policy_type_id: policytype,
                plan_name: plan_name,
                body_types: body_types,
                cylinders: cylinder,
                electric_vehicle: electric_vehicle,
                nature_of_plan_id: nature_of_plan_id,
                plan_for: defaultplanfor,
                plan_for_topup: plan_for_topup,
                business_type_id: businessTypes,
                car_value: car_value,
                car_value_topup: car_value_topup,
                min_premium: min_premium,
                premium: premium,
                age: age,
                age_topup: age_topup,
                drivingexp: drivingexp,
                drivingexptopup: drivingexptopup,
                homedrivingexp: homedrivingexp,
                homedrivingexptopup: homedrivingexptopup,
                claimyears: claimyears,
                claimyeardisc: claimyeardisc,
                gcc_spec: gccspec,
                gccspecstopup: gccspecstopup,
                nationality: Nationality,
                NationalTopup: NationalTopup,
                make_motor: make_motor,
                car_model_topup: make_motor_topup,
                age_of_the_car: age_of_the_car,
                age_of_the_car_topup: age_of_the_car_topup,
                add_op_con_desc: add_op_con_desc,
                add_op_con_desc_topup: add_op_con_desc_topup,
                vat: vat,
                jdv_comm: jdv_comm,
                location: defaultlocation
            })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updateMotorPlan/${motor_plan_id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    Swal.fire({
                        text: data.message,
                        icon: 'success',
                        button: false
                    })
                    navigate('/motor-plan');
                    setTimeout(() => {
                        Swal.close()
                    }, 1000);

                }
                else {
                    Swal.fire({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: false

                    })
                    navigate(0);
                    setTimeout(() => {
                        Swal.close()
                    }, 1000);
                }
            });
    }

    const handleChange = (selectedOption) => {
        setDefaultplanFor(selectedOption);
    };

    const handleChange1 = (selectedOption) => {
        setGccSpec(selectedOption);
    };
    const handleChangeLoc = (loc) => {
        setDefaultLocation(loc)
    }
    const handleChange2 = (National) => {
        console.log('National>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', National)
        setNational(National);
    };

    const handleChange3 = (selectedOption) => {
        setMakeMotor(selectedOption);
    };

    const handleChange4 = (selectedOption) => {
        // const business_type_dt = selectedOption?.length;
        //         const business_type_obj = [];
        //         for (let i = 0; i < business_type_dt; i++) {
        //             const business_type_obj1 = {
        //                  business_type_id: selectedOption[i]['business_type_id']?selectedOption[i]['business_type_id']
        //                  :selectedOption[i]['_id'],
        //                   business_type_name: selectedOption[i]['business_type_name'] };
        //             business_type_obj.push(business_type_obj1);
        //         }
        //         var business_typeValues = business_type_obj;
        setBusinessTypes(selectedOption);
    };

    const handleChange5 = (selectedOption) => {
        setBodyTypes(selectedOption);
    };

    const handleChange6 = (selectedOption) => {
        setCylinders(selectedOption);
    };
    const NatureOfPlan = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getNatureOfPlan`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setNatureOfPlan(data.data)
            })
    }
    const validateInput = (e) => {
        const inputValue = e.target.value;
        const textPattern = /^[A-Za-z,]*$/;
        if (!textPattern.test(inputValue)) {
            setErrmsg({ status: true, name: e.target.name })
            e.target.value = inputValue.replace(/[^a-zA-Z\s,]/g, '');
        } else {
            setErrmsg({ status: false, name: e.target.name })
        }
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card" style={{ marginTop: '20px' }}>
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="card-title">Edit Motor Plan</h4>
                                </div>
                                <div className="col-md-6">
                                    <button onClick={() => navigate(-1)} className="btn btn-primary" style={{ float: 'right' }}>Back</button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <form action='/' method="POST" onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Company Name</label>
                                            <select className="form-control" name="company_id">
                                                <option value="">Select Company</option>
                                                {
                                                    companyList.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item._id} selected={rowsData.company_id == item._id ? true : false}>{item.company_name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Plan Name</label>
                                            <input type="text" className="form-control" placeholder="Enter Plan Name" name="plan_name" autoComplete="off" defaultValue={rowsData.plan_name} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label className='text-danger' >Nature Of Plan</label>
                                            <select required className="form-control" name="nature_of_plan_id">
                                                <option value="">Select Nature Of Plan</option>
                                                {natureOfPlan.map((item, index) => {
                                                    return (
                                                        <option
                                                            key={index}
                                                            value={item._id}
                                                            selected={rowsData.nature_of_plan_id == item._id ? true : false}
                                                        >
                                                            {item.nature_of_plan_name}
                                                        </option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">

                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Body Type</label>
                                            <Multiselect
                                                options={bodyType}
                                                selectedValues={bodytypes}
                                                displayValue="body_type_name"
                                                showCheckbox={true}
                                                onSelect={handleChange5}
                                                onRemove={handleChange5}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Cylinder</label>
                                            <Multiselect
                                                options={cylinder}
                                                selectedValues={cylinders}
                                                displayValue="id"
                                                showCheckbox={true}
                                                onSelect={handleChange6}
                                                onRemove={handleChange6}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Min Premium</label>
                                            <input type="text" name="min_premium" className="form-control" placeholder="Enter Min Premium" autoComplete="off" defaultValue={carPremium} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Premium</label>
                                            <input type="text" name="premium" className="form-control" placeholder="Enter Premium" autoComplete="off" defaultValue={premium} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Electric Vehicle</label>
                                            <select className="form-control" name="electric_vehicle">
                                                <option value="0">Select</option>
                                                <option value="1" selected={rowsData.electric_vehicle == 1 ? true : false}>Yes</option>
                                                <option value="0" selected={rowsData.electric_vehicle == 0 ? true : false}>No</option>
                                            </select>
                                        </div>
                                    </div>

                                </div>
                                <div className='row'>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Plan For</label>
                                            <Multiselect
                                                options={planFor}
                                                selectedValues={defaultplanfor}
                                                displayValue="plan_for_name"
                                                showCheckbox={true}
                                                onSelect={handleChange}
                                                onRemove={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Fixed/Percentage/Reffered (Plan For)</label>
                                            <input type="text" name="plan_for_topup" className="form-control" placeholder="Enter Fixed/Percentage/Reffered (Plan For)" defaultValue={defplanfortopup} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Business Type</label>
                                            <Multiselect
                                                options={businessType}
                                                selectedValues={businessTypes}
                                                displayValue="business_type_name"
                                                showCheckbox={true}
                                                onSelect={handleChange4}
                                                onRemove={handleChange4}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Car Model</label>
                                            <Multiselect
                                                options={modelmotor}
                                                selectedValues={MakeMotor}
                                                displayValue="make_motor_name"
                                                showCheckbox={true}
                                                onSelect={handleChange3}
                                                onRemove={handleChange3}
                                            />
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className='form-group mb-3'>
                                            <label>Fixed/Percentage/Reffered (Car Model)</label>
                                            <input type="text"
                                                defaultValue={maketopup}
                                                // onChange={(evnt) => (handleChange(index, evnt))}
                                                name="car_model_topup" className="form-control"
                                                placeholder="Enter Fixed/Percentage/Reffered (Car Model Topup)" />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6" >
                                        <div className="form-group mb-3">
                                            <label>Car Value</label>
                                            <input type="text" name="car_value" className="form-control" placeholder="Enter Car Value" autoComplete="off" defaultValue={carValue} />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Fixed/Percentage/Reffered (Car Value)</label>
                                            <input type="text" name="car_value_topup" className="form-control" placeholder="Enter Car Value" autoComplete="off" defaultValue={carValueTopup} />
                                        </div>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Driver Age</label>
                                            <input type="text" name="age" className="form-control" placeholder="Enter Driver Age" autoComplete="off" defaultValue={age} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Fixed/Percentage/Reffered (Driver Age)</label>
                                            <input type="text" name="agetopup" className="form-control" placeholder="Enter Age Fixed/Percentage/Reffered" autoComplete="off" defaultValue={age_topup} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Nationality</label>
                                            <Multiselect
                                                options={nationality}
                                                selectedValues={National}
                                                displayValue="nationality_name"
                                                showCheckbox={true}
                                                onSelect={handleChange2}
                                                onRemove={handleChange2}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Fixed/Percentage/Reffered (Nationality)</label>
                                            <input type="text" name="nationalitytopup" className="form-control" placeholder="Enter Fixed/Percentage/Reffered (Nationality)" autoComplete="off" defaultValue={NationalTopup} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Driving Experiance</label>
                                            <input type="text" name="drivingexp" className="form-control" placeholder="Enter Driving Experience" autoComplete="off" defaultValue={driving} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Fixed/Percentage/Reffered (Driving Experiance)</label>
                                            <input type="text" name="drivingexptopup" className="form-control" placeholder="Enter Driving Experience Fixed/Percentage/Reffered" autoComplete="off" defaultValue={driving_topup} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Home Country Driving Experiance</label>
                                            <input type="text" name="homedrivingexp" className="form-control" placeholder="Enter Home Country Driving Experience" autoComplete="off" defaultValue={home} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Fixed/Percentage/Reffered (Home Country Driving Experiance)</label>
                                            <input type="text" name="homedrivingexptopup" className="form-control" placeholder="Enter Home Country Driving Experience Fixed/Percentage/Reffered" autoComplete="off" defaultValue={home_topup} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>No Claim Year</label>
                                            <input type="text" name="claimyear" className="form-control" placeholder="Enter Claim Year" autoComplete="off" defaultValue={claimyear} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>No Claim Discount</label>
                                            <input type="text" name="claimyeardisc" className="form-control" placeholder="Enter Claim Year Discount" autoComplete="off" defaultValue={claimyear_topup} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>GCC / NON-GCC</label>
                                            <Multiselect
                                                options={gccspecs}
                                                selectedValues={gcc_spec}
                                                displayValue="plan_for_gcc_spec_name"
                                                showCheckbox={true}
                                                onSelect={handleChange1}
                                                onRemove={handleChange1}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Fixed/Percentage/Reffered (GCC / No-GCC)</label>
                                            <input type="text" name="gccspecstopup" className="form-control" placeholder="Enter Fixed/Percentage/Reffered (GCC / No-GCC)" autoComplete="off" defaultValue={gcc_spec_topup} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">

                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Age Of The Car</label>
                                            <input type="text" name="age_of_the_car" className="form-control" placeholder="Enter Age Of The Car" autoComplete="off" defaultValue={age_of_the_car} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Fixed/Percentage/Reffered (Age Of The Car)</label>
                                            <input type="text" name="age_of_the_car_topup" className="form-control" placeholder="Enter Fixed/Percentage/Reffered (Age Of The Car)" autoComplete="off" defaultValue={age_of_the_car_topup} />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Add Option Condition Description</label>
                                            <input type="text" name="add_op_con_desc" onInput={(e) => validateInput(e)} className="form-control" placeholder="Enter Add Option Condition Description" autoComplete="off" defaultValue={add_op_con_desc} />
                                            {errmsg.status == true && errmsg.name == "add_op_con_desc" ? <span style={{ color: 'red' }}>Text Only</span> : ""}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Fixed/Percentage/Reffered (Add Option Condition Description)</label>
                                            <input type="text" name="add_op_con_desc_topup" className="form-control" placeholder="Enter Fixed/Percentage/Reffered (Add Option Condition Description)" autoComplete="off" defaultValue={add_op_con_desc_topup} />
                                        </div>
                                    </div>

                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Vat Able</label>
                                            <input type="text" name="vat" onInput={(e) => validateInput(e)} className="form-control" placeholder="Enter Vat Able" autoComplete="off" defaultValue={vat} />
                                            {errmsg.status == true && errmsg.name == "vat" ? <span style={{ color: 'red' }}>Text Only</span> : ""}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>JDV Commission</label>
                                            <input type="text" name="jdv_comm" className="form-control" placeholder="Enter JDV Commission" autoComplete="off" defaultValue={rowsData.jdv_comm} />
                                        </div>
                                    </div>

                                </div>
                                <div className='row'>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Location</label>
                                            <Multiselect
                                                options={location}
                                                selectedValues={defaultlocation}
                                                onSelect={(evnt) => (handleChangeLoc(evnt))}
                                                onRemove={(evnt) => (handleChangeLoc(evnt))}
                                                displayValue="label"
                                                placeholder="Select Location"
                                                closeOnSelect={false}
                                                avoidHighlightFirstOption={true}
                                                showCheckbox={true}
                                                style={{ chips: { background: "#007bff" } }}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <button type="submit" className="btn btn-primary mt-2" style={{ float: "right" }}>Update</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditTPLMotorPlan
