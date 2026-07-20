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
import { fetchPosts, createPost, deletePost } from '../features/posts/postSlice';
import type { Post } from '../models/Post';

function UserPosts() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { posts, loading, error } = useAppSelector((state) => state.posts);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [newPost, setNewPost] = useState<Omit<Post, 'id'>>({
    userId: Number(id),
    title: '',
    body: '',
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setSnackbar({ open: true, message: error, severity: 'error' });
    }
  }, [error]);

  const userPosts = posts.filter(post => post.userId === Number(id));

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.body.trim()) {
      setSnackbar({ open: true, message: 'Todos los campos son requeridos', severity: 'error' });
      return;
    }
    try {
      await dispatch(createPost(newPost)).unwrap();
      setSnackbar({ open: true, message: 'Post creado exitosamente', severity: 'success' });
      setOpenDialog(false);
      setNewPost({ userId: Number(id), title: '', body: '' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al crear post', severity: 'error' });
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (window.confirm('¿Estás seguro de eliminar este post?')) {
      try {
        await dispatch(deletePost(postId)).unwrap();
        setSnackbar({ open: true, message: 'Post eliminado', severity: 'success' });
      } catch (err) {
        setSnackbar({ open: true, message: 'Error al eliminar post', severity: 'error' });
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography>Cargando posts...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ mt: 5, textAlign: "center" }}>
        Posts del Usuario #{id}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Crear Nuevo Post
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 800, margin: "20px auto", px: 2 }}>
        {userPosts.length === 0 ? (
          <Typography variant="body1" align="center" color="text.secondary">
            No hay posts para este usuario
          </Typography>
        ) : (
          userPosts.map((post) => (
            <Card key={post.id} variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {post.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ID: {post.id}
                  </Typography>
                </Box>
                <Typography variant="body2">{post.body}</Typography>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2, justifyContent: "space-between" }}>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/posts/${post.id}`}
                >
                  Editar
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeletePost(post.id!)}
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

      {/* Dialog para crear post */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título"
            fullWidth
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Contenido"
            fullWidth
            multiline
            rows={4}
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleCreatePost} variant="contained" color="primary">
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

export default UserPosts;