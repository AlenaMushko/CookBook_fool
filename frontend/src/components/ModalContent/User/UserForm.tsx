import { useUploadFileMutation } from "@apis/fileAPI";
import { useUpdateUserMutation } from "@apis/userAPI";
import { IUpdateUserReq, IUser } from "@apiTypes/user.types";
import {
  getInitialValuesUser,
  getValidationSchemaUser,
} from "@components/ModalContent/User/config";
import { FIELDS_NAME_USER } from "@components/ModalContent/User/types";
import { FIELDS_NAME_SIGN_UP } from "@components/SignUp/types";
import { Button, FormControl, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import CustomInput from "@shared/CustomInput";
import ImageUpload from "@shared/ImageUpload/ImageUpload";
import CustomPhoneInput from "@shared/PhoneInput";
import { getDeviceId } from "@utils/device";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import theme from "../../../../theme";

interface UserFormProps {
  userData: IUser;
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetchUser: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  userData,
  setIsFormOpen,
  refetchUser,
}) => {
  const { t } = useTranslation();
  const [updateUser] = useUpdateUserMutation();
  const [selectedFile, setSelectedFile] = useState<Blob | null>(null);

  const [uploadFile] = useUploadFileMutation();

  const formik = useFormik({
    initialValues: getInitialValuesUser({ user: userData }),
    validationSchema: getValidationSchemaUser(t),
    onSubmit: async (values) => {
      const deviceId = getDeviceId();
      let avatar = null;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile as Blob);
        formData.append("folderName", "avatars");

        const { key } = await uploadFile({ formData, t }).unwrap();

        avatar = key;
      }

      const newUser: IUpdateUserReq = {
        firstName: values[FIELDS_NAME_USER.FIRST_NAME],
        lastName: values[FIELDS_NAME_USER.LAST_NAME],
        image: values[FIELDS_NAME_USER.IMAGE] ?? avatar,
        phone: values[FIELDS_NAME_USER.PHONE] ?? null,
        deviceId,
      };

      try {
        await updateUser({
          userId: userData.id,
          userData: newUser,
          t,
        }).unwrap();
        formik.resetForm();
        setIsFormOpen(false);
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
        width: { xs: "100%" },
        p: { xs: 2, sm: 4 },
        backgroundColor: theme.palette.primary.contrastText,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Grid container>
        <Grid
          sx={{
            margin: "0 0 20px 0",
          }}
        >
          <CustomInput
            formik={formik}
            isInvalid={
              formik.touched[FIELDS_NAME_USER.FIRST_NAME] &&
              Boolean(formik.errors[FIELDS_NAME_USER.FIRST_NAME])
            }
            name={FIELDS_NAME_USER.FIRST_NAME}
            type='text'
            label={t("user.firstName")}
            placeholder={t("user.enterFirstName")}
            helpText={
              formik.touched[FIELDS_NAME_USER.FIRST_NAME]
                ? formik.errors[FIELDS_NAME_USER.FIRST_NAME]
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
              formik.touched[FIELDS_NAME_USER.LAST_NAME] &&
              Boolean(formik.errors[FIELDS_NAME_USER.LAST_NAME])
            }
            name={FIELDS_NAME_USER.LAST_NAME}
            type='text'
            label={t("user.lastName")}
            placeholder={t("user.enterLastName")}
            helpText={
              formik.touched[FIELDS_NAME_USER.LAST_NAME]
                ? formik.errors[FIELDS_NAME_USER.LAST_NAME]
                : ""
            }
            value={formik.values[FIELDS_NAME_USER.LAST_NAME]}
            onHandleChange={formik.handleChange}
            onHandleBlur={formik.handleBlur}
            mb={20}
            isRequired={true}
          />
          <CustomPhoneInput
            label={t("user.phone")}
            fieldName={FIELDS_NAME_USER.PHONE}
            formikValues={formik.values}
            formikTouched={formik.touched}
            formikErrors={formik.errors}
            setFieldValue={formik.setFieldValue}
          />
        </Grid>

        <Grid
          sx={{
            margin: { xs: "auto", md: "0 0 0 40px" },
            marginBottom: { xs: "20px", md: "0 " },
          }}
        >
          <ImageUpload
            userAvatar={userData.image}
            setSelectedFile={setSelectedFile}
            fieldName={FIELDS_NAME_USER.PHONE}
            setFieldValue={formik.setFieldValue}
            refetchUser={refetchUser}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={() => setIsFormOpen(false)}
            type='button'
            variant='contained'
            color='primary'
            sx={{
              backgroundColor: theme.palette.secondary.light,
              "&:hover": {
                backgroundColor: theme.palette.secondary.main,
              },
            }}
          >
            {t("goToProfile")}
          </Button>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            sx={{
              backgroundColor: theme.palette.primary.dark,
              "&:hover": {
                backgroundColor: theme.palette.colors.actionHover,
              },
            }}
          >
            {t("update")}
          </Button>
        </Box>
      </Box>
    </FormControl>
  );
};

export default UserForm;
