import React from 'react'
import SocialMedia from './views/social-media/SocialMedia'
import ClaimQuestions from './views/claims-questions/ClaimQuestion'
import BankDetails from './views/bank-details/BankDetails'
import EmergencyDepartment from './views/emergency_departments/EmergencyDepartment'
import NewsLetter from './views/newsletter/NewsLetter'
import BannerImage from './views/banner_image/BannerImage'
import Complaint from './views/complaints/Complaint'
import GuidelinesSteps from './views/Guidelines/GuideLinesSteps'
import AMRatings from './views/AM_&_SP_Ratings/AMRatings'
import { element } from 'prop-types'
import CEOTopLegend from './views/admin-ceo_dashboard/ceo/CEOTopLegend'
// const MISReports = React.lazy(() => import('./views/MISReports'))
const SpecialIncetive = React.lazy(() => import('./views/SpecialIncetive'))


const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const LineOfBusiness = React.lazy(() => import('./views/line-of-business/LineOfBusiness'))
const AddLineOfBusiness = React.lazy(() => import('./views/line-of-business/AddLineOfBusiness'))
const EditLineOfBusiness = React.lazy(() => import('./views/line-of-business/EditLineOfBusiness'))

const Location = React.lazy(() => import('./views/location/Location'))
const AddLocation = React.lazy(() => import('./views/location/AddLocation'))
const EditLocation = React.lazy(() => import('./views/location/EditLocation'))

const MakeMotor = React.lazy(() => import('./views/motor-make/MakeMotor'))
const AddMakeMotor = React.lazy(() => import('./views/motor-make/AddMakeMotor'))
const EditMakeMotor = React.lazy(() => import('./views/motor-make/EditMakeMotor'))

const ModelMotor = React.lazy(() => import('./views/motor-model/ModelMotor'))
const AddModelMotor = React.lazy(() => import('./views/motor-model/AddModelMotor'))
const EditModelMotor = React.lazy(() => import('./views/motor-model/EditModelMotor'))

const Addtravelinsurancefor = React.lazy(() =>
  import('./views/Travel/travelinsurancefor/Addtravelinsurancefor'),
)
const Viewtravelinsurancefor = React.lazy(() =>
  import('./views/Travel/travelinsurancefor/Viewtravelinsurancefor'),
)
const Updatetravelinsurancefor = React.lazy(() =>
  import('./views/Travel/travelinsurancefor/Updatetravelinsurancefor'),
)

const Addtraveltype = React.lazy(() => import('./views/Travel/traveltype/Addtraveltype'))
const ViewTraveltype = React.lazy(() => import('./views/Travel/traveltype/Viewtraveltype'))
const UpdateTraveltype = React.lazy(() => import('./views/Travel/traveltype/Updatetraveltype'))

const Addtravelplantype = React.lazy(() =>
  import('./views/Travel/travelplantype/Addtravelplantype'),
)
const Viewtravelplantype = React.lazy(() =>
  import('./views/Travel/travelplantype/Viewtravelplantype'),
)
const Updatetravelplantype = React.lazy(() =>
  import('./views/Travel/travelplantype/Updatetravelplantype'),
)

const Addtravelregionlist = React.lazy(() =>
  import('./views/Travel/travelregionlist/Addtravelregionlist'),
)
const Viewtravelregionlist = React.lazy(() =>
  import('./views/Travel/travelregionlist/Viewtravelregionlist'),
)
const Updatetravelregionlist = React.lazy(() =>
  import('./views/Travel/travelregionlist/Updatetravelregionlist'),
)

const Addtravelcovertypelist = React.lazy(() =>
  import('./views/Travel/travelcovertypelist/Addtravelcovertypelist'),
)
const Viewtravelcovertypelist = React.lazy(() =>
  import('./views/Travel/travelcovertypelist/Viewtravelcovertypelist'),
)
const Updatetravelcovertypelist = React.lazy(() =>
  import('./views/Travel/travelcovertypelist/Updatetravelcovertypelist'),
)

const Addpropertytypelist = React.lazy(() =>
  import('./views/Home/homepropertytype/Addpropertytypelist'),
)
const Viewpropertytypelist = React.lazy(() =>
  import('./views/Home/homepropertytype/Viewpropertytypelist'),
)
const Updatepropertytypelist = React.lazy(() =>
  import('./views/Home/homepropertytype/Updatepropertytypelist'),
)

const Addhomeplantypelist = React.lazy(() =>
  import('./views/Home/homeplantypelist/Addhomeplantypelist'),
)
const Viewhomeplantypelist = React.lazy(() =>
  import('./views/Home/homeplantypelist/Viewhomeplantypelist'),
)
const Updatehomeplantypelist = React.lazy(() =>
  import('./views/Home/homeplantypelist/Updatehomeplantypelist'),
)

const Addhomeownershiplist = React.lazy(() =>
  import('./views/Home/homeownershipstatus/Addhomeownership'),
)
const Viewhomeownershiplist = React.lazy(() =>
  import('./views/Home/homeownershipstatus/Viewhomeownership'),
)
const Updatehomeownershiplist = React.lazy(() =>
  import('./views/Home/homeownershipstatus/Updatehomeownership'),
)

const Viewhomecondition = React.lazy(() => import('./views/Home/homecondition/Viewhomecondition'))
const HomeCondition = React.lazy(() => import('./views/Home/homeplan/ViewHomeCondition'))
const Addhomecondition = React.lazy(() => import('./views/Home/homecondition/Addhomecondition'))

const Addmedicalplantype = React.lazy(() =>
  import('./views/Medical/medical_plan_type/Addmedicalplantype'),
)
const Viewmedicalplantype = React.lazy(() =>
  import('./views/Medical/medical_plan_type/Viewmedicalplantype'),
)
const Updatemedicalplantype = React.lazy(() =>
  import('./views/Medical/medical_plan_type/Updatemedicalplantype'),
)

const Addmedicalvisacountries = React.lazy(() =>
  import('./views/Medical/medical_visa_countries/Addmedicalvisacountries'),
)
const Viewmedicalvisacountries = React.lazy(() =>
  import('./views/Medical/medical_visa_countries/Viewmedicalvisacountries'),
)
const Updatemedicalvisacountries = React.lazy(() =>
  import('./views/Medical/medical_visa_countries/Updatemedicalvisacountries'),
)

const Addmedicalplancondition = React.lazy(() =>
  import('./views/Medical/medical_plan_condition/Addmedicalplancondition'),
)
const Viewmedicalplancondition = React.lazy(() =>
  import('./views/Medical/medical_plan_condition/Viewmedicalplancondition'),
)
const Updatemedicalplancondition = React.lazy(() =>
  import('./views/Medical/medical_plan_condition/Updatemedicalplancondition'),
)

const Addmedicalsalaryrange = React.lazy(() =>
  import('./views/Medical/medical_salary_range/Addmedicalsalaryrange'),
)
const Viewmedicalsalaryrange = React.lazy(() =>
  import('./views/Medical/medical_salary_range/Viewmedicalsalaryrange'),
)
const Updatemedicalsalaryrange = React.lazy(() =>
  import('./views/Medical/medical_salary_range/Updatemedicalsalaryrange'),
)

const Addmedicalweighttype = React.lazy(() =>
  import('./views/Medical/medical_weight_type/Addmedicalweighttype'),
)
const Viewmedicalweighttype = React.lazy(() =>
  import('./views/Medical/medical_weight_type/Viewmedicalweighttype'),
)
const Updatemedicalweighttype = React.lazy(() =>
  import('./views/Medical/medical_weight_type/Updatemedicalweighttype'),
)
const ViewYachtMake = React.lazy(() => import('./views/Yacht/Yacht_Make/View_Yacht_Make'))
const AddYachtMake = React.lazy(() => import('./views/Yacht/Yacht_Make/Add_Yacht_Make'))

const ViewYachtModel = React.lazy(() => import('./views/Yacht/Yacht_Model/ViewYachtModel'))
const AddYachtModel = React.lazy(() => import('./views/Yacht/Yacht_Model/AddYachtModel'))

const ViewYachtEngine = React.lazy(() => import('./views/Yacht/Yacht_Engine/ViewYachtEngine'))
const AddYachtEngine = React.lazy(() => import('./views/Yacht/Yacht_Engine/AddYachtEngine'))

const Addyachtbodytype = React.lazy(() => import('./views/Yacht/yacht_body_type/Addyachtbodytype'))
const Viewyachtbodytype = React.lazy(() =>
  import('./views/Yacht/yacht_body_type/Viewyachtbodytype'),
)
const Updateyachtbodytype = React.lazy(() =>
  import('./views/Yacht/yacht_body_type/Updateyachtbodytype'),
)

const Addyachthullmaterial = React.lazy(() =>
  import('./views/Yacht/yacht_hull_material/Addyachthullmaterial'),
)
const Viewyachthullmaterial = React.lazy(() =>
  import('./views/Yacht/yacht_hull_material/Viewyachthullmaterial'),
)
const Updateyachthullmaterial = React.lazy(() =>
  import('./views/Yacht/yacht_hull_material/Updateyachthullmaterial'),
)

const Addyachthorsepowerlist = React.lazy(() =>
  import('./views/Yacht/yacht_horsepower_list/Addyachthorsepowerlist'),
)
const Viewyachthorsepowerlist = React.lazy(() =>
  import('./views/Yacht/yacht_horsepower_list/Viewyachthorsepowerlist'),
)
const Updateyachthorsepowerlist = React.lazy(() =>
  import('./views/Yacht/yacht_horsepower_list/Updateyachthorsepowerlist'),
)

const Addyachtenginelist = React.lazy(() =>
  import('./views/Yacht/yacht_engine_Type/Addyachtenginelist'),
)
const Viewyachtenginelist = React.lazy(() =>
  import('./views/Yacht/yacht_engine_Type/Viewyachtenginelist'),
)
const Updateyachtenginelist = React.lazy(() =>
  import('./views/Yacht/yacht_engine_Type/Updateyachtenginelist'),
)

