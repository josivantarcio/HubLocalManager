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

# Construir a aplicação NestJS
RUN npm run build

# Expor a porta do backend (3001, conforme backend.md)
EXPOSE 3001

# Comando para iniciar o backend
CMD ["npm", "run", "start:prod"]