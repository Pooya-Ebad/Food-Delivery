import { ApiProperty } from "@nestjs/swagger";
import {IsEmail, IsMobilePhone, IsNumber, IsOptional, IsString, Length} from "class-validator";

export class SignupDto {
  @ApiProperty()
  @IsString()
  first_name: string;
  @ApiProperty()
  @IsString()
  last_name: string;
  @ApiProperty()
  @IsMobilePhone(
    "fa-IR",
    {},
    {message: "your phonbe number format is incorrect"}
  )
  mobile: string;
  @ApiProperty()
  @IsString()
  @IsEmail({}, {message: "your email format is incorrect"})
  email: string;
}
export class UserAddressDto {
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsString()
  province: string;
  @ApiProperty()
  @IsString()
  city: string;
  @ApiProperty()
  @IsString()
  address: string;
  @ApiProperty()
  @IsString()
  postal_code?: string;
}
