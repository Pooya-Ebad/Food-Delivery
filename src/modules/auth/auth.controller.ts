import {Body, Controller, Post} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {CheckOtpDto, SendOtpDto} from "./dto/otp.dto";
import {ApiConsumes, ApiTags} from "@nestjs/swagger";
import {FormType} from "src/common/enum/form-type.enum";
import { SignupDto, UserAddressDto } from "./dto/basic.dto";
import { UserAuth } from "src/common/decorators/auth.decorator";

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  signup(@Body() signupDto: SignupDto) {
    return this.authService.create(signupDto);
  }
  @Post("/send-otp")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  sendOtp(@Body() otpDto: SendOtpDto) {
    return this.authService.sendOtp(otpDto);
  }
  @Post("/check-otp")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  checkOtp(@Body() otpDto: CheckOtpDto) {
    return this.authService.checkOtp(otpDto);
  }
  @Post("/add-address")
  @UserAuth()
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  setAddress(@Body() userAddressDto: UserAddressDto) {
    return this.authService.setAddress(userAddressDto);
  }
}
