import { Container, Typography, Card, Box } from "@mui/material";
import ArticleIcon from '@mui/icons-material/Article';
import PeopleIcon from '@mui/icons-material/People';
import CommentIcon from '@mui/icons-material/Comment';
import PhotoAlbumIcon from '@mui/icons-material/PhotoAlbum';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import ListIcon from '@mui/icons-material/List';
import { Link } from "react-router-dom";

function Home() {
    const cards = [
        {
            icon: <ArticleIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
            title: 'Posts',
            description: 'Crea, edita y elimina publicaciones',
            path: '/posts'
        },

        {
            icon: <PeopleIcon sx={{ fontSize: 60, color: 'secondary.main' }} />,
            title: 'Usuarios',
            description: 'Gestiona los usuarios del sistema',
            path: '/users'
        },

        {
            icon: <CommentIcon sx={{ fontSize: 60, color: 'success.main' }} />,
            title: 'Comentarios',
            description: 'Administra los comentarios de los posts',
            path: '/comments'
        },

        {
            icon: <PhotoAlbumIcon sx={{ fontSize: 60, color: 'warning.main' }} />,
            title: 'Albums',
            description: 'Organiza tus fotos en albums',
            path: '/albums'
        },

        {
            icon: <InsertPhotoIcon sx={{ fontSize: 60, color: 'success.main' }} />,
            title: 'Photos',
            description: 'Administra tus fotos',
            path: '/photos'
        },

        {
            icon: <ListIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
            title: 'Todo',
            description: 'Gestiona tus tareas',
            path: '/userTodos'
        }
    ];

    return (
        <Container sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom align="center">
                Bienvenido a Posts Manager
            </Typography>
            <Typography variant="h6" gutterBottom align="center" color="text.secondary">
                Administra tus publicaciones, usuarios, comentarios y más
            </Typography>

            <Box
                sx={{
                    mt: 4,
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)'
                    },
                    gap: 3
                }}
            >
                {cards.map((card, index) => (
                    <Card
                        key={index}
                        component={Link}
                        to={card.path}
                        sx={{
                            height: 260,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 3,
                            textDecoration: 'none',
                            color: 'inherit',
                            cursor: 'pointer',
                            transition: '0.3s',

                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: 6
                            }
                        }}
                    >
                        {card.icon}

                        <Typography variant="h6" sx={{ mt: 2 }}>
                            {card.title}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" align="center">
                            {card.description}
                        </Typography>
                    </Card>
                ))}

            </Box>
        </Container>
    );
}

export default Home;