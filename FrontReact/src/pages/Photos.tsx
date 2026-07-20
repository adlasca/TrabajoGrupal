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

import {
  createPhoto,
  deletePhoto,
  fetchPhotos,
  fetchPhotosByAlbumId
} from '../features/photos/photoSlice';

import type { Photo } from '../models/Photo';



function Photos() {


  const { id } = useParams<{id:string}>();

  const dispatch = useAppDispatch();


  const {
    photos,
    loading,
    error
  } = useAppSelector(
      (state)=>state.photos
  );



  const [openDialog,setOpenDialog]=useState(false);



  const [newPhoto,setNewPhoto]=useState<Omit<Photo,'id'>>({

    albumId:id ? Number(id) : 1,

    title:"",

    url:"",

    thumbnailUrl:""

  });





  const [snackbar,setSnackbar]=useState<{

    open:boolean;

    message:string;

    severity:"success"|"error"

  }>({

    open:false,

    message:"",

    severity:"success"

  });






  // Cargar fotos según contexto

  useEffect(()=>{


    if(id){


      dispatch(
          fetchPhotosByAlbumId(
              Number(id)
          )
      );


    }else{


      dispatch(
          fetchPhotos()
      );


    }


  },[dispatch,id]);









  // Mostrar errores

  useEffect(()=>{


    if(error){


      setSnackbar({

        open:true,

        message:error,

        severity:"error"

      });


    }


  },[error]);









  // Crear foto

  const handleCreatePhoto = async()=>{


    if(
        !newPhoto.title.trim() ||
        !newPhoto.url.trim()
    ){


      setSnackbar({

        open:true,

        message:"Título y URL son obligatorios",

        severity:"error"

      });


      return;


    }





    try{


      await dispatch(
          createPhoto(newPhoto)
      ).unwrap();




      setSnackbar({

        open:true,

        message:"Foto creada correctamente",

        severity:"success"

      });





      setOpenDialog(false);





      setNewPhoto({

        albumId:id ? Number(id) : 1,

        title:"",

        url:"",

        thumbnailUrl:""

      });






      // Recargar según ubicación

      if(id){


        dispatch(
            fetchPhotosByAlbumId(
                Number(id)
            )
        );


      }else{


        dispatch(
            fetchPhotos()
        );


      }





    }catch(error){



      setSnackbar({

        open:true,

        message:"Error al crear foto",

        severity:"error"

      });


    }


  };









  // Eliminar foto

  const handleDeletePhoto = async(photoId:number)=>{


    if(window.confirm("¿Eliminar foto?")){


      try{


        await dispatch(
            deletePhoto(photoId)
        ).unwrap();




        if(id){


          dispatch(
              fetchPhotosByAlbumId(
                  Number(id)
              )
          );


        }else{


          dispatch(
              fetchPhotos()
          );


        }





        setSnackbar({

          open:true,

          message:"Foto eliminada correctamente",

          severity:"success"

        });





      }catch(error){



        setSnackbar({

          open:true,

          message:"Error al eliminar foto",

          severity:"error"

        });



      }


    }


  };









  if(loading){


    return(

        <Box
            sx={{
              textAlign:"center",
              mt:5
            }}
        >

          <Typography>

            Cargando fotos...

          </Typography>


        </Box>

    );


  }









  return (

      <Box
          sx={{
            p:3
          }}
      >



        <Typography variant="h4">

          {
            id
                ? `Fotos del Álbum #${id}`
                : "Todas las Fotos"
          }


        </Typography>







        <Button

            variant="outlined"

            color="warning"

            component={Link}

            to="/"

            sx={{
              mb:2,
              mr:2
            }}

        >

          Regresar

        </Button>







        <Button

            variant="contained"

            color="primary"

            onClick={()=>setOpenDialog(true)}

            sx={{
              mb:2
            }}

        >

          Agregar Foto

        </Button>









        <Grid
            container
            spacing={3}
        >



          {
            photos.length===0 ?


                <Grid size={{xs:12}}>


                  <Typography align="center">

                    No existen fotos

                  </Typography>


                </Grid>


                :



                photos.map((photo)=>(


                    <Grid
                        size={{
                          xs:12,
                          sm:6,
                          md:4
                        }}

                        key={photo.id}
                    >



                      <Card>


                        <CardMedia

                            component="img"

                            height="200"

                            image={
                                photo.thumbnailUrl ||
                                photo.url
                            }

                            alt={photo.title}

                        />




                        <CardContent>


                          <Typography>

                            {photo.title}

                          </Typography>


                          <Typography variant="caption">

                            ID: {photo.id}

                          </Typography>


                        </CardContent>





                        <CardActions>


                          <Button

                              variant="outlined"

                              color="error"

                              fullWidth

                              onClick={()=>
                                  handleDeletePhoto(
                                      photo.id!
                                  )
                              }

                          >

                            Eliminar

                          </Button>


                        </CardActions>




                      </Card>



                    </Grid>


                ))


          }



        </Grid>









        {/* CREAR FOTO */}


        <Dialog

            open={openDialog}

            onClose={()=>setOpenDialog(false)}

            fullWidth

            maxWidth="sm"

        >



          <DialogTitle>

            Agregar Nueva Foto

          </DialogTitle>





          <DialogContent>



            <TextField

                margin="dense"

                label="Album ID"

                type="number"

                fullWidth

                value={newPhoto.albumId}

                disabled={!!id}

                onChange={(e)=>

                    setNewPhoto({

                      ...newPhoto,

                      albumId:Number(
                          e.target.value
                      )

                    })

                }

            />





            <TextField

                margin="dense"

                label="Título"

                fullWidth

                value={newPhoto.title}

                onChange={(e)=>

                    setNewPhoto({

                      ...newPhoto,

                      title:e.target.value

                    })

                }

            />






            <TextField

                margin="dense"

                label="URL Imagen"

                fullWidth

                value={newPhoto.url}

                onChange={(e)=>

                    setNewPhoto({

                      ...newPhoto,

                      url:e.target.value

                    })

                }

            />






            <TextField

                margin="dense"

                label="Thumbnail"

                fullWidth

                value={newPhoto.thumbnailUrl}

                onChange={(e)=>

                    setNewPhoto({

                      ...newPhoto,

                      thumbnailUrl:e.target.value

                    })

                }

            />



          </DialogContent>







          <DialogActions>


            <Button
                onClick={()=>setOpenDialog(false)}
            >

              Cancelar

            </Button>





            <Button

                variant="contained"

                onClick={handleCreatePhoto}

            >

              Crear

            </Button>



          </DialogActions>





        </Dialog>








        <Snackbar

            open={snackbar.open}

            autoHideDuration={3000}

            onClose={()=>

                setSnackbar({

                  ...snackbar,

                  open:false

                })

            }

        >


          <Alert severity={snackbar.severity}>

            {snackbar.message}


          </Alert>


        </Snackbar>





      </Box>


  );

}



export default Photos;