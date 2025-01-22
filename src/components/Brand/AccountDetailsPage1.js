import React, { useState, useEffect } from "react";
import { Box, TextField, Stack, Button, Typography, ClickAwayListener, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { logout } from "../../store/brandSlice";
import { useDispatch } from "react-redux";
import LogoutIcon from '@mui/icons-material/Logout';


const AccountDetailsPage1 = () => {

    const user = useSelector(state => state.brandUser);
      const dispatch = useDispatch();
      const navigate = useNavigate();
      const [ loading, setLoading ] = useState(true);
      const [ userDetails, setUserDetails ] = useState('');
      const baseUrl = "http://localhost:8001/usersOn";
      const [passwordDialogue, setPasswordDialogue] = useState(false);
      const [originalPassword, setOriginalPassword] = useState("");
      const [newPassword, setNewPassword] = useState("");
      const [isLoading, setIsLoading] = useState(false);


       const handleSignOut = () => {
          dispatch(logout());
          navigate(`/login`);
         
        };
      
        const handleClickAway = () => {
          //this function keeps the dialogue open, even when user clicks outside the dialogue. dont delete this function
        };

        useEffect(() => {

            if(!user.user_id){
        
              navigate("/login");
          
            }
            else if(user.user_id){
        
            
            const fetchData = async () => {
              try {
        
                    // axios.post("/api/usersOn/get-user-details", {
                      axios.post(baseUrl + "/get-user-details", {
                    userId: user.user_id
                  }).then(ress=>{
                  
                    setUserDetails(ress.data.data);
                    setLoading(false);
              
                  }).catch(e=>{
              
                  })
              
              } catch (error) {
                console.error(error);
              }
            };
        
            fetchData();
          }
          }, [user.user_id]);

          const updatePassword = async (e) => {
            e.preventDefault();
        
            setIsLoading(true);
        
        
            if(!originalPassword || !newPassword){
                setIsLoading(false);
                toast.warning("Enter Valid Password");
              }
        
        
              else {
        
        
              await axios.post(baseUrl + "/change-password",
                { userId: user.user_id, password : originalPassword, newPassword : newPassword },
                {withCredentials: true}
              )
              .then((res) => {
        
        
                    if(!res.data.success){
        
                        setIsLoading(false);
                        toast.error("Password update failed. Please try again.");
        
                    }
                    else if(res.data.success){
                        
                        setIsLoading(false);
                        setPasswordDialogue(false);
                        toast.success("Password updated successfully");
                        
                    }
        
              })
              .catch((err) => {
        
        
                if (err.response && err.response.data.error === "Wrong current password") {
                  toast.warning("Wrong current password");
                } 
        
                else if (err.response && err.response.data.error === "email, password mismatch") {
                  toast.warning("Invalid email or password");
                } 
                
                else {
                  toast.error("An error occurred. Please try again later.");
                }
              });
        
            }
        
            
          };
 

  return (
  <>

  { loading ?  (<CircularProgress />) : (

    <Grid container mt={5}>

        <Grid item xs={12} sm={6} md={4}>
                <Typography sx={{ fontSize : '18px', fontWeight : '500'}}>Your Account</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={8}>
            
            <Grid container fullWidth sx={{  borderStyle : 'solid', borderWidth :'1px', borderColor : '#BCCCDC', marginBottom : '22px', paddingY : '12px', paddingX : '12px'}}>
                
                <Grid item md={4}>
                <Typography sx={{ fontSize : '14px', fontWeight : '500'}}>Personal Info</Typography>
                </Grid>

                <Grid item md={8}>
                <Typography sx={{ fontSize : '14px', fontWeight : '400'}}>{userDetails.name}</Typography>
                <Typography sx={{ fontSize : '14px', fontWeight : '400'}}>{userDetails.email}</Typography>
                       
                </Grid>

            </Grid>

            
            <Grid container fullWidth sx={{  borderStyle : 'solid', borderWidth :'1px', borderColor : '#BCCCDC', marginBottom : '22px', paddingY : '12px', paddingX : '12px'}}>
                
                <Grid item md={4}>
                <Typography sx={{ fontSize : '14px', fontWeight : '500'}}>Account ID</Typography>
                </Grid>

                <Grid item md={8}>
                <Typography sx={{ fontSize : '14px', fontWeight : '400'}}>{userDetails.account_id}</Typography>
                       
                </Grid>

            </Grid>


            <Grid container fullWidth sx={{  borderStyle : 'solid', borderWidth :'1px', borderColor : '#BCCCDC', marginBottom : '22px', paddingY : '12px', paddingX : '12px'}}>
                
                <Grid item md={4} sx={{ display : 'flex', alignItems : 'center'}}>
                <Typography sx={{ fontSize : '14px', fontWeight : '500'}}>Password</Typography>
                </Grid>

                <Grid item md={8}>
                <Stack
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%'
                    }}
                    >
                    <Typography sx={{ fontSize: '14px', fontWeight: '400' }}>**********</Typography>
                    <Button
                        variant="outlined"
                        color="warning"
                        onClick={() => {
                        setPasswordDialogue(true);
                        }}
                        sx={{ marginRight : '12px'}}
                    >
                        Change Password
                    </Button>
                    </Stack>    
                </Grid>

            </Grid>

            <div style={{ textAlign: 'start'}}>
                    <Button startIcon={<LogoutIcon />} sx={{ color : 'grey', textTransform : 'none'}} variant="outlined" color="warning" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </div>

                




            
        </Grid>

     </Grid>

  ) }





        {user && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Dialog
            open={passwordDialogue}
            onClose={()=> setPasswordDialogue(false)}
            disableEscapeKeyDown
            keepMounted
            fullWidth
          >
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent dividers>
          
            <Typography sx={{fontSize: '16px', marginTop: '5px'}} >
                Please enter current password
              </Typography>

              <TextField
                type="password"
                id="originalPassword"
                onChange={(e) => {
                  setOriginalPassword(e.target.value);
                }}
                margin="normal"
                variant="outlined"
                label="Current Password"
              />

              <Typography sx={{fontSize: '16px', marginTop: '5px'}} >
                Please enter new password
              </Typography>

              <TextField
                type="password"
                id="newPassword"
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                margin="normal"
                variant="outlined"
                label="New Password"
              />

        </DialogContent>
            <DialogActions>
              <Button onClick={()=> setPasswordDialogue(false)} color="primary">
                Cancel
              </Button>
              <Button color="success" onClick={updatePassword}>
                SUBMIT
              </Button>
            </DialogActions>
          </Dialog>
        </ClickAwayListener>
      )}


           <ToastContainer autoClose= {2000}/>
      
  </>
  );
};

export default AccountDetailsPage1;
