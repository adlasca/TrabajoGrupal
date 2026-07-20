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

import {
  fetchUserById,
  updateUser,
  clearSelectedUser
} from '../features/users/userSlice';

import type { User } from '../models/User';


function UserDetail() {


  const { id } = useParams<{id:string}>();

  const navigate = useNavigate();

  const dispatch = useAppDispatch();


  const {
    selectedUser,
    loading,
    error
  } = useAppSelector(
      state => state.users
  );


  const [user,setUser] = useState<User | null>(null);



  const [snackbar,setSnackbar] =
      useState<{
        open:boolean;
        message:string;
        severity:'success'|'error'
      }>({
        open:false,
        message:'',
        severity:'success'
      });



  useEffect(()=>{

    if(id){

      dispatch(
          fetchUserById(Number(id))
      );

    }


    return ()=>{

      dispatch(
          clearSelectedUser()
      );

    }


  },[dispatch,id]);




  useEffect(()=>{

    if(selectedUser){

      setUser(selectedUser);

    }

  },[selectedUser]);




  useEffect(()=>{

    if(error){

      setSnackbar({
        open:true,
        message:error,
        severity:'error'
      });

    }


  },[error]);





  const handleChange = (
      field:keyof User,
      value:string
  )=>{


    if(user){

      setUser({
        ...user,
        [field]:value
      });

    }

  }





  const handleSave = async()=>{


    if(user && user.id){


      try{


        const {
          id:userId,
          ...userData
        } = user;



        await dispatch(
            updateUser({
              id:userId,
              user:userData
            })
        ).unwrap();



        setSnackbar({
          open:true,
          message:'Usuario actualizado correctamente',
          severity:'success'
        });



        setTimeout(()=>{

          navigate('/users');

        },1500);



      }catch(error){


        setSnackbar({
          open:true,
          message:'Error al actualizar usuario',
          severity:'error'
        });


      }


    }


  }





  if(loading || !user){

    return (

        <Box sx={{textAlign:'center',mt:5}}>

          <Typography>
            Cargando usuario...
          </Typography>

        </Box>

    );

  }






  return (

      <Box
          sx={{
            maxWidth:900,
            margin:'40px auto',
            px:2
          }}
      >


        <Card
            variant="outlined"
            sx={{
              borderRadius:3
            }}
        >


          <CardContent
              sx={{
                display:'flex',
                flexDirection:'column',
                gap:2
              }}
          >


            <Typography
                variant="h5"
                sx={{
                  fontWeight:'bold'
                }}
            >

              Editar Usuario #{user.id}

            </Typography>



            {/* DATOS PRINCIPALES */}


            <TextField
                label="Nombre"
                value={user.name}
                fullWidth
                onChange={
                  e=>handleChange(
                      'name',
                      e.target.value
                  )
                }
            />



            <TextField
                label="Username"
                value={user.username}
                fullWidth
                onChange={
                  e=>handleChange(
                      'username',
                      e.target.value
                  )
                }
            />



            <TextField
                label="Email"
                value={user.email}
                fullWidth
                onChange={
                  e=>handleChange(
                      'email',
                      e.target.value
                  )
                }
            />



            <TextField
                label="Teléfono"
                value={user.phone}
                fullWidth
                onChange={
                  e=>handleChange(
                      'phone',
                      e.target.value
                  )
                }
            />



            <TextField
                label="Website"
                value={user.website}
                fullWidth
                onChange={
                  e=>handleChange(
                      'website',
                      e.target.value
                  )
                }
            />





            {/* ADDRESS */}


            <Typography
                variant="h6"
                sx={{mt:2}}
            >

              Dirección

            </Typography>



            <TextField
                label="Calle"
                value={user.addressStreet}
                fullWidth
                onChange={
                  e=>handleChange(
                      'addressStreet',
                      e.target.value
                  )
                }
            />



            <TextField
                label="Suite"
                value={user.addressSuite}
                fullWidth
                onChange={
                  e=>handleChange(
                      'addressSuite',
                      e.target.value
                  )
                }
            />



            <TextField
                label="Ciudad"
                value={user.addressCity}
                fullWidth
                onChange={
                  e=>handleChange(
                      'addressCity',
                      e.target.value
                  )
                }
            />



            <TextField
                label="Código Postal"
                value={user.addressZipcode}
                fullWidth
                onChange={
                  e=>handleChange(
                      'addressZipcode',
                      e.target.value
                  )
                }
            />



            <TextField
                label="Latitud"
                value={user.addressGeoLat}
                fullWidth
                onChange={
                  e=>handleChange(
                      'addressGeoLat',
                      e.target.value
                  )
                }
            />



            <TextField
                label="Longitud"
                value={user.addressGeoLng}
                fullWidth
                onChange={
                  e=>handleChange(
                      'addressGeoLng',
                      e.target.value
                  )
                }
            />






            {/* COMPANY */}


            <Typography
                variant="h6"
                sx={{mt:2}}
            >

              Empresa

            </Typography>



            <TextField
                label="Nombre Empresa"
                value={user.companyName}
                fullWidth
                onChange={
                  e=>handleChange(
                      'companyName',
                      e.target.value
                  )
                }
            />



            <TextField
                label="Catch Phrase"
                value={user.companyCatchPhrase}
                fullWidth
                onChange={
                  e=>handleChange(
                      'companyCatchPhrase',
                      e.target.value
                  )
                }
            />



            <TextField
                label="Business"
                value={user.companyBs}
                fullWidth
                onChange={
                  e=>handleChange(
                      'companyBs',
                      e.target.value
                  )
                }
            />




          </CardContent>





          <CardActions
              sx={{
                px:4,
                pb:4,
                gap:2
              }}
          >


            <Button
                variant="contained"
                color="secondary"
                component={Link}
                to="/users"
            >

              Regresar

            </Button>



            <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
            >

              Guardar

            </Button>


          </CardActions>



        </Card>





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

          <Alert
              severity={snackbar.severity}
          >

            {snackbar.message}

          </Alert>


        </Snackbar>




      </Box>


  );


}


export default UserDetail;