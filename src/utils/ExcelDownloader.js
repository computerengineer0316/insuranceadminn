import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import headersData from './highestrateheaders.json';
import averaherateheadersData from './averagerateheaders.json';
const PolicyTypeName = (data, type) => {
    try {
        const policytype = type.toLowerCase();
        const policyMap = {
            motor: 'policy_type_name',
            travel: 'travel_insurance_for',
            medical: 'medical_plan_type',
            yacht: 'policy_type_name',
            home: 'home_plan_type'
        };
        return data && data[policyMap[policytype]] ? data[policyMap[policytype]] : "-";
    } catch (error) {
        console.error(error);
        return "-";
    }
};
const handledays = (minutes) => {
    let days = Math.floor(minutes / 1440);
    let hours = Math.floor((minutes % 1440) / 60);
    let min = Math.floor((minutes % 1440) % 60);
    console.log({ days, hours, min });
    return `${days}d ${hours}h ${min}m`;
}
const headrow = (worksheet, header) => {
    header.eachCell((cell) => {
        cell.font = { bold: true };
    });
}

const performanceReport = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            const workbook = new Workbook();
            const worksheet = workbook.addWorksheet('Performance Report');

            // Add headers for the entire worksheet
            const headers = [
                'Supervisor Name', 'Supervisor Email', 'LOB Name', 'Sr. No.', 'SA Name', 'Policy Type', 'Premium', 'JDV Comm'
            ];
            worksheet.addRow(headers);

            let rowIndex = 2; // Start from the second row

            data.forEach((entry) => {
                const supervisor = entry.supervisor;

                entry.lobs.forEach((lob) => {
                    // Add supervisor information and LOB name before the data
                    worksheet.addRow([
                        supervisor.name,
                        supervisor.email,
                        lob.lob_name,
                        '', '', '', '', ''
                    ]);

                    // Add data rows
                    lob.plans.forEach((plan, index) => {
                        const row = [
                            '', '', '', // Leave supervisor and LOB name columns empty for data rows
                            index + 1,
                            plan.agent_name.name,
                            plan.planDetails ? (plan.planDetails.policy_type_name || plan.planDetails.travel_insurance_for || plan.planDetails.home_plan_type || plan.planDetails.medical_plan_type) : '-',
                            plan.premium,
                            plan.jdvCommission,
                        ];
                        worksheet.addRow(row);
                    });

                    // Add total row for each LOB
                    worksheet.addRow([
                        '', '', '', '', '', 'Total', lob.totalPremium, lob.totalJdvCommission
                    ]);
                });

                // Add total commission and total premium summary for each supervisor
                worksheet.addRow([
                    '', '', '', '', '', 'Total Commission', entry.totalJDVCommission, ''
                ]);
                worksheet.addRow([
                    '', '', '', '', '', 'Total Premium', entry.totalPremium, ''
                ]);
                worksheet.addRow([]); // Add a blank row between supervisors
            });

            // Apply bold font to headers
            worksheet.getRow(1).font = { bold: true };

            // Auto-fit columns
            worksheet.columns.forEach((column) => {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, (cell) => {
                    const columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength) {
                        maxLength = columnLength;
                    }
                });
                column.width = maxLength + 2;
            });

            // Save Excel file
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), 'InsuranceData.xlsx');
            });
            resolve("Success");
        } catch (error) {
            console.error("Failed to Export: ", error);
            reject("Failed to Export");
        }
    });
};



const ClosingrationReport = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            const workbook = new Workbook();
            const worksheet = workbook.addWorksheet('Closing Ratio Report');

            // Add headers for the entire worksheet
            const headers = [
                'Supervisor Name', 'Supervisor Email', 'LOB Name', 'Sr. No.', 'SA Name', 'Policy Type', 'Premium', 'JDV Comm', 'Closing Ratio'
            ];
            worksheet.addRow(headers);

            let rowIndex = 2; // Start from the second row

            data.forEach((entry) => {
                const supervisor = entry.supervisor;

                entry.lobs.forEach((lob) => {
                    // Add supervisor information and LOB name before the data
                    worksheet.addRow([
                        supervisor.name,
                        supervisor.email,
                        lob.lob_name,
                        '', '', '', '', '', ''
                    ]);

                    // Add data rows
                    lob.plans.forEach((plan, index) => {
                        let newVsClosedPercentage = plan.newVsClosedPercentage !== undefined ? `${plan.newVsClosedPercentage.toFixed()}%` : '-';
                        let newlead = plan.lead_status_count && plan.lead_status_count.new ? plan.lead_status_count.new : 0;
                        let closedlead = plan.lead_status_count && plan.lead_status_count.closed ? plan.lead_status_count.closed : 0;
                        let renewalVsClosedPercentage = plan.renewalVsClosedPercentage !== undefined ? `${plan.renewalVsClosedPercentage.toFixed()}%` : '-';
                        let businewsrenewallead = plan.business_type_count && plan.business_type_count.renewal ? plan.business_type_count.renewal : 0;
                        let businewsclosedlead = plan.business_type_count && plan.business_type_count.closed ? plan.business_type_count.closed : 0;

                        let ClosingRatioData = `(i) (${newVsClosedPercentage} New: ${newlead}, Closed: ${closedlead}), (ii) ${renewalVsClosedPercentage}, Renewal: ${businewsrenewallead}, Closed: ${businewsclosedlead}`;

                        let policytype = plan.planDetails ? (plan.planDetails.policy_type_name || plan.planDetails.travel_insurance_for || plan.planDetails.home_plan_type || plan.planDetails.medical_plan_type) : "-";
                        const row = [
                            '', '', '', // Leave supervisor and LOB name columns empty for data rows
                            index + 1,
                            plan.assigned_agent.length > 0 ? plan.assigned_agent.map(item => item.name).join(",") : "-",
                            policytype,
                            plan.premium || 0,
                            plan.jdvCommission || 0,
                            ClosingRatioData
                        ];
                        worksheet.addRow(row);
                    });

                    // Add total row for each LOB
                    worksheet.addRow([
                        '', '', '', '', '', 'Total', lob.totalPremium, lob.totalJdvCommission, ''
                    ]);
                });

                // Add total commission and total premium summary for each supervisor
                worksheet.addRow([
                    '', '', '', '', '', 'Total Commission', entry.totalJDVCommission, '', ''
                ]);
                worksheet.addRow([
                    '', '', '', '', '', 'Total Premium', entry.totalPremium, '', ''
                ]);
                worksheet.addRow([]); // Add a blank row between supervisors
            });

            // Apply bold font to headers
            worksheet.getRow(1).font = { bold: true };

            // Auto-fit columns
            worksheet.columns.forEach((column) => {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, (cell) => {
                    const columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength) {
                        maxLength = columnLength;
                    }
                });
                column.width = maxLength + 2;
            });

            // Save Excel file
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), 'InsuranceData.xlsx');
            });
            resolve("Success");
        } catch (error) {
            console.error("Failed to Export: ", error);
            reject("Failed to Export");
        }
    });
};

