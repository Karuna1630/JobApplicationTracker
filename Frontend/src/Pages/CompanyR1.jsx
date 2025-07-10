import { useNavigate } from "react-router-dom";
import crlogo from "../assets/CR.avif";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Formik, Form, Field } from "formik";
import { companyRegister } from "../schemas/index1";
import { toast } from "react-toastify";

const CompanyR1 = () => {
  const navigate = useNavigate();

  const initialValues = {
    company: {
      companyName: "",
      location: "",
      description: "",
    },
  };

  const onSubmit = async (values, actions) => {
    try {
      localStorage.setItem("companyData", JSON.stringify(values.company));
      navigate("/companyR2");
    } catch (error) {
      console.error("Failed to store company data:", error);
      toast.error("Something went wrong while saving company data.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen font-sans flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 p-10">
        <div className="flex w-full max-w-6xl shadow-lg rounded-lg overflow-hidden">
          <div className="hidden md:block md:w-1/2">
            <img src={crlogo} className="object-cover w-full h-full" alt="Company" />
          </div>

          <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
            <div className="max-w-sm w-full">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">2 easy steps of Company Registration</h2>
                <div className="flex justify-center items-center mt-6 relative">
                  <div className="flex flex-col items-center z-10">
                    <div className="h-10 w-10 rounded-full bg-white text-black border border-black flex items-center justify-center">
                      1
                    </div>
                    <span className="text-sm mt-1 font-medium">Organization</span>
                  </div>
                  <div className="w-1/3 h-0.5 bg-green-500 mx-2"></div>
                  <div className="flex flex-col items-center z-10">
                    <div className="h-10 w-10 rounded-full bg-white text-black border border-black flex items-center justify-center">
                      2
                    </div>
                    <span className="text-sm mt-1 font-medium">Sign Up</span>
                  </div>
                </div>
                <div className="pt-4">
                  <h2 className="text-xl font-bold">Organization Information</h2>
                  <p className="text-sm text-gray-600">Provide your company details</p>
                </div>
              </div>

              <Formik initialValues={initialValues} validationSchema={companyRegister} onSubmit={onSubmit}>
                {({ errors, touched }) => (
                  <Form className="space-y-5">
                    <Field
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
                      type="text"
                      name="company.companyName"
                      placeholder="Company Name"
                    />
                    {errors.company?.companyName && touched.company?.companyName && (
                      <p className="text-red-600 text-sm mt-1 ml-1 font-medium">
                        {errors.company.companyName}
                      </p>
                    )}

                    <Field
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
                      type="text"
                      name="company.location"
                      placeholder="Location"
                    />
                    {errors.company?.location && touched.company?.location && (
                      <p className="text-red-600 text-sm mt-1 ml-1 font-medium">
                        {errors.company.location}
                      </p>
                    )}

                    <Field
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
                      type="text"
                      name="company.description"
                      placeholder="Description"
                    />
                    {errors.company?.description && touched.company?.description && (
                      <p className="text-red-600 text-sm mt-1 ml-1 font-medium">
                        {errors.company.description}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-800 transition"
                    >
                      Continue
                    </button>

                    <p className="text-center text-sm mt-4">
                      Already have a company account?{" "}
                      <a href="/login" className="text-blue-600 hover:underline">
                        Login Here
                      </a>
                    </p>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CompanyR1;
