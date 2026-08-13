import CONFIG from "@config/config";
import { Button } from "@/components/ui/button";
import React from "react";

interface ImgWithDeleteBtnProps {
  handleRemoveImage: () => void;
  userAvatar: string;
}

const ImgWithDeleteBtn: React.FC<ImgWithDeleteBtnProps> = ({
  handleRemoveImage,
  userAvatar,
}) => {
  const avatar = `${CONFIG.AWS_S3_ENDPOINT}/${CONFIG.AWS_S3_BUCKET_NAME}/${userAvatar}`;

  return (
    <div className='relative h-full w-full'>
      <img
        src={avatar}
        alt='Uploaded'
        className='h-full w-full object-cover'
      />
      <Button
        type='button'
        variant='ghost'
        size='icon-sm'
        aria-label='Remove image'
        onClick={handleRemoveImage}
        className='absolute top-1.5 right-1.5 bg-white/70 hover:bg-white'
      >
        !!!
      </Button>
    </div>
  );
};

export default ImgWithDeleteBtn;
