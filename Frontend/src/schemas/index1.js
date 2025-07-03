import * as Yup from "yup";

export const companyRegister = Yup.object({
  company: Yup.object({
    companyName: Yup.string()
      .min(3, "Company name must be at least 3 characters")
      .required("please enter company name"),

    companyLogo: Yup.mixed()
      .required("please upload your company logo"),

    website: Yup.string()
      .url("Invalid URL").required("please enter URL of your company"),

    location: Yup.string()
      .min(5, "Location must be at least 5 characters")
      .required("please enter description about your company"),

    description: Yup.string()
      .min(5, "Description must be at least 5 characters")
      .required("please enter description about your company")

    // industryId: Yup.string().required("Please select an industry"),
  }),
});
