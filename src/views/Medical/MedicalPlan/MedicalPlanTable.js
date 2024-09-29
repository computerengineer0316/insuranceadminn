import React from "react";
import { useEffect, useState } from 'react';
import Multiselect from "multiselect-react-dropdown";

function TablePlan({ rowsData, deleteTableRows, handleChange, handleChange123 }) {
    const [planCategory, setPlanCategory] = useState([]);
    const [natureOfPlan, setNatureOfPlan] = useState([]);
    const [visaCountry, setVisaCountry] = useState([]);
    const [planConditon, setPlanCondition] = useState([]);
    const [nationality, setNationality] = useState([]);
    const [medicalPlanType, setPlanType] = useState([]);
    const [salaryRange, setSalaryRange] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [location, setLocation] = useState([]);
    const [errmsg, setErrmsg] = useState({
        status: false,
        name: '',
        index: ''
    })


    useEffect(() => {

        Plancategory();
        NatureOfPlan();
        MedicalPlanType();
        get_MedicalVisaCountry();
        getMedicalPlanCondition();
        nationality_list();
        getMedicalSalaryRange();
        company_list();
        locationList();
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
                const location_len = locationdt.length;
                const location_list = [];
                for (let i = 0; i < location_len; i++) {
                    const location_obj = { label: locationdt[i].location_name, value: locationdt[i]._id };
                    location_list.push(location_obj);
                }
                setLocation(location_list);
            });
    }

    const MedicalPlanType = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getMedicalPlanTypeList`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setPlanType(data.data);
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
    const get_MedicalVisaCountry = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getmedicalVisaCountry`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setVisaCountry(data.data);
            });
    }
    const getMedicalPlanCondition = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getMedicalPlanCondition`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setPlanCondition(data.data);
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
            .then(response => response.json())
            .then(data => {
                setNationality(data.data);
            });
    }
    const getMedicalSalaryRange = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getMedicalSalaryRange`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setSalaryRange(data.data);
            });
    }
    const handleChange1 = (index, evnt, title) => {
        handleChange123(index, evnt, title);
    };
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
    const validateInput = (e, index) => {
        const inputValue = e.target.value;
        const textPattern = /^[A-Za-z,]*$/;
        if (!textPattern.test(inputValue)) {
            setErrmsg({ status: true, name: e.target.name, index: index })
            e.target.value = inputValue.replace(/[^a-zA-Z\s,]/g, '');
        } else {
            setErrmsg({ status: false, name: e.target.name, index: index })
        }
    }
    return (
        rowsData.map((data, index) => {
            return (
                <tr key={index}>
                    <td>
                        <button className="btn btn-outline-danger" onClick={() => (deleteTableRows(index))}>x</button>
                    </td>
                    <td>
                        <input type="text" className="form-control" name="plan_name" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Enter Plan Name" />
                    </td>
                    <td>
                        <select className="form-control" name="company_id" onChange={(evnt) => (handleChange(index, evnt))}>
                            <option value="">Select Company</option>
                            {companyList.map((item, index) => (
                                <option key={index} value={item._id}>{item.company_name}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        <select className="form-control" name="plan_category_id" onChange={(evnt) => (handleChange(index, evnt))}>
                            <option value="">Select Plan Category</option>
                            {planCategory.map((item, index) => (
                                <option key={index} value={item._id}>{item.plan_category_name}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        <select className="form-control" name="nature_of_plan_id" onChange={(evnt) => (handleChange(index, evnt))}>
                            <option value="">Select Nature Of Plan</option>
                            {natureOfPlan.map((item, index) => (
                                <option key={index} value={item._id}>{item.nature_of_plan_name}</option>
                            ))}
                        </select>
                    </td>

                    <td>
                        <select className="form-control" name="medical_plan_type" onChange={(evnt) => (handleChange(index, evnt))}>
                            <option value="">Medical Plan Type</option>
                            {medicalPlanType.map((item, index) => (
                                <option key={index} value={item._id}>{item.medical_plan_type}</option>
                            ))}
                        </select>
                    </td>
                    {/* <td>
                        <Multiselect
                            className="form-control"
                            options={visaCountry}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'medical_visa_country'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'medical_visa_country'))}
                            displayValue="medical_visa_country"
                            showCheckbox={true}
                        />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="medical_visa_country_topup" className="form-control" placeholder="Add Emirates Issuing Visa topup" />
                    </td> */}
                    <td>
                        <Multiselect
                            className="form-control"
                            options={planConditon}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'medical_plan_condition'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'medical_plan_condition'))}
                            displayValue="medical_plan_condition"
                            showCheckbox={true}
                        />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="medical_plan_condition_topup" className="form-control" placeholder="Add Plan Condition topup" />
                    </td>
                    <td>
                        <Multiselect
                            className="form-control"
                            options={nationality}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'nationality_name'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'nationality_name'))}
                            displayValue="nationality_name"
                            showCheckbox={true}
                        />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="nationality_topup" className="form-control" placeholder="Add Nationality topup" />
                    </td>
                    <td>
                        <Multiselect
                            className="form-control"
                            options={salaryRange}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'medical_salary_range'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'medical_salary_range'))}
                            displayValue="medical_salary_range"
                            showCheckbox={true}
                        />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="salary_range_topup" className="form-control" placeholder="Add Medical Salary Range topup" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="add_op_con_desc" onInput={(e) => validateInput(e, index)} className="form-control" placeholder="Add option condition Description" />
                        {errmsg.status == true && errmsg.name == "add_op_con_desc" && errmsg.index == index ? <span style={{ color: 'red' }}>Text Only</span> : ""}
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="add_op_con_desc_topup" className="form-control" placeholder="Add option condition Description topup" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="vat_able" onInput={(e) => validateInput(e, index)} className="form-control" placeholder="Enter Vat Able" />
                        {errmsg.status == true && errmsg.name == "vat_able" && errmsg.index == index ? <span style={{ color: 'red' }}>Text Only</span> : ""}
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="jdv_comm" className="form-control" placeholder="Enter JDV Commision" />
                    </td>
                    {/* <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="excess" className="form-control" placeholder="Enter excess" />
                    </td> */}
                    <td>
                        <Multiselect
                            options={location}
                            selectedValues={location}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'location'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'location'))}
                            displayValue="label"
                            placeholder="Select Location"
                            closeOnSelect={false}
                            avoidHighlightFirstOption={true}
                            showCheckbox={true}
                            style={{ chips: { background: "#007bff" } }}
                            required
                        />
                    </td>
                </tr>
            )
        })
    )
}

export default TablePlan;