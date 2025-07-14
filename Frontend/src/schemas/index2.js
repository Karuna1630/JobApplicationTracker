import * as Yup from 'yup';


const PasswordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
export const CompanyUserSchema = Yup.object({
    firstName: Yup.string().min(2).required("please enter your FirstName"),
    lastName: Yup.string().min(2).required("please enter your LastName"),
    email: Yup.string().email("please enter valid email").required("please enter your email"),
    phoneNumber: Yup.string().matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits").required("please enter your mobile number"),
    password: Yup.string().matches(PasswordRegex,"please enter valid password ").required("please enter your password"),
    confirmPassword: Yup.string().oneOf([Yup.ref("password")], "password do not match").required("please enter confrim password")
   
})