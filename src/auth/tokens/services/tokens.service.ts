import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';
import { Token } from '../entities/token.entity';
import { AccessTokensService } from '../../access-tokens/services/access-tokens.service';
import { RefreshTokensService } from '../../refresh-tokens/services/refresh-tokens.service';
import { CreateTokenInput } from '../dto/create-token.input';
import { AccessToken } from '../../access-tokens/entities/access-token.entity';
import { RefreshToken } from '../../refresh-tokens/entities/refresh-token.entity';
import { UsersService } from '../../../users/services/users.service';
import { isEmail } from '../../../@common/helpers/validate.helper';
import { CreateTokenByRefreshTokenInput } from '../dto/create-token-by-refresh-token.input';

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly accessTokensService: AccessTokensService,
    private readonly refreshTokensService: RefreshTokensService,
  ) {}

  async create(createTokenInput: CreateTokenInput): Promise<Token> {
    const { username, password } = createTokenInput;

    let exceptionUser;
    let user;

    try {
      user = isEmail(username)
        ? await this.usersService.findOneByEmailAndPassword(username, password)
        : await this.usersService.findOneByPhoneAndPassword(username, password);
    } catch (e) {
      exceptionUser = e;
    }

    if (exceptionUser || !user) {
      throw new BadRequestException(
        'These credentials do not match our records.',
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

  async createByRefreshToken(
    createTokenByRefreshInput: CreateTokenByRefreshTokenInput,
  ): Promise<Token> {
    const { accessToken, refreshToken } = createTokenByRefreshInput;

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

  async tokenFactory(accessToken: AccessToken, refreshToken?: RefreshToken) {
    const token = new Token();
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
    }

    return token;
  }

  generateAccessTokenExpiresAt(): Date {
    return moment().utc().add(8, 'hours').toDate();
  }

  generateRefreshTokenExpiresAt(): Date {
    return moment().utc().add(30, 'days').toDate();
  }
}