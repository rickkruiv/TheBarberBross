import React from "react"
import { Box, Avatar, IconButton } from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"

export default function AvatarUpload(){ 
    
    return(
    <Box sx={{
        position:"relative",
        display:"inline-grid"
        }}
    >
        <Avatar sx={{
            width:112,
            height:112,
            bgcolor:"#0C1116"}}
        />
        <IconButton size="small" sx={{position:"absolute",right:6,bottom:6,bgcolor:"primary.main",color:"#0B1117","&:hover":{bgcolor:"text.tertiary"}}}>
            <CloudUploadIcon fontSize="small"/>
            </IconButton>
        </Box>
    ) 
}
