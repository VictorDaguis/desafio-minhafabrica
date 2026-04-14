# Desafio Técnico — MinhaFabrica

Aplicação web fullstack com autenticação JWT, painel administrativo e CRUD de usuários e produtos.

## Tecnologias

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs  
**Frontend:** Next.js, React, TypeScript, Tailwind CSS, Axios

## Como rodar localmente

### Pré-requisitos
- Node.js v18+
- Conta no MongoDB Atlas (gratuito)

### Backend

```bash
cd backend
npm install
```

Crie o arquivo `.env` baseado no `.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/minhafabrica
JWT_SECRET=seu_segredo_aqui
```

Rode o servidor:

```bash
npm run dev
```

Crie o usuário admin (apenas na primeira vez):

POST http://localhost:5000/api/v1/auth/seed


### Frontend

```bash
cd frontend
npm install
```

Crie o arquivo `.env.local` baseado no `.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

Rode o frontend:

```bash
npm run dev
```

Acesse: http://localhost:3000

## Credenciais de acesso


As credenciais do usuário admin serão enviadas por e-mail junto com a entrega.

Para criar o admin, acesse:
```
POST http://localhost:5000/api/v1/auth/seed
```

## Estrutura do projeto

desafio-minhafabrica/
├── backend/          # API Node.js + Express
│   └── src/
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       ├── models/
│       ├── routes/
│       ├── middlewares/
│       └── utils/
└── frontend/         # Next.js + React + TypeScript
└── app/
├── login/
└── admin/
├── dashboard/
├── usuarios/
└── products/