const Addyachtspeedknotlist = React.lazy(() =>
  import('./views/Yacht/yacht_speed_knot_list/Addyachtspeedknotlist'),
)
const Viewyachtspeedknotlist = React.lazy(() =>
  import('./views/Yacht/yacht_speed_knot_list/Viewyachtspeedknotlist'),
)
const Updateyachtspeedknotlist = React.lazy(() =>
  import('./views/Yacht/yacht_speed_knot_list/Updateyachtspeedknotlist'),
)
const getYacht_Experience_List = React.lazy(() =>
  import('./views/Yacht/Yacht_Plan/Yacht_Experience/View_Yacht_Experience'),
)
const yachtQuestions = React.lazy(() => import('./views/Yacht/Yacht_Plan/Yacht_Questions/View_Yacht_Questions'))

const BodyType = React.lazy(() => import('./views/body-type/BodyType'))
const AddBodyType = React.lazy(() => import('./views/body-type/AddBodyType'))
const EditBodyType = React.lazy(() => import('./views/body-type/EditBodyType'))

const PlanCategory = React.lazy(() => import('./views/plan-category/PlanCategory'))
const AddPlanCategory = React.lazy(() => import('./views/plan-category/AddPlanCategory'))
const EditPlanCategory = React.lazy(() => import('./views/plan-category/EditPlanCategory'))

const NatureOfPlan = React.lazy(() => import('./views/nature-of-plan/NatureOfPlan'))
const AddNatureOfPlan = React.lazy(() => import('./views/nature-of-plan/AddNatureOfPlan'))
const EditNatureOfPlan = React.lazy(() => import('./views/nature-of-plan/EditNatureOfPlan'))

const AddNationality = React.lazy(() => import('./views/nationality/AddNationality'))
const ViewNationality = React.lazy(() => import('./views/nationality/ViewNationality'))
const UpdateNationality = React.lazy(() => import('./views/nationality/UpdateNationality'))

const AreaOfRegistration = React.lazy(() =>
  import('./views/area-of-registration/AreaOfRegistration'),
)
const AddAreaOfRegistration = React.lazy(() =>
  import('./views/area-of-registration/AddAreaOfRegistration'),
)
const EditAreaOfRegistration = React.lazy(() =>
  import('./views/area-of-registration/EditAreaOfRegistration'),
)
const AddUsertype = React.lazy(() => import('./views/user-type/AddUsertype'))
const ViewUsertype = React.lazy(() => import('./views/user-type/ViewUsertype'))
const UpdateUsertype = React.lazy(() => import('./views/user-type/UpdateUsertype'))

const AddRepairtype = React.lazy(() => import('./views/repair-type/AddRepairtype'))
const ViewRepairtype = React.lazy(() => import('./views/repair-type/ViewRepairtype'))
const UpdateRepairtype = React.lazy(() => import('./views/repair-type/UpdateRepairtype'))

const AddPolicytype = React.lazy(() => import('./views/policy-type/AddPolicytype'))
const ViewPolicytype = React.lazy(() => import('./views/policy-type/ViewPolicytype'))
const UpdatePolicytype = React.lazy(() => import('./views/policy-type/UpdatePolicytype'))

const AddBusinesstype = React.lazy(() => import('./views/business-type/AddBusinesstype'))
const ViewBusinesstype = React.lazy(() => import('./views/business-type/ViewBusinesstype'))
const UpdateBusinesstype = React.lazy(() => import('./views/business-type/UpdateBusinesstype'))

const AddMotormodeldetails = React.lazy(() =>
  import('./views/motor-model-details/AddMotormodeldetails'),
)
const ViewMotormodeldetails = React.lazy(() =>
  import('./views/motor-model-details/ViewMotormodeldetails'),
)
const UpdateMotormodeldetails = React.lazy(() =>
  import('./views/motor-model-details/UpdateMotormodeldetails'),
)

const AddCompany = React.lazy(() => import('./views/insurance-company/AddCompany'))
const Company = React.lazy(() => import('./views/insurance-company/InsuranceCompany'))
const EditCompany = React.lazy(() => import('./views/insurance-company/EditCompany'))

const ViewBank = React.lazy(() => import('./views/bank/ViewBank'))
const ViewLOB = React.lazy(() => import('./views/insurance-company/ViewLOB'))
const ViewPlans = React.lazy(() => import('./views/insurance-company/ViewPlans'))
const ViewLeadStatus = React.lazy(() => import('./views/lead-status/ViewLeadStatus'))

const AddMotorPlan = React.lazy(() => import('./views/plan/AddMotorPlan'))
const MotorPlan = React.lazy(() => import('./views/plan/MotorPlan'))
const EditMotorPlan = React.lazy(() => import('./views/plan/EditMotorPlan'))
const EditTPLMotorPlan = React.lazy(() => import('./views/plan/EditTPLMotorPlan'))

const AddThirdPartyPlan = React.lazy(() =>
  import('./views/plan/Third-party-plan/AddThirdPartyPlan'),
)
const ThirdMotorTablePlan = React.lazy(() =>
  import('./views/plan/Third-party-plan/ThirdMotorTablePlan'),
)

const AddStaff = React.lazy(() => import('./views/staff/AddStaff'))
const ViewStaff = React.lazy(() => import('./views/staff/ViewStaff'))
const EditStaff = React.lazy(() => import('./views/staff/EditStaff'))
const ViewProfile = React.lazy(() => import('./views/profile/ViewProfile'))
const ChangePassword = React.lazy(() => import('./views/profile/ChangePassword'))
const User_management = React.lazy(() => import('./views/staff/User_management'))

const ViewStandardCover = React.lazy(() => import('./views/plan/Standard-Cover/ViewStandardCover'))
const GetStandardCovers = React.lazy(() => import('./views/plan/Standard-Cover/GetStandardCovers'))

const ViewAdditionalCover = React.lazy(() =>
  import('./views/plan/Additional-cover/ViewAdditionalCover'),
)
const GetAdditionalCovers = React.lazy(() =>
  import('./views/plan/Additional-cover/GetAdditionalCover'),
)

const Nonapplicablenationality = React.lazy(() =>
  import('./views/plan/Nationality/Nonapplicablenationality'),
)

const ViewBlackListedVehicle = React.lazy(() =>
  import('./views/insurance-company/ViewBlackListedVehicle'),
)

const Blacklistvehicle = React.lazy(() =>
  import('./views/plan/Black-list-vehicle/Blacklistvehicle'),
)

const global_user_management_permission = React.lazy(() =>
  import('./views/user-management/Global_user_management_permission'),
)

const AddTravelPlan = React.lazy(() => import('./views/Travel/travelplan/AddTravelPlan'))
const TravelPlan = React.lazy(() => import('./views/Travel/travelplan/TravelPlan'))
const EditTravelPlan = React.lazy(() => import('./views/Travel/travelplan/EditTravelPlan'))
const ViewPlanPrice = React.lazy(() => import('./views/Travel/travelplan/ViewPlanPrice'))
const AddPlanPrice = React.lazy(() => import('./views/Travel/travelplan/AddPlanPrice'))
const EditPlanPrice = React.lazy(() => import('./views/Travel/travelplan/EditPlanPrice'))

const AdminDashboard = React.lazy(() => import('./views/admin-ceo_dashboard/admin/AdminDashboard'))

const CEODashboard = React.lazy(() => import('./views/admin-ceo_dashboard/ceo/CEODashboard'))

const OperationsDashboard = React.lazy(() =>
  import('./views/operations_dashboard/OperationsDashboard'),
)

const Operationtoplegend = React.lazy(() => import('./views/operations_dashboard/Operationtoplegend'))
const Operationgraph = React.lazy(() => import('./views/operations_dashboard/Operationgraph'))

const Managesupervisordashboard = React.lazy(() =>
  import('./views/manager-supervisor_dashboard/dashboard/Managesupervisordashboard'),
)
const Leadsstatus = React.lazy(() =>
  import('./views/manager-supervisor_dashboard/dashboard/Leadsstatus'),
)
const APIPending = React.lazy(() =>
  import('./views/manager-supervisor_dashboard/dashboard/ApiPending'),
)
const PaymentPending = React.lazy(() =>
  import('./views/manager-supervisor_dashboard/dashboard/PaymentPending'),
)
const Renewalstatus = React.lazy(() =>
  import('./views/manager-supervisor_dashboard/dashboard/Renewalstatus'),
)
const RTAPending = React.lazy(() =>
  import('./views/manager-supervisor_dashboard/dashboard/RTAPending'),
)
const ClosedBussinessManager = React.lazy(() =>
  import('./views/manager-supervisor_dashboard/dashboard/ClosedBusiness'),
)
const LostDroppedManager = React.lazy(() =>
  import('./views/manager-supervisor_dashboard/dashboard/LostDropped'),
)

const ManagerSalesGraph = React.lazy(() => import('./views/manager-supervisor_dashboard/dashboard/ManagerSalesGraph'))

const salesDashboard = React.lazy(() => import('./views/sales_advisor/dashboard/SalesDashboard'))
const SalesGraph = React.lazy(() => import('./views/sales_advisor/dashboard/SalesGraph'))
const NewLead = React.lazy(() => import('./views/sales_advisor/dashboard/NewLead'))
const HotLead = React.lazy(() => import('./views/sales_advisor/dashboard/HotLead'))
const ColdLead = React.lazy(() => import('./views/sales_advisor/dashboard/ColdLead'))
const WarmLead = React.lazy(() => import('./views/sales_advisor/dashboard/WarmLead'))
const ClosedBussiness = React.lazy(() => import('./views/sales_advisor/dashboard/ClosedBussiness'))
const PendingPolicies = React.lazy(() => import('./views/sales_advisor/dashboard/PendingPolicies'))
const LostDropped = React.lazy(() => import('./views/sales_advisor/dashboard/LostDropped'))

const DocumentChaserDashboard = React.lazy(() =>
  import('./views/document_chaser/dashboard/DocumentChaserDashboard'),
)
const ChasingDocument = React.lazy(() =>
  import('./views/document_chaser/dashboard/ChasingDocument'),
)
const PendingVerification = React.lazy(() =>
  import('./views/document_chaser/dashboard/PendingVerification'),
)
const DCSalesGraph = React.lazy(() => import('./views/document_chaser/dashboard/DCSalesGraph'))

