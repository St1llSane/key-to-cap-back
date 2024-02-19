import { Module } from '@nestjs/common';
import { UserModule } from '@entities/user/user.module';
import { MyTypeOrmModule } from '@db/typeorm.module';
import { AuthModule } from '@auth/auth.module';
import { ProductModule } from '@entities/product/product.module';

@Module({
  imports: [MyTypeOrmModule, AuthModule, UserModule, ProductModule],
})
export class AppModule {}
