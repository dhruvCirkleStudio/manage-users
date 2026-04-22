import React from "react";
import DashboardLayout, {
  DashboardMainContent,
  DashboardNavigation,
} from "../shared/DashboardLayout";
import { Box, Toolbar, Typography } from "@mui/material";
import { InlineWidget } from "react-calendly";

export default function Meeting() {
  return (
    <DashboardLayout>
      <DashboardNavigation>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" color="text.primary">
              Schedule Meeting!
            </Typography>
          </Box>
        </Toolbar>
      </DashboardNavigation>
      <DashboardMainContent>
        <Box sx={{ width: "100%", height: "800px" }}>
          <InlineWidget
            url="https://calendly.com/satish_cirkle_studio/30min?month=2025-06"
            styles={{ height: "100%", width: "100%" }}
          />
        </Box>
      </DashboardMainContent>
    </DashboardLayout>
  );
}
