import { durationConverter } from '@app/common/helpers/duration.helper';
import { isEmail } from '@app/common/helpers/validate.helper';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';

import { OtpService } from '../../../otp/services/otp.service';
import { UsersService } from '../../../users/services/users.service';
import { AccessToken } from '../../access-tokens/entities/access-token.entity';
import { AccessTokensService } from '../../access-tokens/services/access-tokens.service';
import { RefreshToken } from '../../refresh-tokens/entities/refresh-token.entity';
import { RefreshTokensService } from '../../refresh-tokens/services/refresh-tokens.service';
import { CreateTokenInput } from '../dto/create-token.input';
import { RefreshTokenInput } from '../dto/refresh-token.input';
import { TokenResponse } from '../types/token.type';

const otpSubjectTypeName = 'create_token';

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly accessTokensService: AccessTokensService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly otpService: OtpService,
  ) {}

  async createToken(
    createTokenInput: CreateTokenInput,
  ): Promise<TokenResponse> {
    const { username, password, isOtp } = createTokenInput;

    let exceptionUser;
    let user;

    try {
      if (isOtp) {
        user = await this.usersService.findOneByPhoneNumber(username);
      } else {
        user = isEmail(username)
          ? await this.usersService.findOneByEmailAndPassword(
              username,
              password,
            )
          : await this.usersService.findOneByPhoneNumberAndPassword(
              username,
              password,
            );
      }
    } catch (e) {
      exceptionUser = e;
    }

    if (exceptionUser || !user) {
      throw new BadRequestException(
        'These credentials do not match our records.',
      );
    }

    if (isOtp) {
      const isValidOtp = await this.otpService.isValidExpiry(
        otpSubjectTypeName,
        user.id,
        username,
        password,
      );

      if (!isValidOtp) {
        throw new BadRequestException('otp is invalid.');
      }

      await this.otpService.revoke(
        otpSubjectTypeName,
        user.id,
        username,
        password,
      );
    }

    const accessToken = await this.accessTokensService.create({
      userId: user.id,
      expiresAt: this.generateAccessTokenExpiresAt(),
    });

    const refreshToken = await this.refreshTokensService.create({
      accessTokenId: accessToken.id,
      userId: accessToken.userId,
      expiresAt: this.generateRefreshTokenExpiresAt(),
    });

    return this.tokenFactory(accessToken, refreshToken);
  }

  async refreshToken(
    refreshTokenInput: RefreshTokenInput,
  ): Promise<TokenResponse> {
    const { accessToken, refreshToken } = refreshTokenInput;

    let decodedAccessToken;
    let decodedRefreshToken;

    try {
      decodedAccessToken = await this.jwtService.verifyAsync(accessToken, {
        ignoreExpiration: true,
      });

      decodedRefreshToken = await this.jwtService.verifyAsync(refreshToken);
    } catch (e) {
      throw new BadRequestException(
        'These credentials do not match our records.',
      );
    }

    const isValidRefreshToken = await this.refreshTokensService.isValidExpiry(
      decodedRefreshToken.jti,
      decodedAccessToken.jti,
    );

    if (!isValidRefreshToken) {
      throw new BadRequestException(
        'These credentials do not match our records.',
      );
    }

    const newAccessToken = await this.accessTokensService.create({
      userId: decodedRefreshToken.sub,
      expiresAt: this.generateAccessTokenExpiresAt(),
    });

    await this.refreshTokensService.updateAccessToken(
      decodedRefreshToken.jti,
      newAccessToken.id,
    );

    return this.tokenFactory(newAccessToken);
  }

  protected async tokenFactory(
    accessToken: AccessToken,
    refreshToken?: RefreshToken,
  ) {
    const token = new TokenResponse();
    token.expiresAt = Math.round(accessToken.expiresAt.valueOf() / 1000);

    const currentTime = Math.round(new Date().valueOf() / 1000);
    token.accessToken = this.jwtService.sign({
      jti: accessToken.id,
      nbf: currentTime,
      sub: accessToken.userId,
    });

    if (refreshToken) {
      const expires = moment.duration(
        moment(refreshToken.expiresAt).diff(moment()),
      );
      token.refreshToken = await this.jwtService.signAsync(
        {},
        {
          expiresIn: Math.round(expires.asSeconds()),
          jwtid: refreshToken.id,
          subject: accessToken.userId,
        },
      );
      token.refreshTokenExpiresAt = Math.round(
        refreshToken.expiresAt.valueOf() / 1000,
      );
    }

    return token;
  }

  generateAccessTokenExpiresAt(): Date {
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '30d';
    const duration = durationConverter(jwtExpiresIn);
    return moment().utc().add(duration, 'seconds').toDate();
  }

  generateRefreshTokenExpiresAt(): Date {
    return moment().utc().add(1, 'years').toDate();
  }
}
