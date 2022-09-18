FROM node:16.9.1-alpine

WORKDIR /usr

COPY . .

# ARG secret
# ENV env_name $secret

# RUN apk add openssl
# RUN openssl genrsa -passout pass:${env_name} -aes256 -out private.pem 4096
# RUN openssl rsa -passin pass:${env_name} -in private.pem -outform PEM -pubout -out public.pem
# RUN mv private.pem ../private.key
# RUN mv public.pem ../public.key

RUN npm install
RUN npm run build

## this is stage two , where the app actually runs
FROM node:16.9.1-alpine

WORKDIR /usr

COPY package.json ./

RUN npm install --only=production

COPY --from=0 /usr/dist .

RUN npm install pm2 -g

EXPOSE 80

CMD ["pm2-runtime", "server.js"]