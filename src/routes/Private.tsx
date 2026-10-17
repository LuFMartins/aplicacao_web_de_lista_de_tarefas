import { useState, useEffect } from "react";
import { auth } from "../firebaseConnection.ts"
import { onAuthStateChanged } from "firebase/auth";

import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Private({ children }: { children: React.ReactNode }) {

   const [loading, setLoading] = useState(true);
   const [logado, setLogado] = useState(false);

   useEffect(() => {

      function checkLogin() {
         const unsub = onAuthStateChanged(auth, (user) => { // Verifica se o usuário está logado
            if (user) {
               const userData = {
                  uid: user.uid,
                  email: user.email
               }

               localStorage.setItem('@userDetails', JSON.stringify(userData)); // Salva os dados do usuário no localStorage

               setLoading(false);
               setLogado(true);
            } else {
               // Usuário não está logado
               localStorage.removeItem('@userDetails'); // Remove os dados do usuário do localStorage
               setLoading(false);
               setLogado(false);
            }
         });

         return unsub;
      }

      checkLogin();
   }, [])

   if (loading) {
      return (
         <div>
            <h1>Carregando...</h1>
         </div>
      )
   }

   if (!logado) { 
      return <Navigate to="/" />
   }

   return (
      <>
         {children}
         {console.log('PASSOU AQUI')}
      </>
   )
}