const PolicyIssuerDashboard = React.lazy(() =>
  import('./views/policy_issuer/dashboard/PolicyIssuerDashboard'),
)
const PendingPolicy = React.lazy(() => import('./views/policy_issuer/dashboard/PendingPolicy'))
const IssuedPolicy = React.lazy(() => import('./views/policy_issuer/dashboard/IssuedPolicies'))
const PISalesGraph = React.lazy(() => import('./views/policy_issuer/dashboard/PISalesGraph'))

const InsuranceCompanyDashboard = React.lazy(() =>
  import('./views/insurance-company_dashboard/dashboard/InsuranceCompanyDashboard'),
)
const PremiumEarned = React.lazy(() =>
  import('./views/insurance-company_dashboard/dashboard/PremiumEarned'),
)
const BestRateComparison = React.lazy(() =>
  import('./views/insurance-company_dashboard/dashboard/BestRateComparison'),
)
const ProjectedBusinessAnalysis = React.lazy(() =>
  import('./views/insurance-company_dashboard/dashboard/ProjectedBusinessAnalysis'),
)
const AdWithUs = React.lazy(() => import('./views/Advertise-with-us/AdvertiseWithUs'))
const HomePlan = React.lazy(() => import('./views/Home/homeplan/HomePlan'))

const AddHomePlan = React.lazy(() => import('./views/Home/homeplan/AddHomePlan'))
const EditHomePlan = React.lazy(() => import('./views/Home/homeplan/EditHomePlan'))
const YachtPlan = React.lazy(() => import('./views/Yacht/Yacht_Plan/YachtPlan'))
const AddYachtPlan = React.lazy(() => import('./views/Yacht/Yacht_Plan/AddYachtPlan'))
const AddTPLYachtPlan = React.lazy(() => import('./views/Yacht/Yacht_Plan/addTPLYachtPlan'))
const EditYachtPlan = React.lazy(() => import('./views/Yacht/Yacht_Plan/EditYachtPlan'))
const EditTPLYachtPlan = React.lazy(() => import('./views/Yacht/Yacht_Plan/EditTPLYachtPlan'))

const AddYachtConditions = React.lazy(() => import('./views/Yacht/Yacht_Plan/AddYachtConditions'))
const ViewYachtcondition = React.lazy(() => import('./views/Yacht/YachtConditions/ViewYachtConditions'))
const YachtConditions = React.lazy(() => import('./views/Yacht/Yacht_Plan/YachtConditions'))
//
const MedicalPlan = React.lazy(() => import('./views/Medical/MedicalPlan/MedicalPlan'))
const AddMedicalPlan = React.lazy(() => import('./views/Medical/MedicalPlan/AddMedicalPlan'))
const EditMedicalPlan = React.lazy(() => import('./views/Medical/MedicalPlan/EditMedicalPlan'))

const medTableBenefits = React.lazy(() =>
  import('./views/Medical/MedicalPlan/TableBenefits/TableBenefits'),
)

const viewMedicalBenefits = React.lazy(() =>
  import('./views/Medical/MedicalPlan/TableBenefits/viewTableBenefits'),
)
const AddMedicalBenefits = React.lazy(() =>
  import('./views/Medical/MedicalPlan/TableBenefits/AddTableBenefits'),
)
const StandardUnderwrintingCond = React.lazy(() =>
  import('./views/Medical/MedicalPlan/StandardUnderwriting/StandardConditions'),
)
const viewStandardUnderwrintingCond = React.lazy(() =>
  import('./views/Medical/MedicalPlan/StandardUnderwriting/viewStandardConditions'),
)
const AddStandardUnderwrintingCond = React.lazy(() =>
  import('./views/Medical/MedicalPlan/StandardUnderwriting/AddStandardCondition'),
)

const AdditionalUnderwrintingCond = React.lazy(() =>
  import('./views/Medical/MedicalPlan/AdditionalCondition/AdditionalCondition'),
)
const viewAdditionalUnderwrintingCond = React.lazy(() =>
  import('./views/Medical/MedicalPlan/AdditionalCondition/ViewAdditionalCondition'),
)
const AddAdditionalUnderwrintingCond = React.lazy(() =>
  import('./views/Medical/MedicalPlan/AdditionalCondition/AddAdditionalCondition'),
)

const ViewBMI = React.lazy(() => import('./views/Medical/MedicalPlan/AddBMI/ViewBMI'))
const AddBMI = React.lazy(() => import('./views/Medical/MedicalPlan/AddBMI/AddBMI'))
const editBMI = React.lazy(() => import('./views/Medical/MedicalPlan/AddBMI/EditBMI'))
// const EditPlanPrice = React.lazy(() => import('./views/Travel/travelplan/EditPlanPrice'));

const AddBusinessEntity = React.lazy(() => import('./views/business_entity/AddBusinessEntity'))
const ViewBusinessEntity = React.lazy(() => import('./views/business_entity/ViewBusinessEntity'))
const EditBusinessEntity = React.lazy(() => import('./views/business_entity/EditBusinessEntity'))
const ViewBusinessEntityBank = React.lazy(() =>
  import('./views/business_entity/ViewBusinessEntityBank'),
)
const ViewBusinessEntitycommission = React.lazy(() => import('./views/business_entity/viewBusinessEntitycommission'))
const ViewBusinessEntityDiscount = React.lazy(() => import('./views/business_entity/ViewBusnessEntityDiscount'))
const UnderwrintingConditions = React.lazy(() =>
  import('./views/Medical/MedicalPlan/UderwritingConditions/UnderwritingConditions'),
)
const AddUnderwrintingConditions = React.lazy(() =>
  import('./views/Medical/MedicalPlan/UderwritingConditions/AddUnderwritingCondition'),
)
const viewUnderwrintingConditions = React.lazy(() => import('./views/Medical/MedicalPlan/UderwritingConditions/ViewUnderwritingConditions'),)
const ViewGeneralWritingCondition = React.lazy(() => import('./views/Medical/general_writing_condition/GeneralWritingConditions'),)
const AddGeneralWritingCondition = React.lazy(() => import('./views/Medical/general_writing_condition/AddGeneralWritingCondition'),)
const ViewHomeAdditionalConditions = React.lazy(() => import('./views/Home/AdditionalConditions/ViewHomeAdditionalConditions'),)
const AddHomeAdditionalConditions = React.lazy(() => import('./views/Home/AdditionalConditions/AddHomeAdditionalConditions'),)
const ViewPlanRates = React.lazy(() =>
  import('./views/Medical/MedicalPlan/PlanRatesBasedOnAge/ViewPlanRates'),
)
const AddPlanRates = React.lazy(() =>
  import('./views/Medical/MedicalPlan/PlanRatesBasedOnAge/AddPlanRates'),
)
const EditPlanRates = React.lazy(() =>
  import('./views/Medical/MedicalPlan/PlanRatesBasedOnAge/EditPlanRates'),
)

const ViewDocumentsList = React.lazy(() => import('./views/Documents-master/ViewDocumentsList'))

const ViewTestimonials = React.lazy(() => import('./views/testimonials/ViewTestimonials'))

const ViewCompliance = React.lazy(() => import('./views/compliance/ViewCompliance'))

const ViewSpecialoffer = React.lazy(() => import('./views/special-offer/ViewSpecialoffer'))

const Claims = React.lazy(() => import('./views/claims/Claims'))

const Termscondition = React.lazy(() => import('./views/terms-condition/Termscondition'))

const Maternitycondition = React.lazy(() =>
  import('./views/Medical/medical_maternity_conditions/Maternitycondition'),
)
const AddMaternitycondition = React.lazy(() =>
  import('./views/Medical/medical_maternity_conditions/AddMaternityCondition'),
)

const MotorClaimYears = React.lazy(() => import('./views/motor-claim-years/MotorClaimYears'))

const AdminToplegend = React.lazy(() => import('./views/admin-ceo_dashboard/admin/AdminToplegend'))

const TopLegend = React.lazy(() => import('./views/manager-supervisor_dashboard/dashboard/TopLegend'))

const SaToplegend = React.lazy(() => import('./views/sales_advisor/dashboard/SaToplegend'))

const DcToplegend = React.lazy(() => import('./views/document_chaser/dashboard/DcToplegend'))

const PiToplegend = React.lazy(() => import('./views/policy_issuer/dashboard/PiToplegend'))

const AdminGraph = React.lazy(() => import('./views/admin-ceo_dashboard/admin/AdminGraph'))

const AMRating = React.lazy(() => import('./views/AM_&_SP_Ratings/AMRatings'))

const SPRating = React.lazy(() => import('./views/AM_&_SP_Ratings/SP_Rating'))
const BEdashboard = React.lazy(() => import('./views/business-entity-dashboard/BEdashboard'))
const BEToplegend = React.lazy(() => import('./views/business-entity-dashboard/BEToplegend'))
const BESalesgraph = React.lazy(() => import('./views/business-entity-dashboard/BESalesgraph'))
const BENewleads = React.lazy(() => import('./views/business-entity-dashboard/BENewleads'))
const BEHotleads = React.lazy(() => import('./views/business-entity-dashboard/BEHotleads'))
const BEWarmleads = React.lazy(() => import('./views/business-entity-dashboard/BEWarmleads'))
const BEColdleads = React.lazy(() => import('./views/business-entity-dashboard/BEColdleads'))
const BEPending = React.lazy(() => import('./views/business-entity-dashboard/BEPending'))
const BEIssued = React.lazy(() => import('./views/business-entity-dashboard/BEIssued'))
const BELostdropped = React.lazy(() => import('./views/business-entity-dashboard/BELostdropped'))
const AllLeads = React.lazy(() => import('./views/Leads/ViewLeads'))
const addMakeMotor = React.lazy(() => import('./views/motor-make/AddMakeMotor'))
const addModelMotor = React.lazy(() => import('./views/motor-model/ModelMotor'))
const BELink = React.lazy(() => import('./views/business-entity-dashboard/BELink'))
const MotorLeaddetails = React.lazy(() => import('./views/leaddetails/MotorLeaddetails'))
const TravelLeaddetails = React.lazy(() => import('./views/leaddetails/TravelLeaddetails'))
const HomeLeaddetails = React.lazy(() => import('./views/leaddetails/HomeLeaddetails'))
const MedicalLeaddetails = React.lazy(() => import('./views/leaddetails/MedicalLeaddetails'))
const YachtLeaddetails = React.lazy(() => import('./views/leaddetails/YachtLeaddetails'))
const vat = React.lazy(() => import('./views/Vat/ViewVat'))
const ViewYearCode = React.lazy(() => import('./views/Year_Code/ViewYearCode'))
const ViewYachtYearCode = React.lazy(() => import('./views/Yacht/Yacht_Plan/Year_Code/View_Year_Code'))
const AddYachtYearCode = React.lazy(() => import('./views/Yacht/Yacht_Plan/Year_Code/Add_Year_Code'))
const ViewDiscountcoupon = React.lazy(() => import('./views/discountcoupon/ViewDiscountcoupon'))

