import { IUser } from "@apiTypes/user.types";
import UserForm from "@components/ModalContent/User/UserForm";
import CONFIG from "@config/config";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import theme from "../../../../theme";

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
      <Card>
        {userData?.image ? (
          <CardMedia
            component='img'
            height='140'
            image={avatar}
            alt={`${userData?.lastName?.charAt(0)} ${userData?.firstName?.charAt(0)}`}
          />
        ) : null}
        <CardContent>
          <Typography
            variant='h5'
            component='h5'
            sx={{ color: theme.palette.text.primary }}
          >
            {userData?.lastName} {userData?.firstName}
          </Typography>
          <Box
            sx={{
              mt: "16px",
              display: "flex",
              gap: "16px",
              alignItems: "baseline",
            }}
          >
            <Typography
              variant='h6'
              component='h5'
              sx={{
                color: theme.palette.text.primary,
                fontSize: "1.2em",
              }}
            >
              Email:
            </Typography>
            <Typography
              variant='body1'
              component='h5'
              sx={{
                color: theme.palette.text.primary,
                fontSize: "1.2em",
              }}
            >
              {userData?.email}
            </Typography>
          </Box>

          {userData?.phone ? (
            <Box
              sx={{
                mt: "16px",
                display: "flex",
                gap: "16px",
                alignItems: "baseline",
              }}
            >
              <Typography
                variant='h6'
                component='h5'
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: "1.2em",
                }}
              >
                Phone:
              </Typography>
              <Typography
                variant='body1'
                component='h5'
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: "1.2em",
                }}
              >
                {userData?.phone}
              </Typography>
            </Box>
          ) : null}
        </CardContent>
      </Card>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={handleUserUpdate}
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
          {t("update")}
        </Button>
      </Box>
    </>
  );
};

export default User;
