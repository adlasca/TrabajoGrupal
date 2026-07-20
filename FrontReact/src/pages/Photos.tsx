import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardMedia,
  TextField,
  CardActions,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { createPhoto, deletePhoto } from '../features/photos/photoSlice';
import type { Photo } from '../models/Photo';

function Photos() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { photos, loading, error } = useAppSelector((state) => state.photos);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [newPhoto, setNewPhoto] = useState<Omit<Photo, 'id'>>({
    albumId: Number(id),
    title: '',
    url: '',
    thumbnailUrl: '',
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (id) {
      //dispatch((Number(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      setSnackbar({ open: true, message: error, severity: 'error' });
    }
  }, [error]);

  const handleCreatePhoto = async () => {
    if (!newPhoto.title.trim() || !newPhoto.url.trim()) {
      setSnackbar({ open: true, message: 'Título y URL son requeridos', severity: 'error' });
      return;
    }
    try {
      await dispatch(createPhoto(newPhoto)).unwrap();
      setSnackbar({ open: true, message: 'Foto creada exitosamente', severity: 'success' });
      setOpenDialog(false);
      setNewPhoto({ albumId: Number(id), title: '', url: '', thumbnailUrl: '' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al crear foto', severity: 'error' });
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta foto?')) {
      try {
        await dispatch(deletePhoto(photoId)).unwrap();
        setSnackbar({ open: true, message: 'Foto eliminada', severity: 'success' });
      } catch (err) {
        setSnackbar({ open: true, message: 'Error al eliminar foto', severity: 'error' });
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography>Cargando fotos...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ mt: 5, textAlign: "center" }}>
        Fotos del Álbum #{id}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Agregar Foto
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ maxWidth: 1200, margin: "20px auto", px: 2 }}>
        {photos.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1" align="center" color="text.secondary">
              No hay fotos en este álbum
            </Typography>
          </Grid>
        ) : (
          photos.map((photo: Photo) => (
            <Grid item xs={12} sm={6} md={4} key={photo.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={photo.thumbnailUrl || photo.url}
                  alt={photo.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" noWrap>
                    {photo.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ID: {photo.id}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={() => handleDeletePhoto(photo.id!)}
                  >
                    Eliminar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
        <Button variant="contained" color="secondary" component={Link} to="/albums" size="large">
          Regresar a Álbumes
        </Button>
      </Box>

      {/* Dialog para crear foto */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Agregar Nueva Foto</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título"
            fullWidth
            value={newPhoto.title}
            onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="URL de la imagen"
            fullWidth
            value={newPhoto.url}
            onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
          />
          <TextField
            margin="dense"
            label="URL del thumbnail (opcional)"
            fullWidth
            value={newPhoto.thumbnailUrl}
            onChange={(e) => setNewPhoto({ ...newPhoto, thumbnailUrl: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleCreatePhoto} variant="contained" color="primary">
            Agregar
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

export default Photos;