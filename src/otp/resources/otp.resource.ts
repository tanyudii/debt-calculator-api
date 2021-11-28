import { Resource } from '@app/common/graphql/types/resource.type';
import { Field, ObjectType } from '@nestjs/graphql';

import { OtpResponse } from '../types/otp-response.type';

@ObjectType()
export class OtpResource extends Resource<OtpResource> {
  @Field(() => OtpResponse)
  data: OtpResponse;
}
