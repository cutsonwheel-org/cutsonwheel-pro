export interface Notification {
  emailEvents: boolean;
  emailUpdates: boolean;
  emailInvitations: boolean;
  pushNotification: boolean;
}

export interface Roles {
  client?: boolean;
  assistant?: boolean;
}

export interface Metadata {
  lastSignInTime: Date;
  creationTime: Date;
}

export interface Skill {
  name: string;
  level?: string;
}

export interface Name {
  firstname: string;
  lastname: string;
  middlename?: string;
}

export interface Address {
    address1: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    postal: string;
  }

export class Users {
  constructor(
    public email: string,
    public emailVerified: boolean,
    public photoURL: string,
    public displayName: string,
    public phoneNumber: string,
    public isAnonymous: boolean,
    public tenantId: string,
    public id: string,
    public metadata: Metadata,
    public isSetupCompleted: boolean,
    public isValidated: boolean,
    public name?: Name,
    public roles?: Roles,
    public location?: Address,
    public experience?: string,
    public skills?: Skill,
    public notifications?: Notification,
  ) {}
}