const SpecialIncentive = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            const workbook = new Workbook();
            const worksheet = workbook.addWorksheet('Combined Data');

            // Add header row
            worksheet.addRow([
                'Promotional Code No',
                'Completed By',
                'Supervisor/Team Lead',
                'SA Name',
                'Line of Business',
                'Policy Type',
                'Premium',
                'Commission'
            ]);

            // Add data rows
            data.forEach((item) => {
                item.completed_by.forEach((completed) => {
                    completed.lead.forEach((lead) => {
                        worksheet.addRow([
                            item.description,
                            completed.user.name,
                            lead.supervisor_id.name,
                            lead.assigned_agent.name,
                            lead.type_of_policy.line_of_business_name,
                            PolicyTypeName(lead.plan_id, lead.type_of_policy.line_of_business_name),
                            lead.final_price,
                            lead.jdvComission
                        ]);
                    });

                    // Add total commission row after processing all leads for the current item
                    worksheet.addRow(['', '', '', '', '', '', 'Total Commission:', completed.totalCommission]);
                });
            });

            // Apply bold font to header row
            worksheet.getRow(1).font = { bold: true };

            // Auto-fit columns
            worksheet.columns.forEach((column) => {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, (cell) => {
                    const columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength) {
                        maxLength = columnLength;
                    }
                });
                column.width = maxLength + 2;
            });

            // Save Excel file
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), 'data.xlsx');
                resolve("Excel file downloaded successfully");
            });

        } catch (error) {
            console.error("Failed to Export: ", error);
            reject("Failed to Export");
        }
    });
};
const SpecialIncentiveToCustomerWith = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            const workbook = new Workbook();
            data.forEach((entry) => {
                const supervisor = entry.supervisor;

                entry.lobs.forEach((lob) => {
                    const worksheet = workbook.addWorksheet(`${supervisor.name} - ${lob.lob_name}`);
                    // Add supervisor information
                    const supervisorNameRow = worksheet.addRow(['Supervisor Name:', supervisor.name]);
                    const supervisorEmailRow = worksheet.addRow(['Supervisor Email:', supervisor.email]);
                    const totalPremiumRow = worksheet.addRow(['Total Premium:', lob.totalPremium]);
                    const totalJdvCommissionRow = worksheet.addRow(['Total JDV Commission:', lob.totalJdvCommission]);

                    worksheet.addRow([]);
                    headrow(worksheet, supervisorNameRow);
                    headrow(worksheet, supervisorEmailRow);
                    headrow(worksheet, totalPremiumRow);
                    headrow(worksheet, totalJdvCommissionRow);


                    // Add header row
                    const Row = ['Sr. No.', 'Promotional Code No', 'SA Name', 'Policy Type', 'Premium', 'JDV Comm']
                    worksheet.addRow(Row);

                    // Add data rows
                    lob.plans.forEach((plan, index) => {
                        const row = [
                            index + 1,
                            plan.discountId && plan.discountId.description ? plan.discountId.description : "-",
                            plan.agent_name.name,
                            PolicyTypeName(plan.planDetails, lob.lob_name),
                            plan.premium,
                            plan.jdvCommission,
                        ];

                        worksheet.addRow(row);
                    });

                    // Add total row
                    worksheet.addRow(['', '', 'Total', lob.totalPremium, lob.totalJdvCommission]);

                    // Format header
                    const headerRow = worksheet.getRow(4); // Adjusted to account for supervisor info rows
                    headerRow.eachCell((cell) => {
                        cell.font = { bold: true };
                    });

                    // Auto-fit columns
                    worksheet.columns.forEach((column) => {
                        let maxLength = 0;
                        column.eachCell({ includeEmpty: true }, (cell) => {
                            const columnLength = cell.value ? cell.value.toString().length : 10;
                            if (columnLength > maxLength) {
                                maxLength = columnLength;
                            }
                        });
                        column.width = maxLength + 2;
                    });
                });

                // Add total commission and total premium summary
                const summarySheet = workbook.addWorksheet(`${supervisor.name} - Summary`);
                const summaryNameRow = summarySheet.addRow(['Supervisor Name:', supervisor.name]);
                const summaryEmailRow = summarySheet.addRow(['Supervisor Email:', supervisor.email]);
                summarySheet.addRow([]);
                summarySheet.addRow(['Total Commission', entry.totalJDVCommission]);
                summarySheet.addRow(['Total Premium', entry.totalPremium]);

                // Apply bold font to supervisor rows in summary
                summaryNameRow.eachCell((cell) => {
                    cell.font = { bold: true };
                });
                summaryEmailRow.eachCell((cell) => {
                    cell.font = { bold: true };
                });

                summarySheet.getRow(4).font = { bold: true }; // Adjusted to account for supervisor info rows
                summarySheet.getRow(5).font = { bold: true }; // Adjusted to account for supervisor info rows
            });

            // Save Excel file
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), 'InsuranceData.xlsx');
            });
            resolve("Success");
        } catch (error) {
            alert("Failed to Export ");
        }
    });
};
const SpecialIncentiveToCustomerWithoght = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            const workbook = new Workbook();
            data.forEach((entry) => {
                const supervisor = entry.supervisor;

                entry.lobs.forEach((lob) => {
                    const worksheet = workbook.addWorksheet(`${supervisor.name} - ${lob.lob_name}`);
                    // Add supervisor information
                    const supervisorNameRow = worksheet.addRow(['Supervisor Name:', supervisor.name]);
                    const supervisorEmailRow = worksheet.addRow(['Supervisor Email:', supervisor.email]);
                    const totalPremiumRow = worksheet.addRow(['Total Premium:', lob.totalPremium]);
                    const totalJdvCommissionRow = worksheet.addRow(['Total Commission:', lob.totalJdvCommission]);
                    worksheet.addRow([]);
                    headrow(worksheet, supervisorNameRow);
                    headrow(worksheet, supervisorEmailRow);
                    headrow(worksheet, totalPremiumRow);
                    headrow(worksheet, totalJdvCommissionRow);

                    // Add header row
                    const Row = ['Sr. No.', 'Promotional Code No', 'SA Name', 'Policy Type', 'Premium', 'JDV Comm']
                    worksheet.addRow(Row);

                    // Add data rows
                    lob.plans.forEach((plan, index) => {
                        const row = [
                            index + 1,
                            plan.discountId && plan.discountId.description ? plan.discountId.description : "-",
                            plan.agent_name.name,
                            PolicyTypeName(plan.planDetails, lob.lob_name),
                            plan.premium,
                            plan.jdvCommission,
                        ];

                        worksheet.addRow(row);
                    });

                    // Add total row
                    worksheet.addRow(['', '', 'Total', lob.totalPremium, lob.totalJdvCommission]);

                    // Format header
                    const headerRow = worksheet.getRow(4); // Adjusted to account for supervisor info rows
                    headerRow.eachCell((cell) => {
                        cell.font = { bold: true };
                    });

                    // Auto-fit columns
                    worksheet.columns.forEach((column) => {
                        let maxLength = 0;
                        column.eachCell({ includeEmpty: true }, (cell) => {
                            const columnLength = cell.value ? cell.value.toString().length : 10;
                            if (columnLength > maxLength) {
                                maxLength = columnLength;
                            }
                        });
                        column.width = maxLength + 2;
                    });
                });

                // Add total commission and total premium summary
                const summarySheet = workbook.addWorksheet(`${supervisor.name} - Summary`);
                const summaryNameRow = summarySheet.addRow(['Supervisor Name:', supervisor.name]);
                const summaryEmailRow = summarySheet.addRow(['Supervisor Email:', supervisor.email]);
                summarySheet.addRow([]);
                summarySheet.addRow(['Total Commission', entry.totalJDVCommission]);
                summarySheet.addRow(['Total Premium', entry.totalPremium]);

                // Apply bold font to supervisor rows in summary
                summaryNameRow.eachCell((cell) => {
                    cell.font = { bold: true };
                });
                summaryEmailRow.eachCell((cell) => {
                    cell.font = { bold: true };
                });

                summarySheet.getRow(4).font = { bold: true }; // Adjusted to account for supervisor info rows
                summarySheet.getRow(5).font = { bold: true }; // Adjusted to account for supervisor info rows
            });

            // Save Excel file
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), 'InsuranceData.xlsx');
            });
            resolve("Success");
        } catch (error) {
            alert("Failed to Export ");
        }
    });
};

