"use client";
import React, { createContext } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import DataService from "@/lib/fetch";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/context";

const Login = () => {
  const { setUser } = useAppContext();

  const router = useRouter();
  const initialValues = {
    email: "",
    password: "",
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      const { email } = await DataService.postDataNoAuth("/api/login", values);

      setUser(email);

      setSubmitting(false);
      router.push("/dashboard");
    } catch (error) {
      setSubmitting(false);

      return toast.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-600 to-indigo-600">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Home
      </Link>
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <Image
          src="expense.svg"
          alt="Login"
          className="h-50 mx-auto mb-8"
          width={100}
          height={100}
        />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="w-full mb-4 px-4 py-2 border rounded-lg"
                required
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500"
              />

              <Field
                type="password"
                name="password"
                placeholder="Password"
                className="w-full mb-4 px-4 py-2 border rounded-lg"
                required
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500"
              />

              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
              <div className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                <Link
                  href={"/register"}
                  className="block hover:text-blue-500 underline"
                >
                  Create an Account
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
