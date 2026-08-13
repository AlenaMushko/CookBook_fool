import { useUploadFileMutation } from "@apis/fileAPI";
import { useUpdateUserMutation } from "@apis/userAPI";
import { IUpdateUserReq, IUser } from "@apiTypes/user.types";
import {
  getInitialValuesUser,
  getValidationSchemaUser,
} from "@components/ModalContent/User/config";
import { FIELDS_NAME_USER } from "@components/ModalContent/User/types";
import { FIELDS_NAME_SIGN_UP } from "@components/SignUp/types";
import { Button } from "@/components/ui/button";
import CustomInput from "@shared/CustomInput";
import ImageUpload from "@shared/ImageUpload/ImageUpload";
import CustomPhoneInput from "@shared/PhoneInput";
import { getDeviceId } from "@utils/device";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

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
    <form
      onSubmit={formik.handleSubmit}
      className='w-full rounded-lg bg-card p-4 shadow-md sm:p-8'
    >
      <div className='flex flex-col md:flex-row'>
        <div className='mb-5'>
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
        </div>

        <div className='mx-auto mb-5 md:mx-0 md:mb-0 md:ml-10'>
          <ImageUpload
            userAvatar={userData.image}
            setSelectedFile={setSelectedFile}
            fieldName={FIELDS_NAME_USER.PHONE}
            setFieldValue={formik.setFieldValue}
            refetchUser={refetchUser}
          />
        </div>
      </div>

      <div className='flex justify-between'>
        <div className='flex justify-end'>
          <Button
            onClick={() => setIsFormOpen(false)}
            type='button'
            className='bg-brand-soft text-foreground hover:bg-brand hover:text-brand-foreground'
          >
            {t("goToProfile")}
          </Button>
        </div>
        <div className='flex justify-start'>
          <Button
            type='submit'
            className='bg-primary text-primary-foreground hover:bg-primary-hover'
          >
            {t("update")}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UserForm;
