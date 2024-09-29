import { tr } from 'date-fns/locale';
import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert';

const Blacklistvehicle = () => {
    const navigate = useNavigate();
    const [listBlackListedVehicle, setListBlackListedVehicle] = useState([]);
    const [enabledRows, setEnabledRows] = useState(true);
    const [formData, setFormData] = useState([]);
    const [tickList, setTickList] = useState([]);
    const [planid, setId] = useState([]);
    const [compid, setCompId] = useState([]);

    const customURL = window.location.href
    const params = new URLSearchParams(customURL.split('?')[1])
    const ParamValue = params.get('id')

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login');
        }
        else {
            const url = window.location.href;
            const url1 = url.split("/")[3];
            const url2 = url1.split("?")[1];
            const id = url2.split("=")[1];
            setId(id)
            motor_plan_details(id);
        }
    }, [enabledRows]);

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
                const result = data.data;
                const company_id = result?.company_id;
                setCompId(company_id)
                getlistBlackListedVehicle(company_id, id)
            });
    }

    const getlistBlackListedVehicle = (company_id, id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getlistBlackListedVehicle/${company_id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const list = data.data;
                console.log(list, ">>>>>>>>>   >>>>>list");
                setTickList(list)

                fetch(`https://insuranceapi-3o5t.onrender.com/api/motor_plan_details/${id}`, requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        const motorplandetails = data.data.black_listed_vehicle;
                        console.log(motorplandetails, ">>>>>>>>>>>>>>motorplandetails");
                        const inputArray = [];
                        for (let i = 0; i < list.length; i++) {
                            for (let j = 0; j < motorplandetails.length; j++) {
                                let id = list[i].motor_model_detail
                                if (motorplandetails[j].variantId == id._id) {
                                    list[i]['checked'] = true;
                                    list[i]['topup'] = motorplandetails[j].topup;
                                    inputArray.push({
                                        variantId: motorplandetails[j].variantId,
                                        topup: motorplandetails[j].topup,
                                    });
                                }
                            }
                        }
                        console.log(list, ">>>>>>>>>>>>>>list");
                        setListBlackListedVehicle(list);
                        setFormData(inputArray);

                    });
            });
    }

    const handleCheckboxChange = (e, bList) => {
        const stateValue = [...formData]
        if (e.target.checked === true) {
            // setEnabledRows(false)
            bList['checked'] = true;
            stateValue.push({
                variantId: bList.motor_model_detail._id,
                topup: "",
            })
        } else if (e.target.checked === false) {
            let id = bList.motor_model_detail
            let obj = stateValue.find(o => o.variantId === id._id);
            const indx = stateValue.indexOf(obj)
            console.log(indx)
            stateValue.splice(indx, 1)

        }
        setFormData(stateValue)

    };

    const handleInputChange = (e, itemId) => {
        const valdata = new FormData();
        const val = valdata.get('topup');
        const { name, value } = e.target;
        setFormData((prevData) => {
            const newData = [...prevData];
            console.log(newData, ">>>>>>>>>>>>>>> new data");

            const existingDataIndex = newData.findIndex((item) => item.variantId === itemId._id);
            if (existingDataIndex !== -1) {
                newData[existingDataIndex] = {
                    ...newData[existingDataIndex],
                    [name]: value,
                };
            }
            else {
                newData.push({
                    variantId: itemId._id,
                    topup: val,
                });
            }
            return newData;
        });
    };





    const handleSubmit = () => {
        // console.log(ParamValue);
        console.log(formData, ">>>>>>>>>>>>>>> submit data");


        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: ParamValue, blackListArr: formData }),
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/add_black_listed_Vehicle`, requestOptions)
            .then(response => response.json())
            .then(data => {
                window.location.href = '/blacklistvehicle?id=' + ParamValue;
            });
    }

    const SelectAll = (e) => {
        // setEnabledRows(true)
        if (e.target.checked === true) {

            const inputArray = [];
            const listArray = [];
            for (let i = 0; i < tickList.length; i++) {

                tickList[i]['checked'] = true;
                listArray.push(tickList[i]);
                let id = tickList[i].motor_model_detail
                inputArray.push({
                    variantId: id._id,
                    topup: '',
                });
            }
            setFormData(inputArray)
            setListBlackListedVehicle(listArray)
        } else if (e.target.checked === false) {
            let elemnt = document.getElementsByName('flexCheckDefault');
            for (let i = 0; i < elemnt.length; i++) {
                elemnt[i].checked = false;
            }

            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/getlistBlackListedVehicle/${compid}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    const list = data.data;
                    setTickList(list)
                    fetch(`https://insuranceapi-3o5t.onrender.com/api/motor_plan_details/${planid}`, requestOptions)
                        .then(response => response.json())
                        .then(data => {
                            const motorplandetails = data.data.black_listed_vehicle;
                            const inputArray = [];
                            for (let i = 0; i < list.length; i++) {
                                for (let j = 0; j < motorplandetails.length; j++) {
                                    let id = list[i].motor_model_detail
                                    if (motorplandetails[j].variantId == id._id) {
                                        // list[i]['checked'] = true;
                                        list[i]['topup'] = motorplandetails[j].topup;
                                        inputArray.push({
                                            variantId: motorplandetails[j].variantId,
                                            topup: motorplandetails[j].topup,
                                        });
                                    }
                                }
                            }
                            setListBlackListedVehicle(list);
                            setFormData([]);

                        });
                });
        }


    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card ">
                        <div className="card-header">
                            <div className='row'>
                                <div className='col-md-6'>
                                    <h4>Black Listed Vehicle</h4>
                                </div>

                                <div className="col-md-6">
                                    <a href="/motor-plan" className="btn btn-primary" style={{ float: 'right' }}>Back</a>
                                </div>
                            </div>
                            <div className="row ">
                                <div className="checkboxs col-md-4">
                                    <input
                                        className="form-check-input mx-2 mt-2"
                                        type="checkbox"
                                        id="flexCheckDefaul"
                                        // checked={enabledRows}
                                        onChange={(e) => SelectAll(e)}
                                    />
                                    <label><h5>Tick</h5></label>
                                </div>
                            </div>

                        </div>
                        <div className="card-body">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th><strong>#</strong></th>
                                        <th><strong>Start Year</strong></th>
                                        <th><strong>Make Motor</strong></th>
                                        <th><strong>Model Motor</strong></th>
                                        <th><strong>Motor Model Details</strong></th>
                                        <th><strong>Body Type</strong></th>
                                        <th><strong>Cylinder</strong></th>
                                        <th><strong>Value</strong></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listBlackListedVehicle?.map((item) => (
                                        <tr key={item._id}>
                                            <td>

                                                <div className="checkboxs">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="flexCheckDefault"
                                                        // checked={item.checked||enabledRows === true?true:false}
                                                        defaultChecked={item.checked}
                                                        onChange={(e) => handleCheckboxChange(e, item)}
                                                    />
                                                </div>
                                            </td>
                                            <td>{item.motor_model_detail?.['motor_model_detail_start_year']}</td>
                                            <td>{item.make_motor?.['make_motor_name']}</td>
                                            <td>{item.model_motor?.['motor_model_name']}</td>
                                            <td>{item.motor_model_detail?.['motor_model_detail_name']}</td>
                                            <td>{item.body_type?.['body_type_name']}</td>
                                            <td>{item.motor_model_detail?.['motor_model_detail_cylinder']}</td>
                                            <td>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        name="topup"
                                                        className="form-control"
                                                        disabled={item.checked === true ? false : true}
                                                        onChange={(e) => handleInputChange(e, item.motor_model_detail)}
                                                        defaultValue={item.topup ? item.topup : ''}
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
export default Blacklistvehicle;