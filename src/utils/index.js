function Rate(total, num) {
    let rateStr = num.rate;
    let rateValue = 0;

    // Check if the rate includes a percentage sign
    if (!rateStr.includes("%")) {
        // Convert the rate to a numeric value
        rateValue = parseFloat(rateStr);

        // Add the numeric rate to the total
        total += rateValue;
    }

    // If the rate includes a percentage sign, it will be ignored
    return total;
}

const RateCalculator = (items) => {
    try {
        let total = 0;
        if (items && items.length > 0) {
            console.log("items", items)
            items.forEach((data) => {
                if (data.rate) {
                    // Calculate the total rate for the current comprehensive plan
                    let planTotal = data.rate.reduce(Rate, 0);
                    total += planTotal;
                }
            })
            return total;
        } else {
            return total;
        }



    } catch (error) {
        return 0
    }
};
const TotalLeadCount = (items) => {
    try {
        if (items && items.length > 0) {
            // Return the result of reduce
            return items.reduce((initialValue, l) => {
                console.log("leads length", l.leads ? l.leads.length : 0)
                console.log("leads", l.leads)
                // Add the length of leads to the initial value, if leads exist
                return initialValue + (l.leads ? l.leads.length : 0);
            }, 0);
        } else {
            // Return 0 if items is empty or undefined
            return 0;
        }
    } catch (error) {
        console.log(error);
        return 0;
    }
};

export { RateCalculator, TotalLeadCount }