const MostActiveTimePeriod = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            const workbook = new Workbook();
            const worksheet = workbook.addWorksheet('Data');
            // Add header row
            worksheet.addRow([
                'Sr. No.',
                'Date',
                'Hourly Time',
                'Customer Name',
                'Contact No.',
                'Customer Email',
                'Line of Business',
                'Policy Type',
            ]);
            // Add data rows
            data.forEach((item, index) => {
                worksheet.addRow([
                    index + 1,
                    item.new_lead_timestamp ? new Date(item.new_lead_timestamp).toLocaleDateString("en-UK") : "-",
                    item.hours + ":00",
                    item.name,
                    item.phoneno,
                    item.email,
                    item.lob_name,
                    PolicyTypeName(item.plan_detail ? item.plan_detail : "", item.lob_name),

                ]);
            });

            // Save Excel file
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), 'data.xlsx');
                resolve("Excel file downloaded successfully");
            });

        } catch (error) {
            console.log("error", error)
            alert("Failed to Export ")
        }
    }
    );
}
const MostProductiveDayOFtheWeek = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            const workbook = new Workbook();
            data.forEach((entry) => {
                const supervisor = entry._id;
                const worksheet = workbook.addWorksheet(`${supervisor}`);
                // Add supervisor information
                const supervisorNameRow = worksheet.addRow(['Day & Date	:', supervisor]);
                const supervisorEmailRow = worksheet.addRow(['Deal Closed Count:', entry.count]);
                worksheet.addRow([]);
                headrow(worksheet, supervisorNameRow);
                headrow(worksheet, supervisorEmailRow);
                // Add header row
                const Row = ['Sr. No.', 'Deal Closing Time', 'Line of Busines', 'Policy Type']
                worksheet.addRow(Row);
                entry.plan_name.forEach((plan, index) => {
                    // Add data rows
                    const row = [
                        index + 1,
                        plan.policy_issued_date ? (new Date(plan.policy_issued_date).toLocaleDateString()) : "-",
                        plan.lob,
                        PolicyTypeName(plan.plan, plan.lob),

                    ];
                    worksheet.addRow(row);
                    // Format header
                    const headerRow = worksheet.getRow(4); // Adjusted to account for supervisor info rows
                    headerRow.eachCell((cell) => {
                        cell.font = { bold: true };
                    });

                    // Auto-fit columns
                    worksheet.columns.forEach((column) => {
                        let maxLength = 0;
                        column.eachCell({ includeEmpty: true }, (cell) => {
                            const columnLength = cell.value ? cell.value.toString().length : 10;
                            if (columnLength > maxLength) {
                                maxLength = columnLength;
                            }
                        });
                        column.width = maxLength + 2;
                    });
                });

                // Add total commission and total premium summary
                const summarySheet = workbook.addWorksheet(`${supervisor} - Summary`);
                const summaryNameRow = summarySheet.addRow(['Day & Date	:', supervisor]);
                const summaryEmailRow = summarySheet.addRow(['Deal Closed Count: ', entry.count]);


                // Apply bold font to supervisor rows in summary
                summaryNameRow.eachCell((cell) => {
                    cell.font = { bold: true };
                });
                summaryEmailRow.eachCell((cell) => {
                    cell.font = { bold: true };
                });

                summarySheet.getRow(4).font = { bold: true }; // Adjusted to account for supervisor info rows
                summarySheet.getRow(5).font = { bold: true }; // Adjusted to account for supervisor info rows
            });

            // Save Excel file
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), 'InsuranceData.xlsx');
            });
            resolve("Success");
        } catch (error) {
            alert("Failed to Export ");
        }
    });
};
const MarketResponseVsDiscount = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            const workbook = new Workbook();
            const worksheet = workbook.addWorksheet('Data');
            // Add header row
            worksheet.addRow([
                'Sr. No.',
                'Promotional Code No',
                'Type of Promotion ',
                'Line of Business',
                'Promotion Start Date',
                'First policy closed with Promotional Code',
                'Avg. Business Closing (No. of Policies)',
                'Avg. Business Closing (Total Premium)',
                'Policies generated through promotion(No. of policies)',
                'Premium generated through promotion (Total Premium)',
                'Market Response Time ',
                'Incremental Policies',
                'Incremental Premium',
            ]);
            // Add data rows
            data.forEach((item, index) => {
                worksheet.addRow([
                    index + 1,
                    item.code,
                    item.discount.includes("%") ? `Percentage- ${item.discount}` : `Value- ${item.discount} AED`,
                    item.lob.map((item) => item.line_of_business_name).join(","),
                    item.startdate ? new Date(item.startdate).toLocaleDateString() : "-",
                    item.firstPolicyClosed ? new Date(item.firstPolicyClosed).toLocaleDateString() : "-",
                    item.leadWithoutDiscount,
                    item.premiumWithoutDiscount ? item.premiumWithoutDiscount.toFixed(2) : "-",
                    item.leadWithDiscount,
                    item.premiumWithDiscount ? item.premiumWithDiscount.toFixed(2) : "-",
                    item.marketResponseTime ? new Date(item.marketResponseTime).toLocaleDateString() : "-",
                    item.incrementalPolicies,
                    item.incrementalPremium,

                ]);
            });

            // Save Excel file
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), 'data.xlsx');
                resolve("Excel file downloaded successfully");
            });

        } catch (error) {
            console.log("error", error)
            alert("Failed to Export ");
        }
    }
    );
}
const PendingLeadsPolicies = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            const workbook = new Workbook();
            const worksheet = workbook.addWorksheet('Data');
            // Add header row
            worksheet.addRow([
                'Sr. No.',
                'Aging Period',
                'Aging Period for  Super Visor To Salse Advisor',
                'Aging Period for  Salse Advisor To Salse Advisor',
                'Aging Period for  Document Chaser To Policy Issuer'
            ]);
            // Add data rows
            data.forEach((item, index) => {
                worksheet.addRow([
                    index + 1,
                    item.agingPeriodInDay > 30 ? "30+ days " : item.agingPeriodInDay + " days",
                    item.agingPeriodForSupervisorToSA ? handledays(item.agingPeriodForSupervisorToSA) : "-",

                    item.agingPeriodForSAtoDC ? handledays(item.agingPeriodForSAtoDC) : "-",
                    item.agingPeriodForDCtoPI ? handledays(item.agingPeriodForDCtoPI) : "-",

                ]);
            });

            // Save Excel file
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), 'data.xlsx');
                resolve("Excel file downloaded successfully");
            });

        } catch (error) {
            console.log("error", error)
            alert("Failed to Export ");
        }
    }
    );
}
const AutoVsManualDealClose = async (newleaddata) => {
    return new Promise((resolve, reject) => {
        try {
            const workbook = new Workbook();
            const worksheet = workbook.addWorksheet('Data');
            // Add header row
            worksheet.addRow([
                'Sr. No.',
                'Total Number of Closed Deals',
                'Policies issued through Auto (No SA Intervention) ',
                'Policies issued Manually (SA Intervention)',
                'Auto vs. Manual'
            ])
            // Add data rows
            worksheet.addRow([
                newleaddata.totalLeadClosed ? newleaddata.totalLeadClosed.toFixed() : "-",
                newleaddata.autoLeadClosed ? newleaddata.autoLeadClosed.toFixed() : "-",
                newleaddata.manualLeadClosed ? newleaddata.manualLeadClosed.toFixed() : "-",
                newleaddata.autoVsManualRatio ? newleaddata.autoVsManualRatio.toFixed() + "%" : "-",
            ])
            // Save Excel file
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), 'data.xlsx');
                resolve("Excel file downloaded successfully");
            })
        } catch (error) {
            console.log("error", error)
            alert("Failed to Export ");
        }
    }
    );
}
// HighestLowestRate
const HighestLowestRateTravelPlan = async (data) => {
    console.log("travel>data", data);
    return new Promise((resolve, reject) => {
        try {
            const workbook = new Workbook();
            const worksheet = workbook.addWorksheet('Travel Insurance Plans');

            // Add headers for the entire worksheet
            const headers = headersData["travel"].map((item) => item.label);
            worksheet.addRow(headers);

            data.forEach((company, companyIndex) => {
                const startRowIndex = worksheet.lastRow.number + 1; // Start row index for the current company

                company?.plans?.forEach((plan) => {
                    plan?.travel_plan_prices?.forEach((price) => {
                        price?.no_of_days_or_topup?.forEach((dayRange) => {
                            const row = [
                                companyIndex + 1,
                                company.company_name,
                                plan.plan_name,
                                price.cover_type_id ? price.cover_type_id.travel_cover_type : '-',
                                `${dayRange.number_of_daysMin}-${dayRange.number_of_daysMax}`,
                                dayRange.travel_premium
                            ];
                            worksheet.addRow(row);
                        });
                    });
                });

                const endRowIndex = worksheet.lastRow.number; // End row index for the current company

                // Merge and center 'S.No' and 'Company Name' columns if there are multiple rows for the same company
                if (endRowIndex > startRowIndex) {
                    worksheet.mergeCells(startRowIndex, 1, endRowIndex, 1); // Merge 'S.No'
                    worksheet.mergeCells(startRowIndex, 2, endRowIndex, 2); // Merge 'Company Name'

                    // Center align merged cells
                    worksheet.getCell(startRowIndex, 1).alignment = { vertical: 'middle', horizontal: 'center' };
                    worksheet.getCell(startRowIndex, 2).alignment = { vertical: 'middle', horizontal: 'center' };
                }

                worksheet.addRow([]); // Add a blank row between companies
            });

            // Apply bold font to headers
            worksheet.getRow(1).font = { bold: true };

            // Auto-fit columns
            worksheet.columns.forEach((column) => {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, (cell) => {
                    const columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength) {
                        maxLength = columnLength;
                    }
                });
                column.width = maxLength + 2;
            });

            // Save Excel file
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), 'TravelInsurancePlans.xlsx');
            });
            resolve("Success");
        } catch (error) {
            console.error("Failed to Export: ", error);
            reject("Failed to Export");
        }
    });
};
const HighestLowestRateMotorPlan = async (data) => {
    console.log("motor>data", data);
    return new Promise((resolve, reject) => {
        try {
            const workbook = new Workbook();
            const worksheet = workbook.addWorksheet('Motor Insurance Plans');

            // Add headers for the worksheet
            const headers = headersData["motor"].map((item) => item.label);
            worksheet.addRow(headers);

            data.forEach((company, companyIndex) => {
                const comprehensivePlans = company?.comprehensive_plans || [];
                const tplPlans = company?.tpl_plans || [];

                const comprehensivePlanNames = comprehensivePlans.map(c => c.plan_name);
                const tplPlanNames = tplPlans.map(c => c.plan_name);

                const comprehensiveBodyTypes = comprehensivePlans.flatMap(c => c?.body_type?.map(b => b?.body_type_name)) || [];
                const tplBodyTypes = tplPlans.flatMap(c => c?.body_type?.map(b => b?.body_type_name)) || [];

                const comprehensiveRates = comprehensivePlans.flatMap(c => c?.rate?.map(b => b.premium || b.rate)) || [];
                const tplRates = tplPlans.flatMap(c => c?.rate?.map(b => b.premium || b.rate)) || [];

                const maxLength = Math.max(comprehensivePlanNames.length, tplPlanNames.length, comprehensiveBodyTypes.length, tplBodyTypes.length, comprehensiveRates.length, tplRates.length);

                // Start row index for current company data
                const startRowIndex = worksheet.lastRow.number + 1;

                for (let rowIndex = 0; rowIndex < maxLength; rowIndex++) {
                    const row = [
                        companyIndex + 1,
                        company.company_name,
                        comprehensivePlanNames[rowIndex] || "N/A",
                        tplPlanNames[rowIndex] || "N/A",
                        comprehensiveBodyTypes[rowIndex] || "N/A",
                        tplBodyTypes[rowIndex] || "N/A",
                        comprehensiveRates[rowIndex] || "N/A",
                        tplRates[rowIndex] || "N/A",
                    ];
                    worksheet.addRow(row);
                }

                const endRowIndex = startRowIndex + maxLength - 1;

                // Merge and center 'S.No' and 'Company Name' columns if there are multiple rows for the same company
                if (maxLength > 1) {
                    worksheet.mergeCells(startRowIndex, 1, endRowIndex, 1); // Merge 'S.No'
                    worksheet.mergeCells(startRowIndex, 2, endRowIndex, 2); // Merge 'Company Name'

                    // Center align merged cells
                    worksheet.getCell(startRowIndex, 1).alignment = { vertical: 'middle', horizontal: 'center' };
                    worksheet.getCell(startRowIndex, 2).alignment = { vertical: 'middle', horizontal: 'center' };
                }

                worksheet.addRow([]); // Add a blank row between companies
            });

            // Apply bold font to headers
            worksheet.getRow(1).font = { bold: true };

            // Auto-fit columns based on the content width
            worksheet.columns.forEach((column) => {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, (cell) => {
                    const columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength) {
                        maxLength = columnLength;
                    }
                });
                column.width = maxLength + 2;
            });

            // Save Excel file
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), 'MotorInsurancePlans.xlsx');
            });
            resolve("Success");
        } catch (error) {
            console.error("Failed to Export: ", error);
            reject("Failed to Export");
        }
    });
};
const HighestLowestRateYachtPlan = async (data) => {
    console.log("travel>data", data);
    return new Promise((resolve, reject) => {
        try {
            const workbook = new Workbook();
            const worksheet = workbook.addWorksheet('Yacht Insurance Plans');

            // Add headers for the entire worksheet
            const headers = headersData["yacht"].map((item) => item.label);
            worksheet.addRow(headers);

            data.forEach((company, companyIndex) => {
                const comprehensivePlans = company?.comprehensive_plans || [];
                const tplPlans = company?.tpl_plans || [];

                const comprehensivePlanNames = comprehensivePlans.map(c => c.plan_name);
                const tplPlanNames = tplPlans.map(c => c.plan_name);

                const comprehensiveBodyTypes = comprehensivePlans.flatMap(c => c?.yacht_body_type_or_topup?.map(b => b?.yacht_body_type)) || [];
                const tplBodyTypes = tplPlans.flatMap(c => c?.yacht_body_type_or_topup?.map(b => b?.yacht_body_type)) || [];

                const comprehensiveRates = comprehensivePlans.flatMap(c => c?.rate?.map(b => b)) || [];
                const tplRates = tplPlans.flatMap(c => c?.rate?.map(b => b.premium)) || [];

                const maxLength = Math.max(
                    comprehensivePlanNames.length,
                    tplPlanNames.length,
                    comprehensiveBodyTypes.length,
                    tplBodyTypes.length,
                    comprehensiveRates.length,
                    tplRates.length
                );

                // Start row index for merging
                let startRowIndex = worksheet.lastRow.number + 1;

                for (let rowIndex = 0; rowIndex < maxLength; rowIndex++) {
                    const row = [
                        companyIndex + 1,
                        company.company_name,
                        comprehensivePlanNames[rowIndex] || "N/A",
                        tplPlanNames[rowIndex] || "N/A",
                        comprehensiveBodyTypes[rowIndex] || "N/A",
                        tplBodyTypes[rowIndex] || "N/A",
                        comprehensiveRates[rowIndex] || "N/A",
                        tplRates[rowIndex] || "N/A",
                    ];
                    worksheet.addRow(row);
                }

                let endRowIndex = startRowIndex + maxLength - 1;

                // Merge and center cells if data is the same across rows
                if (maxLength > 1) {
                    worksheet.mergeCells(startRowIndex, 1, endRowIndex, 1);
                    worksheet.mergeCells(startRowIndex, 2, endRowIndex, 2);
                    worksheet.getCell(startRowIndex, 1).alignment = { vertical: 'middle', horizontal: 'center' };
                    worksheet.getCell(startRowIndex, 2).alignment = { vertical: 'middle', horizontal: 'center' };
                }

                worksheet.addRow([]); // Add a blank row between companies
            });

            // Apply bold font to headers
            worksheet.getRow(1).font = { bold: true };

            // Auto-fit columns
            worksheet.columns.forEach((column) => {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, (cell) => {
                    const columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength) {
                        maxLength = columnLength;
                    }
                });
                column.width = maxLength + 2;
            });

            // Save Excel file
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), 'YachtInsurancePlans.xlsx');
            });
            resolve("Success");
        } catch (error) {
            console.error("Failed to Export: ", error);
            reject("Failed to Export");
        }
    });
};

