import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@db/typeorm.module';

@Module({
  imports: [TypeOrmModule, UserModule],
})
export class AppModule {}
