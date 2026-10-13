import { useState } from "react";
import {Link} from "react-router-dom"

import "./home.css"

function Home() {

   const [email, setEmail] = useState('');
   const [senha, setSenha] = useState('');

   function handleLogin(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault(); // Evita que a página seja recarregada ao enviar o formulário

      if(email === '' || senha === '') {
         alert('Preencha todos os campos');
         return;
      }

      alert(`Email: ${email}\nSenha: ${senha}`);
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