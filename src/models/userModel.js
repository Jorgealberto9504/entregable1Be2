import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    first_name:{
        type:String,
    },
    last_name:{
        type:String,
    },
    email:{
        type:String,
        unique:true
    },
    age:{
        type:Number,
    },
    
    password:{
        type:String,

    },
    role:{
        type:String,
        default:'user'
    }
})

export default mongoose.model('users', userSchema)