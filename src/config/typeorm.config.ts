import { TypeOrmModuleOptions } from "@nestjs/typeorm"
export function TypOrmConfig() : TypeOrmModuleOptions {
    const { DB_HOST,DB_NAME,DB_PASSWORD,DB_PORT,DB_USERNAME } = process.env
    return {
        type : "mysql",
        port : DB_PORT,
        host : DB_HOST,
        database : DB_NAME,
        username : DB_USERNAME,
        password : DB_PASSWORD,
        autoLoadEntities : false,
        synchronize : true,
        entities : [
            "dist/**/**/**/*.entity{.ts,.js}",
            "dist/**/**/*.entity{.ts,.js}",
        ] 
    }
}     