import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchUserById, updateUser, clearSelectedUser } from '../features/users/userSlice';
import type { User } from '../models/User';

function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedUser, loading, error } = useAppSelector((state) => state.users);
  
  const [user, setUser] = useState<User | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(Number(id)));
    }
    return () => {
      dispatch(clearSelectedUser());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedUser) {
      setUser(selectedUser);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (error) {
      setSnackbar({ open: true, message: error, severity: 'error' });
    }
  }, [error]);

  const handleSave = async () => {
    if (user && user.id) {
      try {
        const { id: userId, ...userData } = user;
        await dispatch(updateUser({ id: userId, user: userData })).unwrap();
        setSnackbar({ open: true, message: 'Usuario actualizado exitosamente', severity: 'success' });
        setTimeout(() => navigate('/users'), 1500);
      } catch (err) {
        setSnackbar({ open: true, message: 'Error al actualizar usuario', severity: 'error' });
      }
    }
  };

  if (loading || !user) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography>Cargando usuario...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, margin: "40px auto", px: 2 }}>
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Editar Usuario
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              ID: {user.id}
            </Typography>
          </Box>

          <TextField
            label="Nombre"
            variant="outlined"
            value={user.name}
            fullWidth
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
          <TextField
            label="Username"
            variant="outlined"
            value={user.username}
            fullWidth
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />
          <TextField
            label="Email"
            variant="outlined"
            value={user.email}
            fullWidth
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <TextField
            label="Teléfono"
            variant="outlined"
            value={user.phone}
            fullWidth
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
          />
          <TextField
            label="Sitio Web"
            variant="outlined"
            value={user.website}
            fullWidth
            onChange={(e) => setUser({ ...user, website: e.target.value })}
          />
        </CardContent>

        <CardActions sx={{ justifyContent: "flex-start", px: 4, pb: 4, gap: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            to="/users"
          >
            Regresar
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSave}
          >
            Guardar
          </Button>
        </CardActions>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default UserDetail;