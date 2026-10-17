# React Login Firebase

Aplicação web de lista de tarefas criada com o objetivo de estudar React e a comunicação com o Firebase. O projeto reúne autenticação de usuários, rotas protegidas e operações de leitura e escrita em tempo real no Cloud Firestore.

> Este é um projeto de estudo. Antes de utilizá-lo em produção, configure corretamente as regras de segurança do Firebase e revise os pontos de atenção descritos neste README.

## Funcionalidades

- Cadastro de usuários com e-mail e senha pelo Firebase Authentication.
- Envio de e-mail de verificação após o cadastro.
- Login e logout de usuários.
- Rotas para login (`/`), cadastro (`/register`) e área autenticada (`/admin`).
- Proteção da área de tarefas com o estado de autenticação do Firebase.
- Criação, edição e conclusão (exclusão) de tarefas no Cloud Firestore.
- Atualização da lista de tarefas em tempo real.
- Separação das tarefas por usuário.
- Notificações de sucesso e erro com React Toastify.

## Tecnologias

- [React 19](https://react.dev/) e [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) para desenvolvimento e build
- [Firebase Authentication](https://firebase.google.com/docs/auth) para autenticação
- [Cloud Firestore](https://firebase.google.com/docs/firestore) para armazenar as tarefas
- [React Router](https://reactrouter.com/) para navegação
- [React Toastify](https://fkhadra.github.io/react-toastify/) para notificações
- ESLint para análise estática do código

## Pré-requisitos

- Node.js e npm instalados.
- Uma conta Google e um projeto criado no [Firebase Console](https://console.firebase.google.com/).
- Os serviços Firebase Authentication e Cloud Firestore habilitados no projeto.

## Como executar

1. Clone este repositório e entre na pasta do projeto:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd react-login-firebase
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure o Firebase conforme a seção seguinte.

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

   O Vite exibirá no terminal o endereço local para abrir no navegador.

## Configuração do Firebase

1. No Firebase Console, crie um projeto ou selecione um existente.
2. Adicione uma aplicação Web e obtenha o objeto de configuração do Firebase.
3. No menu **Authentication > Sign-in method**, habilite o provedor **E-mail/senha**.
4. Crie um banco de dados Cloud Firestore.
5. Abra `src/firebaseConnection.ts` e substitua os valores de `firebaseConfig` pelos dados da sua aplicação Web.
6. Publique regras de segurança adequadas antes de usar dados reais.

O arquivo `src/firebaseConnection.ts` inicializa o Firebase, o Firestore e o Authentication. Neste projeto, a configuração da aplicação está escrita diretamente nesse arquivo. As chaves de configuração de aplicações Web do Firebase são identificadores usados pelo cliente, não substituem as regras de segurança. Não coloque credenciais de servidor, chaves privadas ou contas de serviço no código do navegador.

### Estrutura dos dados

As tarefas são armazenadas na coleção `tarefas` do Firestore. Cada documento criado pela aplicação contém:

| Campo | Descrição |
| --- | --- |
| `tarefa` | Texto da tarefa |
| `created` | Data e hora de criação |
| `userId` | UID do usuário autenticado que criou a tarefa |
| `userEmail` | E-mail do usuário que criou a tarefa |

A aplicação consulta a coleção filtrando por `userId` e ordenando por `created` em ordem decrescente. O Firestore pode solicitar a criação de um índice composto para essa consulta; nesse caso, use o link de criação indicado na mensagem de erro do Firebase.

### Regras de segurança do Firestore

As regras do Firestore devem validar a identidade do usuário e o `userId` do documento. Como ponto de partida para este formato de dados, uma regra pode restringir leitura e escrita ao dono da tarefa:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tarefas/{taskId} {
      function isOwner(userId) {
        return request.auth != null && request.auth.uid == userId;
      }

      allow read: if isOwner(resource.data.userId);
      allow create: if isOwner(request.resource.data.userId);
      allow update: if isOwner(resource.data.userId)
                    && isOwner(request.resource.data.userId);
      allow delete: if isOwner(resource.data.userId);
    }
  }
}
```

Revise e teste as regras no simulador do Firebase antes de publicá-las. Não use regras abertas como `allow read, write: if true` em um projeto exposto.

## Utilização

1. Acesse a página inicial e informe e-mail e senha para entrar.
2. Para criar uma conta, use o link de cadastro. O Firebase envia um e-mail de verificação e, após a criação, o formulário retorna à página de login.
3. Depois de entrar, a rota `/admin` apresenta a lista de tarefas. Adicione uma tarefa pelo campo de texto.
4. Use **Editar** para alterar uma tarefa e **Concluir** para removê-la da lista.
5. Use **logout** para encerrar a sessão.

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento Vite |
| `npm run build` | Verifica os projetos TypeScript e gera a versão de produção em `dist/` |
| `npm run preview` | Serve localmente a versão de produção gerada |
| `npm run lint` | Executa o ESLint no projeto |

## Organização do projeto

```text
src/
├── App.tsx                     # Rotas da aplicação e contêiner de notificações
├── firebaseConnection.ts       # Inicialização do Firebase, Authentication e Firestore
├── index.css                   # Estilos globais
├── main.tsx                    # Ponto de entrada React
├── pages/
│   ├── Admin/
│   │   ├── Admin.tsx           # Gerenciamento de tarefas
│   │   └── admin.css
│   ├── Home/
│   │   ├── Home.tsx            # Tela de login
│   │   └── home.css
│   └── Register/
│       └── Register.tsx        # Tela de cadastro
└── routes/
    ├── Private.tsx             # Verificação de autenticação da rota restrita
    └── Routes.tsx              # Definição das rotas
```

## Pontos de atenção

- A verificação da rota protegida melhora o fluxo de navegação, mas a segurança dos dados deve ser imposta pelas regras do Firestore, não apenas pelo código do cliente.
- Os detalhes básicos da sessão (`uid` e e-mail) são guardados em `localStorage` para uso pela tela de tarefas. Esse armazenamento não deve ser tratado como fonte confiável de autorização.
- O cadastro solicita verificação por e-mail, mas a aplicação não impede explicitamente o acesso de uma conta ainda não verificada.
- O projeto é didático e não inclui testes automatizados nem uma camada de backend própria.
- A operação **Concluir** remove o documento da tarefa do Firestore.

## Licença

Nenhuma licença foi definida neste repositório até o momento.
