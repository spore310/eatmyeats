interface RefreshToken {
  sessionId: string;
  timeStamp?: number;
}

interface AccessToken {
  userId: string;
  username?: string;
  email: string;
  timeStamp?: number;
}
