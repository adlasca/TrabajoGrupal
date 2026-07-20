import { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchUsers, createUser, deleteUser } from '../features/users/userSlice';
import type { User } from '../models/User';

function Users() {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.users);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    name: '',
    username: '',
    email: '',
    phone: '',
    website: '',
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setSnackbar({ open: true, message: error, severity: 'error' });
    }
  }, [error]);

  const handleCreateUser = async () => {
    try {
      await dispatch(createUser(newUser)).unwrap();
      setSnackbar({ open: true, message: 'Usuario creado exitosamente', severity: 'success' });
      setOpenDialog(false);
      setNewUser({ name: '', username: '', email: '', phone: '', website: '' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al crear usuario', severity: 'error' });
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await dispatch(deleteUser(id)).unwrap();
        setSnackbar({ open: true, message: 'Usuario eliminado', severity: 'success' });
      } catch (err) {
        setSnackbar({ open: true, message: 'Error al eliminar usuario', severity: 'error' });
      }
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 5, textAlign: 'center' }}>
        <Typography>Cargando usuarios...</Typography>
      </Container>
    );
  }

  return (
    <>
      <Container sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Usuarios
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          onClick={() => setOpenDialog(true)}
        >
          Crear Usuario
        </Button>

        <Table sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Website</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.website}</TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    variant="outlined"
                    component={Link}
                    to={`/users/${user.id}`}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    color="secondary"
                    variant="outlined"
                    component={Link}
                    to={`/users/${user.id}/posts`}
                    sx={{ mr: 1 }}
                  >
                    Posts
                  </Button>
                  <Button
                    color="secondary"
                    variant="outlined"
                    component={Link}
                    to={`/users/${user.id}/todos`}
                    sx={{ mr: 1 }}
                  >
                    ToDos
                  </Button>
                  <Button
                    color="secondary"
                    variant="outlined"
                    component={Link}
                    to={`/users/${user.id}/albums`}
                    sx={{ mr: 1 }}
                  >
                    Albums
                  </Button>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => handleDeleteUser(user.id!)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>

      {/* Dialog para crear usuario */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Usuario</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            fullWidth
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Username"
            fullWidth
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Teléfono"
            fullWidth
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Website"
            fullWidth
            value={newUser.website}
            onChange={(e) => setNewUser({ ...newUser, website: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleCreateUser} variant="contained" color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
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
    </>
  );
}

export default Users;