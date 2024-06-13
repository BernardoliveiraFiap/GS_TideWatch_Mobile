# Use a imagem oficial do Node.js versão 16 ou superior
FROM node:16
 
# Defina o diretório de trabalho dentro do container
WORKDIR /app
 
# Copie o arquivo package.json e instale as dependências
COPY package.json ./
RUN npm install
 
# Instale o Expo CLI globalmente
RUN npm install -g expo-cli
 
# Copie todos os outros arquivos do seu projeto para o container
COPY . .
 
# Expo usa a porta 19000 por padrão, mas vamos expor todas as portas necessárias
EXPOSE 19000 19001 19002
 
# Comando para iniciar o projeto via Expo
CMD ["npx", "expo", "start"]