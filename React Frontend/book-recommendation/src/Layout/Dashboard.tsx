import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Dashboard() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 8, // Adjust to match the AppBar height
          p: 3,
        }}
      >
        <Container>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard;
