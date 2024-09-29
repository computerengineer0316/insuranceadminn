import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';

const YachtConditions = () => {
    const navigate = useNavigate();
    const [yachtcondition, setYachtcondition] = useState([]);
    const [enabledRows, setEnabledRows] = useState({});
    const [formData, setFormData] = useState([]);

    const customURL = window.location.href;
    const params = new URLSearchParams(customURL.split('?')[1]);
    const ParamValue = params.get('id');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            const url = window.location.href;
            const url1 = url.split("/")[3];
            const url2 = url1.split("?")[1];
            const url3 = url2.split("&");
            const id = url3[0].split("=")[1];
            getyachtcondition(id);
        }
    }, []);

    const handleCheckboxChange = (e, rowId, label) => {
        if (e.target.checked === true) {
            let FoundData = yachtcondition?.find((item) => item.condition_label === label)
            FoundData['checked'] = true
            const allFormdata = [...formData]
            allFormdata?.push(FoundData)
            setFormData(allFormdata)
            console.log(FoundData, "selected FoundData");
        }
        else {
            let FoundData = yachtcondition?.find((item) => item.condition_label === label)
            FoundData['checked'] = false
            const allFormdata = [...formData]
            const index = allFormdata?.findIndex((item) => item.condition_label === label)
            allFormdata?.splice(index, 1)
            setFormData(allFormdata)
        }
    };
    const getyachtcondition = async (id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/getyachtcondition`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const yachtcondition = data.data;
                console.log(yachtcondition, "<><><><><><><><><yachtcondition")
                planstdcvdata(yachtcondition, id)

            });
    }

    const planstdcvdata = (yachtcondition, id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        let url = '';
        url = `https://insuranceapi-3o5t.onrender.com/api/yacht_plan_details/${id}`;
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
                const yachtplandetailss = data.data.condition_arr;
                console.log(yachtplandetailss, "<><><><><><><><><yachtplandetailss")
                let allYachtConditions = yachtcondition
                let AllConditionArray = []
                let PayloadArray = []
                for (let i = 0; i < allYachtConditions?.length; i++) {
                    let matchHoGya = false
                    for (let j = 0; j < yachtplandetailss?.length; j++) {

                        if (yachtplandetailss[j]?.condition_id === allYachtConditions[i]?._id) {
                            matchHoGya = true
                            let descArray = yachtplandetailss[j]?.condition_desc?.map((val) => ({ label: val, value: val }))
                            AllConditionArray.push({
                                condition_id: allYachtConditions[i]?._id,
                                condition_label: allYachtConditions[i]?.yacht_condition_label,
                                condition_desc: descArray,
                                condition_value: yachtplandetailss[j]?.condition_value,
                                checked: true
                            })
                            PayloadArray.push({
                                condition_id: allYachtConditions[i]?._id,
                                condition_label: allYachtConditions[i]?.yacht_condition_label,
                                condition_desc: descArray,
                                condition_value: yachtplandetailss[j]?.condition_value,
                                checked: true
                            })
                        }
                    }
                    if (matchHoGya === false) {
                        AllConditionArray.push({
                            condition_id: allYachtConditions[i]?._id,
                            condition_label: allYachtConditions[i]?.yacht_condition_label,
                            condition_desc: [],
                            condition_value: '',
                            checked: false
                        })
                    }
                }
                setYachtcondition(AllConditionArray);
                setFormData(PayloadArray)
            });
    };
    const handleInputChange1 = (selectedOption, itemId, label) => {
        try {
            let FoundInFormData = formData?.find((item) => item.condition_label == label)
            if (FoundInFormData == undefined) {
                let FoundData = yachtcondition?.find((item) => item.condition_label == label)
                let foundIndex = yachtcondition?.findIndex((item) => item == FoundData)
                let alldata = [...yachtcondition]
                alldata[foundIndex]['condition_desc'] = selectedOption
                setYachtcondition(alldata)
            } else {
                let FoundData = formData?.find((item) => item.condition_label == label)
                let foundIndex = formData?.findIndex((item) => item == FoundData)
                let alldata = [...formData]
                alldata[foundIndex]['condition_desc'] = selectedOption
                setFormData(alldata)

                let FoundAllData = yachtcondition?.find((item) => item.condition_label == label)
                let foundIndex1 = yachtcondition?.findIndex((item) => item == FoundAllData)
                let alldata1 = [...yachtcondition]
                alldata1[foundIndex1]['condition_desc'] = selectedOption
                setYachtcondition(alldata1)

            }
        } catch (error) {
            console.log(error, "error in handleInputChange function")
        }
    };
    const handleInputChange = (e, id, label) => {
        const { name, value } = e.target;
        let FoundInFormData = formData?.find((item) => item.condition_label == label)
        if (FoundInFormData == undefined) {
            let FoundData = yachtcondition?.find((item) => item.condition_label == label)
            let foundIndex = yachtcondition?.findIndex((item) => item == FoundData)
            let alldata = [...yachtcondition]
            alldata[foundIndex]['condition_value'] = value
            setYachtcondition(alldata)
        }
        else {
            let FoundData = formData?.find((item) => item.condition_label == label)
            let foundIndex = formData?.findIndex((item) => item == FoundData)
            let alldata = [...formData]
            alldata[foundIndex]['condition_value'] = value
            setFormData(alldata)

            let FoundAllData = yachtcondition?.find((item) => item.condition_label == label)
            let foundIndex1 = yachtcondition?.findIndex((item) => item == FoundAllData)
            let alldata1 = [...yachtcondition]
            alldata1[foundIndex1]['condition_value'] = value
            setYachtcondition(alldata1)
        }
    };
    const handleSubmit = () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: ParamValue, formData: formData }),
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/add_yacht_condition`, requestOptions)
            .then(response => response.json())
            .then(data => {
                window.location.href = '/YachtCondition?id=' + ParamValue;
            }
            );
    };
    const options = [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
    ];
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card ">
                        <div className="card-header">
                            <div className='row'>
                                <div className='col-md-6'>
                                    <h4>Conditions</h4>
                                </div>
                                <div className="col-md-6">
                                    <a href="/yachtplan" className="btn btn-primary" style={{ float: 'right' }}>Back</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th><strong>#</strong></th>
                                        <th><strong>Condition</strong></th>
                                        <th><strong>Description</strong></th>
                                        <th><strong>Fixed/Percentage/Reffered</strong></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {yachtcondition.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="checkboxs">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="flexCheckDefault"
                                                        defaultChecked={item?.condition_desc?.length > 0 ? true : false}
                                                        onChange={(e) => handleCheckboxChange(e, index, item.condition_label)}
                                                    />
                                                </div>
                                            </td>
                                            <td>{item.condition_label}</td>
                                            <td>
                                                <div className="form-group">

                                                    <Multiselect
                                                        options={options}
                                                        selectedValues={item.condition_desc ? item.condition_desc : []}
                                                        displayValue="label"
                                                        onSelect={(evnt) => handleInputChange1(evnt, item.condition_id, item.condition_label)}
                                                        onRemove={(evnt) => handleInputChange1(evnt, item.condition_id, item.condition_label)}
                                                        placeholder="Select Description"
                                                        showCheckbox={true}
                                                        closeOnSelect={false}
                                                        disable={item.checked == false ? true : false}
                                                        required
                                                        disabled={!item.condition_desc}
                                                    />

                                                </div>
                                            </td>
                                            <td>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        name="value"
                                                        className="form-control"
                                                        disabled={item.checked == false ? true : false}
                                                        onChange={(e) => handleInputChange(e, item.condition_id, item.condition_label)}
                                                        defaultValue={item.condition_value ? item.condition_value : ''}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="card-footer">
                            <button className='btn btn-primary' onClick={handleSubmit} style={{ float: 'right' }}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default YachtConditions
