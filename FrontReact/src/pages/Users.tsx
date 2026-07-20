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
import { TableContainer, Paper } from "@mui/material";
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
    addressStreet: '',
    addressSuite: '',
    addressCity: '',
    addressZipcode: '',
    addressGeoLat: '',
    addressGeoLng: '',
    phone: '',
    website: '',
    companyName: '',
    companyCatchPhrase: '',
    companyBs: '',
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
      setNewUser({ name: '', username: '', email: '', phone: '', website: '', addressStreet: '', addressSuite: '', addressCity: '', addressZipcode: '', addressGeoLat: '', addressGeoLng: '', companyName: '', companyCatchPhrase: '', companyBs: '' });
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
              variant="outlined"
              color="secondary"
              component={Link}
              to="/"
              sx={{ mb: 2, mr: 2 }}
          >
            Regresar
          </Button>

          <Button
              variant="contained"
              color="secondary"
              sx={{ mb: 2 }}
              onClick={() => setOpenDialog(true)}
          >
            Crear Usuario
          </Button>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 1800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Calle</TableCell>
                  <TableCell>Suite</TableCell>
                  <TableCell>Ciudad</TableCell>
                  <TableCell>Codigo Postal</TableCell>
                  <TableCell>Latitud</TableCell>
                  <TableCell>Longitud</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Website</TableCell>
                  <TableCell>Company Name</TableCell>
                  <TableCell>Company Catch Phrase</TableCell>
                  <TableCell>Company Business</TableCell>
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
                      <TableCell>{user.addressStreet}</TableCell>
                      <TableCell>{user.addressSuite}</TableCell>
                      <TableCell>{user.addressCity}</TableCell>
                      <TableCell>{user.addressZipcode}</TableCell>
                      <TableCell>{user.addressGeoLat}</TableCell>
                      <TableCell>{user.addressGeoLng}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.website}</TableCell>
                      <TableCell>{user.companyName}</TableCell>
                      <TableCell>{user.companyCatchPhrase}</TableCell>
                      <TableCell>{user.companyBs}</TableCell>
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
          </TableContainer>
        </Container>

        {/* Dialog para crear usuario */}
        <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            maxWidth="lg"
            fullWidth
            scroll="paper">
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          <DialogContent
              dividers
              sx={{
                maxHeight: '70vh',
                overflowY: 'auto',
              }}
          >
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
                label="Calle"
                fullWidth
                value={newUser.addressStreet}
                onChange={(e)=>
                    setNewUser({
                      ...newUser,
                      addressStreet:e.target.value
                    })
                }
            />

            <TextField
                margin="dense"
                label="Suite"
                fullWidth
                value={newUser.addressSuite}
                onChange={(e)=>
                    setNewUser({
                      ...newUser,
                      addressSuite:e.target.value
                    })
                }
            />

            <TextField
                margin="dense"
                label="Ciudad"
                fullWidth
                value={newUser.addressCity}
                onChange={(e)=>
                    setNewUser({
                      ...newUser,
                      addressCity:e.target.value
                    })
                }
            />

            <TextField
                margin="dense"
                label="Código Postal"
                fullWidth
                value={newUser.addressZipcode}
                onChange={(e)=>
                    setNewUser({
                      ...newUser,
                      addressZipcode:e.target.value
                    })
                }
            />
            <TextField
                margin="dense"
                label="Latitud"
                fullWidth
                value={newUser.addressGeoLat}
                onChange={(e)=>
                    setNewUser({
                      ...newUser,
                      addressGeoLat:e.target.value
                    })
                }
            />

            <TextField
                margin="dense"
                label="Longitud"
                fullWidth
                value={newUser.addressGeoLng}
                onChange={(e)=>
                    setNewUser({
                      ...newUser,
                      addressGeoLng:e.target.value
                    })
                }
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
            <TextField
                margin="dense"
                label="Empresa"
                fullWidth
                value={newUser.companyName}
                onChange={(e)=>
                    setNewUser({
                      ...newUser,
                      companyName:e.target.value
                    })
                }
            />

            <TextField
                margin="dense"
                label="Catch Phrase"
                fullWidth
                value={newUser.companyCatchPhrase}
                onChange={(e)=>
                    setNewUser({
                      ...newUser,
                      companyCatchPhrase:e.target.value
                    })
                }
            />

            <TextField
                margin="dense"
                label="Business"
                fullWidth
                value={newUser.companyBs}
                onChange={(e)=>
                    setNewUser({
                      ...newUser,
                      companyBs:e.target.value
                    })
                }
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