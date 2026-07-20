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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchPosts, createPost, deletePost } from '../features/posts/postSlice';
import { fetchUsers } from '../features/users/userSlice';
import type { Post } from '../models/Post';

function Posts() {
  const dispatch = useAppDispatch();
  const { posts, loading, error } = useAppSelector((state) => state.posts);
  const { users } = useAppSelector((state) => state.users);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [newPost, setNewPost] = useState<Omit<Post, 'id'>>({
    userId: 0,
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
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setSnackbar({ open: true, message: error, severity: 'error' });
    }
  }, [error]);

  const handleCreatePost = async () => {
    if (newPost.userId === 0) {
      setSnackbar({ open: true, message: 'Selecciona un usuario', severity: 'error' });
      return;
    }
    if (!newPost.title.trim() || !newPost.body.trim()) {
      setSnackbar({ open: true, message: 'Todos los campos son requeridos', severity: 'error' });
      return;
    }
    try {
      await dispatch(createPost(newPost)).unwrap();
      setSnackbar({ open: true, message: 'Post creado exitosamente', severity: 'success' });
      setOpenDialog(false);
      setNewPost({ userId: 0, title: '', body: '' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al crear post', severity: 'error' });
    }
  };

  const handleDeletePost = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este post?')) {
      try {
        await dispatch(deletePost(id)).unwrap();
        setSnackbar({ open: true, message: 'Post eliminado', severity: 'success' });
      } catch (err) {
        setSnackbar({ open: true, message: 'Error al eliminar post', severity: 'error' });
      }
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 5, textAlign: 'center' }}>
        <Typography>Cargando posts...</Typography>
      </Container>
    );
  }

  return (
    <>
      <Container sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Posts
        </Typography>

        <Button
            variant="outlined"
            color="warning"
            component={Link}
            to="/"
            sx={{ mb: 2, mr: 2 }}
        >
          Regresar
        </Button>
        <Button
          variant="contained"
          color="warning"
          sx={{ mb: 2 }}
          onClick={() => setOpenDialog(true)}
        >
          Crear Post
        </Button>

        <Table sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Body</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.id}</TableCell>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.body}</TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    variant="outlined"
                    component={Link}
                    to={`/posts/${post.id}`}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    color="secondary"
                    variant="outlined"
                    component={Link}
                    to={`/posts/${post.id}/comments`}
                    sx={{ mr: 1 }}
                  >
                    Comentarios
                  </Button>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => handleDeletePost(post.id!)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>

      {/* Dialog para crear post */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Post</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Usuario</InputLabel>
            <Select
              value={newPost.userId}
              onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
              label="Usuario"
            >
              <MenuItem value={0}>Seleccionar usuario</MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} (ID: {user.id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
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

export default Posts;