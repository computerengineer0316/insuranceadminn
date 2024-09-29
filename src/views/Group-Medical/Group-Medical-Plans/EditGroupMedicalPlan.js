import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import Multiselect from "multiselect-react-dropdown";
import { Container, Row, Modal, Button, Accordion, Col, Table } from 'react-bootstrap';
import swal from 'sweetalert';


const EditGroupMedicalPlan = () => {
    const navigate = useNavigate();
    const [companyList, setCompanyList] = useState([]);
    const [location, setLocation] = useState([]);
    const [medical_plan_id, setMedicalPlanId] = useState('');
    const [defaultData, setDefaultData] = useState({});
    const [networkList, setNetworkList] = useState([]);
    const [changedLoc, handleChangeLoc] = useState([]);
    const [defaultnetwork, setdefaultNetwork] = useState([]);
    const [network, setNetworks] = useState([]);
    const [dates, setDates] = useState({
        from_date: '',
        to_date: ''
    });

    const [tpa, setTPAs] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [documents, setAllDocuments] = useState([])
    const [showDcumentModal, SetShowDocumentModal] = useState(false)
    const [payload, setPayload] = useState([]);

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
            setMedicalPlanId(id);
            medical_plan_details(id);
            company_list();
            locationList();
            MedicalNetworkList();
            activeMedicalNetwork();
            activeMedicalTPAList();

        }
    }, []);
    const activeMedicalNetwork = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/activeMedicalNetwork`, requestOptions)
            .then(response => response.json())
            .then((data) => {
                setNetworks(data.data)
            });
    }
    const activeMedicalTPAList = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/activeMedicalTPA`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const locationdt = data.data;
                setTPAs(locationdt)
            });
    }
    // const handleChange = (e, index) => {
    //     const { name, value } = e.target;
    //     const list = [...network];
    //     list[index][name] = value;
    //     setNetwork(list);
    // }
    // const handleChange1 = (e, index) => {
    //     const { name, value } = e.target;
    //     const list = [...defaultnetwork];
    //     list[index][name] = value;
    //     setNetwork(list);
    // }
    const getDocuments = (lob, planDocs) => {
        const reqOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getGroupMedicalDocuments?lob=${lob}&category=issued policy`, reqOptions)
            .then((response) => response.json())
            .then((data) => {
                const AllDocs = data.data
                if (planDocs) {
                    for (let i = 0; i < AllDocs.length; i++) {
                        const ReqDocs = AllDocs[i];
                        let matchHoGya = false;
                        for (let j = 0; j < planDocs.length; j++) {
                            const LeadDocs = planDocs[j];
                            if (ReqDocs.document_type === LeadDocs.name) {
                                matchHoGya = true;
                                AllDocs[i]["name"] = ReqDocs.document_type;
                                AllDocs[i]["file"] = LeadDocs.file ? LeadDocs.file : "";
                            }

                        }
                        if (matchHoGya === false) {
                            AllDocs[i]["name"] = ReqDocs.document_type;
                            AllDocs[i]["file"] = "";
                        }
                    }
                    setAllDocuments(AllDocs)
                } else {
                    for (let i = 0; i < AllDocs.length; i++) {
                        AllDocs[i]['name'] = AllDocs.document_type;

                    }

                    setAllDocuments(AllDocs)

                }
            })
    }
    const MedicalNetworkList = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/activeMedicalNetworkList`, requestOptions)
            .then(response => response.json())
            .then((data) => {
                setNetworkList(data.data)
            });
    }
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
    const medical_plan_details = (id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch(`https://insuranceapi-3o5t.onrender.com/api/group_medical_plan_by_id?id=${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const lobid = data.data[0]?.line_of_business_id
                const docs = data.data[0]?.documents

                getDocuments(lobid, docs)
                setDefaultData(data.data[0]);
                setDates({
                    from_date: data.data[0].from_date?.slice(0, 10),
                    to_date: data.data[0].to_date?.slice(0, 10)
                })
                // setdefaultNetwork(data.data[0]?.networkListData);
                const locDataArr = [];
                const locData = data.data[0]?.locations
                for (let i = 0; i < locData.length; i++) {
                    locDataArr.push({
                        label: locData[i].location_name,
                        value: locData[i]._id
                    })
                }
                handleChangeLoc(locDataArr);
            });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const tpa = data.get('tpa');
        const company_id = data.get('company_id');
        const network = data.get('network');
        const plan_name = data.get('plan_name');
        const from_date = data.get('from_date');
        const to_date = data.get('to_date');

        console.log({
            "tpa": tpa,
            "company_id": company_id,
            "network": network,
            "plan_name": plan_name,
            "from_date": from_date,
            "to_date": to_date,
            "changedLoc": changedLoc
        })

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                plan_name: plan_name,
                company_id: company_id,
                location: changedLoc,
                from_date: from_date,
                to_date: to_date,
                // tpa: tpa,
                // network: network,
                // network_list: defaultnetwork,
            })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/update_group_medical_plan?id=${medical_plan_id}`, requestOptions)
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
                            navigate('/ViewGroupMedicalPlans');
                        }
                    })
                }
                else {
                    Swal.fire({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        confirmButtonText: "Ok",
                    })
                        .then((result) => {
                            if (result.isConfirmed) {
                                navigate("/ViewGroupMedicalPlans");
                            }
                        });
                }
            });

    }

    const handleFileUpload = (e, index, item) => {
        const file = e.target.files[0];
        let AllPayload = [...payload];
        const elementExists = AllPayload?.some((payloadItem, payloadIndex) => payloadItem.name == item.document_type);
        if (elementExists === true) {
            const foundElement = AllPayload?.find(element => element.name === item.document_type);
            let foundIndex = AllPayload?.indexOf(foundElement);
            console.log("foundIndex: ", foundIndex)
            if (foundIndex === -1) {
                AllPayload.push({
                    name: foundElement?.name,
                    file: file,
                    newfile: true,
                    origionalname: file.name
                });
            } else {
                AllPayload[foundIndex] = {
                    name: foundElement.name,
                    file: file,
                }
            }

            setPayload(AllPayload);
        } else {
            AllPayload.push({
                name: item.document_type,
                file: file,
            });
            // The element with the provided index does not exist in AllPayload
            setPayload(AllPayload);
        }

    };

    const uploadAllDocuments = () => {
        SetShowDocumentModal(false)
        const formData = new FormData();
        const documentData = [];
        payload.forEach((item, index) => {
            formData.append('file', item.file)
        });
        formData.append('id', medical_plan_id)
        formData.append('payload', JSON.stringify(payload));
        if (payload.length) {
            fetch('https://insuranceapi-3o5t.onrender.com/api/uploadGroupMedicalPlanDocs', {
                method: 'post',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200) {
                        swal("Success!", "Updated", "success");
                        setShowModal(false);
                        // getdcleads(page, perPage);
                        setPayload([]);
                        medical_plan_details(medical_plan_id)
                        // window.location.reload()
                    }
                    else {
                        swal("Error!", "Something went wrong", "error");
                    }
                })
                .catch(error => {
                    console.error(error)
                })
        }
        else {
            alert("No Documents")
        }
    }
    const handlewindow = (url) => {
        window.open(`https://insuranceapi-3o5t.onrender.com/GroupClaimDocuments/${url}`)
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card" style={{ marginTop: '20px' }}>
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="card-title">Edit Group Medical Plan</h4>
                                </div>
                                <div className="col-md-6">
                                    <button onClick={() => navigate("/ViewGroupMedicalPlans")} className="btn btn-primary" style={{ float: 'right' }}>Back</button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <form action="/" method="POST" onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Customer Name</label>
                                            <input required type="text" className="form-control" placeholder="Enter Plan Name" name="plan_name" autoComplete="off" defaultValue={defaultData?.plan_name} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Insurance Company Name</label>
                                            <select required className="form-control" name="company_id">
                                                <option hidden value="">Select Insurance Company</option>
                                                {
                                                    companyList.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item._id} selected={defaultData.company_id == item._id ? true : false}>{item.company_name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className='form-group mb-3'>
                                            <label>From Date</label>
                                            <input type='date' className='form-control' name='from_date' defaultValue={dates.from_date} />
                                            {/* <select className="form-control" name="network" >
                                                <option value="">Select Network</option>
                                                {network.map((item, index) => (
                                                    <option key={index} selected={item._id == defaultData.network ? true : false} value={item._id}>{item.name}</option>
                                                ))}
                                            </select> */}
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>

                                    <div className='col-md-6'>
                                        <div className='form-group mb-3'>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>To Date</label>
                                                    {/* <select className="form-control" name="tpa" >
                                                        <option value="">Select TPA</option>
                                                        {tpa.map((item, index) => (
                                                            <option key={index} selected={item._id == defaultData.tpa ? true : false} value={item._id}>{item.name}</option>
                                                        ))}
                                                    </select> */}
                                                    <input className='form-control' type='date' name='to_date' defaultValue={dates.to_date} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="row"> */}

                                {/* <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Network List</label>
                                            <Multiselect
                                                options={networkList}
                                                selectedValues={defaultnetwork}
                                                onSelect={(evnt) => (setdefaultNetwork(evnt))}
                                                onRemove={(evnt) => (setdefaultNetwork(evnt))}
                                                displayValue="name"
                                                placeholder="Select Network List"
                                                closeOnSelect={false}
                                                avoidHighlightFirstOption={true}
                                                showCheckbox={true}
                                                style={{ chips: { background: "#007bff" } }}
                                                required
                                            />
                                        </div>
                                    </div> */}

                                {/* </div> */}
                                <div className='row'>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Location</label>
                                            <Multiselect
                                                options={location}
                                                selectedValues={changedLoc}
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
                                    <div className='col-md-6'>
                                        <div className='btn btn-warning' onClick={() => SetShowDocumentModal(true)}>View Documents</div>
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
            <Modal size='lg' show={showDcumentModal} onHide={() => SetShowDocumentModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Documents</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <Table bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Sr.</th>
                                            <th>Name</th>
                                            <th>View / Upload</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {documents?.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.document_type}</td>
                                                <td>
                                                    <div style={{ display: 'flex' }}>
                                                        <input className='mx-2' name={item.document_type} type="file"
                                                            onChange={(e) => handleFileUpload(e, index, item)}
                                                        />
                                                        {item?.file ? (
                                                            <button
                                                                className="btn btn-warning mx-5"
                                                                style={{ marginRight: '5px' }}
                                                                key={index}
                                                                onClick={() => handlewindow(item.file)}
                                                            >
                                                                View
                                                            </button>
                                                        ) : ''
                                                        }
                                                        {/* <input name={item.document_type} type="file"
                                                            onChange={(e) => handleFileUpload(e, index, item)}
                                                            /> */}
                                                    </div>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>

                                </Table>
                                <button onClick={() => uploadAllDocuments()} className='btn btn-primary my-2'>Submit</button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => SetShowDocumentModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default EditGroupMedicalPlan
