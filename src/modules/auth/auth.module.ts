import {Module} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {AuthController} from "./auth.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../user/entity/user.entity";
import {OTPEntity} from "../user/entity/otp.entity";
import {JwtService} from "@nestjs/jwt";
import { UserAddressEntity } from "../user/entity/address.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, OTPEntity, UserAddressEntity])],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  exports: [AuthService, JwtService, TypeOrmModule],
})
export class AuthModule {}
