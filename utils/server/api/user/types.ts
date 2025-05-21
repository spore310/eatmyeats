interface UserType {
  userName: string;
  phoneNumber: string;
  email: string;
  id: string;
  timeStamp: string;
}
interface GETUserAPIResponseType extends UserAPIResponse {
  user: UserType | null;
}
interface getUserByNameResponseType extends GETUserAPIResponseType {
  message?: string;
}
interface GETUserAPIResponseBody {
  user: UserType | null;
  timeStamp: string;
  message: string;
}
