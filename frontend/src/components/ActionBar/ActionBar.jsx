import React from "react"
import { Box, Paper, Button } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import SendOutlinedIcon from "@mui/icons-material/SendOutlined"
import VisibilityIcon from "@mui/icons-material/Visibility"
export default function ActionBar({onSubmit,onPreview,onCancel})
{
     return(<Paper elevation={0} sx={{position:"sticky",bottom:0,borderTop:"1px solid #1E2733",bgcolor:"background.default",py:2,px:2}}><Box sx={{display:"flex",justifyContent:"flex-end",gap:1,maxWidth:1280,mx:"auto"}}><Button variant="text" startIcon={<CloseIcon/>} onClick={onCancel}>Cancelar</Button><Button variant="contained" color="secondary" startIcon={<SendOutlinedIcon/>} onClick={onSubmit}>Enviar Cadastro</Button><Button variant="outlined" startIcon={<VisibilityIcon/>} onClick={onPreview}>Visualizar Contrato</Button></Box></Paper>) }
