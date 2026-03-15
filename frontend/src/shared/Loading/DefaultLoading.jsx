import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'
import { Box, Typography } from "@mui/material"

export default function DefaultLoading({ loadMessage = "Carregando..." }) {
    return (
        <Box sx={{ p: 3, 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    height: "100%", 
                    gap: 2 }}>
            <Stack spacing={4} direction="row" >
                <CircularProgress size="2rem"/>
            </Stack>
            <Typography textAlign="center">{loadMessage}</Typography>
        </Box>
    )
}
