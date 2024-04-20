import React, { useState, useEffect, useTransition } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { NumericFormat } from "react-number-format";
import ReactDatePicker from "react-datepicker";
import { toast } from "sonner";
import { useRouter, redirect } from "next/navigation";
import DataService from "@/lib/fetch";
import { dateFormatter } from "@/utils/functions/utils";

const Expense = ({ onClose }) => {
  const [budgets, setBudgets] = useState([]);
  const [load, setReload] = useState(false);
  const [isPending, setTransition] = useTransition();

  const fetchBudets = async () => {
    try {
      const response = await DataService.getDataNoAuth("/budget/api");
      setBudgets(response);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  useEffect(() => {
    setTransition(async () => await fetchBudets());
  }, []);

  const router = useRouter();
  const newExpense = {
    description: null,
    amount: null,
    date: null,
    budget: null,
  };

  const validationSchema = Yup.object().shape({
    description: Yup.string().required("Budget name is required"),
    amount: Yup.number()
      .required("Amount is required")
      .min(1, "Amount must be greater than or equal to 0"),
    budget: Yup.string().required("Category is required"),
    date: Yup.date().required("Date is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      const response = await DataService.postDataNoAuth(
        "/dashboard/api",
        values
      );
      toast.success(response);
      onClose();
      setSubmitting(false);
      router.refresh();
    } catch (error) {
      toast.error(error);
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-md p-8 w-4/5 max-w-md">
        <h2 className="text-lg font-semibold mb-4">Add Expense</h2>
        <Formik
          initialValues={newExpense}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, setFieldValue, isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <Field
                  type="text"
                  id="description"
                  name="description"
                  className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-lg border-gray-300 rounded-md ${
                    errors.description && touched.description
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <ErrorMessage
                  name="description"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Expense Amount
                </label>

                <NumericFormat
                  name={`amount`}
                  value={values.amount}
                  thousandSeparator={true}
                  min={0}
                  prefix={"₦"}
                  onValueChange={(values) => {
                    const { value } = values;
                    setFieldValue("amount", value);
                  }}
                  className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-lg border-gray-300 rounded-md ${
                    errors.budgetamount && touched.budgetamount
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <ErrorMessage
                  name="amount"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Date
                </label>
                <Field
                  id="date"
                  name="date"
                  placeholder="Select Date"
                  render={({ field }) => (
                    <ReactDatePicker
                      {...field}
                      dateFormat="MMMM yyyy"
                      showMonthYearPicker
                      className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-lg border-gray-300 rounded-md ${
                        errors.date && touched.date ? "border-red-500" : ""
                      }`}
                      selected={values.date}
                      onChange={(value) => {
                        setFieldValue("date", value);
                      }}
                    />
                  )}
                />
                <ErrorMessage
                  name="date"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="budget"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Budget
                </label>
                <Field
                  as="select"
                  name="budget"
                  value={values.budget || ""}
                  onChange={(value) => {
                    value.persist();
                    let item = value.target.value;
                    setFieldValue("budget", item);
                  }}
                  error={touched.budget && errors.budget}
                  className={`block w-full mt-1 px-3 py-2 border ${
                    errors.date && touched.date
                      ? "border-red-500"
                      : "border-gray-300"
                  } bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  disabled={!values.date}
                >
                  <option value="" disabled defaultValue hidden></option>
                  {values.date && budgets
                    ? budgets
                        .filter((item) => {
                          const itemDate = new Date(item.monthyear);                  
                          return (
                            itemDate.getMonth() === values.date.getMonth()+1 &&
                            itemDate.getFullYear() === values.date.getFullYear()
                          );
                        })
                        .map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.categoryname}
                          </option>
                        ))
                    : null}
                </Field>
                {errors.date && touched.date && (
                  <p className="text-red-500 text-sm mt-1">
                    Expense date must be selected first before budget category
                  </p>
                )}
                <ErrorMessage
                  name="budget"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="mr-2 px-4 py-2 text-sm rounded-md bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  disabled={isPending ? isPending : isSubmitting}
                >
                  {isPending ? "Close" : isSubmitting ? "Close" : " Close"}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isPending ? isPending : isSubmitting}
                >
                  {isPending
                    ? "Please wait.."
                    : isSubmitting
                    ? "submitting .."
                    : " Save"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Expense;
