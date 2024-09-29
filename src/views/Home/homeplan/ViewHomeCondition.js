import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';


const ViewHomeCondition = () => {
    const navigate = useNavigate();
    const [homecondition, sethomecondition] = useState([]);
    const [homeplancondition, sethomeplancondition] = useState([]);
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
            gethomecondition(id);

        }
    }, []);

    const handleCheckboxChange = (e, rowId, label) => {
        if (e.target.checked === true) {
            let FoundData = homecondition?.find((item) => item.condition_label === label)
            FoundData['checked'] = true
            const allFormdata = [...formData]
            allFormdata?.push(FoundData)
            setFormData(allFormdata)
            console.log(FoundData, "selected FoundData");
        }
        else {
            let FoundData = homecondition?.find((item) => item.condition_label === label)
            FoundData['checked'] = false
            const allFormdata = [...formData]
            const index = allFormdata?.findIndex((item) => item.condition_label === label)
            allFormdata?.splice(index, 1)
            setFormData(allFormdata)
        }
    };

    const gethomecondition = async (id) => {
        try {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const response = await fetch(`https://insuranceapi-3o5t.onrender.com/api/gethomecondition`, requestOptions);
            const data = await response.json();
            const homeconditionData = data.data;
            // sethomecondition(homeconditionData);

            planHomeConditionDetails(homeconditionData, id);
        } catch (error) {
            console.error('Error fetching home conditions:', error);
        }
    };

    const planHomeConditionDetails = (homecondition, id) => {
        try {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const url = `https://insuranceapi-3o5t.onrender.com/api/home_plan_details/${id}`;
            fetch(url, requestOptions)
                .then(response => response.json())
                .then(data => {

                    const homeplandetails = data.data.condition_arr;
                    let allHomeConditions = homecondition
                    let AllConditionArray = []
                    let PayloadArray = []
                    for (let i = 0; i < allHomeConditions?.length; i++) {
                        let matchHoGya = false
                        for (let j = 0; j < homeplandetails?.length; j++) {

                            if (homeplandetails[j]?.condition_id === allHomeConditions[i]?._id) {
                                matchHoGya = true
                                let descArray = homeplandetails[j]?.condition_desc?.map((val) => ({ label: val, value: val }))
                                AllConditionArray.push({
                                    condition_id: allHomeConditions[i]?._id,
                                    condition_label: allHomeConditions[i]?.home_condition_label,
                                    condition_desc: descArray,
                                    condition_value: homeplandetails[j]?.condition_value,
                                    checked: true
                                })
                                PayloadArray.push({
                                    condition_id: allHomeConditions[i]?._id,
                                    condition_label: allHomeConditions[i]?.home_condition_label,
                                    condition_desc: descArray,
                                    condition_value: homeplandetails[j]?.condition_value,
                                    checked: true
                                })
                            }
                        }
                        if (matchHoGya === false) {
                            AllConditionArray.push({
                                condition_id: allHomeConditions[i]?._id,
                                condition_label: allHomeConditions[i]?.home_condition_label,
                                condition_desc: [],
                                condition_value: '',
                                checked: false
                            })
                        }
                    }
                    sethomecondition(AllConditionArray)
                    setFormData(PayloadArray)

                });
        } catch (error) {
            console.error('Error planning home condition details:', error);
        }
    };

    const handleInputChange = (selectedOption, itemId, label) => {
        try {
            let FoundInFormData = formData?.find((item) => item.condition_label == label)
            if (FoundInFormData == undefined) {
                let FoundData = homecondition?.find((item) => item.condition_label == label)
                let foundIndex = homecondition?.findIndex((item) => item == FoundData)
                let alldata = [...homecondition]
                alldata[foundIndex]['condition_desc'] = selectedOption
                sethomecondition(alldata)
            } else {
                let FoundData = formData?.find((item) => item.condition_label == label)
                let foundIndex = formData?.findIndex((item) => item == FoundData)
                let alldata = [...formData]
                alldata[foundIndex]['condition_desc'] = selectedOption
                setFormData(alldata)

                let FoundAllData = homecondition?.find((item) => item.condition_label == label)
                let foundIndex1 = homecondition?.findIndex((item) => item == FoundAllData)
                let alldata1 = [...homecondition]
                alldata1[foundIndex1]['condition_desc'] = selectedOption
                sethomecondition(alldata1)

            }
        } catch (error) {
            console.log(error, "error in handleInputChange function")
        }
    };

    const handleInputChange1 = (e, itemId, label) => {
        const { name, value } = e.target;
        let FoundInFormData = formData?.find((item) => item.condition_label == label)
        if (FoundInFormData == undefined) {
            let FoundData = homecondition?.find((item) => item.condition_label == label)
            let foundIndex = homecondition?.findIndex((item) => item == FoundData)
            let alldata = [...homecondition]
            alldata[foundIndex]['condition_value'] = value
            sethomecondition(alldata)
        }
        else {
            let FoundData = formData?.find((item) => item.condition_label == label)
            let foundIndex = formData?.findIndex((item) => item == FoundData)
            let alldata = [...formData]
            alldata[foundIndex]['condition_value'] = value
            setFormData(alldata)

            let FoundAllData = homecondition?.find((item) => item.condition_label == label)
            let foundIndex1 = homecondition?.findIndex((item) => item == FoundAllData)
            let alldata1 = [...homecondition]
            alldata1[foundIndex1]['condition_value'] = value
            sethomecondition(alldata1)
        }
    };









    const handleSubmit = () => {

        // console.log(ParamValue, "ParamValue");
        console.log(formData, "formData");

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: ParamValue, formData: formData }),
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/add_plan_home_condition`, requestOptions)
            .then(response => response.json())
            .then(data => {
                window.location.href = '/HomeCondition?id=' + ParamValue;
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
                                    <a href="/homeplan" className="btn btn-primary" style={{ float: 'right' }}>Back</a>
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

                                    {
                                        homecondition.map((item, index) => (
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
                                                            onSelect={(evnt) => handleInputChange(evnt, item.condition_id, item.condition_label)}
                                                            onRemove={(evnt) => handleInputChange(evnt, item.condition_id, item.condition_label)}
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
                                                            onChange={(e) => handleInputChange1(e, item.condition_id, item.condition_label)}
                                                            defaultValue={item.condition_value ? item.condition_value : ''}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    }
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

export default ViewHomeCondition
