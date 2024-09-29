import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { CWidgetStatsC } from '@coreui/react'
import { Row, Col } from 'react-bootstrap'
import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
} from '@coreui/react'
import {
  CChart,
  CChartBar,
  CChartPie,
} from '@coreui/react-chartjs'
import Multiselect from 'multiselect-react-dropdown';
import PremiumEarned from './PremiumEarned';
import BestRateComparison from './BestRateComparison';
import ProjectedBusinessAnalysis from './ProjectedBusinessAnalysis';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import InsuranceCompanydbtoplegend from './InsuranceCompanydbtoplegend';

function InsuranceCompanyDashboard() {

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
  const [isActive, setIsActive] = useState(false);
  const [location, setLocation] = useState([]);
  const [selectedOption, setSelectedOption] = useState();
  const [lob, setLob] = useState([]);
  const [selectedlob, setSelectedLOB] = useState();
  const [businessType, setBusinessType] = useState([{ label: 'New Business', value: 'New' }, { label: 'Renewal Business', value: 'Renewal' }]);
  const [selectedBusinessType, setSelectedBusinessType] = useState();
  const [agent, setAgent] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState();
  const [dateRange, setDateRange] = useState('daily');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      locationList();
      lobList();
      agentList();
    }
  }, []);

  const locationList = () => {
    const userdata = JSON.parse(localStorage.getItem('user'));
    const loc = userdata.location;
    if (userdata.insurance_company != "") {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
      fetch(`https://insuranceapi-3o5t.onrender.com/api/getCompanyDetailsbyid/${userdata.insurance_company}`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          setDateRange(data.data.default_time)
        })
    }
    if (loc != undefined) {
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
    if (lob != undefined) {
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
      fetch(`https://insuranceapi-3o5t.onrender.com/api/get_LOB`, requestOptions)
        .then(response => response.json())
        .then(data => {
          const lobdt = data.data;
          const lob_len = lobdt.length;
          const lob_list = [];
          for (let i = 0; i < lob_len; i++) {
            const lob_obj = { label: lobdt[i].line_of_business_name, value: lobdt[i].line_of_business_name };
            lob_list.push(lob_obj);
          }
          setLob(lob_list);
        });
    }
  }

  const agentList = () => {
    const requestOptions =
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getMultiStaff`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const agentdt = data.data;
        const agent_len = agentdt.length;
        const agent_list = [];
        for (let i = 0; i < agent_len; i++) {
          const agent_obj = { label: agentdt[i].name, value: agentdt[i]._id };
          agent_list.push(agent_obj);
        }
        setAgent(agent_list);
        console.log(agent_list);
      });
  }


  const handleDateRangeChange = (dateRange) => {
    setDateRange(dateRange);
  };

  const [isDivVisible, setIsDivVisible] = useState(false);
  const [fromdateValue, onFromDateChange] = useState(new Date());
  const [todateValue, onToDateChange] = useState(new Date());
  const handlecustomized = () => { }

  const defaultFilterOptions = {
    defaultlocation: location,
    defaultlob: lob,
    defaultbusinessType: businessType,
    defaultagent: agent,
    defaultdateRange: dateRange,
  };
  console.log(defaultFilterOptions.defaultbusinessType)

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
      case 'agent':
        setSelectedAgent(selectedValue);
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
    agent: selectedAgent,
    dateRange: dateRange,
  }
  console.log(combinedFilterOptions.businessType)
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
              <Multiselect
                options={defaultFilterOptions.defaultlocation}
                displayValue="label"
                onSelect={(selectedValue) => handleFilterChange('location', selectedValue)}
                onRemove={(selectedValue) => handleFilterChange('location', selectedValue)}
                placeholder="Select location"
                selectedValues={selectedOption}
                showArrow={true}
              />
            </div>
          </Col>

          <Col className='mb-3' sm={3}>
            <div>
              <Multiselect
                options={defaultFilterOptions.defaultbusinessType}
                displayValue="label"
                onSelect={(selectedValue) => handleFilterChange('businessType', selectedValue)}
                onRemove={(selectedValue) => handleFilterChange('businessType', selectedValue)}
                placeholder="Select business type"
                selectedValues={selectedBusinessType}
                showArrow={true}
              />
            </div>
          </Col>

          <Col className='mb-3' sm={3}>
            <div>
              <Multiselect
                options={defaultFilterOptions.defaultlob}
                displayValue="label"
                onSelect={(selectedValue) => handleFilterChange('lob', selectedValue)}
                onRemove={(selectedValue) => handleFilterChange('lob', selectedValue)}
                placeholder="Select line of business"
                selectedValues={selectedlob}
                showArrow={true}
              />
            </div>
          </Col>

          {/* <Col className='mb-3' sm={3}>
            <div>
              <Multiselect
                options={defaultFilterOptions.defaultagent}
                displayValue="label"
                onSelect={(selectedValue) => handleFilterChange('agent', selectedValue)}
                onRemove={(selectedValue) => handleFilterChange('agent', selectedValue)}
                placeholder="Select Agents"
                selectedValues={selectedAgent}
                showArrow={true}
              />
            </div>
          </Col> */}

          <Col>
            <div className='mb-3'>
              <button style={{ width: 'auto' }} className='btn btn-light' onClick={() => navigate('/AddCompanyUsers')}>Add User Request</button>
            </div>
          </Col>
        </Row>
      </section>

      <section className='mb-3'>
        <InsuranceCompanydbtoplegend
          defaultOptions={defaultFilterOptions}
          filterOptions={combinedFilterOptions}
        />
      </section>
      <section className='tables'>
        <Row>
          <Col className='' lg={12}>
            <PremiumEarned
              defaultOptions={defaultFilterOptions}
              filterOptions={combinedFilterOptions}
            />
          </Col>
          <Col className='' lg={12}>
            <BestRateComparison
              defaultOptions={defaultFilterOptions}
              filterOptions={combinedFilterOptions}
            />
          </Col>
          <Col className='' lg={12}>
            <ProjectedBusinessAnalysis
              defaultOptions={defaultFilterOptions}
              filterOptions={combinedFilterOptions}
            />
          </Col>
        </Row>
      </section>
    </>
  )
}
export default InsuranceCompanyDashboard;
