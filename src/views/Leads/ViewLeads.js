import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { Container, Row, Col, Modal, Button, Tabs } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import LeadsTable from './LeadsTable'
import Motorleads from './Motorleads';
import Travelleads from './Travelleads';
import { Tab } from 'bootstrap';
import Homeleads from './Homeleads';
import Medicalleads from './Medicalleads';
import Yachtleads from './Yachtleads';

function ViewLeads() {
  const state = {
    lazyLoad: true,
    responsive: {
      0: {
        items: 1,
      },
      450: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 4,
      },
    },
  }

  const navigate = useNavigate();
  const [location, setLocation] = useState([]);
  const [selectedOption, setSelectedOption] = useState();
  const [lob, setLob] = useState([]);
  const [selectedlob, setSelectedLOB] = useState();
  const [businessType, setBusinessType] = useState([]);
  const [selectedBusinessType, setSelectedBusinessType] = useState();
  const [agenttype, setAgenttype] = useState([])

  //   const [agent, setAgent] = useState([]);

  const [dateRange, setDateRange] = useState('daily');
  const [showModal, setShowModal] = useState(false);
  const [fromdateValue, onFromDateChange] = useState(new Date());
  const [todateValue, onToDateChange] = useState(new Date());

  const [lineofbusiness, setLineofBusiness] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      const userdata = JSON.parse(localStorage.getItem('user'));
      const business_type = userdata.admin_business_type;
      if (business_type.length > 0) {
        const businessdt = business_type;
        const business_len = businessdt.length;
        const business_list = [];
        for (let i = 0; i < business_len; i++) {
          let btype;
          btype = businessdt[i].type;
          btype = btype.split(' ');
          const business_obj = { label: businessdt[i].type, value: btype[0] };
          business_list.push(business_obj);
        }
        setBusinessType(business_list);

      }
      else {
        const Business_type = [
          { label: "New Business", value: "New" },
          { label: "Renewal Business", value: "Renewal" }
        ];
        setBusinessType(Business_type);
      }
      locationList();
      lobList();
      usertypelist();
      lineofbusinesslist();
    }
  }, []);

  const locationList = () => {
    const userdata = JSON.parse(localStorage.getItem('user'));
    const loc = userdata.location;
    if (loc.length > 0) {
      const locationdt = loc;
      const location_len = locationdt.length;
      const location_list = [];
      for (let i = 0; i < location_len; i++) {
        const location_obj = { label: locationdt[i].loc_name, value: locationdt[i].loc_id };
        location_list.push(location_obj);
      }
      setLocation(location_list);
    }
    else {
      const requestOptions =
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      fetch(`https://insuranceapi-3o5t.onrender.com/api/get_location`, requestOptions)
        .then(response => response.json())
        .then(data => {
          const locationdt = data.data;
          const location_len = locationdt.length;
          const location_list = [];
          for (let i = 0; i < location_len; i++) {
            const location_obj = { label: locationdt[i].location_name, value: locationdt[i]._id };
            location_list.push(location_obj);
          }
          setLocation(location_list);
        });
    }
  }

  const lobList = () => {
    const userdata = JSON.parse(localStorage.getItem('user'));
    const lob = userdata.line_of_business;
    if (lob.length > 0) {
      const lobdt = lob;
      const lob_len = lobdt.length;
      const lob_list = [];
      for (let i = 0; i < lob_len; i++) {
        const lob_obj = { label: lobdt[i].lob_name, value: lobdt[i].lob_id };
        lob_list.push(lob_obj);
      }
      setLob(lob_list);
    }
    else {
      const requestOptions =
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      fetch(`https://insuranceapi-3o5t.onrender.com/api/get_line_of_business_list`, requestOptions)
        .then(response => response.json())
        .then(data => {
          const lobdt = data.data;
          const lob_len = lobdt?.length;
          const lob_list = [];
          for (let i = 0; i < lob_len; i++) {
            const lob_obj = { label: lobdt[i].line_of_business_name, value: lobdt[i]._id };
            lob_list.push(lob_obj);
          }
          setLob(lob_list);
        });
    }
  }



  const usertypelist = async (agenttype) => {
    setAgenttype(agenttype);

  }


  const handleDateRangeChange = (dateRange) => {
    setDateRange(dateRange);
  };

  const handlecustomized = () => {
    setShowModal(true);
    setDateRange('customized');
  }

  const defaultFilterOptions =
  {
    defaultlocation: location,
    defaultlob: lob,
    defaultbusinessType: businessType,
    defaultdateRange: dateRange,
    startdate: fromdateValue,
    enddate: todateValue,
    userType: agenttype,
  };

  const handleFilterChange = (filterName, selectedValue) => {
    switch (filterName) {
      case 'location':
        setSelectedOption(selectedValue);

        break;
      case 'lob':
        setSelectedLOB(selectedValue);

        break;
      case 'businessType':
        setSelectedBusinessType(selectedValue);
        break;
      default:
        break;
    }
  };
  const combinedFilterOptions =
  {
    location: selectedOption,
    lob: selectedlob,
    businessType: selectedBusinessType,
    dateRange: dateRange,
  }


  const lineofbusinesslist = () => {
    const requestOptions =
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/get_line_of_business_list`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const lobdt = data.data;
        console.log(lobdt, 'lobdt');
        setLineofBusiness(lobdt);
      });
  }



  return (
    <>
      <section className='mb-2'>
        <Row>
          <Col className='' sm={5}>
            <h4 id="dashboard" className="card-title mb-0">Dashboard</h4>
          </Col>
          <Col sm={7} className="d-none d-md-block">
            <div className='float-end me-3'>
              <button onClick={() => handleDateRangeChange('daily')}
                className={`${dateRange === 'daily' ? 'btn btn-selected' : 'btn btn-light'}`}
              >Daily</button>
              <button onClick={() => handleDateRangeChange('weekly')}
                className={`${dateRange === 'weekly' ? 'btn btn-selected' : 'btn btn-light'}`}
              >Weekly</button>
              <button onClick={() => handleDateRangeChange('monthly')}
                className={`${dateRange === 'monthly' ? 'btn btn-selected' : 'btn btn-light'}`}
              >Monthly</button>
              <button onClick={() => handleDateRangeChange('yearly')}
                className={`${dateRange === 'yearly' ? 'btn btn-selected' : 'btn btn-light'}`}
              >Yearly</button>
              <button onClick={handlecustomized}
                className={`${dateRange === 'customized' ? 'btn btn-selected' : 'btn btn-light'}`}
              >Customized</button>

            </div>
          </Col>

          <Col className='mb-3' sm={3}>
            <div>
              {defaultFilterOptions.defaultlocation < 2 ?
                <Multiselect
                  options={defaultFilterOptions.defaultlocation}
                  displayValue="label"
                  selectedValues={defaultFilterOptions.defaultlocation}
                  showArrow={false}
                />

                :
                <Multiselect
                  options={defaultFilterOptions.defaultlocation}
                  displayValue="label"
                  onSelect={(selectedValue) => handleFilterChange('location', selectedValue)}
                  onRemove={(selectedValue) => handleFilterChange('location', selectedValue)}
                  placeholder="Select location"
                  selectedValues={selectedOption}
                  showArrow={true}
                />
              }
            </div>
          </Col>

          <Col className='mb-3' sm={3}>
            <div>
              {defaultFilterOptions.defaultbusinessType.length < 2
                ?
                <Multiselect
                  options={defaultFilterOptions.defaultbusinessType}
                  displayValue="label"
                  selectedValues={defaultFilterOptions.defaultbusinessType}
                  showArrow={false}
                />

                :
                <Multiselect
                  options={defaultFilterOptions.defaultbusinessType}
                  displayValue="label"
                  onSelect={(selectedValue) => handleFilterChange('businessType', selectedValue)}
                  onRemove={(selectedValue) => handleFilterChange('businessType', selectedValue)}
                  placeholder="Select business type"
                  selectedValues={selectedBusinessType}
                  showArrow={true}
                />
              }
            </div>
          </Col>

          <Col className='mb-3' sm={3}>
            <div>
              {defaultFilterOptions.defaultlob.length < 2
                ?
                <Multiselect
                  options={defaultFilterOptions.defaultlob}
                  displayValue="label"
                  selectedValues={defaultFilterOptions.defaultlob}
                  showArrow={false}
                />

                :
                <Multiselect
                  options={defaultFilterOptions.defaultlob}
                  displayValue="label"
                  onSelect={(selectedValue) => handleFilterChange('lob', selectedValue)}
                  onRemove={(selectedValue) => handleFilterChange('lob', selectedValue)}
                  placeholder="Select line of business"
                  selectedValues={selectedlob}
                  showArrow={true}
                />
              }
            </div>
          </Col>
        </Row>
        <Row>
          <LeadsTable
            defaultOptions={defaultFilterOptions}
            filterOptions={combinedFilterOptions}
          />
        </Row>
        {/* <Row>
        <Tabs defaultActiveKey={lineofbusiness[0]?.line_of_business_name} id="uncontrolled-tab-example" className="mb-3">
                                    {lineofbusiness && 
                                    lineofbusiness.map((item, index) => (
                                        <Tab key={index} eventKey={item.line_of_business_name} title={item.line_of_business_name}>
                                            {item.line_of_business_name === 'Motor' 
                                            &&
                                             <Motorleads 
                                             defaultOptions={defaultFilterOptions}
                                              filterOptions={combinedFilterOptions}
                                              />}
                                            {item.line_of_business_name === 'Travel' 
                                            && 
                                            <Travelleads
                                            defaultOptions={defaultFilterOptions}
                                              filterOptions={combinedFilterOptions}
                                            />}
                                             {item.line_of_business_name === 'Home' 
                                            && 
                                            <Homeleads
                                              defaultOptions={defaultFilterOptions}
                                              filterOptions={combinedFilterOptions}
                                            />}
                                            {item.line_of_business_name === 'Medical' 
                                            && 
                                            <Medicalleads
                                              defaultOptions={defaultFilterOptions}
                                              filterOptions={combinedFilterOptions}
                                            />}
                                            {item.line_of_business_name === 'Yacht' 
                                            && 
                                            <Yachtleads
                                              defaultOptions={defaultFilterOptions}
                                              filterOptions={combinedFilterOptions}
                                            />}
                                        </Tab>
                                    ))}
                                </Tabs>
        </Row> */}
      </section>
      <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Custom Dates</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <label htmlFor="">From</label>
              <DatePicker
                onChange={onFromDateChange}
                value={fromdateValue}
                format="dd/MM/yyyy"
                autoFocus={true}
                inline
                calendarClassName="custom-datepicker"
                closeCalendar={false}
              />
            </Row>
            <Row>
              <label htmlFor="">To</label>
              <DatePicker
                onChange={onToDateChange}
                value={todateValue}
                format="dd/MM/yyyy"
                autoFocus={true}
                inline
                calendarClassName="custom-datepicker"
                closeCalendar={false} />
            </Row>
          </Container>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default ViewLeads
