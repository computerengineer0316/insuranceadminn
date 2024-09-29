import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import swal from 'sweetalert';
import { Accordion, Col, Row } from 'react-bootstrap';


const MainPage = () => {

    const navigate = useNavigate();

    const [banner, setBanner] = useState([]);
    const [previewbanner, setPreviewBanner] = useState([]);
    const [insuranceDetailsBanner, setInsuranceDetailsBanner] = useState([]);
    const [previewInsuranceDetailsBanner, setPreviewInsuranceDetailsBanner] = useState([]);
    const [knowMore, setKnowMore] = useState([]);
    const [know_more_header, setKnowMoreHeader] = useState('');
    const [know_more_content, setKnowMoreContent] = useState('');
    const [previewKnowMore, setPreviewKnowMore] = useState([]);
    const [howToReachUs, setHowToReachUs] = useState([]);



    useEffect(() => {
        getMainPageData();
    }, []);

    const getMainPageData = async () => {
        try {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            };

            await fetch('https://insuranceapi-3o5t.onrender.com/api/get_mainpage', requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    const mainpage = data?.data;
                    setBanner(mainpage?.banner);
                    setPreviewBanner(mainpage?.banner);
                    setInsuranceDetailsBanner(mainpage?.insurance_detail_banner);
                    setPreviewInsuranceDetailsBanner(mainpage?.insurance_detail_banner);
                    setKnowMore(mainpage?.know_more_banner);
                    setPreviewKnowMore(mainpage?.know_more_banner);
                    setKnowMoreHeader(mainpage?.know_more_header);
                    setKnowMoreContent(mainpage?.know_more_content);
                    setHowToReachUs(mainpage?.howToReachUs);
                })
                .catch(error => {
                    console.error('There was an error!', error);
                    swal({
                        text: "Something went wrong",
                        icon: "error",
                    });
                });
        } catch (error) {
            console.error('There was an error!', error);
            swal({
                text: "Something went wrong",
                icon: "error",
            });
        }
    }



    const customConfig = {
        toolbar: {
            items: [
                'heading', '|',
                'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
                'indent', 'outdent', '|',
                'blockQuote', '|',
                'undo', 'redo'
            ]
        },
        placeholder: 'Start typing here...'
    };

    const handleBannerchanges = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map(file => URL.createObjectURL(file));

        setBanner([...banner, ...files]);
        setPreviewBanner([...previewbanner, ...previews]);
    }

    const removebanner = (index) => {
        const updatedSelectedPhotos = [...banner];
        updatedSelectedPhotos.splice(index, 1);

        const updatedPreviews = [...previewbanner];
        updatedPreviews.splice(index, 1);

        setBanner(updatedSelectedPhotos);
        setPreviewBanner(updatedPreviews);
    };

    const handleInsuranceDetailsBannerchanges = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map(file => URL.createObjectURL(file));

        setInsuranceDetailsBanner([...insuranceDetailsBanner, ...files]);
        setPreviewInsuranceDetailsBanner([...previewInsuranceDetailsBanner, ...previews]);
    }

    const removeInsuranceDetailsBanner = (index) => {
        const updatedSelectedPhotos = [...insuranceDetailsBanner];
        updatedSelectedPhotos.splice(index, 1);

        const updatedPreviews = [...previewInsuranceDetailsBanner];
        updatedPreviews.splice(index, 1);

        setInsuranceDetailsBanner(updatedSelectedPhotos);
        setPreviewInsuranceDetailsBanner(updatedPreviews);
    };

    const handleKnowMorechanges = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map(file => URL.createObjectURL(file));

        setKnowMore([...knowMore, ...files]);
        setPreviewKnowMore([...previewKnowMore, ...previews]);
    }

    const removeKnowMore = (index) => {
        const updatedSelectedPhotos = [...knowMore];
        updatedSelectedPhotos.splice(index, 1);

        const updatedPreviews = [...previewKnowMore];
        updatedPreviews.splice(index, 1);

        setKnowMore(updatedSelectedPhotos);
        setPreviewKnowMore(updatedPreviews);
    };






    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // if (banner.length === 0) {
            //     swal({
            //         title: "Oops!",
            //         text: "Please select a banner image",
            //         icon: "error",
            //     });
            //     return;
            // }

            // if (insuranceDetailsBanner.length === 0) {
            //     swal({
            //         title: "Oops!",
            //         text: "Please select a insurance details banner image",
            //         icon: "error",
            //     });
            //     return;
            // }

            // if (knowMore.length === 0) {
            //     swal({
            //         title: "Oops!",
            //         text: "Please select a know more image",
            //         icon: "error",
            //     });
            //     return;
            // }

            // if (howToReachUs.length === 0) {
            //     swal({
            //         title: "Oops!",
            //         text: "Please select a how to reach us image",
            //         icon: "error",
            //     });
            //     return;
            // }

            const formData = new FormData();
            banner.forEach(photo => {
                if (photo instanceof File) {
                    formData.append('banner', photo);
                } else {
                    formData.append('banner', photo.filename);
                }
            });
            insuranceDetailsBanner.forEach(photo => {
                if (photo instanceof File) {
                    formData.append('insurance_detail_banner', photo);
                } else {
                    formData.append('insurance_detail_banner', photo.filename);
                }
            });
            knowMore.forEach(photo => {
                if (photo instanceof File) {
                    formData.append('know_more_banner', photo);
                } else {
                    formData.append('know_more_banner', photo.filename);
                }
            });
            formData.append('know_more_header', know_more_header);
            formData.append('know_more_content', know_more_content);
            formData.append('howToReachUs', howToReachUs);






            // formData.append('banner', banner);
            // formData.append('insuranceDetailsBanner', insuranceDetailsBanner);
            // formData.append('knowMore', knowMore);
            // formData.append('howToReachUs', howToReachUs);

            console.log(Array.from(formData));

            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: formData
            };

            await fetch('https://insuranceapi-3o5t.onrender.com/api/edit_mainpage', requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    swal({
                        title: "Success!",
                        text: "Main page updated successfully",
                        icon: "success",
                    });
                    // navigate('/cms/main-page');
                })
                .catch(error => {
                    console.error('There was an error!', error);
                    swal({
                        title: "Oops!",
                        text: "Something went wrong",
                        icon: "error",
                    });
                });

        } catch (error) {
            console.error('There was an error!', error);
            swal({
                title: "Oops!",
                text: "Something went wrong",
                icon: "error",
            });
        }



    }

    return (
        <div className="container mb-5">
            <div className="row">
                <div className="col-md-12">

                    <Accordion className="container mb-5">
                        <Accordion.Item >
                            <Accordion.Header>
                                <div className="card-header new_leads">
                                    <strong>Banner </strong>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body className="scrollavcds" style={{ padding: '2px' }}>
                                <div className="card mb-5">
                                    <div className='container'>
                                        <div className='row'>
                                            <div className='col-md-12'>
                                                <div className="form-group mb-3">
                                                    {/* <h3><strong>Banner</strong></h3> */}
                                                    {/* <input type='file' multiple className='form-control' onChange={handleBannerchanges} /> */}
                                                    <div className="image-upload">
                                                        <label style={{ cursor: "pointer" }} htmlFor="file_upload">
                                                            <img src="" alt="" className="uploaded-image" />
                                                            <div className="h-100">
                                                                <div className="dplay-tbl">
                                                                    <div className="dplay-tbl-cell">
                                                                        <i className="fa fa-cloud-upload" />
                                                                        <h5>
                                                                            <b>Choose Your Image to Upload</b>
                                                                        </h5>
                                                                        <h6 className="mt-10 mb-70">Or Drop Your Image Here</h6>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <input
                                                                data-required="image"
                                                                type="file"
                                                                name="image_name"
                                                                id="file_upload"
                                                                className="image-input"
                                                                data-traget-resolution="image_resolution"
                                                                onChange={handleBannerchanges}
                                                                multiple
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Row >
                                                        {previewbanner?.map((photo, index) => (
                                                            <Col lg={4} key={index}>

                                                                {photo.filename ?

                                                                    <div className='photo-container mb-2'>
                                                                        <img src={`https://insuranceapi-3o5t.onrender.com/Cmsuploads/banner/${photo.filename}`} alt="Photo" className="photoorodfd" />
                                                                        <button className='remove' onClick={() => removebanner(index)}><span className='cross'>x</span></button>
                                                                    </div>
                                                                    :

                                                                    <div className='photo-container mb-2'>
                                                                        <img src={photo} alt="Photo" className="photoorodfd" />
                                                                        <button className='remove' onClick={() => removebanner(index)}><span className='cross'>x</span></button>
                                                                    </div>
                                                                }

                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <Accordion className="container mb-5">
                        <Accordion.Item >
                            <Accordion.Header>
                                <div className="card-header new_leads">
                                    <strong>Insurance Details Banner </strong>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body className="scrollavcds" style={{ padding: '2px' }}>
                                <div className="card mb-5">
                                    <div className='container'>
                                        <div className='row'>

                                            <div className='col-md-12'>
                                                <div className="form-group mb-3">
                                                    {/* <h3><strong>Insurance Details Banner</strong></h3> */}
                                                    {/* <input type='file' className='form-control' /> */}
                                                    <div className="image-upload">
                                                        <label style={{ cursor: "pointer" }} htmlFor="file_upload">
                                                            <img src="" alt="" className="uploaded-image" />
                                                            <div className="h-100">
                                                                <div className="dplay-tbl">
                                                                    <div className="dplay-tbl-cell">
                                                                        <i className="fa fa-cloud-upload" />
                                                                        <h5>
                                                                            <b>Choose Your Image to Upload</b>
                                                                        </h5>
                                                                        <h6 className="mt-10 mb-70">Or Drop Your Image Here</h6>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <input
                                                                data-required="image"
                                                                type="file"
                                                                name="image_name"
                                                                id="file_upload"
                                                                className="image-input"
                                                                data-traget-resolution="image_resolution"
                                                                onChange={handleInsuranceDetailsBannerchanges}
                                                                multiple
                                                            />
                                                        </label>
                                                    </div>

                                                    <div>
                                                        <Row >
                                                            {previewInsuranceDetailsBanner?.map((photo, index) => (
                                                                <Col lg={4} key={index}>
                                                                    {photo.filename ?

                                                                        <div className='photo-container mb-2'>
                                                                            <img src={`https://insuranceapi-3o5t.onrender.com/Cmsuploads/insurancedetail/${photo.filename}`} alt="Photo" className="photoorodfd" />
                                                                            <button className='remove' onClick={() => removeInsuranceDetailsBanner(index)}><span className='cross'>x</span></button>
                                                                        </div>
                                                                        :
                                                                        <div className='photo-container mb-2'>
                                                                            <img src={photo} alt="Photo" className="photoorodfd" />
                                                                            <button className='remove' onClick={() => removeInsuranceDetailsBanner(index)}><span className='cross'>x</span></button>
                                                                        </div>
                                                                    }
                                                                </Col>
                                                            ))}
                                                        </Row>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <Accordion className="container mb-5">
                        <Accordion.Item >
                            <Accordion.Header>
                                <div className="card-header new_leads">
                                    <strong>Know More </strong>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body className="scrollavcds" style={{ padding: '2px' }}>
                                <h3><strong>Know More Header</strong></h3>
                                <div className="card mb-5">
                                    <div className='container'>
                                        <div className='row'>
                                            <div className='col-md-12'>
                                                <div className="form-group mb-3">
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={know_more_header}
                                                        config={customConfig}
                                                        onReady={editor => {
                                                            // You can store the "editor" and use when it is needed.
                                                            console.log('Editor is ready to use!', editor);
                                                        }}
                                                        onChange={(event, editor) => {
                                                            const data = editor.getData();
                                                            setKnowMoreHeader(data);
                                                        }}
                                                        onBlur={(event, editor) => {
                                                            console.log('Blur.', editor);
                                                        }}
                                                        onFocus={(event, editor) => {
                                                            console.log('Focus.', editor);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />

                                <h3><strong>Know More Content</strong></h3>
                                <div className="card mb-5">
                                    <div className='container'>
                                        <div className='row'>
                                            <div className='col-md-12'>
                                                <div className="form-group mb-3">
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={know_more_content}
                                                        config={customConfig}
                                                        onReady={editor => {
                                                            // You can store the "editor" and use when it is needed.
                                                            console.log('Editor is ready to use!', editor);
                                                        }}
                                                        onChange={(event, editor) => {
                                                            const data = editor.getData();
                                                            setKnowMoreContent(data);
                                                        }}
                                                        onBlur={(event, editor) => {
                                                            console.log('Blur.', editor);
                                                        }}
                                                        onFocus={(event, editor) => {
                                                            console.log('Focus.', editor);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />

                                <h3><strong>Know More Video</strong></h3>
                                <div className="card mb-5">
                                    <div className='container'>
                                        <div className='row'>
                                            <div className='col-md-12'>
                                                <div className="form-group mb-3">
                                                    {/* <h3><strong>Know More</strong></h3> */}
                                                    <div className="image-upload">
                                                        <label style={{ cursor: "pointer" }} htmlFor="file_upload">
                                                            <img src="" alt="" className="uploaded-image" />
                                                            <div className="h-100">
                                                                <div className="dplay-tbl">
                                                                    <div className="dplay-tbl-cell">
                                                                        <i className="fa fa-cloud-upload" />
                                                                        <h5>
                                                                            <b>Choose Your Image to Upload</b>
                                                                        </h5>
                                                                        <h6 className="mt-10 mb-70">Or Drop Your Image Here</h6>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <input
                                                                data-required="image"
                                                                type="file"
                                                                name="image_name"
                                                                id="file_upload"
                                                                className="image-input"
                                                                data-traget-resolution="image_resolution"
                                                                onChange={handleKnowMorechanges}
                                                                multiple
                                                            />
                                                        </label>
                                                    </div>

                                                    <div>
                                                        <Row >
                                                            {previewKnowMore?.map((photo, index) => (
                                                                <Col lg={4} key={index}>
                                                                    {
                                                                        photo.filename ?

                                                                            <div className='photo-container mb-2'>
                                                                                <video controls src={`https://insuranceapi-3o5t.onrender.com/Cmsuploads/knowmore/${photo.filename}`} alt="Photo" className="photoorodfd" />
                                                                                <button className='remove' onClick={() => removeKnowMore(index)}><span className='cross'>x</span></button>
                                                                            </div>
                                                                            :
                                                                            <div className='photo-container mb-2'>
                                                                                <video controls src={photo} alt="Photo" className="photoorodfd" />
                                                                                <button className='remove' onClick={() => removeKnowMore(index)}><span className='cross'>x</span></button>
                                                                            </div>
                                                                    }
                                                                </Col>
                                                            ))}
                                                        </Row>
                                                    </div>


                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <Accordion className="container mb-5">
                        <Accordion.Item >
                            <Accordion.Header>
                                <div className="card-header new_leads">
                                    <strong>How To Reach Us</strong>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body className="scrollavcds" style={{ padding: '2px' }}>
                                <div className="card mb-5">
                                    <div className='container'>
                                        <div className='row'>
                                            <div className='col-md-12'>
                                                <div className="form-group mb-3">
                                                    {/* <h3><strong>How To Reach Us</strong></h3> */}
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={howToReachUs}
                                                        config={customConfig}
                                                        onReady={editor => {
                                                            // You can store the "editor" and use when it is needed.
                                                            console.log('Editor is ready to use!', editor);
                                                        }}
                                                        onChange={(event, editor) => {
                                                            const data = editor.getData();
                                                            setHowToReachUs(data);
                                                        }}
                                                        onBlur={(event, editor) => {
                                                            console.log('Blur.', editor);
                                                        }}
                                                        onFocus={(event, editor) => {
                                                            console.log('Focus.', editor);
                                                        }}
                                                    />

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                </div>
                <div className="card-footer">
                    <button className="btn btn-outline-success" style={{ float: "right" }} onClick={handleSubmit}>
                        Update
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MainPage