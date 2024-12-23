import { Router } from "express";
import userModel from "../models/userModel.js";
import { auth } from "../middleware/authSession.js";
import passport from "passport";

const router = Router()

//En el endpoint que quedo de reguster colocaremos el siguiente middleware despues de la ruta del endpoint con el cvual indicaremos cual sera el archivo que utilizaremos del archivo passport.config, en este mismo middleware especificaremos a donde nos dirigira si es que encontramos un error, aqui debemos de insertar esa ruta que crearemos posteriormente
router.post('/register',passport.authenticate('register',{failureRedirect: '/api/session/failRegister'}),(req,res)=>{

    req.login(req.user,(error)=>{
        if(error){
            return res.send('error al registrar')
        }
        res.send('todo salio bien')
    })
})


router.post('/login',passport.authenticate('login',{failureRedirect: '/api/session/failLogin'}),(req,res)=>{
    
    if(!req.user)return res.send('Password incorrrecta')
        res.send('success')

})



router.get('/comprobacion', auth, (req,res)=>{
    const email = req.user.email
    const firstName = req.user.firstName
    const lastName = req.user.lastName
    const age = req.user.age
    res.send({status:'ok', payload:{email,firstName,lastName,age}})
})


router.delete('/logout',(req,res)=>{
    req.session.destroy(err=>{
        if(!err) return res.send({status:'logout ok'})

        res.send({status:'logout error'})
    })
})

export default router