const HighestLowestRateHomePlan = async (data) => {
    console.log("travel>data", data);
    return new Promise((resolve, reject) => {
        try {
            const workbook = new Workbook();
            const worksheet = workbook.addWorksheet('Home Insurance Plans'); // Updated sheet name

            // Add headers for the entire worksheet
            const headers = headersData["home"].map((item) => item.label);
            worksheet.addRow(headers);

            let currentRow = 2; // Start from the second row (first row is headers)

            data.forEach((company, companyIndex) => {
                const planNames = company?.plans?.map(c => c.plan_name) || [];
                const propertyTypes = company?.plans?.flatMap(c => c?.property_type_id?.map(b => b?.label)) || [];
                const buildingValues = company?.plans?.flatMap(c => c?.building_value_or_topup?.map(b => b.rate)) || [];
                const maxLength = Math.max(planNames.length, propertyTypes.length, buildingValues.length);

                const startRowIndex = currentRow; // Record the starting row for the current company

                for (let rowIndex = 0; rowIndex < maxLength; rowIndex++) {
                    const row = [
                        rowIndex === 0 ? companyIndex + 1 : '', // Company index for the first row only
                        rowIndex === 0 ? company.company_name : '', // Company name for the first row only
                        planNames[rowIndex] || "N/A",
                        propertyTypes[rowIndex] || "N/A",
                        buildingValues[rowIndex] || "N/A",
                    ];
                    worksheet.addRow(row);
                    currentRow++;
                }

                const endRowIndex = currentRow - 1; // Calculate the ending row for the current company

                // Merge and center cells in columns A and B if there are multiple rows for the company
                if (maxLength > 1) {
                    // Merge cells in the first column (Company Index)
                    worksheet.mergeCells(`A${startRowIndex}:A${endRowIndex}`);
                    // Merge cells in the second column (Company Name)
                    worksheet.mergeCells(`B${startRowIndex}:B${endRowIndex}`);

                    // Center alignment for the merged cells in the first column
                    worksheet.getCell(`A${startRowIndex}`).alignment = { vertical: 'middle', horizontal: 'center' };
                    // Center alignment for the merged cells in the second column
                    worksheet.getCell(`B${startRowIndex}`).alignment = { vertical: 'middle', horizontal: 'center' };
                }

                // Add a blank row between companies for better readability
                worksheet.addRow([]);
                currentRow++;
            });

            // Apply bold font to headers
            worksheet.getRow(1).font = { bold: true };

            // Auto-fit columns based on the maximum length of data in each column
            worksheet.columns.forEach((column) => {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, (cell) => {
                    const columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength) {
                        maxLength = columnLength;
                    }
                });
                column.width = maxLength + 2;
            });

            // Save Excel file
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), 'HomeInsurancePlans.xlsx'); // Updated file name
            });
            resolve("Success");
        } catch (error) {
            console.error("Failed to Export: ", error);
            reject("Failed to Export");
        }
    });
};
const HighestLowestRateMedical = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            const workbook = new Workbook();
            const worksheet = workbook.addWorksheet('Medical Plans');

            // Define headers
            const headers = [
                'S.No',
                'Company Name',
                'Plan Name',
                'Male Premium',
                'Female Premium',
                'Married Female Premium',
            ];
            worksheet.addRow(headers);

            data.forEach((val, i) => {
                const planNames = val?.plans?.map(plan => plan.plan_name) || [];
                const rates = val?.plans?.flatMap(plan =>
                    plan.rates.map(rate => ({
                        malePremium: rate.primiumArray?.map(p => p.malePre).join(', ') || "N/A",
                        femalePremium: rate.primiumArray?.map(p => p.femalePer).join(', ') || "N/A",
                        marriedFemalePremium: rate.primiumArray?.map(p => p.marrideFemalePre).join(', ') || "N/A",
                    }))
                ) || [];

                const maxLength = Math.max(planNames.length, rates.length);
                const startRowIndex = worksheet.lastRow.number + 1;

                for (let rowIndex = 0; rowIndex < maxLength; rowIndex++) {
                    const row = [
                        rowIndex === 0 ? i + 1 : '',
                        rowIndex === 0 ? val.company_name || "N/A" : '',
                        planNames[rowIndex] || "N/A",
                        rates[rowIndex]?.malePremium || "N/A",
                        rates[rowIndex]?.femalePremium || "N/A",
                        rates[rowIndex]?.marriedFemalePremium || "N/A",
                    ];
                    worksheet.addRow(row);
                }

                const endRowIndex = worksheet.lastRow.number;

                // Merge and center 'S.No' and 'Company Name' if there are multiple rows for the same company
                if (endRowIndex > startRowIndex) {
                    worksheet.mergeCells(startRowIndex, 1, endRowIndex, 1); // Merge 'S.No'
                    worksheet.mergeCells(startRowIndex, 2, endRowIndex, 2); // Merge 'Company Name'

                    // Center align merged cells
                    worksheet.getCell(startRowIndex, 1).alignment = { vertical: 'middle', horizontal: 'center' };
                    worksheet.getCell(startRowIndex, 2).alignment = { vertical: 'middle', horizontal: 'center' };
                }

                worksheet.addRow([]); // Add a blank row between companies
            });

            // Apply bold font to headers
            worksheet.getRow(1).font = { bold: true };

            // Auto-fit columns
            worksheet.columns.forEach((column) => {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, (cell) => {
                    const columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength) {
                        maxLength = columnLength;
                    }
                });
                column.width = maxLength + 2;
            });

            // Save Excel file
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), 'MedicalPlans.xlsx');
            });
            resolve("Success");
        } catch (error) {
            console.error("Failed to Export: ", error);
            reject("Failed to Export");
        }
    });
};
const HighestLowestRate = async (data) => {
    try {
        if (data && data.length > 0) {
            await Promise.all(data.map(async (property) => {
                if (property && Object.keys(property).length > 0) {
                    await Promise.all(Object.keys(property).map(async (lobname) => {
                        const item = property[lobname];
                        if (item && Array.isArray(item) && item.length > 0) {
                            switch (lobname) {
                                case "travel":
                                    await HighestLowestRateTravelPlan(item)
                                    break;
                                case "motor":
                                    await HighestLowestRateMotorPlan(item)
                                    break;
                                case "yacht":
                                    await HighestLowestRateYachtPlan(item)
                                    break;
                                case "home":
                                    await HighestLowestRateHomePlan(item)
                                    break;
                                case "medical":
                                    await HighestLowestRateMedical(item)
                                    break;
                                default:
                                    ''
                            }


                        } else {
                            return '';
                        }
                    }));
                    return ``
                } else {
                    return ``;
                }
            }));
            return '';
        } else {
            console.log("rows not found");
            return '';
        }
    } catch (error) {
        console.log("error in AllRowsAndTable", error);
        throw error;
    }
};
// end HighestLowestRate
// AveragerateRate
const AveragerateRateTravelPlan = async (data) => {
    console.log("travel>data", data);
    return new Promise((resolve, reject) => {
        try {
            const workbook = new Workbook();
            const worksheet = workbook.addWorksheet('Travel Insurance Plans');

            // Add headers for the entire worksheet
            const headers = averaherateheadersData["travel"].map((item) => item.label);
            worksheet.addRow(headers);

            data.forEach((company, companyIndex) => {
                const startRowIndex = worksheet.lastRow.number + 1; // Start row index for the current company

                company?.plans?.forEach((plan) => {
                    plan?.travel_plan_prices?.forEach((price) => {
                        price?.no_of_days_or_topup?.forEach((dayRange) => {
                            const row = [
                                companyIndex + 1,
                                company.company_name,
                                plan.plan_name,
                                price.cover_type_id ? price.cover_type_id.travel_cover_type : '-',
                                `${dayRange.number_of_daysMin}-${dayRange.number_of_daysMax}`,
                                dayRange.travel_premium
                            ];
                            worksheet.addRow(row);
                        });
                    });
                });

                const endRowIndex = worksheet.lastRow.number; // End row index for the current company

                // Merge and center 'S.No' and 'Company Name' columns if there are multiple rows for the same company
                if (endRowIndex > startRowIndex) {
                    worksheet.mergeCells(startRowIndex, 1, endRowIndex, 1); // Merge 'S.No'
                    worksheet.mergeCells(startRowIndex, 2, endRowIndex, 2); // Merge 'Company Name'

                    // Center align merged cells
                    worksheet.getCell(startRowIndex, 1).alignment = { vertical: 'middle', horizontal: 'center' };
                    worksheet.getCell(startRowIndex, 2).alignment = { vertical: 'middle', horizontal: 'center' };
                }

                worksheet.addRow([]); // Add a blank row between companies
            });

            // Apply bold font to headers
            worksheet.getRow(1).font = { bold: true };

            // Auto-fit columns
            worksheet.columns.forEach((column) => {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, (cell) => {
                    const columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength) {
                        maxLength = columnLength;
                    }
                });
                column.width = maxLength + 2;
            });

            // Save Excel file
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), 'TravelInsurancePlans.xlsx');
            });
            resolve("Success");
        } catch (error) {
            console.error("Failed to Export: ", error);
            reject("Failed to Export");
        }
    });
};
const AveragerateRateMotorPlan = async (data) => {
    console.log("motor>data", data);
    return new Promise((resolve, reject) => {
        try {
            const workbook = new Workbook();
            const worksheet = workbook.addWorksheet('Motor Insurance Plans');

            // Add headers for the worksheet
            const headers = averaherateheadersData["motor"].map((item) => item.label);
            worksheet.addRow(headers);

            data.forEach((company, companyIndex) => {
                const comprehensivePlans = company?.comprehensive_plans || [];
                const tplPlans = company?.tpl_plans || [];

                const comprehensivePlanNames = comprehensivePlans.map(c => c.plan_name);
                const tplPlanNames = tplPlans.map(c => c.plan_name);

                const comprehensiveBodyTypes = comprehensivePlans.flatMap(c => c?.body_type?.map(b => b?.body_type_name)) || [];
                const tplBodyTypes = tplPlans.flatMap(c => c?.body_type?.map(b => b?.body_type_name)) || [];

                const comprehensiveRates = comprehensivePlans.flatMap(c => c?.rate?.map(b => b.premium || b.rate)) || [];
                const tplRates = tplPlans.flatMap(c => c?.rate?.map(b => b.premium || b.rate)) || [];
                const comprehensiveLeads = comprehensivePlans.flatMap(c => c?.leads) || [];
                const tplLeads = tplPlans.flatMap(c => c?.leads) || [];
                const filtercomprehensiveRates = comprehensiveRates.filter((item) => {
                    if (!item.includes("%")) {
                        item = +item
                        return item
                    } else {
                        return false
                    }
                })
                const filtertplRates = tplRates.filter((item) => {
                    console.log("item", item)
                    if (typeof item == "string" && !item.includes("%")) {
                        item = +item
                        return item
                    }
                    if (typeof item == "number") {
                        return item
                    }
                    else {
                        return false
                    }
                })
                const comprehensiveAverageRate = filtercomprehensiveRates.reduce((a, b) => {
                    return a + b
                }, 0) / (comprehensiveLeads.length || 1);
                const tplAverageRate = filtertplRates.reduce((a, b) => a + b, 0) / (tplLeads.length || 1);
                const maxLength = Math.max(comprehensivePlanNames.length, tplPlanNames.length, comprehensiveBodyTypes.length, tplBodyTypes.length, comprehensiveRates.length, tplRates.length);

                // Start row index for current company data
                const startRowIndex = worksheet.lastRow.number + 1;

                for (let rowIndex = 0; rowIndex < maxLength; rowIndex++) {
                    const row = [
                        companyIndex + 1,
                        company.company_name,
                        comprehensivePlanNames[rowIndex] || "N/A",
                        tplPlanNames[rowIndex] || "N/A",
                        comprehensiveBodyTypes[rowIndex] || "N/A",
                        tplBodyTypes[rowIndex] || "N/A",
                        comprehensiveRates[rowIndex] || "N/A",
                        tplRates[rowIndex] || "N/A",
                        comprehensiveAverageRate || "N/A",
                        tplAverageRate || "N/A"

                    ];
                    worksheet.addRow(row);
                }

                const endRowIndex = startRowIndex + maxLength - 1;

                // Merge and center 'S.No' and 'Company Name' columns if there are multiple rows for the same company
                if (maxLength > 1) {
                    worksheet.mergeCells(startRowIndex, 1, endRowIndex, 1); // Merge 'S.No'
                    worksheet.mergeCells(startRowIndex, 2, endRowIndex, 2); // Merge 'Company Name'

                    // Center align merged cells
                    worksheet.getCell(startRowIndex, 1).alignment = { vertical: 'middle', horizontal: 'center' };
                    worksheet.getCell(startRowIndex, 2).alignment = { vertical: 'middle', horizontal: 'center' };
                }

                worksheet.addRow([]); // Add a blank row between companies
            });

            // Apply bold font to headers
            worksheet.getRow(1).font = { bold: true };

            // Auto-fit columns based on the content width
            worksheet.columns.forEach((column) => {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, (cell) => {
                    const columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength) {
                        maxLength = columnLength;
                    }
                });
                column.width = maxLength + 2;
            });

            // Save Excel file
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), 'MotorInsurancePlans.xlsx');
            });
            resolve("Success");
        } catch (error) {
            console.error("Failed to Export: ", error);
            reject("Failed to Export");
        }
    });
};
const AveragerateRateYachtPlan = async (data) => {
    console.log("travel>data", data);
    return new Promise((resolve, reject) => {
        try {
            const workbook = new Workbook();
            const worksheet = workbook.addWorksheet('Yacht Insurance Plans');

            // Add headers for the entire worksheet
            const headers = averaherateheadersData["yacht"].map((item) => item.label);
            worksheet.addRow(headers);

            data.forEach((company, companyIndex) => {
                const comprehensivePlans = company?.comprehensive_plans || [];
                const tplPlans = company?.tpl_plans || [];

                const comprehensivePlanNames = comprehensivePlans.map(c => c.plan_name);
                const tplPlanNames = tplPlans.map(c => c.plan_name);

                const comprehensiveBodyTypes = comprehensivePlans.flatMap(c => c?.yacht_body_type_or_topup?.map(b => b?.yacht_body_type)) || [];
                const tplBodyTypes = tplPlans.flatMap(c => c?.yacht_body_type_or_topup?.map(b => b?.yacht_body_type)) || [];

                const comprehensiveRates = comprehensivePlans.flatMap(c => c?.rate?.map(b => b)) || [];
                const tplRates = tplPlans.flatMap(c => c?.rate?.map(b => b.premium)) || [];
                const comprehensiveLeads = comprehensivePlans.flatMap(c => c?.leads) || [];
                const tplLeads = tplPlans.flatMap(c => c?.leads) || [];
                const filtercomprehensiveRates = comprehensiveRates.filter((item) => {
                    if (!item.includes("%")) {
                        item = +item
                        return item
                    } else {
                        return false
                    }
                })
                const filtertplRates = tplRates.filter((item) => {
                    console.log("item", item)
                    if (typeof item == "string" && !item.includes("%")) {
                        item = +item
                        return item
                    }
                    if (typeof item == "number") {
                        return item
                    }
                    else {
                        return false
                    }
                })
                const comprehensiveAverageRate = filtercomprehensiveRates.reduce((a, b) => {
                    return a + b
                }, 0) / (comprehensiveLeads.length || 1);
                const tplAverageRate = filtertplRates.reduce((a, b) => a + b, 0) / (tplLeads.length || 1);
                const maxLength = Math.max(
                    comprehensivePlanNames.length,
                    tplPlanNames.length,
                    comprehensiveBodyTypes.length,
                    tplBodyTypes.length,
                    comprehensiveRates.length,
                    tplRates.length
                );

                // Start row index for merging
                let startRowIndex = worksheet.lastRow.number + 1;

                for (let rowIndex = 0; rowIndex < maxLength; rowIndex++) {
                    const row = [
                        companyIndex + 1,
                        company.company_name,
                        comprehensivePlanNames[rowIndex] || "N/A",
                        tplPlanNames[rowIndex] || "N/A",
                        comprehensiveBodyTypes[rowIndex] || "N/A",
                        tplBodyTypes[rowIndex] || "N/A",
                        comprehensiveRates[rowIndex] || "N/A",
                        tplRates[rowIndex] || "N/A",
                        comprehensiveAverageRate || "N/A",
                        tplAverageRate || "N/A"
                    ];
                    worksheet.addRow(row);
                }

                let endRowIndex = startRowIndex + maxLength - 1;

                // Merge and center cells if data is the same across rows
                if (maxLength > 1) {
                    worksheet.mergeCells(startRowIndex, 1, endRowIndex, 1);
                    worksheet.mergeCells(startRowIndex, 2, endRowIndex, 2);
                    worksheet.getCell(startRowIndex, 1).alignment = { vertical: 'middle', horizontal: 'center' };
                    worksheet.getCell(startRowIndex, 2).alignment = { vertical: 'middle', horizontal: 'center' };
                }

                worksheet.addRow([]); // Add a blank row between companies
            });

            // Apply bold font to headers
            worksheet.getRow(1).font = { bold: true };

            // Auto-fit columns
            worksheet.columns.forEach((column) => {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, (cell) => {
                    const columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength) {
                        maxLength = columnLength;
                    }
                });
                column.width = maxLength + 2;
            });

            // Save Excel file
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), 'YachtInsurancePlans.xlsx');
            });
            resolve("Success");
        } catch (error) {
            console.error("Failed to Export: ", error);
            reject("Failed to Export");
        }
    });
};

