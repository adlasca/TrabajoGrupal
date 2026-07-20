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
import { fetchCommentById, createComment, updateComment, clearSelectedComment } from '../features/comments/commentSlice';
import { Comment } from '../models/Comment';

function CommentForm() {
  const { id, postId } = useParams<{ id: string; postId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedComment, loading, error } = useAppSelector((state) => state.comments);
  
  const [comment, setComment] = useState<Omit<Comment, 'id'>>({
    postId: Number(postId || 0),
    name: '',
    email: '',
    body: '',
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing && id) {
      dispatch(fetchCommentById(Number(id)));
    }
    return () => {
      dispatch(clearSelectedComment());
    };
  }, [dispatch, id, isEditing]);

  useEffect(() => {
    if (selectedComment && isEditing) {
      setComment({
        postId: selectedComment.postId,
        name: selectedComment.name,
        email: selectedComment.email,
        body: selectedComment.body,
      });
    }
  }, [selectedComment, isEditing]);

  useEffect(() => {
    if (error) {
      setSnackbar({ open: true, message: error, severity: 'error' });
    }
  }, [error]);

  const handleSave = async () => {
    try {
      if (isEditing && id) {
        await dispatch(updateComment({ id: Number(id), comment })).unwrap();
        setSnackbar({ open: true, message: 'Comentario actualizado', severity: 'success' });
        setTimeout(() => navigate(`/posts/${comment.postId}/comments`), 1500);
      } else {
        await dispatch(createComment(comment)).unwrap();
        setSnackbar({ open: true, message: 'Comentario creado', severity: 'success' });
        setTimeout(() => navigate(`/posts/${comment.postId}/comments`), 1500);
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al guardar comentario', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, margin: "40px auto", px: 2 }}>
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {isEditing ? 'Editar Comentario' : 'Crear Nuevo Comentario'}
          </Typography>

          <TextField
            label="Nombre"
            variant="outlined"
            value={comment.name}
            fullWidth
            onChange={(e) => setComment({ ...comment, name: e.target.value })}
          />
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={comment.email}
            fullWidth
            onChange={(e) => setComment({ ...comment, email: e.target.value })}
          />
          <TextField
            label="Contenido"
            variant="outlined"
            value={comment.body}
            fullWidth
            multiline
            rows={4}
            onChange={(e) => setComment({ ...comment, body: e.target.value })}
          />
        </CardContent>

        <CardActions sx={{ justifyContent: "flex-start", px: 4, pb: 4, gap: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            to={`/posts/${comment.postId}/comments`}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSave}
          >
            {isEditing ? 'Actualizar' : 'Crear'}
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

export default CommentForm;