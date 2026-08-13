import { useSignUpMutation } from "@api/apis";
import { ICreateUserReq } from "@apiTypes/auth.types";
import { Button } from "@/components/ui/button";
import {
  getInitialValuesSignUp,
  getValidationSchemaSignUp,
} from "@components/SignUp/config";
import { FIELDS_NAME_SIGN_UP } from "@components/SignUp/types";
import { AppRoutes } from "@routing/appRoutes";
import CustomInput from "@shared/CustomInput";
import { getDeviceId } from "@utils/device";
import { useFormik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [signUp] = useSignUpMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const formik = useFormik({
    initialValues: getInitialValuesSignUp(),
    validationSchema: getValidationSchemaSignUp(t),
    onSubmit: async (values) => {
      const deviceId = getDeviceId();

      const newUser: ICreateUserReq = {
        firstName: values[FIELDS_NAME_SIGN_UP.FIRST_NAME],
        lastName: values[FIELDS_NAME_SIGN_UP.LAST_NAME],
        email: values[FIELDS_NAME_SIGN_UP.EMAIL],
        password: values[FIELDS_NAME_SIGN_UP.PASSWORD],
        deviceId,
      };

      try {
        await signUp({ userData: newUser, t }).unwrap();
        formik.resetForm();
        navigate(AppRoutes.DASHBOARD);
      } catch (e: any) {
        formik.resetForm();
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className='flex h-screen w-screen items-center justify-center bg-background px-2'
    >
      <div className='w-[97%] rounded-lg bg-card p-4 shadow-[var(--shadow-card)] sm:w-[400px] sm:p-8 md:w-[500px]'>
        <h1 className='mb-6 text-center text-[2rem] text-foreground md:text-[2.5rem]'>
          {t("signup")}
        </h1>

        <CustomInput
          formik={formik}
          isInvalid={
            formik.touched[FIELDS_NAME_SIGN_UP.FIRST_NAME] &&
            Boolean(formik.errors[FIELDS_NAME_SIGN_UP.FIRST_NAME])
          }
          name={FIELDS_NAME_SIGN_UP.FIRST_NAME}
          type='text'
          label={t("user.firstName")}
          placeholder={t("user.enterFirstName")}
          helpText={
            formik.touched[FIELDS_NAME_SIGN_UP.FIRST_NAME]
              ? formik.errors[FIELDS_NAME_SIGN_UP.FIRST_NAME]
              : ""
          }
          value={formik.values[FIELDS_NAME_SIGN_UP.FIRST_NAME]}
          onHandleChange={formik.handleChange}
          onHandleBlur={formik.handleBlur}
          mb={20}
          isRequired={true}
        />

        <CustomInput
          formik={formik}
          isInvalid={
            formik.touched[FIELDS_NAME_SIGN_UP.LAST_NAME] &&
            Boolean(formik.errors[FIELDS_NAME_SIGN_UP.LAST_NAME])
          }
          name={FIELDS_NAME_SIGN_UP.LAST_NAME}
          type='text'
          label={t("user.lastName")}
          placeholder={t("user.enterLastName")}
          helpText={
            formik.touched[FIELDS_NAME_SIGN_UP.LAST_NAME]
              ? formik.errors[FIELDS_NAME_SIGN_UP.LAST_NAME]
              : ""
          }
          value={formik.values[FIELDS_NAME_SIGN_UP.LAST_NAME]}
          onHandleChange={formik.handleChange}
          onHandleBlur={formik.handleBlur}
          mb={20}
          isRequired={true}
        />

        <CustomInput
          formik={formik}
          isInvalid={
            formik.touched[FIELDS_NAME_SIGN_UP.EMAIL] &&
            Boolean(formik.errors[FIELDS_NAME_SIGN_UP.EMAIL])
          }
          name={FIELDS_NAME_SIGN_UP.EMAIL}
          type='email'
          label={t("user.email")}
          placeholder={t("user.enterEmail")}
          helpText={
            formik.touched[FIELDS_NAME_SIGN_UP.EMAIL]
              ? formik.errors[FIELDS_NAME_SIGN_UP.EMAIL]
              : ""
          }
          value={formik.values[FIELDS_NAME_SIGN_UP.EMAIL]}
          onHandleChange={formik.handleChange}
          onHandleBlur={formik.handleBlur}
          mb={20}
          isRequired={true}
        />

        <CustomInput
          formik={formik}
          isInvalid={
            formik.touched[FIELDS_NAME_SIGN_UP.PASSWORD] &&
            Boolean(formik.errors[FIELDS_NAME_SIGN_UP.PASSWORD])
          }
          name={FIELDS_NAME_SIGN_UP.PASSWORD}
          type='password'
          label={t("user.password")}
          placeholder={t("user.enterPassword")}
          helpText={
            formik.touched[FIELDS_NAME_SIGN_UP.PASSWORD]
              ? formik.errors[FIELDS_NAME_SIGN_UP.PASSWORD]
              : ""
          }
          value={formik.values[FIELDS_NAME_SIGN_UP.PASSWORD]}
          onHandleChange={formik.handleChange}
          onHandleBlur={formik.handleBlur}
          password
          setShow={() => setShowPassword(!showPassword)}
          show={showPassword}
          mb={20}
          isRequired={true}
        />
        <CustomInput
          formik={formik}
          isInvalid={
            formik.touched[FIELDS_NAME_SIGN_UP.PASSWORD_CONFIRM] &&
            Boolean(formik.errors[FIELDS_NAME_SIGN_UP.PASSWORD_CONFIRM])
          }
          name={FIELDS_NAME_SIGN_UP.PASSWORD_CONFIRM}
          type='password'
          label={t("user.confirmPassword")}
          placeholder={t("user.enterConfirmPassword")}
          helpText={
            formik.touched[FIELDS_NAME_SIGN_UP.PASSWORD_CONFIRM]
              ? formik.errors[FIELDS_NAME_SIGN_UP.PASSWORD_CONFIRM]
              : ""
          }
          value={formik.values[FIELDS_NAME_SIGN_UP.PASSWORD_CONFIRM]}
          onHandleChange={formik.handleChange}
          onHandleBlur={formik.handleBlur}
          password
          setShow={() => setShowPasswordConfirm(!showPasswordConfirm)}
          show={showPasswordConfirm}
          mb={40}
          isRequired={true}
        />

        <Button
          type='submit'
          className='w-full bg-primary text-primary-foreground hover:bg-primary-hover'
        >
          {t("signup")}
        </Button>
      </div>
    </form>
  );
};

export default SignUp;
