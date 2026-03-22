import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isDark = theme.palette.mode === "dark";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      await login({ username, senha });
      navigate("/", { replace: true });
    } catch (error) {
      alert("Usuário ou senha inválidos");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        py: 4,
        backgroundColor: isDark ? "#090909" : "#efefef"
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 420
        }}
      >
        <Stack spacing={3.5}>
          <Stack spacing={1}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              Login na BarberBros
            </Typography>

            <Typography
              sx={{
                maxWidth: 300,
                fontSize: 15,
                lineHeight: 1.6,
                color: theme.palette.text.secondary
              }}
            >
              Acesse sua conta e gerencie sua rotina com praticidade.
            </Typography>
          </Stack>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Usuário"
                variant="outlined"
                autoComplete="username"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 52,
                    borderRadius: "14px",
                    backgroundColor: isDark ? alpha("#000000", 0.35) : alpha("#ffffff", 0.45),
                    "& fieldset": {
                      borderColor: isDark ? alpha("#ffffff", 0.16) : alpha("#000000", 0.12)
                    },
                    "&:hover fieldset": {
                      borderColor: isDark ? alpha("#ffffff", 0.24) : alpha("#000000", 0.18)
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main
                    }
                  }
                }}
              />

              <TextField
                fullWidth
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                autoComplete="current-password"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 52,
                    borderRadius: "14px",
                    backgroundColor: isDark ? alpha("#000000", 0.35) : alpha("#ffffff", 0.45),
                    "& fieldset": {
                      borderColor: isDark ? alpha("#ffffff", 0.16) : alpha("#000000", 0.12)
                    },
                    "&:hover fieldset": {
                      borderColor: isDark ? alpha("#ffffff", 0.24) : alpha("#000000", 0.18)
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main
                    }
                  }
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setShowPassword((prev) => !prev)}
                          tabIndex={-1}
                          sx={{
                            color: theme.palette.text.secondary
                          }}
                        >
                          {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />

              <Button
                type="submit"
                fullWidth
                disabled={submitting}
                sx={{
                  height: 52,
                  borderRadius: "14px",
                  mt: 0.5,
                  fontSize: 15,
                  fontWeight: 700,
                  textTransform: "none",
                  backgroundColor: theme.palette.primary.main,
                  color: "#121212",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                    boxShadow: "none"
                  },
                  "&.Mui-disabled": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.65),
                    color: alpha("#121212", 0.75)
                  }
                }}
              >
                {submitting ? "Entrando..." : "Entrar"}
              </Button>
            </Stack>
          </Box>

          <Stack spacing={2.5}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2
              }}
            >
              <Divider
                sx={{
                  flex: 1,
                  borderColor: isDark ? alpha("#ffffff", 0.14) : alpha("#000000", 0.12)
                }}
              />
              <Typography
                sx={{
                  fontSize: 13,
                  color: theme.palette.text.secondary
                }}
              >
                Ou continue com
              </Typography>
              <Divider
                sx={{
                  flex: 1,
                  borderColor: isDark ? alpha("#ffffff", 0.14) : alpha("#000000", 0.12)
                }}
              />
            </Box>

            <Stack spacing={1}>
              <Typography
                sx={{
                  fontSize: 15,
                  color: theme.palette.text.primary
                }}
              >
                Esqueceu sua senha?
              </Typography>

              <Typography
                sx={{
                  fontSize: 15,
                  color: theme.palette.text.primary
                }}
              >
                Não tem uma conta?{" "}
                <Box
                  component="span"
                  sx={{
                    fontWeight: 700
                  }}
                >
                  Cadastre-se
                </Box>
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}