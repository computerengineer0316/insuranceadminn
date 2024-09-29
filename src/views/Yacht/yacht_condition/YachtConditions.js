import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

    const handleCheckboxChange = (rowId) => {
        setEnabledRows((prevState) => ({
            ...prevState,
            [rowId]: !prevState[rowId],
        }));

        setFormData((prevData) => {
            const newData = [...prevData];
            const existingDataIndex = newData.findIndex((item) => item.itemId === rowId);

            if (existingDataIndex !== -1) {
                newData[existingDataIndex] = {
                    ...newData[existingDataIndex],
                    checked: !newData[existingDataIndex].checked,
                };
            }
            else {
                const newItem = {
                    itemId: rowId,
                    checked: true,
                    itemdesc: '',
                    value: ''
                };

                const yachtConditionItem = yachtcondition.find((item) => item._id === rowId);
                if (yachtConditionItem) {
                    newItem.itemdesc = yachtConditionItem.yacht_condition_description;
                }
                newData.push(newItem);
            }
            return newData;
        });
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

                const yachtconditionlen = yachtcondition.length;
                for (let i = 0; i < yachtconditionlen; i++) {
                    planstdcvdata(yachtcondition[i], id)
                }
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
                const yachtplandetails = data.data;
                const yachtplandetailslen = yachtplandetails.length;
                for (let i = 0; i < yachtplandetailslen; i++) {
                    if (yachtplandetails[i].condition_id == yachtcondition._id) {
                        yachtcondition['itemdesc'] = yachtplandetails[i].condition_desc;
                        yachtcondition['itemvalue'] = yachtplandetails[i].condition_value;
                    }
                }
                setYachtcondition((prevData) => [...prevData, yachtcondition]);
            });
    };

    const handleInputChange = (e, itemId) => {
        const { name, value } = e.target;
        setFormData((prevData) => {
            const newData = [...prevData];
            const existingDataIndex = newData.findIndex((item) => item.itemId === itemId);
            if (existingDataIndex !== -1) {
                newData[existingDataIndex] = {
                    ...newData[existingDataIndex],
                    [name]: value,
                };
            }
            else {
                newData.push({
                    itemId,
                    [name]: value,
                });
            }
            return newData;
        });
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
                                    {yachtcondition.map((item) => (
                                        <tr key={item._id}>
                                            <td>
                                                <div className="checkboxs">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="flexCheckDefault"
                                                        defaultChecked={item.itemdesc && item.itemvalue}
                                                        onChange={() => handleCheckboxChange(item._id)}
                                                    />
                                                </div>
                                            </td>
                                            <td>{item.yacht_condition_label}</td>
                                            <td>
                                                <div className="form-group">
                                                    <select className="form-control" name="itemdesc" disabled={!enabledRows[item._id] && !item.itemdesc} onChange={(e) => handleInputChange(e, item._id)}>
                                                        <option value="" hidden>Select</option>
                                                        <option value="1" selected={item.itemdesc == 1 ? true : item.yacht_condition_description == 1 ? true : false}>Yes</option>
                                                        <option value="0" selected={item.itemdesc == 0 ? true : item.yacht_condition_description == 0 ? true : false}>No</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        name="value"
                                                        className="form-control"
                                                        disabled={!enabledRows[item._id] && !item.itemvalue}
                                                        onChange={(e) => handleInputChange(e, item._id)}
                                                        defaultValue={item.itemvalue}
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
