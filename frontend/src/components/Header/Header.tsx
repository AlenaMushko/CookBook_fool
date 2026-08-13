import AvatarMenu from "@components/Header/AvatarMenu";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { AppRoutes } from "@routing/appRoutes";
import { LanguageSwitcher } from "@shared/index";
import { useAppStore } from "@stores/zustandStore";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import logo from "/logo.svg";

import theme from "../../../theme";

const Header: React.FC = () => {
  const { t } = useTranslation();

  const { isAuthenticated } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (route: string) => location.pathname === route;

  const pagesAuth = [
    { label: t("home"), route: AppRoutes.HOME },
    { label: t("login"), route: AppRoutes.SIGN_IN },
    { label: t("signup"), route: AppRoutes.SIGN_UP },
  ];

  const pagesUser = [
    { label: t("home"), route: AppRoutes.HOME },
    { label: t("dashboard"), route: AppRoutes.DASHBOARD },
  ];

  const pages = isAuthenticated ? pagesUser : pagesAuth;

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavigate = (route: string) => {
    navigate(route);
    handleCloseNavMenu();
  };

  return (
    <>
      <AppBar
        position='absolute'
        sx={{
          t: 0,
          l: 0,
          width: "100vw",
          backgroundColor: theme.palette.colors.card,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.colors.border}`,
          px: "16px",
        }}
      >
        <Container>
          <Toolbar disableGutters>
            {/*mobile */}
            <Box
              sx={{
                mr: 2,
                display: { xs: "flex", sm: "none" },
                flexGrow: 1,
                color: "inherit",
              }}
            >
              <img
                src={logo}
                alt='Logo'
                style={{
                  height: "40px",
                  marginRight: "8px",
                }}
              />
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", sm: "none" } }}>
              <IconButton
                size='large'
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleOpenNavMenu}
                color='inherit'
              >
                <MenuIcon sx={{ fontSize: "30px" }} />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", sm: "none" } }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page.label}
                    onClick={() => handleNavigate(page.route)}
                  >
                    <Typography sx={{ textAlign: "center" }}>
                      {page.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/*desktop */}
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                color: "inherit",
              }}
            >
              <img
                src={logo}
                alt='Logo'
                style={{
                  height: "50px",
                  marginRight: "8px",
                  borderRadius: "4px",
                }}
              />
            </Box>

            <Box
              sx={{
                flexGrow: 0,
                ml: "auto",
                display: "flex",
                gap: "2vw",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  flexGrow: 0,
                  gap: "2vw",
                  ml: "auto",
                  alignItems: "center",
                }}
              >
                {pages.map((page) => (
                  <Button
                    variant='text'
                    key={page.label}
                    onClick={() => handleNavigate(page.route)}
                    sx={{
                      color: isActive(page.route)
                        ? theme.palette.common.white
                        : theme.palette.text.secondary,
                      backgroundColor: isActive(page.route)
                        ? theme.palette.colors.action
                        : "transparent",
                      "&:hover": {
                        backgroundColor: isActive(page.route)
                          ? theme.palette.colors.actionHover
                          : theme.palette.colors.surface,
                        color: isActive(page.route)
                          ? theme.palette.common.white
                          : theme.palette.text.primary,
                      },
                    }}
                  >
                    {page.label}
                  </Button>
                ))}
              </Box>

              <LanguageSwitcher />

              {isAuthenticated ? <AvatarMenu /> : null}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Header;
