import React from 'react'
import { Tabs, Tab } from 'react-bootstrap';
import MainPage from './MainPage';
import MotorPage from './MotorPage';
import TravelPage from './TravelPage';
import HomePage from './HomePage';
import YachtPage from './YachtPage';
import MedicalPage from './MedicalPage';
import OtherinsurancePage from './OtherinsurancePage';
import Helptips from './Helptips';
import Faq from './Faq';


const ViewCms = () => {

    return (
        <div className="container mb-5">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="card-title">CMS</h4>
                                </div>
                            </div>
                        </div>
                        <div className="card-body addmotorplans " style={{ overflowX: 'scroll' }}>
                            <Tabs variant='tabs' defaultActiveKey={'MainPage'} id="uncontrolled-tab-example" className="bg-light mb-3">
                                <Tab eventKey={'MainPage'} title={<h5>Main Page</h5>}>
                                <MainPage/>
                                </Tab>
                                <Tab eventKey={'Helptips'} title={<h5>Help & Tips</h5>}>
                                    <Helptips />
                                </Tab>
                                <Tab eventKey={'Faq'} title={<h5>FAQ</h5>}>
                                    <Faq />
                                </Tab>
                                <Tab eventKey={'Motor'} title={<h5>Motor</h5>}>
                                <MotorPage/>
                                </Tab>
                                <Tab eventKey={'Travel'} title={<h5>Travel</h5>}>
                                  <TravelPage/>
                                </Tab>
                                <Tab eventKey={'Yacht'} title={<h5>Yacht</h5>}>
                                   <YachtPage/>
                                </Tab>
                                <Tab eventKey={'Home'} title={<h5>Home</h5>}>
                                <HomePage/>
                                </Tab>
                                <Tab eventKey={'Medical'} title={<h5>Medical</h5>}>
                                    <MedicalPage/>
                                </Tab>
                                <Tab eventKey={'OtherInsurances'} title={<h5>Other Insurances</h5>}>
                                    <OtherinsurancePage/>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewCms
