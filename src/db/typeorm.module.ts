import { Module } from '@nestjs/common';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '@/user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    NestTypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User],
      migrations: ['dist/db/migrations/**/*.js'],
      autoLoadEntities: true,
      synchronize: true,
      // cli: { migrationsDir: 'src/db/migrations' },
    }),
  ],
})
export class TypeOrmModule {}
