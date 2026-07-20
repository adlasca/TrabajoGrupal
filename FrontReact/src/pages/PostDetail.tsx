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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchPostById, updatePost } from '../features/posts/postSlice';
import { fetchUsers } from '../features/users/userSlice';
import { clearSelectedPost } from '../features/posts/postSlice';
import type { Post } from '../models/Post';

function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedPost, loading, error } = useAppSelector((state) => state.posts);
  const { users } = useAppSelector((state) => state.users);
  
  const [post, setPost] = useState<Post | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(Number(id)));
      dispatch(fetchUsers());
    }
    return () => {
      dispatch(clearSelectedPost());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedPost) {
      setPost(selectedPost);
    }
  }, [selectedPost]);

  useEffect(() => {
    if (error) {
      setSnackbar({ open: true, message: error, severity: 'error' });
    }
  }, [error]);

  const handleSave = async () => {
    if (post && post.id) {
      try {
        const { id: postId, ...postData } = post;
        await dispatch(updatePost({ id: postId, post: postData })).unwrap();
        setSnackbar({ open: true, message: 'Post actualizado exitosamente', severity: 'success' });
        setTimeout(() => navigate('/posts'), 1500);
      } catch (err) {
        setSnackbar({ open: true, message: 'Error al actualizar post', severity: 'error' });
      }
    }
  };

  if (loading || !post) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography>Cargando post...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, margin: "40px auto", px: 2 }}>
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Editar Post
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              ID: {post.id}
            </Typography>
          </Box>

          <FormControl fullWidth>
            <InputLabel>Usuario</InputLabel>
            <Select
              value={post.userId || 0}
              onChange={(e) => setPost({ ...post, userId: Number(e.target.value) })}
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
            label="Título"
            variant="outlined"
            value={post.title}
            fullWidth
            onChange={(e) => setPost({ ...post, title: e.target.value })}
          />
          <TextField
            label="Contenido"
            variant="outlined"
            value={post.body}
            fullWidth
            multiline
            rows={4}
            onChange={(e) => setPost({ ...post, body: e.target.value })}
          />
        </CardContent>

        <CardActions sx={{ justifyContent: "flex-start", px: 4, pb: 4, gap: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            to="/posts"
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
          <Button
            variant="contained"
            color="info"
            size="large"
            component={Link}
            to={`/posts/${post.id}/comments`}
          >
            Ver Comentarios
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

export default PostDetail;