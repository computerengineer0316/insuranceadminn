import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import Multiselect from "multiselect-react-dropdown";

const EditYachtPlan = () => {
    const navigate = useNavigate();
    const [rowsData, setRowsData] = useState({});
    const [planCategory, setPlanCategory] = useState([]);
    const [natureOfPlan, setNatureOfPlan] = useState([]);
    const [bodyType, setBodyType] = useState([]);
    const [bodyTypeTopup, setBodyTypeTopup] = useState('');
    const [PlanFor, setPlanFor] = useState([]);
    const [PlanChangedFor, setChangedPlanFor] = useState([]);
    const [changedbuisness, setChagnedBuisness] = useState([]);
    const [changedBody, setChangedBodyType] = useState([]);
    const [changedHull, setChangedHull] = useState([]);
    const [changedHorsePower, setChangedHorsePower] = useState([]);
    const [changedEngine, setChangedEngine] = useState([]);
    const [changedSpeedKnot, setChangedSpeedKnot] = useState('');
    const [speedknotValues, setSpeedKnotValues] = useState('')
    const [businessType, setBusinessType] = useState([]);
    const [businessTypes, setBusinessTypes] = useState([]);
    const [hullmaterialtopup, setHullMaterialTopup] = useState([]);
    const [hullMaterial, setHullMaterial] = useState([]);
    const [horsePowerType, setHorsePowerType] = useState([])
    const [horsePowerTopup, setHorsePowerTopup] = useState([])
    const [engineType, setEngineType] = useState([])
    const [companyList, setCompanyList] = useState([]);
    const [last_year_policy_type, setLastYear] = useState([]);
    const [last_year_policy_type_topup, setLastYearTopup] = useState('');
    const [age_of_the_car, setAgeOfTheCar] = useState('');
    const [age_of_the_car_topup, setAgeOfTheCarTopup] = useState('');
    const [measurementValues, setMeasurementValues] = useState({
        measurementName: '',
        measurementValue: '',
        measurementtopups: ''
    })
    const [horsePower, setHorsePower] = useState({
        horse_power: '',
        horse_power_topup: ''
    })
    const [boat_breadth, setBoatBreadth] = useState({
        breadth_value: '',
        breadth_topup: ''
    })
    const [engineTypeTopup, setEngineTypeTopup] = useState('')
    const [speedKnot, setSpeedKnot] = useState([])
    const [speedKnotTopups, setSpeedKnotTopups] = useState('')
    const [drivingExpValues, setDrivingExpValues] = useState({
        Drivingvalues: '',
        Drivingtopups: ''
    });
    const [homeDriveExpValues, setHomeDriveExpValues] = useState({
        homeDrivingvalues: '',
        homeDrivingtopups: ''
    });
    const [HullEqp, setHullEqpValues] = useState({
        hullvalues: '',
        hulltopups: '',
        minpremium: ''
    });
    const [dinghyTenValues, setDinghyTenValues] = useState({
        dinghyvalues: '',
        dinghytopups: ''
    })
    const [outboardValues, setOutboardValues] = useState({
        outboard_rangeValues: '',
        outboard_rangeTopups: ''
    })
    const [personeffect, setPersonalEffValues] = useState({
        personal_effectValues: '',
        personal_effectTopups: ''
    })
    const [Trailer, setTrailerValues] = useState({
        trailerValues: '',
        trailerTopups: ''
    })
    const [ClaimYear, setClaimYearsValues] = useState({
        claimyear: '',
        claimyearDisc: ''
    });
    const [PassengerCap, setPassengerValues] = useState({
        passenger_capacityValues: '',
        passenger_capacityTopups: ''
    })
    const [CrewCap, setCrewValues] = useState({
        crew_capacityValues: '',
        crew_capacityTopups: ''
    })
    const [Addopcondesc, setAddOpConValues] = useState({
        addopcondescValues: '',
        addopcondescTopups: '',
        vat: ''
    });

    const [yacht_plan_id, setYachtPlanId] = useState('');
    const [location, setLocation] = useState([]);
    const [defaultlocation, setDefaultLocation] = useState([]);
    const [policyTypes, setPolicyTypes] = useState([]);
    const [errmsg, setErrmsg] = useState({
        status: false,
        name: '',
    })
    const [breadthList, setBreadthList] = useState([]);
    const [defualtboatbreadth, setBoatdefaultBreadth] = useState([]);
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
            yacht_plan_details(id);
            setYachtPlanId(id);
            Plancategory();
            NatureOfPlan();
            BodyType();
            plan_for();
            business_type();
            policy_types();
            company_list();
            horse_power();
            Engine_Type();
            Speed_Knot();
            yacht_hull_material();
            locationList();
            getBoatBreadth();

        }
    }, []);
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
    const policy_types = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getPolicyTypes`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const policy_type = data.data;
                const policy_type_dt = policy_type.length;
                const policy_type_obj = [];
                for (let i = 0; i < policy_type_dt; i++) {
                    const policy_type_obj1 = { _id: policy_type[i]['_id'], policy_type_name: policy_type[i]['policy_type_name'] };
                    policy_type_obj.push(policy_type_obj1);
                }
                setPolicyTypes(policy_type_obj);
            });
    }

    const Plancategory = () => {
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
            });
    }

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

    const BodyType = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getyachtbodytype`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const body_type = data.data;
                setBodyType(body_type);
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
                setPlanFor(data.data);
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
                setBusinessType(data.data);
            });
    }
    const getBoatBreadth = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/activeboaBreadth`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setBreadthList(data.data);
            });
    }
    const horse_power = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_Yacht_horespower_type`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setHorsePowerType(data.data);
            });
    }
    const Engine_Type = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_Yacht_engine_type_list`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setEngineType(data.data);
            });
    }
    const Speed_Knot = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_Yacht_speed_knot_typeList`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setSpeedKnot(data.data);
            });
    }

    const yacht_hull_material = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_Yacht_hull_materials`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setHullMaterial(data.data);
            });
    }


    const yacht_plan_details = (id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/yacht_plan_details/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const resData = data.data;
                console.log("edit data>>>>>> ", resData)
                setRowsData(resData);
                setChangedPlanFor(resData?.plan_for)
                setChagnedBuisness(resData?.business_type)
                setDefaultLocation(resData?.location)
                setChangedBodyType(resData?.yacht_body_type_or_topup)
                setChangedEngine(resData?.yacht_engine_type_or_topup)
                setChangedHorsePower(resData?.yacht_horsepower_type_or_topup)
                setChangedHull(resData?.yacht_hull_material_or_topup)
                setChangedSpeedKnot(resData?.yacht_speed_knot_type_or_topup)
                setBoatdefaultBreadth(resData?.yacht_breadth_value_or_topup)
                console.log("resData?.yacht_speed_knot_type_or_topup", resData?.yacht_speed_knot_type_or_topup)
                const y_b_type = data.data.yacht_body_type_or_topup;
                const y_b_type_topup_obj = [];

                for (let i = 0; i < y_b_type.length; i++) {
                    y_b_type_topup_obj.push(y_b_type[i]['y_b_topup']);

                }
                var y_b_topup_values = y_b_type_topup_obj.join(",")
                setBodyTypeTopup(y_b_topup_values);

                const yach_hull_material = data.data.yacht_hull_material_or_topup;
                const hull_materia_obj = [];
                for (let i = 0; i < yach_hull_material.length; i++) {

                    hull_materia_obj.push(yach_hull_material[i]['hull_material_topup']);
                }
                var hull_values = hull_materia_obj.join(",");
                setHullMaterialTopup(hull_values);

                // const horse_power = data.data.yacht_horsepower_type_or_topup;
                // const horse_power_obj = [];

                // for (let i = 0; i < horse_power.length; i++) {
                //     horse_power_obj.push(horse_power[i]['horse_power_topup'])
                // }
                // let horse_power_values = horse_power_obj.join(",");
                // setHorsePowerTopup(horse_power_values);

                const engine_type = data.data.yacht_engine_type_or_topup;
                const engine_type_obj = [];

                for (let i = 0; i < engine_type.length; i++) {
                    engine_type_obj.push(engine_type[i]['engine_type_topup']);
                }
                let engine_type_Values = engine_type_obj.join(",");
                setEngineTypeTopup(engine_type_Values);

                const measurement_values = data.data.measurement_value_or_topup;
                const measurement_name_obj = [];
                const measurement_value_obj = [];
                const measurement_value_topup = [];
                for (let i = 0; i < measurement_values.length; i++) {
                    const measurement_val_objmin = measurement_values[i]['Min'];
                    const measurement_val_objmax = measurement_values[i]['Max'];
                    measurement_name_obj.push(measurement_values[i]['measurement_type']);
                    measurement_value_obj.push(measurement_val_objmin + '-' + measurement_val_objmax);
                    measurement_value_topup.push(measurement_values[i]['measurement_topup']);
                }
                var m_v_id = measurement_name_obj;
                var m_v_names = measurement_value_obj.join(',');
                var m_v_topup = measurement_value_topup.join(',');
                setMeasurementValues({
                    measurementName: m_v_id,
                    measurementValue: m_v_names,
                    measurementtopups: m_v_topup
                });
                const yacht_speed_knot = data.data.yacht_speed_knot_type_or_topup;

                const speed_knot_topup = [];
                const speedknotValues = []
                for (let i = 0; i < yacht_speed_knot.length; i++) {
                    speedknotValues.push(yacht_speed_knot[i].min + "-" + yacht_speed_knot[i].max)
                    speed_knot_topup.push(yacht_speed_knot[i]['speed_knot_type_topup']);
                }
                var s_k_values = speedknotValues.join(",")
                var s_k_topup = speed_knot_topup.join(',');
                setSpeedKnotTopups(s_k_topup);
                setSpeedKnotValues(s_k_values)

                const horsepower_and_topup = data.data?.yacht_horsepower_type_or_topup;
                const horsepower_obj = [];
                const horsepower_topup = [];
                for (let i = 0; i < horsepower_and_topup.length; i++) {
                    let horsepower_obj1;
                    if (horsepower_and_topup[i]['min'] == horsepower_and_topup[i]['max']) {
                        horsepower_obj1 = horsepower_and_topup[i]['min'];
                    } else {
                        horsepower_obj1 = horsepower_and_topup[i]['min'] + '-' + horsepower_and_topup[i]['max'];
                    }
                    horsepower_obj.push(horsepower_obj1);
                    const horsepower_topup1 = horsepower_and_topup[i]['horsepower_topup'];
                    horsepower_topup.push(horsepower_topup1);
                }
                var horsepowerValues = horsepower_obj.join(',');
                var horsepowerTopupValues = horsepower_topup.join(',');
                setHorsePower({
                    horse_power: horsepowerValues,
                    horse_power_topup: horsepowerTopupValues
                });
                const boat_breadth = data.data?.yacht_breadth_value_or_topup;
                const boat_breadth_obj = [];
                const boat_breadth_topup = [];
                for (let i = 0; i < boat_breadth.length; i++) {
                    let boat_breadth_obj1;
                    if (boat_breadth[i]['min'] == boat_breadth[i]['max']) {
                        boat_breadth_obj1 = boat_breadth[i]['min'];
                    } else {
                        boat_breadth_obj1 = boat_breadth[i]['min'] + '-' + boat_breadth[i]['max'];
                    }
                    boat_breadth_obj.push(boat_breadth_obj1);
                    const boat_breadth_topup1 = boat_breadth[i]['breadth_topup'];
                    boat_breadth_topup.push(boat_breadth_topup1);
                }
                var boat_breadthValues = boat_breadth_obj.join(',');
                var boat_breadthTopupValues = boat_breadth_topup.join(',');
                setBoatBreadth({
                    breadth_value: boat_breadthValues,
                    breadth_topup: boat_breadthTopupValues
                });

                const driving = data.data.driving_experience_or_topup;

                const driving_obj = [];
                const driving_topup = [];
                for (let i = 0; i < driving.length; i++) {
                    var driving_obj1;
                    if (driving[i]['drive_expMin'] == driving[i]['drive_expMax']) {
                        driving_obj1 = driving[i]['drive_expMin'];
                    }
                    else {
                        driving_obj1 = driving[i]['drive_expMin'] + '-' + driving[i]['drive_expMax'];
                    }
                    driving_obj.push(driving_obj1);

                    const driving_topup1 = driving[i]['drive_experience_topup'];
                    driving_topup.push(driving_topup1);
                }
                var drivingValues = driving_obj.join(',');
                var drivingTopupValues = driving_topup.join(',');
                setDrivingExpValues({
                    Drivingvalues: drivingValues,
                    Drivingtopups: drivingTopupValues
                });

                const home = data.data.home_country_driving_experience_or_topup;
                const home_obj = [];
                const home_topup = [];
                for (let i = 0; i < home.length; i++) {
                    let home_obj1;
                    if (home[i]['country_drive_expMin'] == home[i]['country_drive_expMax']) {
                        home_obj1 = home[i]['country_drive_expMin'];
                    }
                    else {
                        home_obj1 = home[i]['country_drive_expMin'] + '-' + home[i]['country_drive_expMax'];
                    }
                    home_obj.push(home_obj1);

                    const home_topup1 = home[i]['country_drive_experience_topup'];
                    home_topup.push(home_topup1);
                }
                var homeValues = home_obj.join(",");
                var homeTopupValues = home_topup.join(",");
                setHomeDriveExpValues({
                    homeDrivingvalues: homeValues,
                    homeDrivingtopups: homeTopupValues
                });

                const hull_and_eqp = data.data?.hull_and_equipment_value_range_or_topup;
                console.log("hull values<<<<<:", hull_and_eqp)
                const hull_and_eqp_obj = [];
                const hull_and_eqp_topup = [];
                const min_prim_arr = [];
                for (let i = 0; i < hull_and_eqp.length; i++) {
                    let hull_and_eqp_obj1;
                    if (hull_and_eqp[i]['hull_equipment_Min'] == hull_and_eqp[i]['hull_equipment_Max']) {
                        hull_and_eqp_obj1 = hull_and_eqp[i]['hull_equipment_Min'];
                    }
                    else {
                        hull_and_eqp_obj1 = hull_and_eqp[i]['hull_equipment_Min'] + '-' + hull_and_eqp[i]['hull_equipment_Max'];
                    }
                    hull_and_eqp_obj.push(hull_and_eqp_obj1);
                    min_prim_arr.push(hull_and_eqp[i]['minimum_premium']);
                    const hull_and_eqp_topup1 = hull_and_eqp[i]['hull_equipment_value_range_topup'];

                    hull_and_eqp_topup.push(hull_and_eqp_topup1);
                }
                var hull_and_eqpValues = hull_and_eqp_obj?.join(',');
                var hull_and_eqpTopupValues = hull_and_eqp_topup?.join(',');
                var min_premium = min_prim_arr?.join(',');
                setHullEqpValues({
                    hullvalues: hull_and_eqpValues,
                    hulltopups: hull_and_eqpTopupValues,
                    minpremium: min_premium
                });

                const dinghy_ten = data.data?.dinghy_ten_value_range_or_topup;
                const dinghy_ten_obj = [];
                const dinghy_ten_topup = [];
                const din_ten_rate = []
                for (let i = 0; i < dinghy_ten.length; i++) {
                    let dinghy_ten_obj1;
                    if (dinghy_ten[i]['dinghy_tender_Min'] == dinghy_ten[i]['dinghy_tender_Max']) {
                        dinghy_ten_obj1 = dinghy_ten[i]['dinghy_tender_Min'];
                    }
                    else {
                        dinghy_ten_obj1 = dinghy_ten[i]['dinghy_tender_Min'] + '-' + dinghy_ten[i]['dinghy_tender_Max'];
                    }
                    dinghy_ten_obj.push(dinghy_ten_obj1);

                    const dinghy_ten_topup1 = dinghy_ten[i]['dinghy_or_tender_value_topup'];
                    dinghy_ten_topup.push(dinghy_ten_topup1);
                    din_ten_rate.push(dinghy_ten[i]?.rate)
                }
                var dinghy_tenValues = dinghy_ten_obj.join(',');
                var dinghy_tenTopupValues = dinghy_ten_topup.join(',');
                var din_Rate = din_ten_rate?.join(",")
                setDinghyTenValues({
                    dinghyvalues: dinghy_tenValues,
                    dinghytopups: dinghy_tenTopupValues,
                    rate: din_Rate
                })

                const outboard_range = data.data.outboard_value_range_or_topup;
                const outboard_range_obj = [];
                const outboard_range_topup = [];
                const out_Rate = [];
                for (let i = 0; i < outboard_range.length; i++) {
                    let outboard_range_obj1;
                    if (outboard_range[i]['outboard_value_range_Min'] == outboard_range[i]['outboard_value_range_Max']) {
                        outboard_range_obj1 = outboard_range[i]['outboard_value_range_Min'];
                    }
                    else {
                        outboard_range_obj1 = outboard_range[i]['outboard_value_range_Min'] + '-' + outboard_range[i]['outboard_value_range_Max'];
                    }
                    outboard_range_obj.push(outboard_range_obj1);

                    const outboard_range_topup1 = outboard_range[i]['outboard_value_range_topup'];
                    outboard_range_topup.push(outboard_range_topup1);
                    out_Rate.push(outboard_range[i]?.rate)
                }
                var outboard_rangeValues = outboard_range_obj.join(',');
                var outboard_rangeTopupValues = outboard_range_topup.join(',');
                var ratedata = out_Rate?.join(",")
                setOutboardValues({
                    outboard_rangeValues: outboard_rangeValues,
                    outboard_rangeTopups: outboard_rangeTopupValues,
                    rate: ratedata
                })

                const personal_effect = data.data.personal_eff_cash_or_topup;
                const personal_effect_obj = [];
                const personal_effect_topup = [];
                const person_rate = []
                for (let i = 0; i < personal_effect.length; i++) {
                    let personal_effect_obj1;
                    if (personal_effect[i]['personal_effect_cash_range_Min'] == personal_effect[i]['personal_effect_cash_range_Max']) {
                        personal_effect_obj1 = personal_effect[i]['personal_effect_cash_range_Min'];
                    }
                    else {
                        personal_effect_obj1 = personal_effect[i]['personal_effect_cash_range_Min'] + '-' + personal_effect[i]['personal_effect_cash_range_Max'];
                    }
                    personal_effect_obj.push(personal_effect_obj1);

                    const personal_effect_topup1 = personal_effect[i]['personal_effect_cash_range_topup'];
                    personal_effect_topup.push(personal_effect_topup1);
                    person_rate.push(personal_effect[i]?.rate)
                }
                var personal_effectValues = personal_effect_obj.join(',');
                var personal_effectTopupValues = personal_effect_topup.join(',');
                var personrate = person_rate?.join(",")
                setPersonalEffValues({
                    personal_effectValues: personal_effectValues,
                    personal_effectTopups: personal_effectTopupValues,
                    rate: personrate
                })

                const trailer = data.data.trailer_or_topup;
                const trailer_obj = [];
                const trailer_topup = [];
                const trailer_rate = [];
                for (let i = 0; i < trailer.length; i++) {
                    let trailer_obj1;
                    if (trailer[i]['trailer_Min'] == trailer[i]['trailer_Max']) {
                        trailer_obj1 = trailer[i]['trailer_Min'];
                    }
                    else {
                        trailer_obj1 = trailer[i]['trailer_Min'] + '-' + trailer[i]['trailer_Max'];
                    }
                    trailer_obj.push(trailer_obj1);
                    trailer_rate.push(trailer[i]?.rate)

                    const trailer_topup1 = trailer[i]['trailer_topup'];
                    trailer_topup.push(trailer_topup1);
                }
                var trailerValues = trailer_obj.join(',');
                var trailerTopupValues = trailer_topup.join(',');
                var ratedata = trailer_rate?.join(",")
                setTrailerValues({
                    trailerValues: trailerValues,
                    trailerTopups: trailerTopupValues,
                    rate: ratedata
                })


                const claimyear = data.data.no_claim_years;

                const claimyear_obj = [];
                const claimyear_disc_obj = [];
                for (let i = 0; i < claimyear.length; i++) {
                    const claimyear_obj1 = claimyear[i]['claimyears'];
                    claimyear_obj.push(claimyear_obj1);

                    const claimyear_topup1 = claimyear[i]['claimyeardisc'];
                    claimyear_disc_obj.push(claimyear_topup1);
                }
                var claimyearValues = claimyear_obj.join(',');
                var claimyearTopupValues = claimyear_disc_obj.join(',');
                setClaimYearsValues({
                    claimyear: claimyearValues,
                    claimyearDisc: claimyearTopupValues
                });

                const passenger_capacity = data.data.passenger_capacity_or_topup;
                const passenger_capacity_obj = [];
                const passenger_capacity_topup = [];
                for (let i = 0; i < passenger_capacity.length; i++) {
                    let passenger_capacity_obj1;
                    if (passenger_capacity[i]['passenger_capacity_Min'] == passenger_capacity[i]['passenger_capacity_Max']) {
                        passenger_capacity_obj1 = passenger_capacity[i]['passenger_capacity_Min'];
                    }
                    else {
                        passenger_capacity_obj1 = passenger_capacity[i]['passenger_capacity_Min'] + '-' + passenger_capacity[i]['passenger_capacity_Max'];
                    }
                    passenger_capacity_obj.push(passenger_capacity_obj1);

                    const passenger_capacity_topup1 = passenger_capacity[i]['passenger_capacity_topup'];
                    passenger_capacity_topup.push(passenger_capacity_topup1);
                }
                var passenger_capacityValues = passenger_capacity_obj.join(',');
                var passenger_capacityTopupValues = passenger_capacity_topup.join(',');
                setPassengerValues({
                    passenger_capacityValues: passenger_capacityValues,
                    passenger_capacityTopups: passenger_capacityTopupValues
                })

                const crew_capacity = data.data.crew_capacity_or_topup;
                const crew_capacity_obj = [];
                const crew_capacity_topup = [];
                for (let i = 0; i < crew_capacity.length; i++) {
                    let crew_capacity_obj1;
                    if (crew_capacity[i]['crew_capacity_Min'] == crew_capacity[i]['crew_capacity_Max']) {
                        crew_capacity_obj1 = crew_capacity[i]['crew_capacity_Min'];
                    }
                    else {
                        crew_capacity_obj1 = crew_capacity[i]['crew_capacity_Min'] + '-' + crew_capacity[i]['crew_capacity_Max'];
                    }
                    crew_capacity_obj.push(crew_capacity_obj1);

                    const crew_capacity_topup1 = crew_capacity[i]['crew_capacity_topup'];
                    crew_capacity_topup.push(crew_capacity_topup1);
                }
                var crew_capacityValues = crew_capacity_obj.join(',');
                var crew_capacityTopupValues = crew_capacity_topup.join(',');
                setCrewValues({
                    crew_capacityValues: crew_capacityValues,
                    crew_capacityTopups: crew_capacityTopupValues
                })
                const last_year_policy_type = data.data.last_year_policy_type_or_topup;
                const last_year_policy_type_dt = last_year_policy_type.length;
                const last_year_policy_type_obj = [];
                const last_year_policy_type_topup = [];
                for (let i = 0; i < last_year_policy_type_dt; i++) {
                    const last_year_policy_type_obj1 = { _id: last_year_policy_type[i]['_id'], policy_type_name: last_year_policy_type[i]['last_year_policy_type'] };
                    last_year_policy_type_obj.push(last_year_policy_type_obj1);

                    const last_year_policy_type_topup1 = last_year_policy_type[i]['last_year_policy_type_topup'];
                    last_year_policy_type_topup.push(last_year_policy_type_topup1);
                }
                var last_year_policy_typeValues = last_year_policy_type_obj;
                var last_year_policy_typeTopupValues = last_year_policy_type_topup.join(',');
                setLastYear(last_year_policy_typeValues);
                setLastYearTopup(last_year_policy_typeTopupValues);
                const age_of_the_car = data.data.age_of_the_car_or_topup;
                const age_of_the_car_dt = age_of_the_car.length;
                const age_of_the_car_obj = [];
                const age_of_the_car_topup = [];

                for (let i = 0; i < age_of_the_car_dt; i++) {
                    let age_of_the_car_obj1;
                    if (age_of_the_car[i]['age_of_the_boat_min'] == age_of_the_car[i]['age_of_the_boat_max']) {
                        age_of_the_car_obj1 = age_of_the_car[i]['age_of_the_boat_min'];
                    }
                    else {
                        age_of_the_car_obj1 = age_of_the_car[i]['age_of_the_boat_min'] + '-' + age_of_the_car[i]['age_of_the_boat_max'];
                    }
                    age_of_the_car_obj.push(age_of_the_car_obj1);

                    const age_of_the_car_topup1 = age_of_the_car[i]['age_of_the_boat_topup'];
                    age_of_the_car_topup.push(age_of_the_car_topup1);
                }

                var age_of_the_carValues = age_of_the_car_obj.join(',');
                var age_of_the_carTopupValues = age_of_the_car_topup.join(',');
                setAgeOfTheCar(age_of_the_carValues);
                setAgeOfTheCarTopup(age_of_the_carTopupValues);

                const add_op_con_desc = data.data.add_op_con_desc_or_topup;

                const add_op_con_desc_obj = [];
                const add_op_con_desc_topup = [];
                const vat = [];
                for (let i = 0; i < add_op_con_desc.length; i++) {
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

                setAddOpConValues({
                    addopcondescValues: add_op_con_descValues,
                    addopcondescTopups: add_op_con_desc_topupValues,
                    vat: vatValues
                });

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
    const handleChange8 = (selectedOption) => {
        setLastYear(selectedOption);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const plan_name = data.get('plan_name');
        const company_id = data.get('company_id');
        const plan_category_id = data.get('plan_category_id');
        const nature_of_plan_id = data.get('nature_of_plan_id');
        const plan_for = PlanChangedFor;
        const business_type_id = changedbuisness;
        const initial_rate = data.get('initial_rate')
        const discounted_rate = data.get('discounted_rate')
        const rate = data.get('rate');
        const excess = data.get('excess');
        const YachtBodyType = changedBody;
        const bodyTypeTopup = data.get('body_type_ptopup');
        const yachtHulltype = changedHull;
        const HullTypeTopup = data.get('hull_material_topup');

        const boat_horsepower = data.get('boat_horsepower');
        const horsepower_topup = data.get('horsepower_topup')
        const EngineType = changedEngine;
        const EngineTypeTopup = data.get('engine_type_topup');
        const SpeedKnotType = data.get('yacht_speed_knot_type');
        const speedKnotTypeTopup = data.get('speed_knot_topup');
        const breadth_value = data.get('breadth_value');
        const breadth_topup = data.get('breadth_topup')
        const measurementValue = data.get('measurement_value');
        const measurementTopup = data.get('measurement_topup');
        const drivingexp = data.get('drivingexp');
        const drivingexptopup = data.get('drivingexptopup');
        const hull_and_eqp_range = data.get('hull_and_eqp_range')
        const hull_and_eqp_range_topup = data.get('hull_and_eqp_topup')
        const din_ten_val_range = data.get('din_ten_val_range')
        const din_ten_val_range_topup = data.get('din_ten_val_topup')
        const outboard_range = data.get('outboard_range')
        const outboard_range_topup = data.get('outboard_range_topup')
        const personal_eff = data.get('personal_eff')
        const personal_eff_topup = data.get('personal_eff_topup')
        const trailer = data.get('trailer')
        const trailer_topup = data.get('trailer_topup')
        const trailer_rate = data.get("trailer_rate")
        const din_ten_val_rate = data.get("din_ten_val_rate")
        const outboard_range_rate = data.get("outboard_range_rate")
        const personal_eff_rate = data.get("personal_eff_rate")
        const claimyears = data.get('claimyears');
        const claimyeardisc = data.get('claimyeardisc');
        const passenger_capacity = data.get('passenger_capacity')
        const passenger_capacity_topup = data.get('passenger_capacity_topup')
        const crew_capacity = data.get('crew_capacity')
        const crew_capacity_topup = data.get('crew_capacity_topup')
        const add_op_con_desc = data.get('add_op_con_desc');
        const add_op_con_desc_topup = data.get('add_op_con_desc_topup');
        const vat = data.get('vat');
        const jdv_comm = data.get('jdv_comm');
        const minimum_premium = data.get('minimum_premium');
        const last_year_policy = last_year_policy_type;
        const last_year_policy_type_topup = data.get('last_year_policy_type_topup');
        const age_of_the_car = data.get('age_of_the_car');
        const age_of_the_car_topup = data.get('age_of_the_car_topup');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                plan_name: plan_name,
                policy_type: "Comprehensive",
                company_id: company_id,
                plan_category_id: plan_category_id,
                nature_of_plan_id: nature_of_plan_id,
                plan_for_name: plan_for,
                business_type_name: business_type_id,
                // initial_rate: initial_rate,
                // discount_rate: discounted_rate,
                rate: rate,
                excess: excess,
                yacht_body_type: YachtBodyType,
                yb_topup: bodyTypeTopup,
                yacht_hull_material: yachtHulltype,
                hull_material_topup: HullTypeTopup,
                boat_horsepower: boat_horsepower,
                horsepower_topup: horsepower_topup,
                breadth_value: defualtboatbreadth,
                breadth_topup: breadth_topup,
                yacht_engine_type: EngineType,
                engine_type_topup: EngineTypeTopup,
                // measurement: measurementType,
                measurement_value: measurementValue,
                m_v_topup: measurementTopup,
                yacht_speed_knot_type: SpeedKnotType,
                s_k_topup: speedKnotTypeTopup,
                driving_experience: drivingexp,
                driving_exp_topup: drivingexptopup,
                // home_country_driving_experience: homedrivingexp,
                // h_c_driving_exp_topup: homedrivingexptopup,
                hull_and_eq_value_range: hull_and_eqp_range,
                hull_and_eqvr_topup: hull_and_eqp_range_topup,
                den_ten_value_range: din_ten_val_range,
                den_tender_topup: din_ten_val_range_topup,
                outboard_value_range: outboard_range,
                outboard_value_range_topup: outboard_range_topup,
                personal_eff_cash: personal_eff,
                personal_eff_cash_topup: personal_eff_topup,
                trailer: trailer,
                trailer_topup: trailer_topup,
                trailer_rate: trailer_rate,
                claim_years: claimyears,
                claim_years_disc: claimyeardisc,
                pass_capacity: passenger_capacity,
                pass_capacity_topup: passenger_capacity_topup,
                crew_capacity: crew_capacity,
                crew_capacity_topup: crew_capacity_topup,
                add_op_con_desc: add_op_con_desc,
                add_op_con_desc_topup: add_op_con_desc_topup,
                vat_able: vat,
                minimum_premium: minimum_premium,
                jdv_commission: jdv_comm,
                last_year_policy_type: last_year_policy,
                last_year_policy_type_topup: last_year_policy_type_topup,
                age_of_the_car: age_of_the_car,
                age_of_the_car_topup: age_of_the_car_topup,
                location: defaultlocation,
                personal_eff_rate: personal_eff_rate,
                outboard_range_rate: outboard_range_rate,
                din_ten_val_rate: din_ten_val_rate
            })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updateYachtplan/${yacht_plan_id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    Swal.fire({
                        title: 'Success',
                        text: data.message,
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/yachtplan');
                        }
                    })
                }
                else {
                    Swal.fire({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        confirmButtonText: "Ok",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate("/yachtplan");
                        }
                    });
                }
            });
    }

    const handleChange1 = (selectedOption) => {
        console.log(selectedOption)
        setChangedPlanFor(selectedOption);

    };

    const handleChange2 = (selectedOption) => {
        setChagnedBuisness(selectedOption)
    };

    const handleChange3 = (selectedOption) => {
        setChangedBodyType(selectedOption)
    };

    const handleChange4 = (selectedOption) => {
        setChangedHull(selectedOption);

    };

    const handleChange5 = (selectedOption) => {
        setChangedHorsePower(selectedOption);
    };

    const handleChange6 = (selectedOption) => {
        setChangedEngine(selectedOption);

    };

    const handleChange7 = (selectedOption) => {
        setChangedSpeedKnot(selectedOption);

    };
    const handleChangeLoc = (loc) => {
        setDefaultLocation(loc)
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
    const descriptionChange = (e) => {
        try {
            const inputValue = e.target.value;
            let conValues = Addopcondesc
            conValues["addopcondescValues"] = inputValue;
            setAddOpConValues(conValues)

        } catch (err) {
            console.log(err)
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
                                    <h4 className="card-title">Edit Yacht Plan</h4>
                                </div>
                                <div className="col-md-6">
                                    <button onClick={() => navigate(-1)} className="btn btn-primary" style={{ float: 'right' }}>Back</button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <form action="/" method="POST"
                                onSubmit={handleSubmit}
                            >
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Plan Name</label>
                                            <input required type="text" className="form-control" placeholder="Enter Plan Name" name="plan_name" autoComplete="off" defaultValue={rowsData.plan_name} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Company Name</label>
                                            <select required className="form-control" name="company_id">
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
                                            <label className='text-danger'>Plan Category</label>
                                            <select required className="form-control" name="plan_category_id">
                                                <option value="">Select Plan Category</option>
                                                {
                                                    planCategory.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item._id} selected={rowsData.plan_category_id == item._id ? true : false}>{item.plan_category_name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>


                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Nature Of Plan</label>
                                            <select required className="form-control" name="nature_of_plan_id">
                                                <option value="">Select Nature Of Plan</option>
                                                {
                                                    natureOfPlan.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item._id} selected={rowsData.nature_of_plan_id == item._id ? true : false}>{item.nature_of_plan_name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Plan For</label>
                                            <Multiselect
                                                options={PlanFor}
                                                selectedValues={rowsData.plan_for}
                                                displayValue="plan_for_name"
                                                showCheckbox={true}
                                                onSelect={handleChange1}
                                                onRemove={handleChange1}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Business Type</label>
                                            <Multiselect
                                                options={businessType}
                                                selectedValues={rowsData.business_type}
                                                displayValue="business_type_name"
                                                showCheckbox={true}
                                                onSelect={handleChange2}
                                                onRemove={handleChange2}
                                            />
                                        </div>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>HULL AND EQUIPMENT VALUE RANGE</label>
                                            <input required type="text" name="hull_and_eqp_range" className="form-control" placeholder="Enter Hull and equipment value range" autoComplete="off" defaultValue={HullEqp?.hullvalues} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Topup(HULL AND EQUIPMENT VALUE RANGE)</label>
                                            <input required type="text" name="hull_and_eqp_topup" className="form-control" placeholder="Enter Topup (Hull and equipment value range)" autoComplete="off" defaultValue={HullEqp?.hulltopups} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Rate %</label>
                                            <input required type="text" name="rate" className="form-control" placeholder="Enter Rate" autoComplete="off" defaultValue={rowsData?.rate} />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">

                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Minimum Premium</label>
                                            <input required type="text" name="minimum_premium" className="form-control" placeholder="Enter Minimum Premium" autoComplete="off" defaultValue={HullEqp?.minpremium} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Excess</label>
                                            <input required type="text" className="form-control" placeholder="Enter Excess" name="excess" autoComplete="off" defaultValue={rowsData.excess} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>DINGHY/TENDER VALUE RANGE</label>
                                            <input required type="text" name="din_ten_val_range" className="form-control" placeholder="Enter DINGHY/TENDER VALUE RANGE" autoComplete="off" defaultValue={dinghyTenValues.dinghyvalues} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Topup(DINGHY/TENDER VALUE RANGE)</label>
                                            <input type="text" name="din_ten_val_topup" className="form-control" placeholder="Enter Topup (DINGHY/TENDER VALUE RANGE)" autoComplete="off" defaultValue={dinghyTenValues.dinghytopups} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Rate</label>
                                            <input type="text" name="din_ten_val_rate" className="form-control" placeholder="Enter Rate (DINGHY/TENDER VALUE RANGE)" autoComplete="off" defaultValue={dinghyTenValues.rate} />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Outboard value range</label>
                                            <input required type="text" name="outboard_range" className="form-control" placeholder="Enter Outboard Value Range" autoComplete="off" defaultValue={outboardValues.outboard_rangeValues} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Topup(Outboard value range)</label>
                                            <input type="text" name="outboard_range_topup" className="form-control" placeholder="Enter Topup (Outboard Value Range)" autoComplete="off" defaultValue={outboardValues.outboard_rangeTopups} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Outboard Value Rate</label>
                                            <input type="text" name="outboard_range_rate" className="form-control" placeholder="Enter Topup (Outboard Value Range)" autoComplete="off" defaultValue={outboardValues.rate} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Personal Effects including Cash</label>
                                            <input required type="text" name="personal_eff" className="form-control" placeholder="Enter Personal Effects including Cash" autoComplete="off" defaultValue={personeffect.personal_effectValues} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Topup(Personal Effects including Cash)</label>
                                            <input type="text" name="personal_eff_topup" className="form-control" placeholder="Enter Topup (Personal Effects including Cash)" autoComplete="off" defaultValue={personeffect.personal_effectTopups} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Rate</label>
                                            <input type="text" name="personal_eff_rate" className="form-control" placeholder="Rate (Personal Effects including Cash)" autoComplete="off" defaultValue={personeffect.rate} />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Trailer</label>
                                            <input required type="text" name="trailer" className="form-control" placeholder="Enter Trailer" autoComplete="off" defaultValue={Trailer.trailerValues} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Topup(Trailer)</label>
                                            <input type="text" name="trailer_topup" className="form-control" placeholder="Enter Topup (Trailer)" autoComplete="off" defaultValue={Trailer.trailerTopups} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Trailer Rate</label>
                                            <input type="text" name="trailer_rate" className="form-control" placeholder="Enter Trailer Rate" autoComplete="off" defaultValue={Trailer.rate} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">


                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Yacht Body Type</label>
                                            <Multiselect
                                                options={bodyType}
                                                selectedValues={rowsData.yacht_body_type_or_topup}
                                                displayValue="yacht_body_type"
                                                showCheckbox={true}
                                                onSelect={handleChange3}
                                                onRemove={handleChange3}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Topup(Yacht Body Type)</label>
                                            <input type="text" name="body_type_ptopup" className="form-control" placeholder="Enter Topup (Yacht body type)" autoComplete="off" defaultValue={bodyTypeTopup} />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">

                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Hull Material</label>
                                            <Multiselect
                                                options={hullMaterial}
                                                selectedValues={rowsData.yacht_hull_material_or_topup}
                                                displayValue="yacht_hull_material"
                                                showCheckbox={true}
                                                onSelect={handleChange4}
                                                onRemove={handleChange4}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Topup(Hull Materail)</label>
                                            <input type="text" name="hull_material_topup" className="form-control" placeholder="Enter Topup (Hull Material)" autoComplete="off" defaultValue={hullmaterialtopup} />
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="row">

                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>HORSEPOWER</label>
                                            <Multiselect
                                                options={horsePowerType}
                                                selectedValues={rowsData.yacht_horsepower_type_or_topup}
                                                displayValue="yacht_horsepower_type"
                                                showCheckbox={true}
                                                onSelect={handleChange5}
                                                onRemove={handleChange5}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Topup(HORSEPOWER)</label>
                                            <input required type="text" name="horse_power_topup" className="form-control" placeholder="Enter Topup (HORSEPOWER)" autoComplete="off" defaultValue={horsePowerTopup} />
                                        </div>
                                    </div>

                                </div> */}
                                <div className="row">

                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>ENGINETYPE</label>
                                            <Multiselect
                                                options={engineType}
                                                selectedValues={rowsData.yacht_engine_type_or_topup}
                                                displayValue="yacht_engine_type"
                                                showCheckbox={true}
                                                onSelect={handleChange6}
                                                onRemove={handleChange6}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Topup(ENGINETYPE)</label>
                                            <input type="text" name="engine_type_topup" className="form-control" placeholder="Enter Topup (ENGINE TYPE)" autoComplete="off" defaultValue={engineTypeTopup} />
                                        </div>
                                    </div>

                                </div>
                                <div className="row">

                                    {/* <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>MEASUREMENT</label>
                                            <input required type="text" name="measurement" className="form-control" placeholder="Enter MEASUREMENTS" autoComplete="off" defaultValue={measurementValues.measurementName} />
                                        </div>
                                    </div> */}
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Boat Length</label>
                                            <input required type="text" name="measurement_value" className="form-control" placeholder="Enter MEASUREMENT Values" autoComplete="off" defaultValue={measurementValues.measurementValue} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Topup(Boat Length)</label>
                                            <input type="text" name="measurement_topup" className="form-control" placeholder="Enter Topup (MEASUREMENT)" autoComplete="off" defaultValue={measurementValues.measurementtopups} />
                                        </div>
                                    </div>

                                </div>
                                <div className='row'>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Boat Breadth</label>
                                            <Multiselect
                                                className="form-control"
                                                options={breadthList}
                                                selectedValues={rowsData?.yacht_breadth_value_or_topup}
                                                onSelect={setBoatdefaultBreadth}
                                                onRemove={setBoatdefaultBreadth}
                                                displayValue="name"
                                                showCheckbox={true}
                                                showArrow={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Topup(Boat Breadth)</label>
                                            <input type="text" name="breadth_topup" className="form-control" placeholder="Enter Topup (Boat Breadth)" autoComplete="off" defaultValue={boat_breadth?.breadth_topup} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Boat Hosrepower</label>
                                            <input type="text" name="boat_horsepower" className="form-control" placeholder="Enter Boat Horsepower" autoComplete="off" defaultValue={horsePower.horse_power} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Topup(Boat Horesepower)</label>
                                            <input type="text" name="horsepower_topup" className="form-control" placeholder="Enter Topup (Boat Horsepower)" autoComplete="off" defaultValue={horsePower?.horse_power_topup} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Speed Knots</label>
                                            {/* <Multiselect
                                                options={speedKnot}
                                                selectedValues={rowsData.yacht_speed_knot_type_or_topup}
                                                displayValue="yacht_speed_knot_type"
                                                showCheckbox={true}
                                                onSelect={handleChange7}
                                                onRemove={handleChange7}
                                            /> */}
                                            <input type="text" name="yacht_speed_knot_type" className="form-control" placeholder="Enter Yacht Speed Knot" defaultValue={speedknotValues} />

                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Topup(Speed Knots)</label>
                                            <input type="text" name="speed_knot_topup" className="form-control" placeholder="Enter Topup (Speed Knot)" autoComplete="off" defaultValue={speedKnotTopups} />
                                        </div>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Driving Experiance</label>
                                            <input required type="text" name="drivingexp" className="form-control" placeholder="Enter Driving Experience" autoComplete="off" defaultValue={drivingExpValues.Drivingvalues} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Topup (Driving Experiance)</label>
                                            <input type="text" name="drivingexptopup" className="form-control" placeholder="Enter Topup (Driving Experience)" autoComplete="off" defaultValue={drivingExpValues.Drivingtopups} />
                                        </div>
                                    </div>
                                </div>



                                <div className="row">
                                    {/* {rowsData.policy_type_id == "641161a4591c2f02bcddf51c" ? */}
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>last year policy type</label>
                                            <Multiselect
                                                options={policyTypes}
                                                selectedValues={last_year_policy_type}
                                                displayValue="policy_type_name"
                                                showCheckbox={true}
                                                onSelect={handleChange8}
                                                onRemove={handleChange8}
                                            />
                                        </div>
                                    </div>
                                    {/* : ""} */}
                                    {rowsData.policy_type_id == "641161a4591c2f02bcddf51c" ?
                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label>Fixed/Percentage/Reffered (last year policy type)</label>
                                                <input type="text" name="last_year_policy_type_topup" className="form-control" placeholder="Enter Last Year Policy Type Fixed/Percentage/Reffered" autoComplete="off" defaultValue={last_year_policy_type_topup} />
                                            </div>
                                        </div> : ""}
                                </div>
                                <div className="row">

                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Age Of The Boat</label>
                                            <input required type="text" name="age_of_the_car" className="form-control" placeholder="Enter Age Of The Car" autoComplete="off" defaultValue={age_of_the_car} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Age of the Boat Topup</label>
                                            <input type="text" name="age_of_the_car_topup" className="form-control" placeholder="Enter Fixed/Percentage/Reffered (Age Of The Car)" autoComplete="off" defaultValue={age_of_the_car_topup} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>No Claim Year</label>
                                            <input type="text" name="claimyears" className="form-control" placeholder="Enter Claim Year" autoComplete="off" defaultValue={ClaimYear.claimyear} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>No Claim Discount</label>
                                            <input type="text" name="claimyeardisc" className="form-control" placeholder="Enter Claim Year Discount" autoComplete="off" defaultValue={ClaimYear.claimyearDisc} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">


                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>PASSENGER CAPACITY</label>
                                            <input required type="text" name="passenger_capacity" className="form-control" placeholder="Enter PASSENGER CAPACITY" autoComplete="off" defaultValue={PassengerCap.passenger_capacityValues} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Topup(PASSENGER CAPACITY)</label>
                                            <input type="text" name="passenger_capacity_topup" className="form-control" placeholder="Enter Topup (PASSENGER CAPACITY)" autoComplete="off" defaultValue={PassengerCap.passenger_capacityTopups} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">


                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>CREW CAPACITY</label>
                                            <input required type="text" name="crew_capacity" className="form-control" placeholder="Enter CREW CAPACITY" autoComplete="off" defaultValue={CrewCap.crew_capacityValues} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Topup(CREW CAPACITY)</label>
                                            <input type="text" name="crew_capacity_topup" className="form-control" placeholder="Enter Topup (CREW CAPACITY)" autoComplete="off" defaultValue={CrewCap.crew_capacityTopups} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Add Option Condition Description</label>
                                            <input type="text" name="add_op_con_desc" onChange={(e) => descriptionChange(e)} onInput={(e) => validateInput(e)} className="form-control" placeholder="Enter Add Option Condition Description" autoComplete="off" defaultValue={Addopcondesc.addopcondescValues} />
                                            {errmsg.status == true && errmsg.name == "add_op_con_desc" ? <span style={{ color: 'red' }}>Text Only</span> : ""}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Topup (Add Option Condition Description)</label>
                                            <input type="text" name="add_op_con_desc_topup" className="form-control" placeholder="Enter Topup (Add Option Condition Description)" autoComplete="off" defaultValue={Addopcondesc.addopcondescTopups} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Vat Able</label>
                                            <input type="text" required={Addopcondesc.addopcondescValues == "" ? false : true} name="vat" onInput={(e) => validateInput(e)} className="form-control" placeholder="Enter Vat Able" autoComplete="off" defaultValue={Addopcondesc.vat} />
                                            {errmsg.status == true && errmsg.name == "vat" ? <span style={{ color: 'red' }}>Text Only</span> : ""}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>JDV Commission</label>
                                            <input required type="text" name="jdv_comm" className="form-control" placeholder="Enter JDV Commission" autoComplete="off" defaultValue={rowsData.jdv_commission} />
                                        </div>
                                    </div>

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

export default EditYachtPlan
