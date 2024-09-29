import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Multiselect from "multiselect-react-dropdown";
import { hr, ro } from 'date-fns/locale';

const AddPlanPrice = () => {
    let validations = {
        plan_type_id: 'Plan Type',
        region_id: 'Region',
        cover_type_id: 'Cover Type',
        no_of_days: 'Number Of Days',
        travel_premium: 'Travel Premium',
        price_name: 'Price Name',
        age: 'Age',
        age_topup: 'Age topup',
        no_of_child: 'Number Of Children',
        no_of_children_topup: 'Children Topup',
        no_of_spouse: 'Number Of Spouse',
        no_of_spouse_topup: 'Spouse Topup',
    }
    const navigate = useNavigate();
    const [travel_plan_id, setTravelPlanId] = useState('');
    const [travel_plan_type, setTravelPlanType] = useState([]);
    const [travel_region, setTravelRegion] = useState([]);
    const [travel_cover_type, setTravelCoverType] = useState([]);
    const [rowsData, setRowsData] = useState([{
        plan_type_id: '',
        region_id: '',
        cover_type_id: '',
        price_name: '',
        no_of_days: '',
        travel_premium: '',
        age: '',
        age_topup: '',
        no_of_child: '',
        no_of_children_topup: '',
        no_of_spouse: '',
        no_of_spouse_topup: '',

    }])

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
            setTravelPlanId(id);
            travel_plan_type_list();
            travel_region_list();
            travel_cover_type_list();
        }
    }, []);

    const addTableRows = () => {
        const lastitm = rowsData[rowsData.length - 1];
        const rowsInput =
        {
            plan_type_id: lastitm?.plan_type_id,
            region_id: lastitm?.region_id,
            cover_type_id: lastitm?.cover_type_id,
            no_of_days: lastitm?.no_of_days,
            travel_premium: lastitm?.travel_premium,
            price_name: lastitm?.price_name,
            age: lastitm?.age,
            age_topup: lastitm?.age_topup,
            no_of_child: lastitm?.no_of_child,
            no_of_children_topup: lastitm?.no_of_children_topup,
            no_of_spouse: lastitm?.no_of_spouse,
            no_of_spouse_topup: lastitm?.no_of_spouse_topup,
        }
        setRowsData([...rowsData, rowsInput])
    }
    const deleteTableRows = (index) => {
        const rows = [...rowsData]
        rows.splice(index, 1)
        setRowsData(rows)
    }
    const handleChange = (index, evnt) => {
        const { name, value } = evnt.target
        const rowsInput = [...rowsData]
        rowsInput[index][name] = value
        setRowsData(rowsInput)
    }
    const handleChange123 = (index, value, title) => {
        const rowsInput = [...rowsData];
        rowsInput[index][title] = value;
        setRowsData(rowsInput)
    }
    const travel_plan_type_list = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/travelplantype`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setTravelPlanType(data.data);
                console.log(data.data)
            });
    }

    const travel_region_list = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/travelregion`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const list = data.data;
                const list1 = list.map((item, index) => {
                    return { label: item.travel_region, value: item._id };
                }
                )
                setTravelRegion(list1);
            });
    }



    const travel_cover_type_list = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/travelcovertype`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setTravelCoverType(data.data);
            });
    }

    const handleSubmit = () => {


        console.log("rowsData>>", rowsData)
        const objectsWithEmptyValues = [];

        rowsData.forEach((rowData, rowIndex) => {
            const emptyKeys = Object.keys(rowData).filter((key) => {
                const value = rowData[key];
                if (typeof value === 'string' && value.trim() === '') {
                    if (key === 'age_topup') {

                        if (rowData['age'] === '') {

                            return false;
                        } else {

                            return true;
                        }

                    }
                    if ((key === 'no_of_child' || key === 'no_of_spouse' ||
                        key === 'no_of_children_topup' || key === 'no_of_spouse_topup')
                        && rowData['plan_type_id'] != '641d700e2e8acf350eaab204') {

                        return false;
                    }

                    return true; // Include this key in emptyKeys

                } else {
                    return false; // Ignore this key - it is not empty
                }
            });

            if (emptyKeys.length > 0) {
                // Store information about the object and its empty keys
                objectsWithEmptyValues.push({
                    index: rowIndex,
                    emptyKeys: emptyKeys,
                });
            }
        });

        if (objectsWithEmptyValues.length > 0) {

            objectsWithEmptyValues.forEach((objectInfo) => {
                const errval = objectInfo.emptyKeys[0];
                swal({
                    title: "warning!",
                    text: `${validations[errval]} is required`,
                    type: "warning",
                    icon: "warning"
                }).then(function () {
                    return false;
                });

            });
        }
        else {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rowsData)
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/addtravelplanprice?id=${travel_plan_id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200) {
                        swal({
                            title: "Success!",
                            text: data.message,
                            type: "success",
                            icon: "success",
                            button: false
                        })
                        setTimeout(() => {
                            swal.close()
                            navigate('/ViewPlanPrice?id=' + travel_plan_id)
                        }, 1000);
                        //     .then(function() {
                        //         navigate('/ViewPlanPrice?id='+travel_plan_id);
                        //     });
                    }
                    else {
                        swal({
                            title: "Error!",
                            text: data.message,
                            type: "error",
                            icon: "error",
                            button: false
                        })
                        setTimeout(() => {
                            swal.close()
                            navigate('/ViewPlanPrice?id=' + travel_plan_id)
                        }, 1000);

                        // .then(function() {
                        //     navigate('/ViewPlanPrice?id='+travel_plan_id);
                        // });
                    }
                });
        }
    }

    // const handleChange = (selectedOption) => 
    // {
    //     setSelectedOption(selectedOption);
    // };



    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className='row'>
                                <div className='col-md-6'>
                                    <h4 className="card-title">Add Plan Price</h4>
                                </div>
                                <div className='col-md-6'>
                                    <a href={`/ViewPlanPrice?id=${travel_plan_id}`} className="btn btn-primary" style={{ float: "right" }}>Back</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <button className="btn btn-outline-success my-1" onClick={addTableRows}>+</button>
                            {/* <form action="/" method="POST" onSubmit={()=>handleSubmit()}> */}
                            {rowsData?.map((item, index) => {
                                return (
                                    <div className="row mb-3" key={index}>

                                        <div className="col-md-4">
                                            <div className="form-group mb-3">
                                                <label>Plan Type</label>
                                                <select className="form-control" required onChange={(evnt) => handleChange(index, evnt)} defaultValue={rowsData[index].plan_type_id} name="plan_type_id" >
                                                    <option value="" hidden>Select Plan Type</option>
                                                    {
                                                        travel_plan_type.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item._id}>{item.travel_plan_type}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group mb-3">
                                                <label>Region</label>
                                                <Multiselect
                                                    options={travel_region}
                                                    selectedValues={rowsData[index].region_id}
                                                    onSelect={(evnt) => (handleChange123(index, evnt, 'region_id'))}
                                                    onRemove={(evnt) => (handleChange123(index, evnt, 'region_id'))}
                                                    displayValue="label"
                                                    placeholder="Select Region"
                                                    closeOnSelect={false}
                                                    avoidHighlightFirstOption={true}
                                                    showCheckbox={true}
                                                    showArrow={true}
                                                    style={{ chips: { background: "#007bff" } }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group mb-3">
                                                <label>Cover Type</label>
                                                <select name="cover_type_id" onChange={(evnt) => handleChange(index, evnt)} defaultValue={rowsData[index].cover_type_id} className="form-control" required>
                                                    <option value="" hidden>Select Cover Type</option>
                                                    {
                                                        travel_cover_type.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item._id}>{item.travel_cover_type ? item.travel_cover_type : ''}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group mb-3">
                                                <label>Price Name</label>
                                                <input
                                                    onChange={(evnt) => handleChange(index, evnt)}
                                                    type="text" name="price_name" className="form-control"
                                                    defaultValue={rowsData[index].price_name}
                                                    placeholder="Enter Price Name" required />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group mb-3">
                                                <label>Number Of Days</label>
                                                <input
                                                    onChange={(evnt) => handleChange(index, evnt)}
                                                    defaultValue={rowsData[index].no_of_days}
                                                    type="text" name="no_of_days" className="form-control"
                                                    placeholder="Enter Number Of Days" required />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group mb-3">
                                                <label>Travel Premium</label>
                                                <input
                                                    onChange={(evnt) => handleChange(index, evnt)}
                                                    defaultValue={rowsData[index].travel_premium}
                                                    type="text" name="travel_premium" className="form-control"
                                                    placeholder="Travel Premium" required />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group mb-3">
                                                <label>Age</label>
                                                <input
                                                    onChange={(evnt) => handleChange(index, evnt)}
                                                    defaultValue={rowsData[index].age}
                                                    type="text" name="age" className="form-control"
                                                    placeholder="Enter Age" required />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group mb-3">
                                                <label>Fixed/Percentage/Reffered</label>
                                                <input
                                                    onChange={(evnt) => handleChange(index, evnt)}
                                                    defaultValue={rowsData[index].age_topup}
                                                    type="text" name="age_topup" className="form-control"
                                                    placeholder="Enter Fixed/Percentage/Reffered" required />
                                            </div>
                                        </div>
                                        {
                                            item?.plan_type_id == '641d700e2e8acf350eaab204' ? (
                                                <div className='row'>
                                                    <div className="col-md-6">
                                                        <div className="form-group mb-3">
                                                            <label>Number Of Child</label>

                                                            <input
                                                                onChange={(evnt) => handleChange(index, evnt)}
                                                                defaultValue={rowsData[index].no_of_child}
                                                                type="text" name="no_of_child" className="form-control"
                                                                placeholder="Enter Number Of Child" required />
                                                        </div>

                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group mb-3">
                                                            <label>Fixed/Percentage/Reffered</label>
                                                            <input
                                                                onChange={(evnt) => handleChange(index, evnt)}
                                                                defaultValue={rowsData[index].no_of_children_topup}
                                                                type="text" name="no_of_children_topup" className="form-control"
                                                                placeholder="Enter Fixed/Percentage/Reffered" required />
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="form-group mb-3">
                                                            <label>Number Of Spouse</label>
                                                            <input
                                                                onChange={(evnt) => handleChange(index, evnt)}
                                                                defaultValue={rowsData[index].no_of_spouse}
                                                                type="text" name="no_of_spouse" className="form-control"
                                                                placeholder="Enter Number Of Spouse" required />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group mb-3">
                                                            <label>Fixed/Percentage/Reffered</label>
                                                            <input
                                                                onChange={(evnt) => handleChange(index, evnt)}
                                                                defaultValue={rowsData[index].no_of_spouse_topup}
                                                                type="text" name="no_of_spouse_topup" className="form-control"
                                                                placeholder="Enter Fixed/Percentage/Reffered" required />
                                                        </div>
                                                    </div>
                                                </div>) : ("")

                                        }
                                        <div className="col-md-12 my-2">
                                            <div className="btn btn-outline-danger" style={{ float: "right" }} onClick={() => (deleteTableRows(index))}>x</div>
                                        </div>
                                        <hr style={{ borderTop: '2px solid #111' }}></hr>
                                    </div>

                                )
                            })
                            }
                            <div className="row">
                                <div className="col-md-12">
                                    <button onClick={() => handleSubmit()} className="btn btn-primary mt-2" style={{ float: "right" }}>Submit</button>
                                </div>
                            </div>
                            {/* </form> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddPlanPrice
