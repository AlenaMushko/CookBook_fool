import { useLogoutMutation } from "@api/apis";
import { useGetUserByIdQuery } from "@apis/userAPI";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CONFIG from "@config/config";
import { AppRoutes } from "@routing/appRoutes";
import CustomModal from "@shared/CustomModal";
import { useAppStore } from "@stores/zustandStore";
import { useState } from "react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import User from "../ModalContent/User/User";

const AvatarMenu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userId = useAppStore((state) => state.userId);
  const { data: userData, refetch } = useGetUserByIdQuery({
    userId: userId ?? "",
  });

  const [logout] = useLogoutMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout().unwrap();
    navigate(AppRoutes.HOME);
    setMenuOpen(false);
  };

  const handleUserInfo = () => {
    setIsModalOpen(true);
    setMenuOpen(false);
  };

  const settings = [
    { label: t("profile"), action: handleUserInfo },
    { label: t("logout"), action: handleLogout },
  ];

  const avatar = userData?.image
    ? `${CONFIG.AWS_S3_ENDPOINT}/${CONFIG.AWS_S3_BUCKET_NAME}/${userData?.image}`
    : undefined;

  const initials = `${userData?.lastName?.charAt(0) ?? ""} ${userData?.firstName?.charAt(0) ?? ""}`.trim();

  return (
    <>
      <div className='ml-auto flex-none'>
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='rounded-full p-0'
                  aria-label='Open settings'
                >
                  <Avatar>
                    {avatar ? (
                      <AvatarImage src={avatar} alt={initials} />
                    ) : null}
                    <AvatarFallback className='bg-secondary text-foreground'>
                      {userData?.image ? null : initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side='bottom'>Open settings</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align='end' className='min-w-36'>
            {settings.map((setting) => (
              <DropdownMenuItem
                key={setting.label}
                className='justify-center'
                onSelect={() => {
                  void setting.action();
                }}
              >
                {setting.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {userData ? (
        <CustomModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={t("profile")}
        >
          <User userData={userData} refetchUser={refetch} />
        </CustomModal>
      ) : null}
    </>
  );
};

export default AvatarMenu;