const ViewCopayment = React.lazy(() => import('./views/Medical/MedicalPlan/AdditionalCondition/ViewCopayment'))

const Viewmedicaldeclaration = React.lazy(() => import('./views/Medical/medical_declaration/Viewmedicaldeclaration'))
const Addmedicaldeclaration = React.lazy(() => import('./views/Medical/medical_declaration/Addmedicaldeclaration'))

const MaternityCondition = React.lazy(() => import('./views/Medical/MedicalPlan/MaternityCondition/MaternityCondition'))
const AddMaternityCondition = React.lazy(() => import('./views/Medical/MedicalPlan/MaternityCondition/AddMaternityCondition'))


const AddmedicalViewmedicalTPA = React.lazy(() => import('./views/Medical/medical_TPA/AddmedicalTPA'))
const ViewmedicalViewmedicalTPA = React.lazy(() => import('./views/Medical/medical_TPA/ViewmedicalTPA'))
const AddmedicalViewmedicalNetwork = React.lazy(() => import('./views/Medical/medical_network/AddmedicalNetwork'))
const ViewmedicalViewmedicalNetwork = React.lazy(() => import('./views/Medical/medical_network/ViewmedicalNetwork'))
const AddmedicalViewmedicalNetworkList = React.lazy(() => import('./views/Medical/NetworkList/AddmedicalNetworkList'))
const ViewmedicalViewmedicalNetworkList = React.lazy(() => import('./views/Medical/NetworkList/NetWorkList'))

const ViewGeneralUnderwriting = React.lazy(() => import('./views/Medical/MedicalPlan/GeneralUnderwriting/ViewGeneralUnderwriting'))
const Best_plan = React.lazy(() => import('./views/Best_Plan/View_Best_Plan'))
const ViewReasonType = React.lazy(() => import('./views/reason-type/reason-type/ViewReasonType'))

