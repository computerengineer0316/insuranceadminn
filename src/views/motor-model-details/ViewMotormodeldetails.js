import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import ReactPaginate from 'react-paginate';
import filePath from '../../webroot/sample-files/motor-model-details.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import Multiselect from "multiselect-react-dropdown";
import { Modal, Button } from 'react-bootstrap';
import Table from 'react-bootstrap/Table'
import { ClipLoader } from 'react-spinners';
import { CProgress } from '@coreui/react';

const ViewMotormodeldetails = () => {

    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [perPage] = useState(15);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [excelfile, setExcelfile] = useState("");
    const [motor_model, setMotormodel] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [motor_model_detail_name, setMotorModelDetailName] = useState('');
    const [motor_model_detail_start_year, setMotorModelStartYear] = useState('');
    const [motor_model_detail_body_type, setMotorModelBodyType] = useState('');
    const [motor_model_detail_cylinder, setMotorModelCylinder] = useState('');
    const [motor_model_detail_min, setMotorModelMin] = useState('');
    const [motor_model_detail_max, setMotorModelMax] = useState('');
    const [motor_model_detail_dep, setMotorModelDep] = useState('');
    const [motor_model_detail_min_dep, setMotorModelMinDep] = useState('');
    const [motor_model_detail_max_dep, setMotorModelMaxDep] = useState('');
    const [motor_model_detail_discontinuation_year, setMotorModelDiscontinutionYear] = useState('');
    const [motor_model_detail_model_id, setMotorModelDetailModelId] = useState('');
    const [motor_model_detail_status, setMotorModelDetailStatus] = useState('');
    const [motor_model_detail_id, setModelMotorDetailId] = useState('');
    const [location, setLocation] = useState([]);
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [visibleedit, setVisibleedit] = useState(false);
    const [visibleclone, setVisiblClone] = useState(false);
    const [bodytype, setBodytype] = useState([]);
    const [motorpermission, setMotorPermission] = useState([]);
    const [modelmotor, setModelMotor] = useState([]);
    const [make_motor, setMakeMotor] = useState([]);
    const [make_motor_id, setMakeMotorId] = useState('')
    const [motor_model_id, setMotorModelId] = useState('')
    const [loading, setLoading] = useState(false);
    const [make_motor_filter_id, setMakeMotorFilterId] = useState('');
    const [motor_model_list_id, setMotorModelListId] = useState([]);
    const [model_motor_filter_id, setModelMotorFilterId] = useState('');
    const [nodata, setNodata] = useState('');
    const [searchvalue, setSearchvalue] = useState('');
    const [statusvalue, setStatusvalue] = useState(2);


    const [showMakeTable, setshowMaketable] = useState('')
    const [makemodelvariant, setmakemodelvariant] = useState([])


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            // getlistModelMotordetials(page, perPage);
            getlistMotormodel();
            locationList();
            bodytypelist();
            getlistMakeMotor();
            getMakeModelVariant(page, perPage)
            const userdata = JSON.parse(localStorage.getItem('user'));
            const motor_permission = userdata?.motor_permission?.[0] || {};
            setMotorPermission(motor_permission);
            exportlistdata();

        }
    }, [])

    useEffect(() => {
        // getlistModelMotordetials(page, perPage);
        // getlistMakeMotor(page,perPage);
        getMakeModelVariant(page, perPage)
        exportlistdata();

    }, [make_motor_filter_id, model_motor_filter_id, searchvalue, statusvalue])





    const getlistModelMotordetials = (page, perPage) => {
        setData([]);
        console.log(statusvalue, ">>>>>>>>>this is searchvalue")


        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({ makeId: make_motor_filter_id, modelId: model_motor_filter_id }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        };

        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_Motor_model_details?page=${page}&limit=${perPage}&name=${searchvalue}&status=${statusvalue}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setNodata(data.message)
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                const list = data.data;
                setData(list);
            });
    }

    const getlistMotormodel = () => {
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
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/get_body_type_list', requestOptions)
            .then(response => response.json())
            .then(data => {
                setBodytype(data.data);
            });
    }


    console.log(data)
    const [exportlist, setExportlist] = useState([]);
    const exportlistdata = () => {
        const requestOptions = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') || '',

            },
            body: JSON.stringify({ makeId: make_motor_filter_id, modelId: model_motor_filter_id }),
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_Motor_model_details_excel?name=${searchvalue}&status=${statusvalue}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setExportlist(data.data);
            });
    }
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", exportlist)

    const fileType = 'xlsx'
    const exporttocsv = () => {

        const updatedData = exportlist?.map((item, index) => {
            return {
                'motor_model_detail_start_year': item.motor_model_detail_start_year,
                'make_motor': item.makeMotor?.make_motor_name,
                'motor_model_detail_model_id': item['motor_model'][0]['motor_model_name'],
                'motor_model_detail_name': item.motor_model_detail_name,
                'motor_model_detail_body_type': item.body_type?.body_type_name,
                'motor_model_detail_cylinder': item.motor_model_detail_cylinder,
                'motor_model_detail_min': item.motor_model_detail_min,
                'motor_model_detail_max': item.motor_model_detail_max,
                'motor_model_detail_dep': item.motor_model_detail_dep,
                'motor_model_detail_min_dep': item.motor_model_detail_min_dep,
                'motor_model_detail_max_dep': item.motor_model_detail_max_dep,
                'motor_model_detail_discontinuation_year': item.motor_model_detail_discontinuation_year,
                'motor_model_detail_location': item.motor_model_detail_location.map((item) => item.location_name).join(", "),
            }
        })
        console.log('updatedData', updatedData)


        const ws = XLSX.utils.json_to_sheet(updatedData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
        const newdata = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(newdata, "Motor-Model-Details" + ".xlsx")
    }


    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getMakeModelVariant(selectedPage + 1, perPage);

        // getlistModelMotordetials(selectedPage + 1, perPage);
    };

    const deleteModelMotordetails = (id, status) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ motor_model_deatil_status: status })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/update_model_motor_detail_status/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        text: data.message,
                        icon: "success",
                        button: false
                    })
                    // getlistModelMotordetials(page, perPage);
                    getMakeModelVariant(page, perPage);

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
                    // getlistModelMotordetials(page, perPage);
                    getMakeModelVariant(page, perPage);

                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
            });
    }

    const [progressBar, setProgressBar] = useState(0);

    const collectExceldata = async (e) => {
        setVisible(false)
        e.preventDefault()
        setLoading(true)
        const fd = new FormData()
        fd.append('file', excelfile)
        let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/read_Motor_model_excel",
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
        // getlistModelMotordetials(page, perPage)

        getMakeModelVariant(page, perPage);
    }
    const trackUploadProgress = (event) => {
        if (event.lengthComputable) {
            const calculatedProgress = Math.round((event.loaded / event.total) * 100);
            setProgressBar(calculatedProgress);
        }
    };
    console.log(progressBar)

    const detailsbyid = async (ParamValue, viz) => {
        setModelMotorDetailId(ParamValue);
        const requestOptions = {
            method: "post",
            body: JSON.stringify({ ParamValue }),
            headers: {
                "Content-Type": "application/json",
            },
        };
        let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_Motor_model_detailsbyid`, requestOptions);
        result = await result.json();
        result = result[0];
        console.log(result, "model details")
        setMakeMotorId(result.motor_model_make_id)
        setMotorModelId(result.motor_model_detail_model_id)
        setMotorModelDetailName(result.motor_model_detail_name);
        setMotorModelStartYear(result.motor_model_detail_start_year);
        setMotorModelBodyType(result.motor_model_detail_body_type);
        setMotorModelCylinder(result.motor_model_detail_cylinder);
        setMotorModelMin(result.motor_model_detail_min);
        setMotorModelMax(result.motor_model_detail_max);
        setMotorModelDep(result.motor_model_detail_dep);
        setMotorModelMinDep(result.motor_model_detail_min_dep);
        setMotorModelMaxDep(result.motor_model_detail_max_dep);
        setMotorModelDiscontinutionYear(result.motor_model_detail_discontinuation_year);
        setMotorModelDetailStatus(result.motor_model_detail_status);
        setMotorModelDetailModelId(result.motor_model_detail_model_id);
        setSelectedOption(result.motor_model_detail_location)

        const requestOption = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/modelmotor/${result.motor_model_make_id}`, requestOption)
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
        const model_motor_detail_name = data.get('model_motor_detail_name');
        const motor_model_detail_model_id = data.get('model_motor_id');
        const motor_model_make_id = data.get('motor_model_make_id');
        const start_year = data.get('start_year');
        const body_type = data.get('body_type');
        const cylinder = data.get('cylinder');
        const min = data.get('min');
        const max = data.get('max');
        const dep = data.get('dep');
        const min_dep = data.get('min_dep');
        const max_dep = data.get('max_dep');
        const discontinution_year = data.get('discontinution_year');
        const location = selectedOption;
        const location_len = location?.length;
        const location_id = [];
        for (let i = 0; i < location_len; i++) {
            location_id.push({
                value: location[i]._id
            });
        }
        const dataArr = [
            {
                motor_model_detail_name: model_motor_detail_name,
                motor_model_detail_id: motor_model_detail_model_id,
                motor_model_make_id: motor_model_make_id,
                start_year: start_year,
                body_type: body_type,
                cylinder: cylinder,
                min: min,
                max: max,
                dep: dep,
                min_dep: min_dep,
                max_dep: max_dep,
                discontinution_year: discontinution_year,
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

        fetch('https://insuranceapi-3o5t.onrender.com/api/add_Motor_model_details', requestOptions)
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
                    // getlistModelMotordetials(page, perPage);
                    getMakeModelVariant(page, perPage);

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
                    // getlistModelMotordetials(page, perPage);
                    getMakeModelVariant(page, perPage);

                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
            });

    }

    const updateMotorModelDetails = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const model_motor_detail_name = data.get('model_motor_detail_name');
        const motor_model_detail_model_id = data.get('model_motor');
        const start_year = data.get('start_year');
        const body_type = data.get('body_type');
        const cylinder = data.get('cylinder');
        const min = data.get('min');
        const max = data.get('max');
        const dep = data.get('dep');
        const min_dep = data.get('min_dep');
        const max_dep = data.get('max_dep');
        const discontinution_year = data.get('discontinution_year');
        const location = selectedOption;
        const location_len = location?.length;
        const location_id = [];
        for (let i = 0; i < location_len; i++) {
            location_id.push(location[i]._id);
        }

        console.log(motor_model_detail_id);

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model_motor_detail_name: model_motor_detail_name,
                motor_model_detail_model_id: motor_model_detail_model_id,
                start_year: start_year,
                body_type: body_type,
                cylinder: cylinder,
                min: min,
                max: max,
                dep: dep,
                min_dep: min_dep,
                max_dep: max_dep,
                discontinution_year: discontinution_year,
                motor_model_detail_location: location_id,
                // model_motor_detail_status: model_motor_detail_status,
                motor_model_detail_id: motor_model_detail_id
            })
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/update_Motor_model_details', requestOptions)
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
                    // getlistModelMotordetials(page, perPage);
                    getMakeModelVariant(page, perPage);

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
                    // getlistModelMotordetials(page, perPage);
                    getMakeModelVariant(page, perPage);

                    // setTimeout(() => {
                    //     swal.close()
                    // }, 1000);
                }
            });
    }
    const addMotorMOdelDetails = () => {
        navigate("/AddMotormodeldetails")
    }
    const getmodelmotor = () => {
        return (e) => {
            const make_motor = e.target.value;
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/modelmotor/${make_motor}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    const modelmotordt = data.data;
                    const modelmotor_len = modelmotordt?.length;
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

    const getlistMakeMotor = () => {
        try {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            fetch('https://insuranceapi-3o5t.onrender.com/api/getlistMakeMotor', requestOptions)
                .then(response => response.json())
                .then(data => {
                    setMakeMotor(data.data);
                    console.log(data.data, ">>>>>>list make motor")
                });
        }
        catch (err) {
            console.log(err)
        }
    }

    // const handlemodel = async (e) => {
    //     const ParamValue = e.target.value;
    //     let result = await fetch("https://api.quickcash.ae/api/getmodel", {
    //         method: "post",
    //         body: JSON.stringify({ ParamValue }),
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //     });
    //     result = await result.json();
    //     setListModels(result);
    // };



    // const handlemodelmotor = () => {
    //     setModelMotorFilterId(make_motor_filter_id);
    // }
    const deleteItem = (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMotorMaster/?id=${id}&type=modelDetails`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    // getlistModelMotordetials(page, perPage);
                    getMakeModelVariant(page, perPage);


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
                    // getlistModelMotordetials(page, perPage);

                    getMakeModelVariant(page, perPage);


                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }

            })
    }





    const getmodelmotorbyid = (id) => {
        try {
            if (id === '') {
                setModelMotorFilterId('');
                return;
            }
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            fetch(`https://insuranceapi-3o5t.onrender.com/api/modelmotor/${id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    const modelmotordt = data.data;
                    setModelMotor(modelmotordt);
                    console.log(modelmotordt, ">>>>>>list model motor")
                });

        }
        catch (err) {
            console.log(err)
        }
    }

    const getMakeModelVariant = (page, limit) => {

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({ makeId: make_motor_filter_id, modelId: model_motor_filter_id }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        };

        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_Make_Model_and_Variant?page=${page}&limit=${limit}&name=${searchvalue}&status=${statusvalue}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const modelmotordt = data.data;
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);

                setmakemodelvariant(modelmotordt);
                console.log("make ,  model, variant >>>>>>>", data)
            });

    }
    // console.log(make_motor_filter_id, ">>>>>>make_motor_filter_id")
    // console.log(model_motor_filter_id, ">>>>>>model_motor_filter_id")



    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h4 className="card-title">Motor Model Details</h4>
                                    </div>
                                    <div className="col-md-6">
                                        {motorpermission.motor_model_details?.includes('create') ?
                                            <button className='btn btn-primary' style={{ float: "right" }} onClick={() => addMotorMOdelDetails()}>Add Motor model detail</button>
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
                                                value={make_motor_filter_id}
                                                onChange={(e) => {
                                                    getmodelmotorbyid(e.target.value)
                                                    setMakeMotorFilterId(e.target.value)
                                                }}
                                            >
                                                <option value="">-- All --</option>
                                                {make_motor.map((item) => (
                                                    <option key={item._id} value={item._id}>{item.make_motor_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className='col-lg-3'>
                                            <label><strong>Select Model</strong></label><br />
                                            <select
                                                value={model_motor_filter_id}
                                                className='form-control'
                                                onChange={(e) => setModelMotorFilterId(e.target.value)}
                                            >
                                                <option value="">-- All --</option>

                                                {make_motor_filter_id !== undefined && make_motor_filter_id?.length > 0 &&
                                                    modelmotor.map((item) => (
                                                        <option key={item._id} value={item._id}>{item.motor_model_name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>

                                        <div className='col-lg-3'>
                                            <label><strong>Select Status</strong></label><br />
                                            <select className='form-control'
                                                value={statusvalue}
                                                onChange={(e) => setStatusvalue(e.target.value)}
                                            >
                                                <option value={2}>-- All --</option>
                                                <option value={1}>Active</option>
                                                <option value={0}>Inactive</option>
                                            </select>
                                        </div>

                                        <div className='col-lg-3'>
                                            <label><strong>Search Variant</strong></label><br />
                                            <input type="text" className="form-control" placeholder="Search" onChange={(e) => setSearchvalue(e.target.value)} />
                                        </div>

                                    </div>
                                </div>
                                <div className="card-header" style={{ textAlign: 'right' }}>
                                    {motorpermission.motor_model_details?.includes('download') ?
                                        <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
                                        : ''}
                                    {motorpermission.motor_model_details?.includes('upload') ?
                                        <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(true)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
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
                                    {/* <table className="table table-bordered"> */}
                                    {/* <thead className="text-primary"> */}
                                    {/* <tr>
                                                <th> # </th>
                                                <th>Year</th>
                                                <th>Make</th>
                                                <th>Model</th>
                                                <th>variant</th>
                                                <th>Body Type</th>
                                                <th>Cylinder</th>
                                                <th>Min</th>
                                                <th>Max</th>
                                                <th>Dep</th>
                                                <th>Min Dep</th>
                                                <th>Max Dep</th>
                                                <th>Discontinution Year</th> */}
                                    {/* <th> Motor Model Detail </th>
                                            <th> Motor Model Name </th>*/}
                                    {/* <th> Location </th> */}
                                    {/* <th> Status </th> */}
                                    {/* <th> Action </th>
                                            </tr>
                                        </thead> */}

                                    <tbody>

                                        {data && data?.length > 0 ?
                                            <>
                                                {data.map((item, index) => (
                                                    <tr key={index}>
                                                        <td> {startFrom + index + 1} </td>
                                                        <td> {item.motor_model_detail_start_year} </td>
                                                        <td> {item.makeMotor?.make_motor_name} </td>
                                                        {/* <td> {item['motor_model'][0]['motor_model_name']} </td> */}
                                                        <td>{item.motor_model?.map((item) => item.motor_model_name)}</td>
                                                        <td> {item.motor_model_detail_name} </td>
                                                        <td> {item.body_type?.body_type_name}</td>
                                                        <td> {item.motor_model_detail_cylinder} </td>
                                                        <td> {item.motor_model_detail_min} </td>
                                                        <td> {item.motor_model_detail_max} </td>
                                                        <td> {item.motor_model_detail_dep} </td>
                                                        <td> {item.motor_model_detail_min_dep} </td>
                                                        <td> {item.motor_model_detail_max_dep} </td>
                                                        <td> {item.motor_model_detail_discontinuation_year} </td>
                                                        <td> {item.motor_model_detail_location.map((item) => item.location_name).join(", ")} </td>
                                                        {/* <td> {item.motor_model_detail_status === 1 ? 'Active' : 'Inactive'} </td> */}
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
                                                                        item.motor_model_detail_status === 1 ?
                                                                            <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deleteModelMotordetails(item._id, 0) }}>Deactivate</button> :
                                                                            <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deleteModelMotordetails(item._id, 1) }}>Activate</button>
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
                                    {/* </table> */}
                                </div>

                                <div className='col-md-12 '>

                                    {makemodelvariant?.map((itm1, indx1) =>
                                        <div key={indx1}>
                                            <div className='table-responsive'>
                                                <h6 className={indx1 % 2 == 0 ?
                                                    'bg-secondary d-flex' : 'bg-light d-flex'}>
                                                    {itm1._id != showMakeTable ?
                                                        <button onClick={() => setshowMaketable(itm1._id)} style={{ border: 'none', background: 'none' }}><i className='fa fa-angle-right'></i></button> :
                                                        <button style={{ border: 'none', background: 'none' }} onClick={() => setshowMaketable('')}><fa className='fa fa-angle-down'></fa></button>}
                                                    <p className='col-md-2 bg-light my-1'>{itm1.make_motor_name}</p>
                                                </h6>
                                                {itm1?.motor_models?.map((itm2, indx2) =>
                                                    <Table variant='light' striped bordered style={{ marginBottom: "20px", display: 'block', overflowX: 'scroll' }} hidden={itm1._id == showMakeTable ? false : true} key={indx2}>
                                                        <thead style={{ backgroundColor: '#1d4771' }}>
                                                            <h6 className='bg-light text-dark my-2'>Model: {itm2.motor_model_name}</h6>
                                                            <tr style={{ border: '1px solid black' }} >
                                                                <th>Variant</th>
                                                                <th>Body Type</th>
                                                                <th>Cylinder</th>
                                                                <th>Manufacturing Year</th>
                                                                <th>Discontinution Year</th>
                                                                <th>Min Value</th>
                                                                <th>Max Value</th>
                                                                <th>Dep Years</th>
                                                                <th>Dep Min</th>
                                                                <th>Dep Max</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {itm2?.variants?.map((mod, modindx) =>
                                                                <tr hidden={mod?.motor_model_detail_name ? false : true} key={modindx}>

                                                                    <td>{mod?.motor_model_detail_name}</td>
                                                                    <td>{mod?.motor_model_detail_body_type?.body_type_name}</td>
                                                                    <td>{mod?.motor_model_detail_cylinder}</td>
                                                                    <td>{mod?.motor_model_detail_start_year}</td>
                                                                    <td>{mod?.motor_model_detail_discontinuation_year}</td>
                                                                    <td>{mod?.motor_model_detail_min}</td>
                                                                    <td>{mod?.motor_model_detail_max}</td>
                                                                    <td>{mod?.motor_model_detail_dep}</td>
                                                                    <td>{mod?.motor_model_detail_min_dep}</td>
                                                                    <td>{mod?.motor_model_detail_max_dep}</td>
                                                                    <td>
                                                                        {/* {mod == {}  ?'':<> */}
                                                                        {motorpermission.motor_model_details?.includes('edit') && (
                                                                            <button className="btn btn-primary" onClick={() => { detailsbyid(mod._id, "edit"); }}>Edit</button>
                                                                        )}
                                                                        {' '}
                                                                        {motorpermission.motor_model_details?.includes('create') && (
                                                                            <button className="btn btn-success" onClick={() => { detailsbyid(mod._id, "clone"); }}>clone</button>
                                                                        )}
                                                                        {' '}
                                                                        {motorpermission.motor_model_details?.includes('delete') && (
                                                                            <>
                                                                                {
                                                                                    mod.motor_model_detail_status === 1 ?
                                                                                        <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deleteModelMotordetails(mod._id, 0) }}>Deactivate</button> :
                                                                                        <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deleteModelMotordetails(mod._id, 1) }}>Activate</button>
                                                                                }
                                                                                <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(mod._id) }}>Delete</button>

                                                                            </>
                                                                        )}
                                                                        {/* </>} */}
                                                                    </td>

                                                                </tr>)}
                                                        </tbody>
                                                    </Table>
                                                )}
                                            </div>
                                        </div>)}


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
                                                    {/* <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label className="form-label">Status</label>
                                                    <select className="form-control" name="status" required>
                                                        <option value="">Select Status</option>
                                                        <option value="1">Active</option>
                                                        <option value="0">Inactive</option>
                                                    </select>
                                                </div>
                                            </div> */}
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
                                                        <label className="form-label"><strong>Motor Model detail Name</strong></label>
                                                        <input type="text"
                                                            className="form-control"
                                                            placeholder="Model Detail"
                                                            name="model_motor_detail_name"
                                                            autoComplete="off"
                                                            required
                                                            defaultValue={motor_model_detail_name} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Make Motor</strong></label>
                                                        <select className="form-control" onChange={getmodelmotor()} name="motor_model_make_id">
                                                            {make_motor.map((item, index) => (
                                                                <option key={index} value={item._id} selected={item._id == make_motor_id ? true : false}>{item.make_motor_name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Motor Models</strong></label>
                                                        <select className="form-control" name="model_motor" required >
                                                            {modelmotor.map((item, index) => (
                                                                <option key={index} value={item.value} selected={item.value == motor_model_id ? true : false}>{item.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Start Year</label>
                                                        <input type="text" className="form-control" placeholder="Start Year" name="start_year" autoComplete="off" required defaultValue={motor_model_detail_start_year} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Body Type</label>
                                                        <select className="form-control" name="body_type" required>
                                                            <option>Select Body Type</option>
                                                            {bodytype.map((item, index) => (
                                                                <option key={index} value={item._id} selected={motor_model_detail_body_type == item._id ? true : false}>{item.body_type_name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Cylinder</label>
                                                        <select className="form-control" name="cylinder" required>
                                                            <option>Select Cylinder</option>
                                                            <option value="12" selected={motor_model_detail_cylinder == 12 ? true : false}>12</option>
                                                            <option value="10" selected={motor_model_detail_cylinder == 10 ? true : false}>10</option>
                                                            <option value="8" selected={motor_model_detail_cylinder == 8 ? true : false}>8</option>
                                                            <option value="6" selected={motor_model_detail_cylinder == 6 ? true : false}>6</option>
                                                            <option value="4" selected={motor_model_detail_cylinder == 4 ? true : false}>4</option>
                                                            <option value="2" selected={motor_model_detail_cylinder == 2 ? true : false}>2</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Min</label>
                                                        <input type="text" className="form-control" placeholder="Min" name="min" autoComplete="off" required defaultValue={motor_model_detail_min} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Max</label>
                                                        <input type="text" className="form-control" placeholder="Max" name="max" autoComplete="off" required defaultValue={motor_model_detail_max} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Depreciation up to years</label>
                                                        <input type="text" className="form-control" placeholder="Depreciation up to years" name="dep" autoComplete="off" required defaultValue={motor_model_detail_dep} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Min Depreciation up to years</label>
                                                        <input type="text" className="form-control" placeholder="Min Depreciation up to years" name="min_dep" autoComplete="off" required defaultValue={motor_model_detail_min_dep} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Max Depreciation up to years</label>
                                                        <input type="text" className="form-control" placeholder="Max Depreciation up to years" name="max_dep" autoComplete="off" required defaultValue={motor_model_detail_max_dep} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Discontinution Year</label>
                                                        <input type="text" className="form-control" placeholder="Discontinution Year" name="discontinution_year" autoComplete="off" defaultValue={motor_model_detail_discontinuation_year} />
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

                                                {/* <div className="col-md-6">
                                            <label className="form-label"><strong>Status</strong></label>.
                                            <select className="form-control" name="status" onChange={(e) => setMotorModelDetailStatus(e.target.value)}>
                                                <option>Select Status</option>
                                                <option value="1" selected={motor_model_detail_status == 1 ? true : false}>Active</option>
                                                <option value="0" selected={motor_model_detail_status == 0 ? true : false}>InActive</option>
                                            </select>
                                        </div> */}
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
                                                        <label className="form-label"><strong>Motor Model detail Name</strong></label>
                                                        <input type="text"
                                                            className="form-control"
                                                            placeholder="Model Detail"
                                                            name="model_motor_detail_name"
                                                            autoComplete="off"
                                                            required
                                                            defaultValue={motor_model_detail_name} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Make Motor</strong></label>
                                                        <select className="form-control" onChange={getmodelmotor()} name="motor_model_make_id">
                                                            {make_motor.map((item, index) => (
                                                                <option key={index} value={item._id} selected={item._id == make_motor_id ? true : false}>{item.make_motor_name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Motor Models</strong></label>
                                                        <select className="form-control" name="model_motor_id" required >
                                                            {modelmotor.map((item, index) => (
                                                                <option key={index} value={item.value} selected={item.value == motor_model_id ? true : false}>{item.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Start Year</label>
                                                        <input type="text" className="form-control" placeholder="Start Year" name="start_year" autoComplete="off" required defaultValue={motor_model_detail_start_year} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Body Type</label>
                                                        <select className="form-control" name="body_type" required>
                                                            <option>Select Body Type</option>
                                                            {bodytype.map((item, index) => (
                                                                <option key={index} value={item._id} selected={motor_model_detail_body_type == item._id ? true : false}>{item.body_type_name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Cylinder</label>
                                                        <select className="form-control" name="cylinder" required>
                                                            <option>Select Cylinder</option>
                                                            <option value="12" selected={motor_model_detail_cylinder == 12 ? true : false}>12</option>
                                                            <option value="10" selected={motor_model_detail_cylinder == 10 ? true : false}>10</option>
                                                            <option value="8" selected={motor_model_detail_cylinder == 8 ? true : false}>8</option>
                                                            <option value="6" selected={motor_model_detail_cylinder == 6 ? true : false}>6</option>
                                                            <option value="4" selected={motor_model_detail_cylinder == 4 ? true : false}>4</option>
                                                            <option value="2" selected={motor_model_detail_cylinder == 2 ? true : false}>2</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Min</label>
                                                        <input type="text" className="form-control" placeholder="Min" name="min" autoComplete="off" required defaultValue={motor_model_detail_min} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Max</label>
                                                        <input type="text" className="form-control" placeholder="Max" name="max" autoComplete="off" required defaultValue={motor_model_detail_max} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Depreciation up to years</label>
                                                        <input type="text" className="form-control" placeholder="Depreciation up to years" name="dep" autoComplete="off" required defaultValue={motor_model_detail_dep} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Min Depreciation up to years</label>
                                                        <input type="text" className="form-control" placeholder="Min Depreciation up to years" name="min_dep" autoComplete="off" required defaultValue={motor_model_detail_min_dep} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Max Depreciation up to years</label>
                                                        <input type="text" className="form-control" placeholder="Max Depreciation up to years" name="max_dep" autoComplete="off" required defaultValue={motor_model_detail_max_dep} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">Discontinution Year</label>
                                                        <input type="text" className="form-control" placeholder="Discontinution Year" name="discontinution_year" autoComplete="off" defaultValue={motor_model_detail_discontinuation_year} />
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

                                                {/* <div className="col-md-6">
                                            <label className="form-label"><strong>Status</strong></label>.
                                            <select className="form-control" name="status" onChange={(e) => setMotorModelDetailStatus(e.target.value)}>
                                                <option>Select Status</option>
                                                <option value="1" selected={motor_model_detail_status == 1 ? true : false}>Active</option>
                                                <option value="0" selected={motor_model_detail_status == 0 ? true : false}>InActive</option>
                                            </select>
                                        </div> */}
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

export default ViewMotormodeldetails