import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  TextField,
  CardActions,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchAlbums, createAlbum, deleteAlbum } from '../features/albums/albumSlice';
import type { Album } from '../models/Album';

function UserAlbums() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { albums, loading, error } = useAppSelector((state) => state.albums);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [newAlbum, setNewAlbum] = useState<Omit<Album, 'id'>>({
    userId: Number(id),
    title: '',
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    dispatch(fetchAlbums());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setSnackbar({ open: true, message: error, severity: 'error' });
    }
  }, [error]);

  const userAlbums = albums.filter(album => album.userId === Number(id));

  const handleCreateAlbum = async () => {
    if (!newAlbum.title.trim()) {
      setSnackbar({ open: true, message: 'El título es requerido', severity: 'error' });
      return;
    }
    try {
      await dispatch(createAlbum(newAlbum)).unwrap();
      setSnackbar({ open: true, message: 'Álbum creado exitosamente', severity: 'success' });
      setOpenDialog(false);
      setNewAlbum({ userId: Number(id), title: '' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al crear álbum', severity: 'error' });
    }
  };

  const handleDeleteAlbum = async (albumId: number) => {
    if (window.confirm('¿Estás seguro de eliminar este álbum?')) {
      try {
        await dispatch(deleteAlbum(albumId)).unwrap();
        setSnackbar({ open: true, message: 'Álbum eliminado', severity: 'success' });
      } catch (err) {
        setSnackbar({ open: true, message: 'Error al eliminar álbum', severity: 'error' });
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography>Cargando álbumes...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ mt: 5, textAlign: "center" }}>
        Álbumes del Usuario #{id}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Crear Nuevo Álbum
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 800, margin: "20px auto", px: 2 }}>
        {userAlbums.length === 0 ? (
          <Typography variant="body1" align="center" color="text.secondary">
            No hay álbumes para este usuario
          </Typography>
        ) : (
          userAlbums.map((album) => (
            <Card key={album.id} variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {album.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ID: {album.id}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2, justifyContent: "space-between" }}>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/albums/${album.id}/photos`}
                >
                  Ver Fotos
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteAlbum(album.id!)}
                >
                  Eliminar
                </Button>
              </CardActions>
            </Card>
          ))
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
        <Button variant="contained" color="secondary" component={Link} to="/users" size="large">
          Regresar a Usuarios
        </Button>
      </Box>

      {/* Dialog para crear álbum */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Álbum</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título del álbum"
            fullWidth
            value={newAlbum.title}
            onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleCreateAlbum} variant="contained" color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>

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

export default UserAlbums;