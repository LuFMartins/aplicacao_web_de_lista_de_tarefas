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
   deleteDoc, // Permite deletar documentos no Firestore
   doc // Permite referenciar um documento específico no Firestore
} from "firebase/firestore";

import {toast} from 'react-toastify'

function Admin() {
   const [tarefa, setTarefa] = useState('');
   const [user, setUser] = useState<any>({});
   const [tarefas, setTarefas] = useState<any[]>([]);


   useEffect(() => {
      async function loadTarefas() {
         // Aqui você pode adicionar a lógica para carregar as tarefas do Firestore
         const storedUser = localStorage.getItem('@userDetails');
         setUser(storedUser ? JSON.parse(storedUser) : {});


         if (storedUser) {
            const userDetails = JSON.parse(storedUser);
            const tarefaRef = collection(db, 'tarefas');

            const q = query( // q é a consulta que será feita no Firestore

               tarefaRef, // Cria uma consulta para buscar as tarefas do usuário
               orderBy('created', 'desc'), // Ordena as tarefas pela data de criação em ordem decrescente
               where('userId', '==', userDetails.uid) // Filtra as tarefas pelo ID do usuário

            );

            const unsub = onSnapshot(q, (snapshot /** snapshot representa o resultado da consulta q */) => {
               // let lista: any[] = [];

               // snapshot.forEach((doc) => {
               //    lista.push({
               //       id: doc.id,
               //       tarefa: doc.data().tarefa,
               //       created: doc.data().created,
               //       userId: doc.data().userId,
               //       userEmail: doc.data().userEmail
               //    });
               // })

               const lista = snapshot.docs.map((doc) => ({
                  id: doc.id,
                  tarefa: doc.data().tarefa,
                  created: doc.data().created,
                  userId: doc.data().userId,
                  userEmail: doc.data().userEmail
               }));

               console.log(lista)
               setTarefas(lista); // Atualiza o estado com a lista de tarefas do usuário
            })
         }
      }

      loadTarefas();
   }, [])


   async function handleAddTarefa(e: React.SubmitEvent<HTMLFormElement>) {
      e.preventDefault(); // Evita que a página seja recarregada ao enviar o formulário

      if (tarefa === '') {
         toast.info('Digite uma tarefa');
         return;
      }

      try {
         await addDoc(collection(db, 'tarefas'), { //addDoc gera um id automático único para cada tarefa
            tarefa: tarefa,
            created: new Date(),
            userId: user?.uid, // Armazena o ID do usuário que criou a tarefa
            userEmail: user?.email // Armazena o email do usuário que criou a tarefa
         })

         console.log('Tarefa adicionada com sucesso, olhe o firebase para ver a tarefa adicionada');
         setTarefa('');
      } catch (error: any) {
         toast.error('Erro ao adicionar tarefa');
      }

   }

   async function handleLogout() {

      const confirmLogout = window.confirm('Deseja realmente sair?');

      if (!confirmLogout) {
         return;
      }
      await signOut(auth);
   }

   async function handleConcluiTarefa(id: string){
      try{
         const docRef = doc(db, 'tarefas', id)
         await deleteDoc(docRef);
         console.log('Tarefa concluida com sucesso!');
      } catch (error: any) {
         alert('Erro ao finalizar a tarefa');
      }
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

         {tarefas.map(item => (
            <article className="list" key={item.id}>
                  <p>{item.tarefa}</p>
                  <div className="actionsList">
                     <button className="btEdit">Editar</button>
                     <button className="btConcluir" onClick={() => handleConcluiTarefa(item.id)}>Concluir</button>
                  </div>
            </article>
         ))}


         <button className='btLogout' onClick={handleLogout}>
            logout
         </button>
      </div>
   )
}

export default Admin;