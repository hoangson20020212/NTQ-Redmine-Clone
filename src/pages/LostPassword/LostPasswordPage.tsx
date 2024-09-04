import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import ErrorImg from "~/assets/images/error-img.png";
import { Button } from "~/components/Button/Button";

type FormData = {
  email: string;
};

const LostPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [errorMessage, _setErrorMessage] = useState("");

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
    // Call API
    // If email not found, setErrorMessage("Email not found");
  };

  const renderErrorMessage = (message: string) => {
    return (
      <div className="flex border-red-600 items-center text-xs border-2 bg-red-100 gap-3 p-2 mt-2 mb-3">
        <figure className="ml-2">
          <img src={ErrorImg} alt="error" />
        </figure>
        <span className="text-red-900">{message}</span>
      </div>
    );
  };

  return (
    <>
      {errorMessage && renderErrorMessage(errorMessage)}
      {errors.email && renderErrorMessage(errors.email.message as string)}
      <h2 className="text-mouse-gray text-xl py-2 font-bold">Lost Password</h2>
      <div className="border pl-36 bg-slate-50 p-3 mt-2">
        <form action="" className="flex items-center" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="email" className="font-bold text-xs text-mouse-gray">
            Email
            <span className="text-red-700 mx-1">*</span>
          </label>
          <input
            id="email"
            type="text"
            className="border w-80 h-6 text-xs pl-1"
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
              maxLength: {
                value: 50,
                message: "Email must be at most 50 characters long.",
              },
            })}
          />
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </>
  );
};

export default LostPasswordPage;
