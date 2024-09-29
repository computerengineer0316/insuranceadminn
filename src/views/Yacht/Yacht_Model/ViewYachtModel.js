import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import ReactPaginate from 'react-paginate';
import filePath from '../../../webroot/sample-files/yacht-model-details.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import Multiselect from "multiselect-react-dropdown";
import { Modal, Button } from 'react-bootstrap';
import { CProgress } from '@coreui/react';

const ViewYachtModel = () => {

    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [excelfile, setExcelfile] = useState("");
    const [motor_model, setMotormodel] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [yacht_data, setYachtModelDetailData] = useState('');
    const [model_detail_id, setYachtDetailId] = useState('');
    const [location, setLocation] = useState([]);
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [visibleedit, setVisibleedit] = useState(false);
    const [visibleclone, setVisiblClone] = useState(false);
    const [bodytype, setBodytype] = useState([]);
    const [motorpermission, setMotorPermission] = useState([]);
    const [modelmotor, setModelMotor] = useState([]);
    const [yacht_make, setYachtMake] = useState([]);
    const [loading, setLoading] = useState(false);
    const [make_filter_id, setMakeFilterId] = useState('');
    // const [model_motor_filter_id, setModelMotorFilterId] = useState('');
    const [nodata, setNodata] = useState('');
    const [searchvalue, setSearchvalue] = useState('');
    const [statusvalue, setStatusvalue] = useState(null);





    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getlistYachtModeldetials(page, perPage);
            getlistYachtmodel();
            locationList();
            bodytypelist();
            getlistYachtMake();
            const userdata = JSON.parse(localStorage.getItem('user'));
            const motor_permission = userdata?.motor_permission?.[0] || {};
            setMotorPermission(motor_permission);
            exportlistdata();
        }
    }, [])

    useEffect(() => {
        getlistYachtModeldetials(page, perPage);

    }, [make_filter_id, searchvalue, statusvalue])




    const getlistYachtModeldetials = (page, perPage) => {
        setData([]);
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({ MakeId: make_filter_id }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_all_Yacht_Model?page=${page}&limit=${perPage}&name=${searchvalue}&status=${statusvalue}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setNodata(data.message)
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                const list = data.data;
                setData(list);
            });
    }

    const getlistYachtmodel = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/get_model_motor_name', requestOptions)
            .then(response => response.json())
            .then(data => {
                setMotormodel(data.data);
            });
    }

    const bodytypelist = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/get_Yacht_Body_type', requestOptions)
            .then(response => response.json())
            .then(data => {
                setBodytype(data.data);
            });
    }

    const [exportlist, setExportlist] = useState([]);
    const exportlistdata = () => {
        const requestOptions = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') || '',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_all_Yacht_Model?name=${searchvalue}&status=${statusvalue}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setExportlist(data.data);
                console.log("yacht export data >>>>>>>>>>>>>>>>>> ", data.data)
            });
    }
    const fileType = 'xlsx'
    const exporttocsv = () => {

        const updatedData = exportlist?.map((item, index) => {
            return {
                'yacht_model_start_year': item?.start_year,
                'yacht_make': item.yachtmakes?.name,
                // 'motor_model_detail_model_id': item['motor_model'][0]['motor_model_name'],
                'yacht_model_name': item.name,
                'yacht_body_type': item.body_type?.yacht_body_type,
                'yacht_engine': item.engine,
                'yacht_model_detail_min': item.minValue,
                'yacht_model_detail_max': item.maxValue,
                'number_of_dep': item.noOfDep,
                'yacht_model_detail_min_dep': item.Mindep,
                'yacht_model_detail_max_dep': item.maxDep,
                // 'yacht_model_detail_discontinuation_year': item.noOfDep,
                'yacht_model_detail_location': item.location.map((item) => item.location_name).join(", "),
            }
        })
        console.log("updated data>>", updatedData)
        const ws = XLSX.utils.json_to_sheet(updatedData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
        const newdata = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(newdata, "Yacht-Model-Details" + ".xlsx")
    }


    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getlistYachtModeldetials(selectedPage + 1, perPage);
    };

    const UpdateStatus = (id, status) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/update_yatch_model_details_status?id=${id}&status=${status}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        text: data.message,
                        icon: "success",
                        button: false
                    })
                    getlistYachtModeldetials(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: false,
                    })
                    getlistYachtModeldetials(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
            });
    }

    const [progressBar, setProgressBar] = useState(0);

    const collectExceldata = async (e) => {
        e.preventDefault()
        setVisible(!visible)
        setLoading(true)
        const fd = new FormData()
        fd.append('file', excelfile)
        let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/read_yacht_model_excel",
            {
                method: "post",
                body: fd,
                onUploadProgress: trackUploadProgress,

            });
        result = await result.json();

        setLoading(false)
        if (result.status == 200) {
            swal("Uploaded Succesfully", "", "success");
        } else {
            swal("Something went wrong", "", "failed");
        }
        getlistYachtModeldetials(page, perPage)
    }
    const trackUploadProgress = (event) => {
        if (event.lengthComputable) {
            const calculatedProgress = Math.round((event.loaded / event.total) * 100);
            setProgressBar(calculatedProgress);
        }
    };

    const detailsbyid = async (ParamValue, viz) => {
        setYachtDetailId(ParamValue);
        const requestOptions = {
            method: "post",
            body: JSON.stringify({ ParamValue }),
            headers: {
                "Content-Type": "application/json",
            },
        };
        let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_Yacht_model_detailsbyid`, requestOptions);
        result = await result.json();
        result = result[0];
        setYachtModelDetailData(result);
        setSelectedOption(result.location)
        if (viz == 'edit') {
            setVisibleedit(true);
        } else if (viz == 'clone') {
            setVisiblClone(true);
        }

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
                setLocation(locationdt)
                handleChange(locationdt);
            });
    }

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const name = data.get('name');
        const MakeId = data.get('MakeId');
        const start_year = data.get('start_year');
        const body_type = data.get('body_type');
        const engine = data.get('engine');
        const minValue = data.get('minValue');
        const maxValue = data.get('maxValue');
        const Mindep = data.get('Mindep');
        const maxDep = data.get('maxDep');
        const noOfDep = data.get('noOfDep');
        const location = selectedOption;
        const location_len = location.length;
        const location_id = [];
        for (let i = 0; i < location_len; i++) {
            location_id.push({
                value: location[i]._id
            });
        }
        const dataArr = [
            {
                name: name,
                MakeId: MakeId,
                start_year: start_year,
                body_type: body_type,
                engine: engine,
                minValue: minValue,
                maxValue: maxValue,
                Mindep: Mindep,
                maxDep: maxDep,
                noOfDep: noOfDep,
                location: location_id,
            }
        ]
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataArr)
        };

        fetch('https://insuranceapi-3o5t.onrender.com/api/add_Yacht_model', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status == 200) {
                    setShowModal(false);
                    setVisiblClone(false);
                    swal({
                        text: data.message,
                        type: "success",
                        icon: "success",
                        button: false
                    })
                    getlistYachtModeldetials(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
                else {
                    setShowModal(false);
                    setVisiblClone(false);
                    swal({
                        title: "Error!",
                        text: data.message,
                        type: "error",
                        icon: "error",
                        button: 'ok'
                    })
                    getlistYachtModeldetials(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
            });

    }

    const updateMotorModelDetails = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const name = data.get('name');
        const MakeId = data.get('MakeId');
        const start_year = data.get('start_year');
        const body_type = data.get('body_type');
        const engine = data.get('engine');
        const minValue = data.get('minValue');
        const maxValue = data.get('maxValue');
        const Mindep = data.get('Mindep');
        const maxDep = data.get('maxDep');
        const noOfDep = data.get('noOfDep');
        const location = selectedOption;
        const location_len = location.length;
        const location_id = [];
        for (let i = 0; i < location_len; i++) {
            location_id.push(location[i]._id);
        }
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                MakeId: MakeId,
                start_year: start_year,
                body_type: body_type,
                engine: engine,
                minValue: minValue,
                maxValue: maxValue,
                Mindep: Mindep,
                maxDep: maxDep,
                noOfDep: noOfDep,
                location: location_id,
                id: model_detail_id
            })
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/update_Yacht_model_details', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    setVisibleedit(false);
                    swal({
                        text: data.message,
                        type: "success",
                        icon: "success",
                        button: false
                    })
                    getlistYachtModeldetials(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
                else {
                    setVisibleedit(false);
                    swal({
                        title: "Error!",
                        text: data.message,
                        type: "error",
                        icon: "error",
                        button: false
                    })
                    getlistYachtModeldetials(page, perPage);
                    // setTimeout(() => {
                    //     swal.close()
                    // }, 1000);
                }
            });
    }
    const addMotorMOdelDetails = () => {
        navigate("/AddYachtModel")
    }
    const getmodelmotor = () => {
        return (e) => {
            const yacht_make = e.target.value;
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/modelmotor/${yacht_make}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    const modelmotordt = data.data;
                    const modelmotor_len = modelmotordt.length;
                    const modelmotor_list = [];
                    for (let i = 0; i < modelmotor_len; i++) {
                        const modelmotor_obj = { label: modelmotordt[i].motor_model_name, value: modelmotordt[i]._id };
                        modelmotor_list.push(modelmotor_obj);
                    }
                    setModelMotor(modelmotor_list);
                });
        }
    }

    const startFrom = (page - 1) * perPage;

    const getlistYachtMake = () => {
        try {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            };
            fetch('https://insuranceapi-3o5t.onrender.com/api/getYachtMake', requestOptions)
                .then(response => response.json())
                .then(data => {
                    setYachtMake(data.data);
                });
        }
        catch (err) {
            console.log(err)
        }
    }
    const deleteItem = (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteYachtMaster?id=${id}&type=YatchModel`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    getlistYachtModeldetials(page, perPage);

                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: false,
                    })
                    getlistYachtModeldetials(page, perPage);

                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }

            })
    }



    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h4 className="card-title">Yacht Model Details</h4>
                                    </div>
                                    <div className="col-md-6">
                                        {motorpermission.motor_model_details?.includes('create') ?
                                            <button className='btn btn-primary' style={{ float: "right" }} onClick={() => addMotorMOdelDetails()}>Add Yacht Model</button>
                                            : ''}
                                    </div>
                                </div>
                            </div>
                            <div className="card-body" style={{ overflow: 'scroll' }}>
                                <div className="card-header">
                                    <div className='row'>
                                        <div className='col-lg-3'>
                                            <label><strong>Select Make</strong></label><br />
                                            <select className='form-control'
                                                value={make_filter_id}
                                                onChange={(e) => {
                                                    setMakeFilterId(e.target.value)
                                                }}
                                            >
                                                <option value="">-- All --</option>
                                                {yacht_make.map((item) => (
                                                    <option key={item._id} value={item._id}>{item.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className='col-lg-3'>
                                            <label><strong>Select Status</strong></label><br />
                                            <select className='form-control'
                                                value={statusvalue}
                                                onChange={(e) => setStatusvalue(e.target.value)}
                                            >
                                                <option value={null}>-- All --</option>
                                                <option value={true}>Active</option>
                                                <option value={false}>Inactive</option>
                                            </select>
                                        </div>

                                        <div className='col-lg-3'>
                                            <label><strong>Search Model</strong></label><br />
                                            <input type="text" className="form-control" placeholder="Search" onChange={(e) => setSearchvalue(e.target.value)} />
                                        </div>

                                    </div>
                                </div>
                                <div className="card-header" style={{ textAlign: 'right' }}>
                                    {motorpermission.motor_model_details?.includes('download') ?
                                        <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
                                        : ''}
                                    {motorpermission.motor_model_details?.includes('upload') ?
                                        <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
                                        : ''}
                                    {motorpermission.motor_model_details?.includes('export') ?
                                        <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
                                        : ''}
                                </div>
                            </div>

                            <div className="card-body">
                                <div className="table-responsive">
                                    {loading && (
                                        <div className="overlay">
                                            <div className="loader-container">
                                                <CProgress color="info" variant="striped" animated value={100} />
                                                <div>Uploading, please wait...</div>
                                                <div className="loader-text">Do Not Refresh The Page</div>
                                                {/* <ClipLoader color="green" loading={loading} size={100} /> */}
                                            </div>
                                        </div>
                                    )}
                                    <table className="table table-bordered">
                                        <thead className="text-primary">
                                            <tr>
                                                <th> # </th>
                                                <th>Year</th>
                                                <th>Make</th>
                                                <th>Model</th>
                                                <th>Body Type</th>
                                                <th>Engine</th>
                                                <th>Min Value</th>
                                                <th>Max Value</th>
                                                <th>Min Dep</th>
                                                <th>Max Dep</th>
                                                <th>No. Of Dep</th>
                                                <th>Location </th>
                                                <th>Action </th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {data && data.length > 0 ?
                                                <>
                                                    {data.map((item, index) => (
                                                        <tr key={index}>
                                                            <td> {startFrom + index + 1} </td>
                                                            <td> {item.start_year} </td>
                                                            <td> {item.yachtmakes[0]?.name}</td>
                                                            <td>{item.name}</td>
                                                            <td> {item.Yacht_body_type[0]?.yacht_body_type}</td>
                                                            <td> {item.engine} </td>
                                                            <td> {item.minValue} </td>
                                                            <td> {item.maxValue} </td>
                                                            <td> {item.Mindep} </td>
                                                            <td> {item.maxDep} </td>
                                                            <td> {item.noOfDep} </td>
                                                            <td> {item.location.map((item) => item.location_name).join(", ")} </td>
                                                            <td>
                                                                {motorpermission.motor_model_details?.includes('edit') && (
                                                                    <button className="btn btn-primary" onClick={() => { detailsbyid(item._id, "edit"); }}>Edit</button>
                                                                )}
                                                                {' '}
                                                                {motorpermission.motor_model_details?.includes('create') && (
                                                                    <button className="btn btn-success" onClick={() => { detailsbyid(item._id, "clone"); }}>clone</button>
                                                                )}
                                                                {' '}
                                                                {motorpermission.motor_model_details?.includes('delete') && (
                                                                    <>
                                                                        {
                                                                            item.status === true ?
                                                                                <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) UpdateStatus(item._id, false) }}>Deactivate</button> :
                                                                                <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) UpdateStatus(item._id, true) }}>Activate</button>
                                                                        }
                                                                        <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>

                                                                    </>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}

                                                </>
                                                :
                                                <tr><td colSpan="17" style={{ textAlign: 'center' }}><strong>{nodata}</strong></td></tr>
                                            }

                                        </tbody>
                                    </table>
                                </div>
                                <div className="card-footer">
                                    <ReactPaginate
                                        previousLabel={"Previous"}
                                        nextLabel={"Next"}
                                        breakLabel={"..."}
                                        pageCount={pageCount}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={3}
                                        onPageChange={handlePageClick}
                                        containerClassName={"pagination justify-content-end"}
                                        pageClassName={"page-item"}
                                        pageLinkClassName={"page-link"}
                                        previousClassName={"page-item"}
                                        previousLinkClassName={"page-link"}
                                        nextClassName={"page-item"}
                                        nextLinkClassName={"page-link"}
                                        breakClassName={"page-item"}
                                        breakLinkClassName={"page-link"}
                                        activeClassName={"active"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader onClose={() => setVisible(false)}>
                    <CModalTitle>Upload Excel File</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div>
                        <input type="file" className="form-control" id="DHA" defaultValue="" required
                            onChange={(e) => setExcelfile(e.target.files[0])} />
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
                    <CButton color="primary" onClick={collectExceldata} href={'/motor-model'}>Upload</CButton>
                </CModalFooter>
            </CModal>

            <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Motor Model details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-body">
                                            <form action="/" method="POST" onSubmit={handleSubmit}>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Motor Model details</label>
                                                            <input type="text"
                                                                className="form-control"
                                                                placeholder="Model Detail"
                                                                name="motor_model_detail_name"
                                                                autoComplete="off"
                                                                required />
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Motor Models</label>
                                                            <select className="form-control" name="motor_model_detail_model_id" required>
                                                                <option value="">Select Motor Models</option>
                                                                {motor_model.map((item, index) => (
                                                                    <option key={index} value={item._id}>{item.motor_model_name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Start Year</label>
                                                            <input type="text" className="form-control" placeholder="Start Year" name="start_year" autoComplete="off" required />
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Body Type</label>
                                                            <select className="form-control" name="body_type" required>
                                                                <option value="">Select Body Type</option>
                                                                {bodytype.map((item, index) => (
                                                                    <option key={index} value={item._id}>{item.body_type_name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Cylinder</label>
                                                            <select className="form-control" name="cylinder" required>
                                                                <option>Select Cylinder</option>
                                                                <option value="2">2</option>
                                                                <option value="4">4</option>
                                                                <option value="6">6</option>
                                                                <option value="8">8</option>
                                                                <option value="10">10</option>
                                                                <option value="12">12</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Min</label>
                                                            <input type="text" className="form-control" placeholder="Min" name="min" autoComplete="off" required />
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Max</label>
                                                            <input type="text" className="form-control" placeholder="Max" name="max" autoComplete="off" required />
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Depreciation up to years</label>
                                                            <input type="text" className="form-control" placeholder="Depreciation up to years" name="dep" autoComplete="off" required />
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Min Depreciation up to years</label>
                                                            <input type="text" className="form-control" placeholder="Min Depreciation up to years" name="min_dep" autoComplete="off" required />
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Max Depreciation up to years</label>
                                                            <input type="text" className="form-control" placeholder="Max Depreciation up to years" name="max_dep" autoComplete="off" required />
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Discontinution Year</label>
                                                            <input type="text" className="form-control" placeholder="Discontinution Year" name="discontinution_year" autoComplete="off" required />
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="form-group mb-3">
                                                            <label className="form-label">Location</label>
                                                            <Multiselect
                                                                options={location}
                                                                selectedValues={location}
                                                                displayValue="label"
                                                                onSelect={setSelectedOption}
                                                                onRemove={setSelectedOption}
                                                                placeholder="Select Location"
                                                                showCheckbox={true}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }}>Submit</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal size='lg' show={visibleedit} onHide={() => setVisibleedit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Motor Model details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={updateMotorModelDetails}>
                                            <div className="row">

                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Yacht Model Name</strong></label>
                                                        <input type="text"
                                                            className="form-control"
                                                            placeholder="Model Detail"
                                                            name="name"
                                                            autoComplete="off"
                                                            required
                                                            defaultValue={yacht_data?.name} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Yacht Make</strong></label>
                                                        <select className="form-control" name="MakeId">
                                                            {yacht_make.map((item, index) => (
                                                                <option key={index} value={item._id} selected={item._id == yacht_data.MakeId ? true : false}>{item.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Start Year</label>
                                                        <input type="text" className="form-control" placeholder="Start Year" name="start_year" autoComplete="off" required defaultValue={yacht_data?.start_year} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Yacht Body Type</label>
                                                        <select className="form-control" name="body_type" required>
                                                            <option>Select Body Type</option>
                                                            {bodytype.map((item, index) => (
                                                                <option key={index} value={item._id} selected={yacht_data.bodyTypeId == item._id ? true : false}>{item.yacht_body_type}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Cylinder</label>
                                                        <select className="form-control" name="engine" required>
                                                            <option>Select Engine</option>
                                                            <option value="12" selected={yacht_data?.engine == 12 ? true : false}>12</option>
                                                            <option value="10" selected={yacht_data?.engine == 10 ? true : false}>10</option>
                                                            <option value="8" selected={yacht_data?.engine == 8 ? true : false}>8</option>
                                                            <option value="6" selected={yacht_data?.engine == 6 ? true : false}>6</option>
                                                            <option value="4" selected={yacht_data?.engine == 4 ? true : false}>4</option>
                                                            <option value="2" selected={yacht_data?.engine == 2 ? true : false}>2</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Min Value</label>
                                                        <input type="text" className="form-control" placeholder="Min Value" name="minValue" autoComplete="off" required defaultValue={yacht_data?.minValue} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Max Value</label>
                                                        <input type="text" className="form-control" placeholder="Max Value" name="maxValue" autoComplete="off" required defaultValue={yacht_data?.maxValue} />
                                                    </div>
                                                </div>


                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Min Depreciation up to years</label>
                                                        <input type="text" className="form-control" placeholder="Min Depreciation" name="Mindep" autoComplete="off" required defaultValue={yacht_data?.Mindep} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Max Depreciation up to years</label>
                                                        <input type="text" className="form-control" placeholder="Max Depreciation" name="maxDep" autoComplete="off" required defaultValue={yacht_data?.maxDep} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">No Of Depreciation</label>
                                                        <input type="text" className="form-control" placeholder="Number of Depreciation" name="noOfDep" autoComplete="off" required defaultValue={yacht_data?.noOfDep} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Select Location</strong></label>
                                                        <Multiselect
                                                            options={location}
                                                            selectedValues={selectedOption}
                                                            onSelect={handleChange}
                                                            onRemove={handleChange}
                                                            displayValue="location_name"
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
                                                    <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }}>Update</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setVisibleedit(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal size='lg' show={visibleclone} onHide={() => setVisiblClone(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Clone Motor Model details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={handleSubmit}>
                                            <div className="row">

                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Yacht Model Name</strong></label>
                                                        <input type="text"
                                                            className="form-control"
                                                            placeholder="Model Detail"
                                                            name="name"
                                                            autoComplete="off"
                                                            required
                                                            defaultValue={yacht_data?.name} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Yacht Make</strong></label>
                                                        <select className="form-control" name="MakeId">
                                                            {yacht_make.map((item, index) => (
                                                                <option key={index} value={item._id} selected={item._id == yacht_data.MakeId ? true : false}>{item.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Start Year</label>
                                                        <input type="text" className="form-control" placeholder="Start Year" name="start_year" autoComplete="off" required defaultValue={yacht_data?.start_year} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Yacht Body Type</label>
                                                        <select className="form-control" name="body_type" required>
                                                            <option>Select Body Type</option>
                                                            {bodytype.map((item, index) => (
                                                                <option key={index} value={item._id} selected={yacht_data.bodyTypeId == item._id ? true : false}>{item.yacht_body_type}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Cylinder</label>
                                                        <select className="form-control" name="engine" required>
                                                            <option>Select Engine</option>
                                                            <option value="12" selected={yacht_data?.engine == 12 ? true : false}>12</option>
                                                            <option value="10" selected={yacht_data?.engine == 10 ? true : false}>10</option>
                                                            <option value="8" selected={yacht_data?.engine == 8 ? true : false}>8</option>
                                                            <option value="6" selected={yacht_data?.engine == 6 ? true : false}>6</option>
                                                            <option value="4" selected={yacht_data?.engine == 4 ? true : false}>4</option>
                                                            <option value="2" selected={yacht_data?.engine == 2 ? true : false}>2</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Min Value</label>
                                                        <input type="text" className="form-control" placeholder="Min Value" name="minValue" autoComplete="off" required defaultValue={yacht_data?.minValue} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Max Value</label>
                                                        <input type="text" className="form-control" placeholder="Max Value" name="maxValue" autoComplete="off" required defaultValue={yacht_data?.maxValue} />
                                                    </div>
                                                </div>


                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Min Depreciation up to years</label>
                                                        <input type="text" className="form-control" placeholder="Min Depreciation" name="Mindep" autoComplete="off" required defaultValue={yacht_data?.Mindep} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Max Depreciation up to years</label>
                                                        <input type="text" className="form-control" placeholder="Max Depreciation" name="maxDep" autoComplete="off" required defaultValue={yacht_data?.maxDep} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">No Of Depreciation</label>
                                                        <input type="text" className="form-control" placeholder="Number of Depreciation" name="noOfDep" autoComplete="off" required defaultValue={yacht_data?.noOfDep} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Select Location</strong></label>
                                                        <Multiselect
                                                            options={location}
                                                            selectedValues={selectedOption}
                                                            onSelect={handleChange}
                                                            onRemove={handleChange}
                                                            displayValue="location_name"
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
                                                    <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }}>Clone</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setVisiblClone(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ViewYachtModel