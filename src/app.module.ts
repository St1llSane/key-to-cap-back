import { Module } from '@nestjs/common';
import { UserModule } from '@entities/user/user.module';
import { TypeOrmModule } from '@db/typeorm.module';

@Module({
  imports: [TypeOrmModule, UserModule],
})
export class AppModule {}
