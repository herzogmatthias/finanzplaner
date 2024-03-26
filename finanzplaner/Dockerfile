# Step 1: Set the base image. Here, we're using Node 16 as the base image.
FROM node:20.11.1-alpine as builder

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json (or yarn.lock) files
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install
# Or use yarn to install dependencies
# RUN yarn install

# Step 5: Copy the rest of your Next.js app's source code
COPY . .

# Step 6: Build your Next.js app. Customize the "build" script in your package.json if necessary.
RUN npm run build
# Or use yarn to build
# RUN yarn build

# Step 7: Set up the production environment
FROM node:16-alpine as runner
WORKDIR /app

# Step 8: Copy the build output from the builder stage
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Step 9: Set the environment to production
ENV NODE_ENV production

# Step 10: Expose the port your app runs on. The default port for Next.js is 3000
EXPOSE 3000

# Step 11: Define the command to run your app. Here we're using the Next.js start script.
CMD ["npm", "start"]