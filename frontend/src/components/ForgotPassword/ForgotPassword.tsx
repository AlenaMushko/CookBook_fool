import { useForgotPasswordMutation } from "@api/apis";
import { Button } from "@/components/ui/button";
import { FIELDS_NAME_SIGN_IN } from "@components/SignIn/types";
import { EMAIL_REGEX } from "@constants/regex";
import { TEXT } from "@messages/validation";
import CustomInput from "@shared/CustomInput";
import { showToast } from "@shared/Toast";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

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

export default ForgotPassword;
