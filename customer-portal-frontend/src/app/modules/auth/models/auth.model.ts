import { CurrentUserDto } from "./current-user-dto";
export class AuthModel {
  AccessToken: string;
  ExpiresAt: Date;
  User: CurrentUserDto;
  PaymentLink: string;

  setAuth(auth: AuthModel) {
    this.AccessToken = auth.AccessToken;
    this.ExpiresAt = auth.ExpiresAt;
    this.User = auth.User;
    this.PaymentLink = auth.PaymentLink;
  }
}