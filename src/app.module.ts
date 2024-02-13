import { Module } from '@nestjs/common';
import { UserModule } from '@entities/user/user.module';
import { TypeOrmModule } from '@db/typeorm.module';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [TypeOrmModule, UserModule, AuthModule],
})
export class AppModule {}
