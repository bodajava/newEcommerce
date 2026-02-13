import {NextAuthOptions} from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { jwtDecode } from 'jwt-decode';


export const authOptions : NextAuthOptions = {
pages : {
    signIn : '/Login'
},

providers : [
    Credentials({
        name : 'Credentials',
        credentials : {
            email :{},
            password : {},
        },
        authorize : async (Credentials)=>{
           const res = await fetch(`${process.env.API}/auth/signin`,{
            method : 'POST' ,
            body : JSON.stringify({
                email:Credentials?.email,
                password:Credentials?.password,
            }),
            headers :{"Content-Type" : "application/json"},
           })
           const payload = await res.json()

           if(payload.message === 'success'){
            const decodedToken : {id : string} = jwtDecode(payload.token)
            return {
                id : decodedToken.id,
                user : payload.user,
                token : payload.token,
            }
           }else{
            throw new Error(payload.message || "Invalid credentials")
           }
        }
        
    })
],


callbacks :{
    async jwt({token , user }){
        if(user){
            token.user = user.user;
            token.token = user.token;
            token.id = user.id;
        }

        return token
    },
    async session ({session,token}){
        if(token.user){
            session.user = token.user;
            (session as any).token = token.token;
        }
        return session
    }
},


}