import { IParsedDish } from "@api/types";
import CONFIG from "@config/config";
import AlarmIcon from "@mui/icons-material/Alarm";
import {
  Box,
  CardMedia,
  Rating,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { formatPreparationTime } from "@utils/formatPreparationTime";
import React from "react";
import { useTranslation } from "react-i18next";

import theme from "../../../theme";

interface ManInfoProps {
  selectedDish: IParsedDish;
}

const ManInfo: React.FC<ManInfoProps> = ({ selectedDish }) => {
  const { t } = useTranslation();
  const dishImg = selectedDish?.image
    ? `${CONFIG.AWS_S3_ENDPOINT}/${CONFIG.AWS_S3_BUCKET_NAME}/${selectedDish?.image}`
    : undefined;
  const formattedTime = formatPreparationTime(selectedDish?.preparationTime);

  return (
    <Stack
      direction='row'
      sx={{
        gap: "16px",
        p: "16px",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "nowrap",
      }}
    >
      <CardMedia
        component='img'
        height='auto'
        image={dishImg}
        alt={selectedDish?.title}
        sx={{
          width: "40%",
          borderRadius: "12px",
        }}
      />
      <Box
        style={{
          position: "absolute",
          top: "4px",
          right: "4px",
          display: "flex",
          gap: "30px",
        }}
      >
        <Box>
          <Tooltip title={t("dish.preparationTime")} placement='left'>
            <span
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <AlarmIcon
                sx={{
                  color: theme.palette.colors.actionHover,
                }}
              />
              <Typography
                variant='h6'
                component='p'
                sx={{
                  color: theme.palette.colors.actionHover,
                }}
              >
                - {formattedTime}
              </Typography>
            </span>
          </Tooltip>
        </Box>

        <Tooltip title={t("dish.degreeDifficulty")} placement='left'>
          <span>
            <Rating
              size='small'
              name='half-rating-read'
              defaultValue={selectedDish?.difficulty}
              precision={0.5}
              readOnly
            />
          </span>
        </Tooltip>
      </Box>
      <Box>
        <Typography
          variant='h5'
          component='h3'
          sx={{
            marginBottom: "16px",
          }}
        >
          {selectedDish?.title}
        </Typography>
        <Typography
          variant='h6'
          component='p'
          sx={{
            marginBottom: "16px",
            // fontSize: "2rem",
          }}
        >
          {selectedDish?.subtitle}
        </Typography>
        <Typography
          variant='h6'
          component='p'
          // sx={{
          //   color: theme.palette.primary.dark,
          //   fontSize: "2rem",
          // }}
        >
          Author -{" "}
          <span style={{ color: theme.palette.colors.actionHover }}>
            {" "}
            {selectedDish?.user?.firstName} {selectedDish?.user?.lastName}
          </span>
        </Typography>
      </Box>
    </Stack>
  );
};

export default ManInfo;
