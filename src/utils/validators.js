import * as Yup from 'yup';


const ValidatreAddSpecialIntive = async (data) => {
    try {
        const AddSpecialIntiveSchema = Yup.object().shape({
            description: Yup.string().required('description is required'),
            locations: Yup.array().min(1).required('locations is required'),
            lobs: Yup.array().min(1).required('lobs is required'),
            roles: Yup.array().min(1).required('roles is required'),
            users: Yup.array().min(1).required('users is required'),
            start_time: Yup.date()
                .required('Start date is required')
                .typeError('Start date must be a valid date').test("past date time", "Start date can't be in past", function (value) {
                    const d1 = new Date();
                    const d2 = new Date(value);
                    return d1.getTime() < d2.getTime();
                })

            ,
            end_time: Yup.date()
                .required('End date is required')
                .typeError('End date must be a valid date')
                .min(Yup.ref('start_time'), "End date can't be before start date")
                .test('not-equal', "End date and time can't be equal to start date and time", function (value) {
                    const { start_time } = this.parent;
                    const d1 = new Date(start_time);
                    const d2 = new Date(value);
                    return d1.getTime() !== d2.getTime();
                }).test("past date time", "End date and time can't be in past", function (value) {
                    const d1 = new Date();
                    const d2 = new Date(value);
                    console.log("d1", d1.getTime(), "d2", d2.getTime())
                    console.log('past date time', d1.getTime() <= d2.getTime())
                    return d1.getTime() < d2.getTime();
                }),
            policy_type: Yup.string().required('policy type is required'),
            policies_about: Yup.string().required('policy closed value is required'),
            incentive_type: Yup.string().required('incentive type is required'),
            incentive_amount: Yup.string().required('incentive amount is required'),
        })
        await AddSpecialIntiveSchema.validate(data, { abortEarly: false });
        return { isValid: true, errors: null }
    } catch (error) {
        return { isValid: false, errors: error.errors }
    }
}
export { ValidatreAddSpecialIntive }
