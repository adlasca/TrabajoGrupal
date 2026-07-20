import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import HelpIcon from "@mui/icons-material/Help";
import ArticleIcon from '@mui/icons-material/Article';
import PeopleIcon from '@mui/icons-material/People';
import PhotoAlbumIcon from '@mui/icons-material/PhotoAlbum';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import ListIcon from '@mui/icons-material/List';
import { Link } from "react-router-dom";


function NavBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Posts Manager
        </Typography>
        <Button color="inherit" component={Link} to="/" startIcon={<HomeIcon />}>
          Inicio
        </Button>
        <Button color="inherit" component={Link} to="/about" startIcon={<HelpIcon />}>
          Acerca de
        </Button>
        <Button color="inherit" component={Link} to="/posts" startIcon={<ArticleIcon />}>
          Posts
        </Button>
        <Button color="inherit" component={Link} to="/users" startIcon={<PeopleIcon />}>
          Usuarios
        </Button>
        <Button color="inherit" component={Link} to="/albums" startIcon={<PhotoAlbumIcon />}>
          Albums
        </Button>
        <Button color="inherit" component={Link} to="/photos" startIcon={<InsertPhotoIcon />}>
          Photos
        </Button>
        <Button color="inherit" component={Link} to="/todos" startIcon={<ListIcon />}>
          Todos
        </Button>

      </Toolbar>
    </AppBar>
  );
}

export default NavBar;