const AveragerateRateHomePlan = async (data) => {
    console.log("travel>data", data);
    return new Promise((resolve, reject) => {
        try {
            const workbook = new Workbook();
            const worksheet = workbook.addWorksheet('Home Insurance Plans'); // Updated sheet name

            // Add headers for the entire worksheet
            const headers = averaherateheadersData["home"].map((item) => item.label);
            worksheet.addRow(headers);

            let currentRow = 2; // Start from the second row (first row is headers)

            data.forEach((company, companyIndex) => {
                const planNames = company?.plans?.map(c => c.plan_name) || [];
                const propertyTypes = company?.plans?.flatMap(c => c?.property_type_id?.map(b => b?.label)) || [];
                const buildingValues = company?.plans?.flatMap(c => c?.building_value_or_topup?.map(b => b.rate)) || [];
                const maxLength = Math.max(planNames.length, propertyTypes.length, buildingValues.length);
                const Leads = buildingValues.flatMap(c => c?.leads) || [];
                const filtercomprehensiveRates = buildingValues.filter((item) => {
                    if (!item.includes("%")) {
                        item = +item
                        return item
                    } else {
                        return false
                    }
                })

                const AverageRate = filtercomprehensiveRates.reduce((a, b) => {
                    return a + b
                }, 0) / (Leads.length || 1);
                const startRowIndex = currentRow; // Record the starting row for the current company

                for (let rowIndex = 0; rowIndex < maxLength; rowIndex++) {
                    const row = [
                        rowIndex === 0 ? companyIndex + 1 : '', // Company index for the first row only
                        rowIndex === 0 ? company.company_name : '', // Company name for the first row only
                        planNames[rowIndex] || "N/A",
                        propertyTypes[rowIndex] || "N/A",
                        buildingValues[rowIndex] || "N/A",
                        AverageRate || "N/A",
                    ];
                    worksheet.addRow(row);
                    currentRow++;
                }

                const endRowIndex = currentRow - 1; // Calculate the ending row for the current company

                // Merge and center cells in columns A and B if there are multiple rows for the company
                if (maxLength > 1) {
                    // Merge cells in the first column (Company Index)
                    worksheet.mergeCells(`A${startRowIndex}:A${endRowIndex}`);
                    // Merge cells in the second column (Company Name)
                    worksheet.mergeCells(`B${startRowIndex}:B${endRowIndex}`);

                    // Center alignment for the merged cells in the first column
                    worksheet.getCell(`A${startRowIndex}`).alignment = { vertical: 'middle', horizontal: 'center' };
                    // Center alignment for the merged cells in the second column
                    worksheet.getCell(`B${startRowIndex}`).alignment = { vertical: 'middle', horizontal: 'center' };
                }

                // Add a blank row between companies for better readability
                worksheet.addRow([]);
                currentRow++;
            });

            // Apply bold font to headers
            worksheet.getRow(1).font = { bold: true };

            // Auto-fit columns based on the maximum length of data in each column
            worksheet.columns.forEach((column) => {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, (cell) => {
                    const columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength) {
                        maxLength = columnLength;
                    }
                });
                column.width = maxLength + 2;
            });

            // Save Excel file
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), 'HomeInsurancePlans.xlsx'); // Updated file name
            });
            resolve("Success");
        } catch (error) {
            console.error("Failed to Export: ", error);
            reject("Failed to Export");
        }
    });
};
const AveragerateRateMedical = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            const workbook = new Workbook();
            const worksheet = workbook.addWorksheet('Medical Plans');

            // Define headers
            const headers = [
                'S.No',
                'Company Name',
                'Plan Name',
                'Male Premium',
                'Female Premium',
                'Married Female Premium',
            ];
            worksheet.addRow(headers);

            data.forEach((val, i) => {
                const planNames = val?.plans?.map(plan => plan.plan_name) || [];
                const rates = val?.plans?.flatMap(plan =>
                    plan.rates.map(rate => ({
                        malePremium: rate.primiumArray?.map(p => p.malePre).join(', ') || "N/A",
                        femalePremium: rate.primiumArray?.map(p => p.femalePer).join(', ') || "N/A",
                        marriedFemalePremium: rate.primiumArray?.map(p => p.marrideFemalePre).join(', ') || "N/A",
                    }))
                ) || [];

                const maxLength = Math.max(planNames.length, rates.length);
                const startRowIndex = worksheet.lastRow.number + 1;

                for (let rowIndex = 0; rowIndex < maxLength; rowIndex++) {
                    const row = [
                        rowIndex === 0 ? i + 1 : '',
                        rowIndex === 0 ? val.company_name || "N/A" : '',
                        planNames[rowIndex] || "N/A",
                        rates[rowIndex]?.malePremium || "N/A",
                        rates[rowIndex]?.femalePremium || "N/A",
                        rates[rowIndex]?.marriedFemalePremium || "N/A",
                    ];
                    worksheet.addRow(row);
                }

                const endRowIndex = worksheet.lastRow.number;

                // Merge and center 'S.No' and 'Company Name' if there are multiple rows for the same company
                if (endRowIndex > startRowIndex) {
                    worksheet.mergeCells(startRowIndex, 1, endRowIndex, 1); // Merge 'S.No'
                    worksheet.mergeCells(startRowIndex, 2, endRowIndex, 2); // Merge 'Company Name'

                    // Center align merged cells
                    worksheet.getCell(startRowIndex, 1).alignment = { vertical: 'middle', horizontal: 'center' };
                    worksheet.getCell(startRowIndex, 2).alignment = { vertical: 'middle', horizontal: 'center' };
                }

                worksheet.addRow([]); // Add a blank row between companies
            });

            // Apply bold font to headers
            worksheet.getRow(1).font = { bold: true };

            // Auto-fit columns
            worksheet.columns.forEach((column) => {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, (cell) => {
                    const columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength) {
                        maxLength = columnLength;
                    }
                });
                column.width = maxLength + 2;
            });

            // Save Excel file
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), 'MedicalPlans.xlsx');
            });
            resolve("Success");
        } catch (error) {
            console.error("Failed to Export: ", error);
            reject("Failed to Export");
        }
    });
};
const AveragerateRate = async (data) => {
    try {
        if (data && data.length > 0) {
            await Promise.all(data.map(async (property) => {
                if (property && Object.keys(property).length > 0) {
                    await Promise.all(Object.keys(property).map(async (lobname) => {
                        const item = property[lobname];
                        if (item && Array.isArray(item) && item.length > 0) {

                            switch (lobname) {
                                case "travel":
                                    await AveragerateRateTravelPlan(item)
                                    break;
                                case "motor":
                                    await AveragerateRateMotorPlan(item)
                                    break;
                                case "yacht":
                                    await AveragerateRateYachtPlan(item)
                                    break;
                                case "home":
                                    await AveragerateRateHomePlan(item)
                                    break;
                                case "medical":
                                    await AveragerateRateMedical(item)
                                    break;
                                default:
                                    ''
                            }


                        } else {
                            return '';
                        }
                    }));
                    return ``
                } else {
                    return ``;
                }
            }));
            return '';
        } else {
            console.log("rows not found");
            return '';
        }
    } catch (error) {
        console.log("error in AllRowsAndTable", error);
        throw error;
    }
};
const MISExcelDownload = {
    performanceReport, ClosingrationReport,
    SpecialIncentiveToCustomerWithoght, MarketResponseVsDiscount,
    PendingLeadsPolicies, AutoVsManualDealClose,
    SpecialIncentive, SpecialIncentiveToCustomerWith,
    MostActiveTimePeriod, MostProductiveDayOFtheWeek, HighestLowestRate, AveragerateRate

}


export { MISExcelDownload };