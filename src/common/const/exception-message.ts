export const ExceptionMessage = {
  NOT_FOUND: {
    ENTITY: (entityName: string) => `${entityName} not found`,
  },
  INVALID: {
    TOKEN: 'Token invalid',
    PASSWORD_NOT_MATCH: 'Password mismatch',
    NEW_PASSWORD_SAME_AS_OLD: 'New password cannot be the same as the old',
    MISSING_FACULTY_ID: 'Missing faculty id',
    EMAIL_EXISTED: 'Email already exists',
    CREDENTIALS: 'Wrong credentials',
    CANT_DELETE_ADMIN: "Can't delete admin",
    CANT_UPDATE_OTHER_ADMIN: "Can't update other admin account",
    MUST_BE_UNIQUE: (entityName: string) => `${entityName} must be unique`,
  },
  FAILED: {
    HASH_PASSWORD: 'Failed to hash password',
    SIGN_JWT: 'Failed to sign payload',
    SEND_MAIL: 'Failed to send email',
    UPDATE_ENTITY: (entityName: string) => `Failed to update ${entityName}`,
    DELETE_ENTITY: (entityName: string) => `Failed to delete ${entityName}`,
    QUERY: 'Query failed',
  },
};
