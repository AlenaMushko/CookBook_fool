import { useSignInMutation } from "@api/apis";
import { Button } from "@/components/ui/button";
import {
  getInitialValuesSignIn,
  getValidationSchemaSignIn,
} from "@components/SignIn/config";
import { FIELDS_NAME_SIGN_IN } from "@components/SignIn/types";
import { FIELDS_NAME_SIGN_UP } from "@components/SignUp/types";
import { AppRoutes } from "@routing/appRoutes";
import CustomInput from "@shared/CustomInput";
import { useAppStore } from "@stores/zustandStore";
import { getDeviceId } from "@utils/device";
import { useFormik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [signIn] = useSignInMutation();

  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: getInitialValuesSignIn(),
    validationSchema: getValidationSchemaSignIn(t),
    onSubmit: async (values) => {
      const deviceId = getDeviceId();
      const email = values[FIELDS_NAME_SIGN_UP.EMAIL];
      const password = values[FIELDS_NAME_SIGN_UP.PASSWORD];

      useAppStore.getState().setDeviceId(deviceId);

      try {
        await signIn({ email, password, deviceId }).unwrap();
        navigate(AppRoutes.DASHBOARD);
      } catch (e: any) {
        formik.resetForm();
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className='mx-auto flex h-screen w-screen items-center justify-center bg-background px-2'
    >
      <div className='w-[97%] rounded-lg bg-card p-4 shadow-[var(--shadow-card)] sm:w-[400px] sm:p-8'>
        <h1 className='mb-6 text-center text-[2rem] text-foreground md:text-[2.5rem]'>
          {t("login")}
        </h1>

        <CustomInput
          formik={formik}
          isInvalid={
            formik.touched[FIELDS_NAME_SIGN_IN.EMAIL] &&
            Boolean(formik.errors[FIELDS_NAME_SIGN_IN.EMAIL])
          }
          name={FIELDS_NAME_SIGN_IN.EMAIL}
          type='email'
          label={t("user.email")}
          placeholder={t("user.enterEmail")}
          helpText={
            formik.touched[FIELDS_NAME_SIGN_IN.EMAIL]
              ? formik.errors[FIELDS_NAME_SIGN_IN.EMAIL]
              : ""
          }
          value={formik.values[FIELDS_NAME_SIGN_IN.EMAIL]}
          onHandleChange={formik.handleChange}
          onHandleBlur={formik.handleBlur}
          mb={20}
          isRequired={true}
        />

        <CustomInput
          formik={formik}
          isInvalid={
            formik.touched[FIELDS_NAME_SIGN_IN.PASSWORD] &&
            Boolean(formik.errors[FIELDS_NAME_SIGN_IN.PASSWORD])
          }
          name={FIELDS_NAME_SIGN_IN.PASSWORD}
          type='password'
          label={t("user.password")}
          placeholder={t("user.enterPassword")}
          helpText={
            formik.touched[FIELDS_NAME_SIGN_IN.PASSWORD]
              ? formik.errors[FIELDS_NAME_SIGN_IN.PASSWORD]
              : ""
          }
          value={formik.values[FIELDS_NAME_SIGN_IN.PASSWORD]}
          onHandleChange={formik.handleChange}
          onHandleBlur={formik.handleBlur}
          password
          setShow={() => setShowPassword(!showPassword)}
          show={showPassword}
          mb={16}
          isRequired={true}
        />

        <Link
          to={AppRoutes.FORGOT_PASSWORD}
          className='mb-8 block text-right text-foreground underline-offset-4 hover:underline'
        >
          {t("forgot_password")}
        </Link>

        <Button
          type='submit'
          className='w-full bg-primary text-primary-foreground hover:bg-primary-hover'
        >
          {t("login")}
        </Button>
      </div>
    </form>
  );
};

export default SignIn;
