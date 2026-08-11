import { useSignInMutation } from "@api/apis";
import {
  getInitialValuesSignIn,
  getValidationSchemaSignIn,
} from "@components/SignIn/config";
import { FIELDS_NAME_SIGN_IN } from "@components/SignIn/types";
import { FIELDS_NAME_SIGN_UP } from "@components/SignUp/types";
import { Button, FormControl, Link, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { AppRoutes } from "@routing/appRoutes";
import CustomInput from "@shared/CustomInput";
import { useAppStore } from "@stores/zustandStore";
import { getDeviceId } from "@utils/device";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import theme from "../../../theme";

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
    <FormControl
      component='form'
      onSubmit={formik.handleSubmit}
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.colors?.bgLight,
        px: 2,
        margin: "0 auto",
      }}
    >
      <Box
        sx={{
          width: { xs: "97%", sm: 400 },
          p: { xs: 2, sm: 4 },
          backgroundColor: theme.palette.primary.contrastText,
          borderRadius: 2,
          boxShadow: theme.palette?.shadow?.orange,
        }}
      >
        <Typography
          variant='h3'
          component='h1'
          sx={{
            textAlign: "center",
            mb: 3,
            color: theme.palette.text.primary,
            fontSize: { xs: "2rem", md: "2.5rem" },
          }}
        >
          {t("login")}
        </Typography>

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
          href={AppRoutes.FORGOT_PASSWORD}
          underline='hover'
          sx={{
            display: "block",
            textAlign: "right",
            mb: 4,
            color: theme.palette.text.primary,
          }}
        >
          {t("forgot_password")}
        </Link>

        <Button
          type='submit'
          variant='contained'
          color='primary'
          fullWidth
          sx={{
            backgroundColor: theme.palette.primary.dark,
            "&:hover": {
              backgroundColor: theme.palette?.colors?.btnBgHover,
            },
          }}
        >
          {t("login")}
        </Button>
      </Box>
    </FormControl>
  );
};

export default SignIn;
