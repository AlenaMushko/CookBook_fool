import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

import theme from "../../../theme";

interface DishCategoryTitleProps {
  categoryName: string;
  handleCreateDish: () => void;
}

const DishCategoryTitle: React.FC<DishCategoryTitleProps> = ({
  categoryName,
  handleCreateDish,
}) => {
  const { t } = useTranslation();

  return (
    <Stack
      direction='row'
      sx={{
        gap: "16px",
        p: "0 16px",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "nowrap",
      }}
    >
      <Typography
        variant='h2'
        component='h2'
        sx={{
          color: theme.palette.primary.dark,
          fontSize: "2rem",
          whiteSpace: "nowrap",
        }}
      >
        {categoryName}
      </Typography>

      <Button
        onClick={handleCreateDish}
        type='button'
        variant='contained'
        color='primary'
        fullWidth
        sx={{
          width: "140px",
          color: theme.palette.primary.contrastText,
          backgroundColor: theme.palette.colors.action,
          "&:hover": {
            color: theme.palette.colors.bg,
            backgroundColor: theme.palette.colors.actionHover,
          },
        }}
      >
        {t("dish.add")}
      </Button>
    </Stack>
  );
};
export default DishCategoryTitle;
