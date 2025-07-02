import * as Yup from 'yup';


const PasswordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
export const RegisterSchema = Yup.object({
    FirstName: Yup.string().min(5).required("please enter your first name"),
    LastName: Yup.string().min(3).required("please enter your last name"),
    Email: Yup.string().email("please enter valid email").required("please enter your name"),
    MobileNo: Yup.string().matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits").required("please enter ypur mobile number"),
    Password: Yup.string().matches(PasswordRegex,"please enter valid password ").required("please enter your password"),
    ConfirmPassword: Yup.string().oneOf([Yup.ref("Password")], "password do not match").required("please enter confrim password")
})