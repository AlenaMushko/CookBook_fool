import { useDeleteFileMutation } from "@apis/fileAPI";
import { Button } from "@/components/ui/button";
import ImgWithDeleteBtn from "@shared/ImageUpload/ImgWithDeleteBtn";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

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
    <div className='flex h-[200px] w-[250px] flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-border md:w-[200px]'>
      {userAvatar ? (
        <ImgWithDeleteBtn
          handleRemoveImage={handleRemoveImage}
          userAvatar={userAvatar}
        />
      ) : (
        <>
          {selectedImage ? (
            <div className='relative h-full w-full'>
              <img
                src={selectedImage}
                alt='Uploaded'
                className='h-[170px] w-full object-cover'
              />
            </div>
          ) : (
            <div className='h-[170px] w-full bg-info-bg' />
          )}
          <Button
            type='button'
            variant='outline'
            className='h-10 w-full rounded-none border-0 bg-border text-base hover:bg-info hover:text-info-foreground'
            asChild
          >
            <label className='cursor-pointer'>
              {t("user.enterImage")}
              <input
                type='file'
                hidden
                accept='image/*'
                onChange={handleFileChange}
              />
            </label>
          </Button>
        </>
      )}
    </div>
  );
};

export default ImageUpload;
