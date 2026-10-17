import { useState } from "react";
import { Link } from "react-router-dom"

// import "./register.css"

import { auth } from "../../firebaseConnection.ts"
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

function Register() {

   const [email, setEmail] = useState('');
   const [senha, setSenha] = useState('');

   const navigate = useNavigate();

   async function handleRegister(e: React.SubmitEvent<HTMLFormElement>) {
      e.preventDefault(); // Evita que a página seja recarregada ao enviar o formulário

      if (email === '' || senha === '') {
         alert('Preencha todos os campos');
         return;
      }

      try {
         const credential = await createUserWithEmailAndPassword(auth, email, senha)

         await sendEmailVerification(credential.user)

         toast.success(
            "Cadastro realizado! Verifique seu e-mail."
         );


         await signOut(auth)
         navigate('/', { replace: true })
      } catch (error: any) {

         error.code === 'auth/email-already-in-use' && alert('Email já está em uso')
         error.code === 'auth/weak-password' && alert('Senha deve ter no mínimo 6 caracteres')
         error.code === 'auth/invalid-email' && alert('Email inválido')

         setEmail('');
         setSenha('');
      }
   }

   return (
      <>
         <div className="home-container">
            <h1>LISTA DE TAREFAS</h1>
            <span>Gerencie suas tarefas de forma fácil e rápida</span>

            <form className="form" onSubmit={handleRegister}>
               <input type="text" placeholder="Digite seu email" value={email} onChange={(e) => setEmail(e.target.value)} />
               <input type="password" placeholder="******" value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="false" />

               <button type="submit">CADASTRAR</button>
            </form>

            <Link className="link" to="/">Já possui uma conta? Faça o Login</Link>
         </div>
      </>
   )
}

export default Register;