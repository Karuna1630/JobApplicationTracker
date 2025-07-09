import * as Yup from "yup";

export const companyRegister = Yup.object({
  company: Yup.object({
    companyName: Yup.string()
      .min(3, "Company name must be at least 3 characters")
      .required("please enter company name"),
      
    location: Yup.string()
      .min(5, "Location must be at least 5 characters")
      .required("please enter location of your company"),

    description: Yup.string()
      .min(5, "Description must be at least 5 characters")
      .required("please enter description about your company")

    // industryId: Yup.string().required("Please select an industry"),
  }),
});
