import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewAdditionalCover = () => {
    const navigate = useNavigate();
    const [additionalcover, setAdditionalcover] = useState([]);
    const [enabledRows, setEnabledRows] = useState({});
    const [formData, setFormData] = useState([]);
    const [planName, setPlanName] = useState('')
    const [planType, setPlanType] = useState('')
    const [company_name, setCompanyName] = useState('')
    const customURL = window.location.href;
    const params = new URLSearchParams(customURL.split('?')[1]);
    const ParamValue = params.get('id');
    const ParamType = params.get('type');

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
            const type = url3[1].split("=")[1];
            getadditonalcover(id, type);
            setPlanType(type)
        }
    }, []);

    const handleCheckboxChange = (e, cover) => {
        const stateValue = [...formData]
        console.log(stateValue, ">>>>before values")

        if (e.target.checked === true) {
            cover['checked'] = 'checked';
            stateValue.push(cover)
        } else if (e.target.checked === false) {

            const indx = stateValue.indexOf(cover)
            console.log(indx)
            stateValue.splice(indx, 1)
        }
        setFormData(stateValue)
        console.log(stateValue, ">>>>updated values")
    };

    const getadditonalcover = async (id, type) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_additional_cover/${id}/${type}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const additionalcover = data.data;
                const addcoverlen = additionalcover.length;


                const requestOption = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };
                let url = '';
                if (type == 'motor') {
                    url = `https://insuranceapi-3o5t.onrender.com/api/motor_plan_details/${id}`;
                }
                if (type == 'travel') {
                    url = `https://insuranceapi-3o5t.onrender.com/api/travel_plan_details/${id}`;
                }
                if (type == 'yacht') {
                    url = `https://insuranceapi-3o5t.onrender.com/api/yacht_plan_details/${id}`;
                }
                if (type == 'home') {
                    url = `https://insuranceapi-3o5t.onrender.com/api/home_plan_details/${id}`;
                }
                if (type == 'medical') {
                    url = `https://insuranceapi-3o5t.onrender.com/api/single_medical_plan_details/${id}`;
                }
                fetch(url, requestOption)
                    .then(response => response.json())
                    .then(data => {
                        const motorplandetails = data.data.additional_cover_arr;
                        setPlanName(data.data.plan_name)
                        setCompanyName(data.company_name)
                        console.log(motorplandetails, "additional cover array")
                        const coverdata = [];
                        for (let i = 0; i < addcoverlen; i++) {
                            for (let j = 0; j < motorplandetails.length; j++) {
                                if (additionalcover[i]._id == motorplandetails[j].additional_cover_id) {
                                    coverdata.push(additionalcover[i])
                                    additionalcover[i]['checked'] = 'checked';
                                    additionalcover[i]['value'] = motorplandetails[j].additional_cover_value;
                                    additionalcover[i]['additional_cover_description'] = motorplandetails[j].additional_cover_desc;
                                }
                                console.log(additionalcover)
                            }
                        }
                        setAdditionalcover(additionalcover)
                        setFormData(coverdata)
                    });
            });
    }

    const handleInputChange = (e, _id) => {

        const { name, value } = e.target;
        setFormData((prevData) => {
            const newData = [...prevData];
            const existingDataIndex = newData.findIndex((item) => item._id === _id);
            if (existingDataIndex !== -1) {
                newData[existingDataIndex] = {
                    ...newData[existingDataIndex],
                    [name]: value,
                };
            }
            else {
                newData.push({
                    _id,
                    [name]: value,
                });
            }
            return newData;
        });
    };

    const handleSubmit = () => {
        console.log(formData, "submit data")

        for (var i = 0; i < formData.length; i++) {
            if (formData[i].checked == "checked" && (formData[i].additional_cover_description === undefined || formData[i].additional_cover_description === '')) {
                alert("Please enter a description for data " + (formData[i].additional_cover_label));
                return false;
            }
        }

        // for (var i = 0; i < formData.length; i++) {
        //     if (formData[i].checked == "checked" && (formData[i].value === undefined || formData[i].value === '')) {
        //         alert("Please enter a value for data " + (i + 1));
        //         return false;
        //     }
        // }


        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: ParamValue, type: ParamType, formData: formData }),
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/add_plan_additional_cover`, requestOptions)
            .then(response => response.json())
            .then(data => {
                navigate(-1)
                // window.location.href = '/ViewAdditionalCover?id='+ParamValue+'&type='+ParamType;
            });
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card ">
                        <div className="card-header">
                            <div className='row'>
                                <div className='col-md-6'>
                                    <h4>Additional Covers</h4>
                                    {
                                        planType == 'travel' ?
                                            <>
                                                <h5>Plan Name : {planName}</h5>
                                                <h5>Company Name : {company_name}</h5>
                                            </>
                                            : ''
                                    }
                                </div>
                                <div className='col-md-6'>
                                    <button onClick={() => navigate(-1)} className="btn btn-primary" style={{ float: 'right' }}>Back</button>

                                    {/* { ParamType == 'motor' ? <a href="/motor-plan" className="btn btn-primary" style={{float:'right'}}>Back</a> 
                                    : ParamType == 'travel' ?  <a href="/travel-plan" className="btn btn-primary" style={{float:'right'}}>Back</a>
                                    : ParamType == 'home' ?  <a href="/homeplan" className="btn btn-primary" style={{float:'right'}}>Back</a>
                                    : ParamType == 'yacht' ?  <a href="/yachtplan" className="btn btn-primary" style={{float:'right'}}>Back</a>
                                    : ParamType == 'medical' ?  <a href="/medicalplan" className="btn btn-primary" style={{float:'right'}}>Back</a> 
                                    : '' } */}
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th><strong>#</strong></th>
                                        <th><strong>Additional Cover Label</strong></th>
                                        <th><strong>Description</strong></th>
                                        <th><strong>Fixed/Percentage/Reffered</strong></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {additionalcover.map((item) => (
                                        <tr key={item._id}>
                                            <td>
                                                <div className="checkboxs">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="flexCheckDefault"
                                                        defaultChecked={item.checked}
                                                        onChange={(e) => handleCheckboxChange(e, item)}
                                                    />
                                                </div>
                                            </td>
                                            <td>{item.additional_cover_label}</td>
                                            <td>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        name="additional_cover_description"
                                                        className="form-control"
                                                        disabled={!item.checked}
                                                        onChange={(e) => handleInputChange(e, item._id)}
                                                        defaultValue={item.additional_cover_description}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        name="value"
                                                        className="form-control"
                                                        disabled={!item.checked}
                                                        onChange={(e) => handleInputChange(e, item._id)}
                                                        defaultValue={item.value}
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
        </div>
    )
}

export default ViewAdditionalCover;