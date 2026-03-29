export interface UserInfo {
  userId: string
  username: string
  email: string
  avatar: string
  nickname: string
  createdAt: string
}

export interface LoginParams {
  username: string
  password: string
}

export interface RegisterParams {
  username: string
  password: string
  email: string
}

export interface LoginResult {
  token: string
  expiresIn: number
}

export interface UpdateProfileParams {
  email?: string
  avatar?: string
  nickname?: string
}

export interface UpdatePasswordParams {
  oldPassword: string
  newPassword: string
}