const ViewBlackListedYacht = React.lazy(() => import('./views/insurance-company//ViewBlackListedYacht'))
const BlackListedyacht = React.lazy(() => import('./views/Yacht/Yacht_Plan/BlackListedyacht'))
const ViewOtherInsuranlead = React.lazy(() => import('./views/leaddetails/OtherInsurancesLeadDetails'))
const ViewPreferred_Days = React.lazy(() => import('./views/Preferred_Days/ViewPreferred_Days'))
const ViewLabels = React.lazy(() => import('./views/Medical/Label_Master/ViewLabelMaster'))
const ViewBoatBreadth = React.lazy(() => import('./views/Yacht/BoatBreadth/ViewBoatBreadth'))
const ViewGroupMedicalPlans = React.lazy(() => import('./views/Group-Medical/Group-Medical-Plans/ViewGroupMedicalPlan'))
const AddGroupMedicalPlans = React.lazy(() => import('./views/Group-Medical/Group-Medical-Plans/AddGroupMedicalPlan'))
const EditGroupMedicalPlans = React.lazy(() => import('./views/Group-Medical/Group-Medical-Plans/EditGroupMedicalPlan'))
const ViewMemberRequests = React.lazy(() => import('./views/Group-Medical/Member-Requests/ViewMemberRequests'))
const ViewActiveMembers = React.lazy(() => import('./views/Group-Medical/Member-Requests/ViewActiveMembers'))
const ViewDeletedMembers = React.lazy(() => import('./views/Group-Medical/Member-Requests/ViewDeletedMembers'))
const ViewNewlyAddedMembers = React.lazy(() => import('./views/Group-Medical/Member-Requests/ViewNewlyAddedMembers'))
const MemberDetails = React.lazy(() => import('./views/Group-Medical/Member-Requests/MemberDetails'))
const EditMemberDetails = React.lazy(() => import('./views/Group-Medical/Member-Requests/EditMember'))
const AddGroupMedicalPlanRates = React.lazy(() => import('./views/Group-Medical/GroupMedPlanRates/AddPlanRates'))
const ViewGroupMedicalPlanPrice = React.lazy(() => import('./views/Group-Medical/GroupMedPlanRates/ViewPlanRates'))
const EditGroupMedicalPlanPrice = React.lazy(() => import('./views/Group-Medical/GroupMedPlanRates/EditPlanRates'))
const AddMembermanually = React.lazy(() => import('./views/Group-Medical/Member-Requests/AddMembermanually'))
const showInQuotesPage = React.lazy(() => import('./views/Medical/MedicalPlan/ShowInQuotesPage'))
const ViewGroupMedicalCategories = React.lazy(() => import('./views/Group-Medical/Category/ViewGroupMedicalCategories'))
const ViewGroupMedicalClaimType = React.lazy(() => import('./views/Group-Medical/Claim-Type/ViewGroupMedicalClaimType'))
const ViewGroupMedicalClaimStatus = React.lazy(() => import('./views/Group-Medical/Claim-Type/ViewGroupMedicalClaimStatus'))
const ViewGroupMedicalClaimDescription = React.lazy(() => import('./views/Group-Medical/Claim-Type/ViewClaimDescription'))
const ViewClaimRequest = React.lazy(() => import('./views/Group-Medical/Claim-Type/ViewClaimRequest'))
const ViewClaimrequestMembers = React.lazy(() => import('./views/Group-Medical/Claim-Type/ViewClaimrequestMembers'))
const ClaimrequestMemberdetails = React.lazy(() => import('./views/Group-Medical/Claim-Type/ClaimrequestMemberdetails'))
const EditClaimrequestMemberdetails = React.lazy(() => import('./views/Group-Medical/Claim-Type/EditClaimrequestMemberdetails'))
const ProducerDashboard = React.lazy(() => import('./views/producer/ProducerDashboard'))
const ProducerNewLead = React.lazy(() => import('./views/producer/ProducerNewLead'))
const ProducerPendingLeads = React.lazy(() => import('./views/producer/ProducerPendingLeads'))
const ProducerissuedPollicy = React.lazy(() => import('./views/producer/ProducerissuedPollicy'))
const ProducerTopLegend = React.lazy(() => import('./views/producer/ProducerTopLegend'))
const ProducerGraph = React.lazy(() => import('./views/producer/ProducerGraph'))
const ProducerGenerateLink = React.lazy(() => import('./views/producer/ProducerGenerateLink'))
const ProducerUpcomingRenewal = React.lazy(() => import('./views/producer/ProducerUpcomingRenewal'))
const ProducerLostDropped = React.lazy(() => import('./views/producer/ProducerLostDropped'))
const ViewProducerDiscount = React.lazy(() => import('./views/Producer_Discount/ViewProducerDiscount'))
const ViewClaimProcedure = React.lazy(() => import('./views/Group-Medical/Claim-Type/ViewClaimProcedure'))
const ViewUsefulLinks = React.lazy(() => import('./views/Group-Medical/Useful-Links/ViewUsefulLinks'))
const GroupMedicalClaim = React.lazy(() => import('./views/Group-Medical/Claim-Type/GroupMedicalClaim'))
const AddGroupMedicalClaim = React.lazy(() => import('./views/Group-Medical/Claim-Type/AddClaimProcedure'))
const AdditionMemberList = React.lazy(() => import('./views/Group-Medical/Group-Medical-Plans/AdditionMemberList'))
const MaritalStatus = React.lazy(() => import('./views/Group-Medical/Masters/ViewMaritalStatus'))
const Gender = React.lazy(() => import('./views/Group-Medical/Masters/ViewGender'))
const Relaiton = React.lazy(() => import('./views/Group-Medical/Masters/ViewRelation'))
const TatView = React.lazy(() => import('./views/Group-Medical/Tat/TatView'))
const AddTatDays = React.lazy(() => import('./views/Group-Medical/Tat/AddTatDays'))
const SponsortypeView = React.lazy(() => import('./views/sponsortype/SponsortypeView'))
const Sponsortypeadd = React.lazy(() => import('./views/sponsortype/Sponsortypeadd'))
const ViewWorkLocation = React.lazy(() => import('./views/worklocation/ViewWorkLocation'))
const AddWorkLocation = React.lazy(() => import('./views/worklocation/AddWorklocation'))
const ViewBusinessEntityTopup = React.lazy(() => import('./views/business_entity/ViewBusinessEntityTopup'))
const ViewActualSalaryBand = React.lazy(() => import('./views/Group-Medical/Masters/ViewActualSalaryBand'))
const AddActualSalaryBand = React.lazy(() => import('./views/Group-Medical/Masters/AddActualSalaryBand'))
const CompanyUsers = React.lazy(() => import('./views/insurance-company_dashboard/Users/CompanyUsers'))
const AddCompanyUsers = React.lazy(() => import('./views/insurance-company_dashboard/Users/AddCompanyUser'))
const ViewEmailTemplates = React.lazy(() => import('./views/email_templates/ViewEmailTemplates'))
const AddEmailTemplate = React.lazy(() => import('./views/email_templates/AddEmailTemplate'))
const EditEmailTemplate = React.lazy(() => import('./views/email_templates/EditEmailTemplate'))
const ViewTemplateTypes = React.lazy(() => import('./views/email_templates/ViewTemplateTypes'))
const ViewAllMail = React.lazy(() => import('./views/email_templates/ViewAllMail'))
const ViewMail = React.lazy(() => import('./views/email_templates/ViewMail'))
const Usersmail = React.lazy(() => import('./views/email_templates/Usersmail'))
const Mailslist = React.lazy(() => import('./views/email_templates/Mailslist'))
const tooltips = React.lazy(() => import('./views/Tool_Tips/ViewToolTips'))
const ViewCms = React.lazy(() => import('./views/cms/ViewCms'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/line-of-business', name: 'Line Of Business', element: LineOfBusiness },
  { path: '/AddLineOfBusiness', name: 'Add Line Of Business', element: AddLineOfBusiness },
  { path: '/EditLineOfBusiness', name: 'Edit Line Of Business', element: EditLineOfBusiness },
  { path: '/location', name: 'Location', element: Location },
  { path: '/AddLocation', name: 'Add Location', element: AddLocation },
  { path: '/EditLocation', name: 'Edit Location', element: EditLocation },
  { path: '/motor-make', name: 'Make Motor', element: MakeMotor },
  { path: '/ViewYearCode', name: 'View Year Code', element: ViewYearCode },
  { path: '/ViewYachtYearCode', name: 'View Yacht Year Code', element: ViewYachtYearCode },
  { path: '/AddYachtYearCode', name: 'Add Yacht Year Code', element: AddYachtYearCode },
  { path: '/AddMakeMotor', name: 'Add Make Motor', element: AddMakeMotor },
  { path: '/EditMakeMotor', name: 'Edit Make Motor', element: EditMakeMotor },
  { path: '/motor-model', name: 'Model Motor', element: ModelMotor },
  { path: '/AddModelMotor', name: 'Add Model Motor', element: AddModelMotor },
  { path: '/EditModelMotor', name: 'Edit Model Motor', element: EditModelMotor },
  {
    path: '/addtravelinsurancefor',
    name: 'Add Travel Insurance For',
    element: Addtravelinsurancefor,
    exact: true,
  },
  {
    path: '/updatetravelinsurancefor',
    name: 'Update Travel Insurance For',
    element: Updatetravelinsurancefor,
    exact: true,
  },
  {
    path: '/viewtravelinsurancefor',
    name: 'View Travel Insurance For',
    element: Viewtravelinsurancefor,
    exact: true,
  },

  { path: '/Addtraveltype', name: 'Add Travel Type', element: Addtraveltype, exact: true },
  { path: '/Updatetraveltype', name: 'Update Travel Type', element: UpdateTraveltype, exact: true },
  { path: '/Viewtraveltype', name: 'View Travel Type', element: ViewTraveltype, exact: true },

  {
    path: '/Addtravelplantype',
    name: 'Add Travel Plan Type',
    element: Addtravelplantype,
    exact: true,
  },
  {
    path: '/Viewtravelplantype',
    name: 'View Travel Plan Type',
    element: Viewtravelplantype,
    exact: true,
  },
  {
    path: '/Updatetravelplantype',
    name: 'Update Travel Plan Type',
    element: Updatetravelplantype,
    exact: true,
  },

  {
    path: '/Addtravelregionlist',
    name: 'Add Travel Region List',
    element: Addtravelregionlist,
    exact: true,
  },
  {
    path: '/Viewtravelregionlist',
    name: 'View Travel Region List',
    element: Viewtravelregionlist,
    exact: true,
  },
  {
    path: '/Updatetravelregionlist',
    name: 'Update Travel Region List',
    element: Updatetravelregionlist,
    exact: true,
  },

  {
    path: '/Addtravelcovertypelist',
    name: 'Add Travel Cover Type List',
    element: Addtravelcovertypelist,
    exact: true,
  },
  {
    path: '/Viewtravelcovertypelist',
    name: 'View Travel Cover Type List',
    element: Viewtravelcovertypelist,
    exact: true,
  },
  {
    path: '/Updatetravelcovertypelist',
    name: 'Update Travel Cover Type List',
    element: Updatetravelcovertypelist,
    exact: true,
  },
  { path: '/ViewYachtMake', name: 'View Yacht Make', element: ViewYachtMake, exact: true },
  { path: '/AddYachtMake', name: 'Add Yacht Make', element: AddYachtMake, exact: true },
  { path: '/ViewYachtModel', name: 'View Yacht Model', element: ViewYachtModel, exact: true },
  { path: '/AddYachtModel', name: 'Add Yacht Model', element: AddYachtModel, exact: true },
  { path: '/ViewYachtEngine', name: 'View Yacht Engine', element: ViewYachtEngine, exact: true },
  { path: '/AddYachtEngine', name: 'Add Yacht Engine', element: AddYachtEngine, exact: true },

  {
    path: '/Addpropertytypelist',
    name: 'Add Travel Property Type List',
    element: Addpropertytypelist,
    exact: true,
  },
  {
    path: '/Viewpropertytypelist',
    name: 'View Travel Property Type List',
    element: Viewpropertytypelist,
    exact: true,
  },
  {
    path: '/Updatepropertytypelist',
    name: 'Update Travel Property Type List',
    element: Updatepropertytypelist,
    exact: true,
  },

  {
    path: '/Addhomeplantypelist',
    name: 'Add Home Plan Type',
    element: Addhomeplantypelist,
    exact: true,
  },
  {
    path: '/Viewhomeplantypelist',
    name: 'View Home Plan Type',
    element: Viewhomeplantypelist,
    exact: true,
  },
  {
    path: '/Updatehomeplantypelist',
    name: 'Update Home Plan Type',
    element: Updatehomeplantypelist,
    exact: true,
  },

  {
    path: '/Addhomeownership',
    name: 'Add Home Ownership Status',
    element: Addhomeownershiplist,
    exact: true,
  },
  {
    path: '/Viewhomeownership',
    name: 'View Home Ownership Status',
    element: Viewhomeownershiplist,
    exact: true,
  },
  {
    path: '/Updatehomeownership',
    name: 'Update Home Ownership Status',
    element: Updatehomeownershiplist,
    exact: true,
  },

  {
    path: '/Viewhomecondition',
    name: 'View Home Condition',
    element: Viewhomecondition,
    exact: true,
  },

  {
    path: '/Addhomecondition',
    name: 'Add Home Condition',
    element: Addhomecondition,
    exact: true,
  },

  { path: '/HomeCondition', name: 'Home Condition', element: HomeCondition, exact: true },

  {
    path: '/Addmedicalplantype',
    name: 'Add Medical Plan Type',
    element: Addmedicalplantype,
    exact: true,
  },
  {
    path: '/Viewmedicalplantype',
    name: 'View Medical Plan Type',
    element: Viewmedicalplantype,
    exact: true,
  },
  {
    path: '/Updatemedicalplantype',
    name: 'Update Medical Plan Type',
    element: Updatemedicalplantype,
    exact: true,
  },

  {
    path: '/Addmedicalvisacountries',
    name: 'Add Medical Visa Type',
    element: Addmedicalvisacountries,
    exact: true,
  },
  {
    path: '/Viewmedicalvisacountries',
    name: 'View Medical Visa Type',
    element: Viewmedicalvisacountries,
    exact: true,
  },
  {
    path: '/Updatemedicalvisacountries',
    name: 'Update Medical Visa Type',
    element: Updatemedicalvisacountries,
    exact: true,
  },

  {
    path: '/Addmedicalplancondition',
    name: 'Add Medical Plan Condition',
    element: Addmedicalplancondition,
    exact: true,
  },
  {
    path: '/Viewmedicalplancondition',
    name: 'View Medical Plan Condition',
    element: Viewmedicalplancondition,
    exact: true,
  },
  {
    path: '/Updatemedicalplancondition',
    name: 'Update Medical Plan Condition',
    element: Updatemedicalplancondition,
    exact: true,
  },

  {
    path: '/Addmedicalsalaryange',
    name: 'Add Medical Salary Range',
    element: Addmedicalsalaryrange,
    exact: true,
  },
  {
    path: '/Viewmedicalsalaryange',
    name: 'View Medical Salary Range',
    element: Viewmedicalsalaryrange,
    exact: true,
  },
  {
    path: '/Updatemedicalsalaryange',
    name: 'Update Medical Salary Range',
    element: Updatemedicalsalaryrange,
    exact: true,
  },

  {
    path: '/Addmedicalweighttype',
    name: 'Add Medical Weight Type',
    element: Addmedicalweighttype,
    exact: true,
  },
  {
    path: '/Viewmedicalweighttype',
    name: 'View Medical Weight Type',
    element: Viewmedicalweighttype,
    exact: true,
  },
  {
    path: '/Updatemedicalweighttype',
    name: 'Update Medical Weight Type',
    element: Updatemedicalweighttype,
    exact: true,
  },

  {
    path: '/Addyachtbodytype',
    name: 'Add Yacht Body Type',
    element: Addyachtbodytype,
    exact: true,
  },
  {
    path: '/Viewyachtbodytype',
    name: 'View Yacht Body Type',
    element: Viewyachtbodytype,
    exact: true,
  },
  {
    path: '/Updateyachtbodytype',
    name: 'Update Yacht Body Type',
    element: Updateyachtbodytype,
    exact: true,
  },

  {
    path: '/Addyachthullmaterial',
    name: 'Add Yacht Hull Type',
    element: Addyachthullmaterial,
    exact: true,
  },
  {
    path: '/Viewyachthullmaterial',
    name: 'View Yacht Hull Type',
    element: Viewyachthullmaterial,
    exact: true,
  },
  {
    path: '/Updateyachthullmaterial',
    name: 'Update Yacht Hull Type',
    element: Updateyachthullmaterial,
    exact: true,
  },

  {
    path: '/Addyachthorsepowerlist',
    name: 'Add Yacht Horsepower List',
    element: Addyachthorsepowerlist,
    exact: true,
  },
  {
    path: '/Viewyachthorsepowerlist',
    name: 'View Yacht Horsepower List',
    element: Viewyachthorsepowerlist,
    exact: true,
  },
  {
    path: '/Updateyachthorsepowerlist',
    name: 'Update Yacht Horsepower List',
    element: Updateyachthorsepowerlist,
    exact: true,
  },

  {
    path: '/Addyachtenginelist',
    name: 'Add Yacht Engine List',
    element: Addyachtenginelist,
    exact: true,
  },
  {
    path: '/Viewyachtenginelist',
    name: 'View Yacht Engine List',
    element: Viewyachtenginelist,
    exact: true,
  },
  {
    path: '/Updateyachtenginelist',
    name: 'Update Yacht Engine List',
    element: Updateyachtenginelist,
    exact: true,
  },

  {
    path: '/Addyachtspeedknotlist',
    name: 'Add Yacht Speed Knot List',
    element: Addyachtspeedknotlist,
    exact: true,
  },
  {
    path: '/Viewyachtspeedknotlist',
    name: 'View Yacht Speed Knot List',
    element: Viewyachtspeedknotlist,
    exact: true,
  },
  {
    path: '/Updateyachtspeedknotlist',
    name: 'Update Yacht Speed Knot List',
    element: Updateyachtspeedknotlist,
    exact: true,
  },

  { path: '/salesDashboard', name: 'Dashboard', element: salesDashboard, exact: true },
  { path: '/salesGraph', name: 'Graphical View', element: SalesGraph, exact: true },
  { path: '/sales_advisor/dashboard/NewLead', name: 'New Lead', element: NewLead, exact: true },
  { path: '/sales_advisor/dashboard/HotLead', name: 'Hot Lead', element: HotLead, exact: true },
  { path: '/sales_advisor/dashboard/ColdLead', name: 'Cold Lead', element: ColdLead, exact: true },
  { path: '/sales_advisor/dashboard/WarmLead', name: 'Warm Lead', element: WarmLead, exact: true },
  {
    path: '/sales_advisor/dashboard/ClosedBussiness',
    name: 'Closed Bussiness',
    element: ClosedBussiness,
    exact: true,
  },
  {
    path: '/sales_advisor/dashboard/PendingPolicies',
    name: 'Pending Policies',
    element: PendingPolicies,
    exact: true,
  },
  {
    path: '/sales_advisor/dashboard/LostDropped',
    name: 'Lost & Dropped',
    element: LostDropped,
    exact: true,
  },

  {
    path: '/insurancecompanydashboard',
    name: 'Insurance Company Dashboard',
    element: InsuranceCompanyDashboard,
    exact: true,
  },
  { path: '/premiumearned', name: 'Premium Earned', element: PremiumEarned, exact: true },
  {
    path: '/bestratecomparison',
    name: 'Best Rate Comparison',
    element: BestRateComparison,
    exact: true,
  },
  {
    path: '/ProjectedBusinessAnalysis',
    name: 'Projected Business Analysis',
    element: ProjectedBusinessAnalysis,
    exact: true,
  },

  {
    path: '/documentchaserDashboard',
    name: 'Dashboard',
    element: DocumentChaserDashboard,
    exact: true,
  },
  { path: '/chasingdocument', name: 'Chasing Document', element: ChasingDocument, exact: true },
  {
    path: '/pendingverification',
    name: 'Pending Verification',
    element: PendingVerification,
    exact: true,
  },
  {
    path: '/dc_sales_graph',
    name: 'Graphical View',
    element: DCSalesGraph,
    exact: true,
  },

  {
    path: '/policyissuerdashboard',
    name: 'Dashboard',
    element: PolicyIssuerDashboard,
    exact: true,
  },
  { path: '/pendingpolicy', name: 'Pending Policy', element: PendingPolicy, exact: true },
  { path: '/issuedpolicy', name: 'Issued Policy', element: IssuedPolicy, exact: true },
  { path: '/pi_sales_graph', name: 'Graphical View', element: PISalesGraph, exact: true },

  { path: '/body-type', name: 'Body Type', element: BodyType },
  { path: '/AddBodyType', name: 'Add Body Type', element: AddBodyType },
  { path: '/EditBodyType', name: 'Edit Body Type', element: EditBodyType },

  { path: '/plan-category', name: 'Plan Category', element: PlanCategory },
  { path: '/AddPlanCategory', name: 'Add Plan Category', element: AddPlanCategory },
  { path: '/EditPlanCategory', name: 'Edit Plan Category', element: EditPlanCategory },

  { path: '/nature-of-plan', name: 'Nature Of Plan', element: NatureOfPlan },
  { path: '/AddNatureOfPlan', name: 'Add Nature Of Plan', element: AddNatureOfPlan },
  { path: '/EditNatureOfPlan', name: 'Edit Nature Of Plan', element: EditNatureOfPlan },

  { path: '/AddNationality', name: 'Add Nationality', element: AddNationality },
  { path: '/ViewNationality', name: 'View Nationality', element: ViewNationality },
  { path: '/UpdateNationality', name: 'Update Nationality', element: UpdateNationality },

  { path: '/area-of-registration', name: 'Area Of Registration', element: AreaOfRegistration },
  {
    path: '/AddAreaOfRegistration',
    name: 'Add Area Of Registration',
    element: AddAreaOfRegistration,
  },
  {
    path: '/EditAreaOfRegistration',
    name: 'Edit Area Of Registration',
    element: EditAreaOfRegistration,
  },

  { path: '/AddUsertype', name: 'Add User Type', element: AddUsertype },
  { path: '/ViewUsertype', name: 'View User Type', element: ViewUsertype },
  { path: '/UpdateUsertype', name: 'Update User Type', element: UpdateUsertype },

  { path: '/AddRepairtype', name: 'Add Repair Type', element: AddRepairtype },
  { path: '/ViewRepairtype', name: 'View Repair Type', element: ViewRepairtype },
  { path: '/UpdateRepairtype', name: 'Update Repair Type', element: UpdateRepairtype },

  { path: '/AddPolicytype', name: 'Add Policy Type', element: AddPolicytype },
  { path: '/ViewPolicytype', name: 'View Policy Type', element: ViewPolicytype },
  { path: '/UpdatePolicytype', name: 'Update Policy Type', element: UpdatePolicytype },

  { path: '/AddBusinesstype', name: 'Add Business Type', element: AddBusinesstype },
  { path: '/ViewBusinesstype', name: 'View Business Type', element: ViewBusinesstype },
  { path: '/UpdateBusinesstype', name: 'Update Business Type', element: UpdateBusinesstype },

  { path: '/AddMotormodeldetails', name: 'Add Motor Model Details', element: AddMotormodeldetails },
  {
    path: '/ViewMotormodeldetails',
    name: 'View Motor Model Details',
    element: ViewMotormodeldetails,
  },
  {
    path: '/UpdateMotormodeldetails',
    name: 'Update Motor Model Details',
    element: UpdateMotormodeldetails,
  },

  { path: '/AddCompany', name: 'Add Insurance Company', element: AddCompany },
  { path: '/insurance-company', name: 'Insurance Company', element: Company },
  { path: '/EditCompany', name: 'Edit Company', element: EditCompany },

  { path: '/viewBank', name: 'View Bank', element: ViewBank },

  { path: '/ViewPlans', name: 'View Plans', element: ViewPlans },

  { path: '/ViewLeadStatus', name: 'View Lead Status', element: ViewLeadStatus },

  { path: '/ViewLOB', name: 'View Line Of Business', element: ViewLOB },

  { path: '/AddMotorPlan', name: 'Add Plan', element: AddMotorPlan },
  { path: '/motor-plan', name: 'Motor Plan', element: MotorPlan },
  { path: '/EditMotorPlan', name: 'Edit Motor Plan', element: EditMotorPlan },
  { path: '/EditTPLMotorPlan', name: 'Edit Motor Plan', element: EditTPLMotorPlan },

  { path: '/AddThirdPartyPlan', name: 'Add Third Party Plan', element: AddThirdPartyPlan },
  { path: '/ThirdMotorTablePlan', name: 'Third Party Plan', element: ThirdMotorTablePlan },

  { path: '/AddStaff', name: 'Add Staff', element: AddStaff },
  { path: '/ViewStaff', name: 'View Staff', element: ViewStaff },
  { path: '/EditStaff', name: 'Edit Staff', element: EditStaff },
  { path: '/ViewProfile', name: 'View Profile', element: ViewProfile },
  { path: '/ChangePassword', name: 'Change Password', element: ChangePassword },
  { path: '/User_management', name: 'User Management', element: User_management },

  { path: '/ViewStandardCover', name: 'View Standard Cover', element: ViewStandardCover },
  { path: '/GetStandardCovers', name: 'View Standard Cover', element: GetStandardCovers },

  { path: '/ViewAdditionalCover', name: 'View Additional Cover', element: ViewAdditionalCover },
  { path: '/GetAdditionalCovers', name: 'View Additional Cover', element: GetAdditionalCovers },

  {
    path: '/Nonapplicablenationality',
    name: 'non Applicable Nationality',
    element: Nonapplicablenationality,
  },

  {
    path: '/ViewBlackListedVehicle',
    name: 'View Black Listed Vehicle',
    element: ViewBlackListedVehicle,
  },

  { path: '/Blacklistvehicle', name: 'View Black Listed Vehicle', element: Blacklistvehicle },

  {
    path: '/global-user-management-permissions',
    name: 'Global User Management Permission',
    element: global_user_management_permission,
  },

  { path: '/AddTravelPlan', name: 'Add Travel Plan', element: AddTravelPlan },
  { path: '/travel-plan', name: 'Travel Plan', element: TravelPlan },
  { path: '/EditTravelPlan', name: 'Edit Travel Plan', element: EditTravelPlan },
  { path: '/ViewPlanPrice', name: 'View Plan Price', element: ViewPlanPrice },
  { path: '/AddPlanPrice', name: 'Add Plan Price', element: AddPlanPrice },
  { path: '/EditPlanPrice', name: 'Edit Plan Price', element: EditPlanPrice },

  { path: '/admin', name: 'Admin', element: AdminDashboard, exact: true },
  { path: '/sales', name: 'Sales', element: CEODashboard, exact: true },
  { path: '/operations', name: 'Operations', element: OperationsDashboard, exact: true },
  {
    path: '/Operationtoplegend',
    name: 'Operation Top Legend',
    element: Operationtoplegend,
    exact: true,
  },
  { path: '/Operationgraph', name: 'Operation Graph', element: Operationgraph, exact: true },

  {
    path: '/Managesupervisordashboard',
    name: 'Dashboard',
    element: Managesupervisordashboard,
    exact: true,
  },
  { Path: '/Leadsstatus', name: 'Leads Status', element: Leadsstatus, exact: true },
  { Path: '/APIPending', name: 'API Pending', element: APIPending, exact: true },
  { Path: '/PaymentPending', name: 'Payment Pending', element: PaymentPending, exact: true },
  { Path: '/Renewalstatus', name: 'Renewal Status', element: Renewalstatus, exact: true },
  { Path: '/RTAPending', name: 'RTA Pending', element: RTAPending, exact: true },
  {
    Path: '/ClosedBussinessManager',
    name: 'Closed Bussiness',
    element: ClosedBussinessManager,
    exact: true,
  },

  { Path: '/LostDroppedManager', name: 'Lost Dropped', element: LostDroppedManager, exact: true },
  { Path: '/ManagersalesGraph', name: 'Graphical View', element: ManagerSalesGraph, exact: true },
  { path: '/GetThirdPartyBuisness', name: 'Advertise with Us', element: AdWithUs },
  { path: '/homeplan', name: 'Home Plan', element: HomePlan, exact: true },
  { path: '/AddHomePlan', name: 'Add Home Plan', element: AddHomePlan },
  { path: '/EditHomePlan', name: 'Edit Home Plan', element: EditHomePlan },

  { path: '/yachtplan', name: 'Yacht Plan', element: YachtPlan, exact: true },
  { path: '/Addyachtplan', name: 'Yacht Plan', element: AddYachtPlan, exact: true },
  { path: '/AddTPLyachtplan', name: 'Yacht Plan', element: AddTPLYachtPlan, exact: true },
  { path: '/EditYachtPlan', name: 'Edit Comprehensive Yacht Plan', element: EditYachtPlan },
  { path: '/EditTPLYachtPlan', name: 'Edit TPL Yacht Plan', element: EditTPLYachtPlan },
  {
    path: '/AddYachtConditions',
    name: 'Add Yacht Condition',
    element: AddYachtConditions,
    exact: true,
  },
  {
    path: '/Viewyachtcondition',
    name: 'View Yacht Condition',
    element: ViewYachtcondition,
    exact: true,
  },
  { path: '/YachtCondition', name: 'Yacht Condition', element: YachtConditions, exact: true },

  {
    path: '/AddBusinessEntity',
    name: 'Add Business Entity',
    element: AddBusinessEntity,
    exact: true,
  },
  {
    path: '/ViewBusinessEntity',
    name: 'View Business Entity',
    element: ViewBusinessEntity,
    exact: true,
  },
  {
    path: '/EditBusinessEntity',
    name: 'Edit Business Entity',
    element: EditBusinessEntity,
    exact: true,
  },
  {
    path: '/ViewBusinessEntityBank',
    name: 'View Business Entity Bank',
    element: ViewBusinessEntityBank,
    exact: true,
  },
  {
    path: '/ViewBusinessEntitycommission',
    name: 'View Business Entity Commission',
    element: ViewBusinessEntitycommission,
    exact: true,
  },
  {
    path: '/ViewBusinessEntityDiscount',
    name: 'View Business Entity Discount',
    element: ViewBusinessEntityDiscount,
    exact: true,
  },

  { path: '/medicalplan', name: 'Medical Plan', element: MedicalPlan, exact: true },
  { path: '/addmedicalplan', name: 'Medical Plan', element: AddMedicalPlan, exact: true },
  { path: '/EditMedicalPlan', name: 'Edit Medical Plan', element: EditMedicalPlan, exact: true },

  { path: '/tablebenefits', name: 'Medical Benefits', element: medTableBenefits },
  { path: '/viewMedicalBenefits', name: 'View Medical  Benefits', element: viewMedicalBenefits },
  { path: '/AddMedicalBenefits', name: 'Add Medical  Benefits', element: AddMedicalBenefits },
  {
    path: '/StandardConditions',
    name: 'Standard Underwriting Conditions',
    element: StandardUnderwrintingCond,
  },
  {
    path: '/viewStandardConditions',
    name: 'View Standard Underwriting Conditions',
    element: viewStandardUnderwrintingCond,
  },
  {
    path: '/AddStandardConditions',
    name: 'Add Standard Underwriting Conditions',
    element: AddStandardUnderwrintingCond,
  },

  {
    path: '/AdditionalConditions',
    name: 'Additional Underwriting Conditions',
    element: AdditionalUnderwrintingCond,
  },
  {
    path: '/viewAdditionalConditions',
    name: 'View Additional Underwriting Conditions',
    element: viewAdditionalUnderwrintingCond,
  },
  {
    path: '/AddAdditionalConditions',
    name: 'Add Additional Underwriting Conditions',
    element: AddAdditionalUnderwrintingCond,
  },

  { path: '/viewBMI', name: 'View BMI', element: ViewBMI },
  { path: '/addBMI', name: 'Add BMI', element: AddBMI },
  { path: '/editBMI', name: 'Edit BMI', element: editBMI },

  {
    path: '/UnderwritingConditions',
    name: 'Underwriting Conditions',
    element: UnderwrintingConditions,
  },
  {
    path: '/AddUnderwritingConditions',
    name: 'Add Underwriting Conditions',
    element: AddUnderwrintingConditions,
  },
  {
    path: '/ViewUnderwritingConditions',
    name: 'Underwriting Conditions',
    element: viewUnderwrintingConditions,
  },
  {
    path: '/ViewGeneralwritingConditions',
    name: 'View General Writing Conditions',
    element: ViewGeneralWritingCondition,
  },
  {
    path: '/AddGeneralWritingConditions',
    name: 'Add General Writing Conditions',
    element: AddGeneralWritingCondition,
  },
  {
    path: '/ViewHomeAdditionalConditions',
    name: 'View Home Additional Conditions',
    element: ViewHomeAdditionalConditions,
  },
  {
    path: '/AddHomeAdditionalConditions',
    name: 'Add Home Additional Conditions',
    element: AddHomeAdditionalConditions,
  },
  { path: '/ViewRatesBasedOnAge', name: 'Medical Rates Based on Range', element: ViewPlanRates },
  {
    path: '/AddMedicalRatesBasedOnAge',
    name: 'Add Medical Rates Based on Range',
    element: AddPlanRates,
  },
  {
    path: '/EditMedicalRatesBasedOnAge',
    name: 'Edit Medical Rates Based on Range',
    element: EditPlanRates,
  },

  { path: '/ViewDocumentsList', name: 'view document list', element: ViewDocumentsList },

  { path: '/ViewTestimonials', name: 'view testimonials', element: ViewTestimonials },

  { path: '/ViewCompliance', name: 'view compliance', element: ViewCompliance },

  { path: '/ViewSpecialoffer', name: 'view special offer', element: ViewSpecialoffer },

  { path: '/claims', name: 'claims', element: Claims },

  { path: '/termscondition', name: 'terms condition', element: Termscondition },

  { path: '/maternitycondition', name: 'maternity condition', element: Maternitycondition },
  { path: '/addmaternitycondition', name: 'add maternity condition', element: AddMaternitycondition },

  { path: '/motorclaimyears', name: 'motor claim years', element: MotorClaimYears },

  { path: '/Socialmedia', name: 'Social Media', element: SocialMedia },
  { path: '/ClaimQuestions', name: 'Claim Questions', element: ClaimQuestions },
  { path: '/BankDetails', name: 'Bank Details', element: BankDetails },
  { path: '/EmergencyDepartment', name: 'Emergency Department', element: EmergencyDepartment },
  { path: '/StepsGuidelines', name: 'Guidelines', element: GuidelinesSteps },
  { path: '/NewsLetter', name: 'NewsLetter', element: NewsLetter },
  { path: '/BannerImage', name: 'BannerImage', element: BannerImage },
  { path: '/Complaint', name: 'Complaint', element: Complaint },

  // Quotes routes
  // { path: '/app/lead/MotorQuote', name: 'Motor Quote', element: MotorQuote },

  { path: '/AdminToplegend', name: 'Top Legend', element: AdminToplegend },

  { path: '/TopLegend', name: 'Top Legend', element: TopLegend },

  { path: '/SaToplegend', name: 'Top Legend', element: SaToplegend },

  { path: '/DcToplegend', name: 'Top Legend', element: DcToplegend },

  { path: '/PiToplegend', name: 'Top Legend', element: PiToplegend },

  { path: '/AdminGraph', name: 'Graph', element: AdminGraph },
  { path: '/AMRating', name: 'AMRating', element: AMRating },
  { path: '/SPRating', name: 'SPRating', element: SPRating },

  { path: '/BEdashboard', name: 'Dashboard', element: BEdashboard },
  { path: '/BEToplegend', name: 'Top Legend', element: BEToplegend },
  { path: '/BESalesgraph', name: 'Graph', element: BESalesgraph },
  { path: '/BENewleads', name: 'New Leads', element: BENewleads },
  { path: '/BEHotleads', name: 'Hot Leads', element: BEHotleads },
  { path: '/BEWarmleads', name: 'Warm Leads', element: BEWarmleads },
  { path: '/BEColdleads', name: 'Cold Leads', element: BEColdleads },
  { path: '/BEPending', name: 'Pending', element: BEPending },
  { path: '/BEIssued', name: 'Issued', element: BEIssued },
  { path: '/BELostdropped', name: 'Lost Dropped', element: BELostdropped },
  { path: '/AllLeads', name: 'All Leads', element: AllLeads },
  { path: '/addMakeMotor', name: 'Add Make Motor', element: addMakeMotor },
  { path: '/addModelMotor', name: 'Add Model Motor', element: addModelMotor },

  { path: '/BELink', name: 'Link', element: BELink },

  { path: '/MotorLeaddetails', name: 'Motor Lead Details', element: MotorLeaddetails },
  { path: '/TravelLeaddetails', name: 'Travel Lead Details', element: TravelLeaddetails },
  { path: '/HomeLeaddetails', name: 'Home Lead Details', element: HomeLeaddetails },
  { path: '/MedicalLeaddetails', name: 'Medical Lead Details', element: MedicalLeaddetails },
  { path: '/YachtLeaddetails', name: 'Yacht Lead Details', element: YachtLeaddetails },
  { path: '/YachtExperience', name: 'Yacht Experience', element: getYacht_Experience_List },
  { path: '/YachtQuestions', name: 'Yacht Experience', element: yachtQuestions },

  { path: '/vat', name: 'vat', element: vat },

  { path: '/ViewDiscountcoupon', name: 'View Discount Coupon', element: ViewDiscountcoupon },

  { path: '/ViewCopayment', name: 'View Copayment', element: ViewCopayment },

  { path: '/Viewmedicaldeclaration', name: 'View Medical Declaration', element: Viewmedicaldeclaration },
  { path: '/Addmedicaldeclaration', name: 'Add Medical Declaration', element: Addmedicaldeclaration },
  { path: '/AddmedicalTPA', name: 'Add Medical TPA', element: AddmedicalViewmedicalTPA },
  { path: '/ViewmedicalTPA', name: 'View Medical TPA', element: ViewmedicalViewmedicalTPA },
  { path: '/AddmedicalNetwork', name: 'Add Medical Network', element: AddmedicalViewmedicalNetwork },
  { path: '/ViewmedicalNetwork', name: 'View Medical Network', element: ViewmedicalViewmedicalNetwork },
  { path: '/AddmedicalNetworkList', name: 'Add Medical Network List', element: AddmedicalViewmedicalNetworkList },
  { path: '/ViewmedicalNetworkList', name: 'View Medical Network List', element: ViewmedicalViewmedicalNetworkList },


  { path: '/MaternityConditions', name: 'Maternity Condition', element: MaternityCondition },
  { path: '/AddMaternityConditions', name: 'Add Maternity Condition', element: AddMaternityCondition },

  { path: '/ViewmedicalGeneralUnderwriting', name: 'View Medical General Underwriting', element: ViewGeneralUnderwriting },
  { path: '/ViewBestPlan', name: 'Add Best Plan', element: Best_plan },
  { path: '/ViewReasonType', name: 'View Reason Type', element: ViewReasonType },
  // { path: '/MotorQuote', name: 'Link', element: ShivamQuotes },
  // { path: '/Selectedquotes', name: 'Link', element: Selectedquotes },
  // { path: '/Payments', name: 'Link', element: Payments}
  { path: '/ViewBlackListedYacht', name: 'View Black Listed Yacht', element: ViewBlackListedYacht },
  { path: '/BlacklistYacht', name: 'View Black Listed Yacht', element: BlackListedyacht },
  { path: '/OtherInsuranceLeaddetails', name: 'View Yacht Condition', element: ViewOtherInsuranlead },
  { path: '/preferredDays', name: 'View Preferred Days', element: ViewPreferred_Days },
  { path: '/ViewMedicalLabel', name: 'View Medical Label', element: ViewLabels },
  { path: '/ViewBoatBreadth', name: 'View Boat Breadth', element: ViewBoatBreadth },
  { path: '/ViewGroupMedicalPlans', name: 'View Group Medical Plans', element: ViewGroupMedicalPlans },
  { path: '/AddGroupMedicalPlans', name: 'Add Group Medical Plans', element: AddGroupMedicalPlans },
  { path: '/EditGroupMedicalPlans', name: 'Edit Group Medical Plans', element: EditGroupMedicalPlans },
  { path: '/ViewMemberRequests', name: 'View Member Requests', element: ViewMemberRequests },
  { path: "/ViewActiveMembers", name: 'View Active Members', element: ViewActiveMembers },
  { path: "/ViewDeletedMembers", name: 'View Deleted Members', element: ViewDeletedMembers },
  { path: "/ViewNewlyAddedMembers", name: 'View Newly Added Members', element: ViewNewlyAddedMembers },
  { path: "/MemberDetails", name: "Member Details", element: MemberDetails },
  { path: "/EditMemberDetails", name: "Edit Member Details", element: EditMemberDetails },
  { path: "/AddGroupMedicalPlanRates", name: "Add Group Medical Plan Rates", element: AddGroupMedicalPlanRates },
  { path: "/ViewGroupMedicalPlanPrice", name: "View Group Medical Plan Rates", element: ViewGroupMedicalPlanPrice },
  { path: "/EditGroupMedicalPlanPrice", name: "Edit Group Medical Plan Rates", element: EditGroupMedicalPlanPrice },
  { path: "/AddMembermanually", name: "Add Member Manually", element: AddMembermanually },
  { path: "/ShowInquotespage", name: "Show In Quotes Page", element: showInQuotesPage },
  { path: "/ViewGroupMedicalCategory", name: "View Group Medical Categories", element: ViewGroupMedicalCategories },
  { path: "/ViewGroupMedicalClaimType", name: "Add Group Medical Claim Type", element: ViewGroupMedicalClaimType },
  { path: "/ViewGroupMedicalClaimStatus", name: "Add Group Medical Claim Status", element: ViewGroupMedicalClaimStatus },
  { path: "/ViewGroupMedicalClaimDescription", name: "Add Group Medical Claim Description", element: ViewGroupMedicalClaimDescription },
  { path: "/ViewClaimRequest", name: "View Claim Request", element: ViewClaimRequest },
  { path: "/ViewClaimrequestMembers", name: "View Claim Request Members", element: ViewClaimrequestMembers },
  { path: "/ClaimrequestMemberdetails", name: "Claim Request Member Details", element: ClaimrequestMemberdetails },
  { path: "/EditClaimrequestMemberdetails", name: "Edit Claim Request Member Details", element: EditClaimrequestMemberdetails },
  { path: "/ProducerDashboard", name: "Producer Dashboard", element: ProducerDashboard },
  { path: "/ProducerNewLead", name: "Producer New Lead", element: ProducerNewLead },
  { path: "/ProducerPendingLeads", name: "Producer Pending Leads", element: ProducerPendingLeads },
  { path: "/ProducerissuedPollicy", name: "Producer issued Pollicy", element: ProducerissuedPollicy },
  { path: "/ProducerTopLegend", name: "Producer Top Legend", element: ProducerTopLegend },
  { path: "/ProducerGraph", name: "Producer Graph", element: ProducerGraph },
  { path: "/ProducerGenerateLink", name: "Producer Generate Link", element: ProducerGenerateLink },
  { path: "/ProducerUpcomingRenewal", name: "Producer Link", element: ProducerUpcomingRenewal },
  { path: "/ProducerLostDropped", name: "Producer Lost Dropped", element: ProducerLostDropped },
  { path: "/ViewProducerDiscount", name: "Producer Discount", element: ViewProducerDiscount },
  { path: "/ViewClaimProcedure", name: "View Claim Procedure", element: ViewClaimProcedure },
  { path: "/ViewUsefulLinks", name: "View Useful Links", element: ViewUsefulLinks },
  { path: "/GroupMedicalClaim", name: "Group Medical Claim", element: GroupMedicalClaim },
  { path: "/AddGroupMedicalClaim", name: "Add Group Medical Claim", element: AddGroupMedicalClaim },
  { path: "/AdditionMemberList", name: "Addition Member List", element: AdditionMemberList },
  { path: "/TatView", name: "Tat View", element: TatView },
  { path: "/ViewMaritalStatus", name: "View Marital Status", element: MaritalStatus },
  { path: "/ViewGender", name: "View Gender", element: Gender },
  { path: "/ViewRelation", name: "View Gender", element: Relaiton },
  { path: "AddTatDays", name: "Add Tat Days", element: AddTatDays },
  { path: "/SponsortypeView", name: "Sponsor Type View", element: SponsortypeView },
  { path: "/Sponsortypeadd", name: "Add Sponsor Type", element: Sponsortypeadd },
  { path: "/ViewWorkLocation", name: "Sponsor Type View", element: ViewWorkLocation },
  { path: "/AddWorklocation", name: "Add Sponsor Type", element: AddWorkLocation },
  { path: "/ViewBusinessEntityTopup", name: "View Business Entity Topup", element: ViewBusinessEntityTopup },
  { path: "/ViewActualSalaryBand", name: "View Actual Salary Band", element: ViewActualSalaryBand },
  { path: "/AddActualSalaryBand", name: "Add Actual Salary Band", element: AddActualSalaryBand },
  { path: "/CompanyUsers", name: "Company Users", element: CompanyUsers },
  { path: "/AddCompanyUsers", name: "Company Users", element: AddCompanyUsers },

  { path: "/ViewEmailTemplates", name: "Company Users", element: ViewEmailTemplates },
  { path: "/AddEmailTemplate", name: "Company Users", element: AddEmailTemplate },
  { path: "/EditEmailTemplate", name: "Company Users", element: EditEmailTemplate },
  { path: "/ViewTemplateTypes", name: "Company Users", element: ViewTemplateTypes },
  { path: "/ViewAllMail", name: "Company Users", element: ViewAllMail },
  { path: "/ViewMail", name: "Company Users", element: ViewMail },
  { path: "/Usersmail", name: "Company Users", element: Usersmail },
  { path: "/Mailslist", name: "Company Users", element: Mailslist },
  { path: "/tooltips", name: "Tool Tips", element: tooltips },
  { path: "/ViewCms", name: "Tool Tips", element: ViewCms },
  // { path: "/MISReports", name: "MIS Reports", element: MISReports },
  { path: "/SpecialIncetive", name: "Special Incetives", element: SpecialIncetive },
]

export default routes
