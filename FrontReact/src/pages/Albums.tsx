import { useEffect } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchAlbums, deleteAlbum } from '../features/albums/albumSlice';
import { fetchUsers } from '../features/users/userSlice';

function Albums() {
  const dispatch = useAppDispatch();
  const { albums, loading, error } = useAppSelector((state) => state.albums);
  const { users } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchAlbums());
    dispatch(fetchUsers());
  }, [dispatch]);

  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : `Usuario ${userId}`;
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este álbum?')) {
      try {
        await dispatch(deleteAlbum(id)).unwrap();
      } catch (err) {
        // Error manejado por el slice
      }
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 5, textAlign: 'center' }}>
        <Typography>Cargando álbumes...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Álbumes
      </Typography>
      <Button
          variant="outlined"
          color="info"
          component={Link}
          to="/"
          sx={{ mb: 2, mr: 2 }}
      >
        Regresar
      </Button>
      <Button
          variant="contained"
          color="info"
          sx={{ mb: 2 }}
          //onClick={() => setOpenDialog(true)}
      >
        Crear Album
      </Button>

      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Usuario</TableCell>
            <TableCell>Título</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {albums.map((album) => (
            <TableRow key={album.id}>
              <TableCell>{album.id}</TableCell>
              <TableCell>{getUserName(album.userId)}</TableCell>
              <TableCell>{album.title}</TableCell>
              <TableCell>
                <Button
                  color="primary"
                  variant="outlined"
                  component={Link}
                  to={`/albums/${album.id}/photos`}
                  sx={{ mr: 1 }}
                >
                  Ver Fotos
                </Button>
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => handleDelete(album.id!)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => {}}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Container>
  );
}

export default Albums;