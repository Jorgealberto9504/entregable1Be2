import passport, { Passport } from "passport";
import local from 'passport-local'
import userModel from "../models/userModel.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from 'passport-github2'


//aca asignamos una constante con local.strategy 
const LocalStrategy = local.Strategy


//crearemos un afuncion en la cual tendremos la logica de los endpoints
const initializePassport = () =>{

    passport.use('github',new GitHubStrategy({
        clientID:'Iv23liwMbshShD89X71W',
        clientSecret:'e77ff0ebd235b0dad55af628d014ef5b96af5982',
        callbackURL:'http://localhost:8080/api/session/githubcallback'
    },async(_,__,profile,done)=>{
        try {
            let user = await userModel.findOne({id_github:profile._json.id})
            if(user){
                done(null,user)
            }

            const newUser = {
                first_name: profile._json.name,
                last_name:"",
                age:0,
                email:"",
                password:"",
                role:'user',
            }
            const result = await userModel.create(newUser)
            done(null,result)
        } catch (error) {
            done(error)
        }
    }))

//creamos un middleware de passport
        passport.use('register', new LocalStrategy(
            {passReqToCallback:true, usernameField:"email"},// este es un objeto de configuracion en el cual pondremos 2 configuraciones las cuales son (el usuario y el password por defecto los pasa passport) un req con mas datos, que sera la primer configuracion  con la cual indicamos que recibira un req.body con mas datos de los que ya incluye por defecto, la segunda confirguracion seria indicarle que el user que recibe por defecto sera el email que entrara por medio del req, ya que tomaremos el email como usuario, el password no es necesario que aclaremos de donde vendra ya que de igual forma se llama password en nuestro model creado


            //los parametros que recibira nuestra funcion son primero el req, que es todo lo que ingresara el usuario, el username, el password, y el donde seria como el next o el res, que daria la continuacion en caso de que todo este bien, dentro de esta siguiente funcion tendremos la logica del endpoint register
            async(req,username,password,done)=>{
                const {first_name,last_name,age,role} = req.body

                try {

                    const existUser = await userModel.findOne({email:username})//aqui le asignamos al email el contenido de username que vendria siendo el parametro que entrara en la funcion que seria el email que tomaremos como user de nuestra database
                    if(existUser) return done(null.false)//aca indicamos los siguiente, en caso de que usuario exista vamos a devolver si hubo un error, que seria nulo o sea que no hubo error y el usuario no lo tengo, practicamente seria decir que si el usuario existe termine la funcion llamando a done 
                
                    const newUser={
                        first_name,
                        last_name,
                        age,
                        email:username,
                        password:createHash(password), //Esta es la configuracion del hasheo del password, debemos de configurar este hasheo en un archivo utils.js en el cual crearemos la funcion que nos manejara este. de igual forma necesitamos instalar la libreria bcryp e importarla en utils.js e importar la funcion en este archivo actual
                        role
                    }
                
                    const user = await userModel.create(newUser)
                    done(null,user)
                        //Aca ya no necesitarempos los req.session ya que passport nos creara esto
                
                } catch (error) {
                    done(error);
                }

            }))

}

//Aca estamos configurando nuestro login con passport al igual que lo hicimos arriba con register
passport.use('login',new LocalStrategy(
    {usernameField:'email'},
    async(username,password,done)=>{ 
        try {
    const user = await userModel.findOne({email:username})
    if(!user)return done(null,false)
        if(!isValidPassword(user,password)){
            done(null,false)
        }

        return done(null,user)
        } catch (error) {
            done(error)
        }
    }
))


passport.serializeUser((user, done) => {
    // Guarda solo el ID del usuario en la sesión
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        // Aquí puedes buscar el usuario en la base de datos por su ID
        const user = await userModel.findById(id); // Asegúrate de importar tu modelo de usuario
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});


//exportamos nuestra funcion creada anteriormente
export default initializePassport