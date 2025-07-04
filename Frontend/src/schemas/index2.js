import * as Yup from 'yup';


const PasswordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
export const CompanyUserSchema = Yup.object({
    personName: Yup.string().min(5).required("please enter your name"),
    email: Yup.string().email("please enter valid email").required("please enter your email"),
    number: Yup.string().matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits").required("please enter your mobile number"),
    password: Yup.string().matches(PasswordRegex,"please enter valid password ").required("please enter your password"),
    confirmPassword: Yup.string().oneOf([Yup.ref("password")], "password do not match").required("please enter confrim password")
   
})