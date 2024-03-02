export interface UserRequestGet extends Request {
  user: { id: string; email: string };
}
