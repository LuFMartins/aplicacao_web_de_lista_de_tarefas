import { useState, useEffect } from 'react';
import './admin.css'

import { auth } from "../../firebaseConnection.ts"
import { signOut } from "firebase/auth";

import { db } from "../../firebaseConnection.ts"
import { 
   addDoc, // Permite adicionar documentos no Firestore
   collection, // Permite adicionar documentos em uma coleção no Firestore
   getDocs, // Permite buscar documentos em uma coleção no Firestore
   onSnapshot, // Permite ouvir alterações em tempo real no Firestore
   query, // Permite criar consultas no Firestore
   orderBy, // Permite ordenar os resultados de uma consulta no Firestore
   where, // Permite filtrar os resultados de uma consulta no Firestore
} from "firebase/firestore";

function Admin() {
   const [tarefa, setTarefa] = useState('');
   const [user, setUser] = useState<any>({});


   useEffect(() => {
      async function loadTarefas() {
         // Aqui você pode adicionar a lógica para carregar as tarefas do Firestore
         const querySnapshot = localStorage.getItem('@userDetails');
         setUser(querySnapshot ? JSON.parse(querySnapshot) : {});


         if(querySnapshot) {
            const userDetails = JSON.parse(querySnapshot);
            const tarefaRef = collection(db, '@tarefas');

            const q = query(
               tarefaRef, // Cria uma consulta para buscar as tarefas do usuário
               orderBy('created', 'desc'), // Ordena as tarefas pela data de criação em ordem decrescente
               where('userId', '==', userDetails.uid) // Filtra as tarefas pelo ID do usuário
            );

            const unsub = onSnapshot(q, (snapshot) => {
               let lista: any[] = [];
               
               snapshot.forEach((doc) => {
                  lista.push({
                     id: doc.id,
                     tarefa: doc.data().tarefa,
                     created: doc.data().created,
                     userId: doc.data().userId,
                     userEmail: doc.data().userEmail
                  });
               })
            })
         }
      }

      loadTarefas();
   }, [])


   async function handleAddTarefa(e: React.SubmitEvent<HTMLFormElement>) {
      e.preventDefault(); // Evita que a página seja recarregada ao enviar o formulário

      if (tarefa === '') {
         alert('Digite uma tarefa');
         return;
      }

      try {
         await addDoc(collection(db, '@tarefas'), { //addDoc gera um id automático único para cada tarefa
            tarefa: tarefa,
            created: new Date(),
            userId: user?.uid, // Armazena o ID do usuário que criou a tarefa
            userEmail: user?.email // Armazena o email do usuário que criou a tarefa
         })

         alert('Tarefa adicionada com sucesso, olhe o firebase para ver a tarefa adicionada');
         setTarefa('');
      } catch (error: any) {
         alert('Erro ao adicionar tarefa');
      }

   }

   async function handleLogout() {

      const confirmLogout = window.confirm('Deseja realmente sair?');

      if (!confirmLogout) {
         return;
      }
      await signOut(auth);
   }

   return (
      <div className="admin-container">
         <h1>Minhas Tarefas</h1>

         <form onSubmit={handleAddTarefa} className="formAdmin">
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