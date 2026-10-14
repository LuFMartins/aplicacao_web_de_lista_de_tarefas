import { useState, useEffect } from "react";
import { auth } from "../firebaseConnection.ts"
import { onAuthStateChanged } from "firebase/auth";

import { Navigate } from "react-router-dom";

export default function Private({ children }: { children: React.ReactNode }) {

   const [loading, setLoading] = useState(true);
   const [logado, setLogado] = useState(false);

   useEffect(() => {

      async function checkLogin() {
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
               setLoading(false);
               setLogado(false);
            }
         });

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