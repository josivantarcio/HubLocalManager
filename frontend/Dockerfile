# Usar a imagem oficial do Node.js
FROM node:18

# Definir o diretório de trabalho
WORKDIR /usr/src/app

# Copiar os arquivos de dependências
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante do código
COPY . .

# Construir a aplicação Next.js
RUN npm run build

# Expor a porta do frontend (3000, conforme frontend.md)
EXPOSE 3000

# Comando para iniciar o frontend
CMD ["npm", "start"]