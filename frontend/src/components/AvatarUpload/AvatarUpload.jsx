import React from "react"
import { Box, Avatar, IconButton } from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
export default function AvatarUpload(){ return(<Box sx={{position:"relative",display:"inline-grid"}}><Avatar sx={{width:112,height:112,bgcolor:"#0C1116"}}/><IconButton size="small" sx={{position:"absolute",right:6,bottom:6,bgcolor:"#62B6A5",color:"#0B1117","&:hover":{bgcolor:"#7CE0C3"}}}><CloudUploadIcon fontSize="small"/></IconButton></Box>) }
