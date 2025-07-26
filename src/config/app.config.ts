
export const EnvConfiguration = () => ({
    enviroment: process.env.NODE_ENV || 'dev',
    postgreDB: process.env.DB_NAME,
    passwordDB: process.env.DB_PASSWORD,
    usernameDB: process.env.DB_USERNAME,
    portDB: process.env.DB_PORT || 5432,
    port: process.env.PORT || 3000 
})