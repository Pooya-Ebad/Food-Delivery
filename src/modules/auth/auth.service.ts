import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../user/entity/user.entity";
import {Repository} from "typeorm";
import {OTPEntity} from "../user/entity/otp.entity";
import {CheckOtpDto, SendOtpDto} from "./dto/otp.dto";
import {randomInt} from "crypto";
import {JwtService} from "@nestjs/jwt";
import {PayloadType} from "./types/payload";
import { SignupDto, UserAddressDto } from "./dto/basic.dto";
import { UserAddressEntity } from "../user/entity/address.entity";
import { Request } from "express";
import { REQUEST } from "@nestjs/core";
@Injectable({scope : Scope.REQUEST})
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OTPEntity) private otpRepository: Repository<OTPEntity>,
    private jwtService: JwtService,
    @InjectRepository(UserAddressEntity) private addressRepository: Repository<UserAddressEntity>,
    @Inject(REQUEST)
    private req : Request
  ) {}

  async create(signupDto : SignupDto){
    const { email, first_name, last_name, mobile } = signupDto
    await this.checkEmail(email)
    await this.checkMobile(mobile)
    const user = this.userRepository.create({
      first_name,
      last_name,
      email,
      mobile
    })
    await this.userRepository.save(user)
    await this.createOtpForUser(user)
    return {
      message: "sent code successfully"
    };
  }
  async sendOtp(otpDto: SendOtpDto) {
    const {mobile} = otpDto;
    let user = await this.userRepository.findOneBy({mobile});
    if (!user) {
      return {
        message : "user not found, please signup first"
      }
    }
    await this.createOtpForUser(user);
    return {
      message: "sent code successfully",
    };
  }
  async checkOtp(otpDto: CheckOtpDto) {
    const {code, mobile} = otpDto;
    const now = new Date();
    const user = await this.userRepository.findOne({
      where: {mobile},
      relations: {
        otp: true,
      },
    });
    if (!user || !user?.otp)
      throw new UnauthorizedException("Not Found Account");
    const otp = user?.otp;
    if (otp?.code !== code)
      throw new UnauthorizedException("Otp code is incorrect");
    if (otp.expires_in < now)
      throw new UnauthorizedException("Otp Code is expired");
    if (!user.mobile_verify) {
      await this.userRepository.update(
        {id: user.id},
        {
          mobile_verify: true,
        }
      );
    }
    const {accessToken, refreshToken} = this.generateTokenForUser({
      id: user.id,
    });
    return {
      accessToken,
      refreshToken,
      message: "You logged-in successfully",
    };
  }
  async checkEmail(email: string) {
    const user = await this.userRepository.findOneBy({email});
    if (user) throw new ConflictException("email is already exist");
  }
  async checkMobile(mobile: string) {
    const user = await this.userRepository.findOneBy({mobile});
    if (user) throw new ConflictException("mobile number is already exist");
  }
  async setAddress(addressDto : UserAddressDto){
    const { id } = this.req.user
    const { title, city, province, address, postal_code } = addressDto
    const user = await this.userRepository.findOneBy({id})
    const addressExist = await this.addressRepository.findOneBy({postal_code})
    if(!user) throw new NotFoundException("user not found")
    if(addressExist) throw new ConflictException("this Postalcode already exist")
    const new_address = this.addressRepository.create({
      title,
      city,
      postal_code,
      province,
      address,
      userId : id
    })
    await this.addressRepository.save(new_address)
    return {
      message : "address added successfully"
    }
    
  }
  async createOtpForUser(user: UserEntity) {
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2);
    const code = randomInt(10000, 99999).toString();
    let otp = await this.otpRepository.findOneBy({userId: user.id});
    if (otp) {
      if (otp.expires_in > new Date()) {
        throw new BadRequestException("otp code not expired");
      }
      otp.code = code;
      otp.expires_in = expiresIn;
    } else {
      otp = this.otpRepository.create({
        code,
        expires_in: expiresIn,
        userId: user.id,
      });
    }
    otp = await this.otpRepository.save(otp);
    user.otpId = otp.id;
    await this.userRepository.save(user);
  }
  generateTokenForUser(payload: PayloadType) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: "30d",
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: "1y",
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  async validateAccessToken(token: string) {
    try {
      const payload = this.jwtService.verify<PayloadType>(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
      if (typeof payload === "object" && payload?.id) {
        const user = await this.userRepository.findOneBy({id: payload.id});
        if (!user) {
          throw new UnauthorizedException("login on your account ");
        }
        return user;
      }
      throw new UnauthorizedException("login on your account ");
    } catch (error) {
      throw new UnauthorizedException("login on your account ");
    }
  }
}
