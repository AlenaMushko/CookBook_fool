import { useDeleteFileMutation } from "@apis/fileAPI";
import { Box, Button, Card, CardMedia, Paper } from "@mui/material";
import ImgWithDeleteBtn from "@shared/ImageUpload/ImgWithDeleteBtn";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import theme from "../../../theme";

interface ImageUploadProps {
  userAvatar: string | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<Blob | null>>;
  fieldName: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  refetchUser: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  setSelectedFile,
  userAvatar,
  fieldName,
  setFieldValue,
  refetchUser,
}) => {
  const { t } = useTranslation();
  const [deleteImage] = useDeleteFileMutation();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async () => {
    if (userAvatar && typeof "string" && userAvatar !== "") {
      await deleteImage({ key: userAvatar, t });
      setSelectedFile(null);
      setFieldValue(fieldName, null);
      refetchUser();
    }
  };

  return (
    <Card
      sx={{
        width: { xs: "250px", md: "200px" },
        height: 200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        border: "1px dashed gray",
      }}
    >
      {userAvatar ? (
        <ImgWithDeleteBtn
          handleRemoveImage={handleRemoveImage}
          userAvatar={userAvatar}
        />
      ) : (
        <>
          {selectedImage ? (
            <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
              <CardMedia
                component='img'
                image={selectedImage}
                alt='Uploaded Image'
                sx={{
                  width: "100%",
                  height: "170px",
                  objectFit: "cover",
                }}
              />
            </Box>
          ) : (
            <Paper
              variant='elevation'
              sx={{
                backgroundColor: theme.palette.colors.infoBg,
                width: { xs: "250px", md: "200px" },
                height: 170,
              }}
            />
          )}
          <Button
            variant='outlined'
            component='label'
            fullWidth
            sx={{
              height: "40px",
              fontSize: "16px",
              padding: "0",
              lineHeight: "1.2",
              backgroundColor: theme.palette.colors.border,
              "&:hover": {
                backgroundColor: theme.palette.info.main,
              },
            }}
          >
            {t("user.enterImage")}
            <input
              type='file'
              hidden
              accept='image/*'
              onChange={handleFileChange}
            />
          </Button>
        </>
      )}
    </Card>
  );
};

export default ImageUpload;
