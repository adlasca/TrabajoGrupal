import { Container, Typography, Box, Paper } from "@mui/material";

function About() {
  return (
    <Container sx={{ mt: 5 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Acerca de Posts Manager
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Esta es una aplicación de gestión de contenido que permite administrar:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body1">
            Usuarios: CRUD completo de usuarios
          </Typography>
          <Typography component="li" variant="body1">
            Posts: Creación, edición y eliminación de publicaciones
          </Typography>
          <Typography component="li" variant="body1">
            Comentarios: Gestión de comentarios por post
          </Typography>
          <Typography component="li" variant="body1">
            Albums: Organización de fotos
          </Typography>
          <Typography component="li" variant="body1">
            Todos: Lista de tareas por usuario
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Tecnologías: React, TypeScript, Redux Toolkit, Material-UI, React Router
        </Typography>
      </Paper>
    </Container>
  );
}

export default About;