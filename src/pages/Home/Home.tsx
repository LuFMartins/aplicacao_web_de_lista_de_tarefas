import { useState } from "react";
import { Link } from "react-router-dom"
import "./home.css"

import { auth } from "../../firebaseConnection.ts"
import { signInWithEmailAndPassword } from "firebase/auth";

import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

function Home() {

   const [email, setEmail] = useState('');
   const [senha, setSenha] = useState('');

   // Hook do React Router para navegação programática
   const navigate = useNavigate(); 


   // Função para lidar com o login do usuário
   async function handleLogin(e: React.SubmitEvent<HTMLFormElement>) {
      e.preventDefault(); // Evita que a página seja recarregada ao enviar o formulário

      if (email === '' || senha === '') {
         toast.info('Preencha todos os campos');
         return;
      }

      try {

         await signInWithEmailAndPassword(auth, email, senha)
         navigate('/admin', { replace: true })

      } catch (error: any) {
         
         error.code === 'auth/invalid-credential' && toast.error('Email ou senha inválidos')
         error.code === 'auth/user-not-found' && toast.error('Usuário não encontrado')
         error.code === 'auth/invalid-email' && toast.error('Email inválido')
         error.code === 'auth/wrong-password' && toast.error('Senha incorreta')

         setEmail('');
         setSenha('');

      }

   }

   return (
      <>
         <div className="home-container">
            <h1>LISTA DE TAREFAS</h1>
            <span>Gerencie suas tarefas de forma fácil e rápida</span>

            <form className="form" onSubmit={handleLogin}>
               <input type="text" placeholder="Digite seu email" value={email} onChange={(e) => setEmail(e.target.value)} />
               <input type="password" placeholder="******" value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="false" />

               <button type="submit">Acessar</button>
            </form>

            <Link className="link" to="/register">Não possui uma conta? Cadastre-se</Link>
         </div>
      </>
   )
}

export default Home;