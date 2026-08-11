import { useForgotPasswordMutation } from "@api/apis";
import { FIELDS_NAME_SIGN_IN } from "@components/SignIn/types";
import { EMAIL_REGEX } from "@constants/regex";
import { TEXT } from "@messages/validation";
import { Box, Button, FormControl, Typography } from "@mui/material";
import CustomInput from "@shared/CustomInput";
import { showToast } from "@shared/Toast";
import { useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

import theme from "../../../theme";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [forgotPassword] = useForgotPasswordMutation();

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object().shape({
      [FIELDS_NAME_SIGN_IN.EMAIL]: Yup.string()
        .matches(EMAIL_REGEX, t(TEXT.ERROR.AUTH.INVALID_EMAIL))
        .required(t(TEXT.ERROR.REQUIRED_FIELD)),
    }),
    onSubmit: async (values) => {
      const email = values.email;

      try {
        await forgotPassword({ email }).unwrap();
      } finally {
        showToast(t("user.checkEmail"), "info");
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

export default ForgotPassword;
