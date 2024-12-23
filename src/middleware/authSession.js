export const auth = (req,res,next)=>{
    if(!req.isAuthenticated()){//isauthenticated es una funcion que ya incluye passport ques para ver si ta se logueo
        return res.send('error de autenticacion')
}
    if(req.user?.role === 'admin' || req.user?.role === 'user'){
        return next()
    }
}

export const authAdmin = (req,res,next)=>{
    if(!req.isAuthenticated()){//isauthenticated es una funcion que ya incluye passport ques para ver si ta se logueo
        return res.send('error de autenticacion')
}
    if(req.user?.role === 'admin'){
        return next()
    }
    return res.send('errorazo')
}