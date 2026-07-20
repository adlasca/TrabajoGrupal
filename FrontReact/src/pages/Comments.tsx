import { useEffect } from 'react';

import {
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
    fetchComments,
    fetchCommentsByPostId,
    deleteComment,
} from '../features/comments/commentSlice';
import { Link, useParams } from "react-router-dom";

function Comments() {

  const dispatch = useAppDispatch();
  const { comments, loading, error } = useAppSelector((state) => state.comments);

    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            dispatch(fetchCommentsByPostId(Number(id)));
        } else {
            dispatch(fetchComments());
        }
    }, [dispatch, id]);

  const handleDeleteComment = async (commentId: number) => {
    if (window.confirm('¿Estás seguro de eliminar este comentario?')) {
      try {
        await dispatch(deleteComment(commentId)).unwrap();
      } catch (err) {
        // Error manejado por el slice
      }
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 5, textAlign: 'center' }}>
        <Typography>Cargando comentarios...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
            {id ? `Comentarios del Post #${id}` : "Todos los Comentarios"}
        </Typography>

        <Button
            variant="outlined"
            color="info"
            component={Link}
            to={id ? `/posts/${id}` : "/posts"}
            sx={{ mb: 2, mr: 2 }}
        >
            Regresar
        </Button>
        {id && (
            <Button
                variant="contained"
                color="primary"
                component={Link}
                to={`/posts/${id}/comments/new`}
                sx={{ mb: 2 }}
            >
                Crear Comentario
            </Button>
        )}

      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Post ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Body</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {comments.map((comment) => (
            <TableRow key={comment.id}>
              <TableCell>{comment.id}</TableCell>
              <TableCell>{comment.postId}</TableCell>
              <TableCell>{comment.name}</TableCell>
              <TableCell>{comment.email}</TableCell>
              <TableCell>{comment.body}</TableCell>
              <TableCell>
                <Button
                  color="primary"
                  variant="outlined"
                  component={Link}
                  to={`/comments/${comment.id}`}
                  sx={{ mr: 1 }}
                >
                  Editar
                </Button>
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => handleDeleteComment(comment.id!)}
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

export default Comments;