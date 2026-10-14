import {useState} from 'react';
import './admin.css'

import { auth } from "../../firebaseConnection.ts"
import { signOut } from "firebase/auth";

function Admin() {
   const [tarefa, setTarefa] = useState('');

   function handleAddTarefa(e: React.SubmitEvent<HTMLFormElement>) {
      e.preventDefault(); // Evita que a página seja recarregada ao enviar o formulário
   }

   async function handleLogout() {

      const confirmLogout = window.confirm('Deseja realmente sair?');

      if(!confirmLogout) {
         return;
      }
      await signOut(auth);
   }

   return (
      <div className="admin-container">
         <h1>Minhas Tarefas</h1>

         <form onSubmit={ handleAddTarefa } className="formAdmin">
            <textarea
               className="text-area"
               placeholder="Digite uma tarefa..." 
               value={tarefa}
               onChange={(e) => setTarefa(e.target.value)}
            />
            <button type="submit">Adicionar Tarefa</button>
         </form>

         <article className="list">
            <p>Estudar JavaScript e reactjs hoje a noite</p>

            <div className="actionsList">
               <button className="btEdit">Editar</button>
               <button className="btConcluir">Concluir</button>
            </div>
         </article>

         <button className='btLogout' onClick={handleLogout}>
            logout
         </button>
      </div>
   )
}

export default Admin;