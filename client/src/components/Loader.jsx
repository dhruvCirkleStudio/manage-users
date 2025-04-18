import { Box, CircularProgress } from "@mui/material";

export default function Loader() {
  return (
    <Box sx={{ display: 'flex',height:'100%',width:'100%' }}>
      <CircularProgress />
    </Box>
  );
}
