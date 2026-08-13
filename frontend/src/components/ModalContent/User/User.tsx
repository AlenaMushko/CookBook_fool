import { IUser } from "@apiTypes/user.types";
import UserForm from "@components/ModalContent/User/UserForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import CONFIG from "@config/config";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface UserProps {
  userData: IUser;
  refetchUser: () => void;
}

const User: React.FC<UserProps> = ({ userData, refetchUser }) => {
  const { t } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleUserUpdate = () => {
    setIsFormOpen(true);
  };

  const avatar = userData?.image
    ? `${CONFIG.AWS_S3_ENDPOINT}/${CONFIG.AWS_S3_BUCKET_NAME}/${userData?.image}`
    : undefined;

  return isFormOpen ? (
    <UserForm
      userData={userData}
      setIsFormOpen={setIsFormOpen}
      refetchUser={refetchUser}
    />
  ) : (
    <>
      <Card className='gap-0 border-border bg-card py-0'>
        {userData?.image ? (
          <img
            src={avatar}
            alt={`${userData?.lastName?.charAt(0)} ${userData?.firstName?.charAt(0)}`}
            className='h-[140px] w-full object-cover'
          />
        ) : null}
        <CardContent className='pt-4'>
          <h5 className='font-serif text-xl text-foreground'>
            {userData?.lastName} {userData?.firstName}
          </h5>
          <div className='mt-4 flex items-baseline gap-4'>
            <h5 className='text-[1.2em] font-semibold text-foreground'>Email:</h5>
            <p className='text-[1.2em] text-foreground'>{userData?.email}</p>
          </div>

          {userData?.phone ? (
            <div className='mt-4 flex items-baseline gap-4'>
              <h5 className='text-[1.2em] font-semibold text-foreground'>
                Phone:
              </h5>
              <p className='text-[1.2em] text-foreground'>{userData?.phone}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className='mt-4 flex justify-end'>
        <Button
          onClick={handleUserUpdate}
          type='button'
          className='bg-brand-soft text-foreground hover:bg-brand hover:text-brand-foreground'
        >
          {t("update")}
        </Button>
      </div>
    </>
  );
};

export default User;
