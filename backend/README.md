# Backend

## Authentication Token Flow

1. **Sign up** via `POST /signup` with a JSON body containing `username` and `password`.
   - On success the server creates a record in the `users` table and returns a signed JWT token.
2. **Log in** via `POST /login` with the same credentials.
   - When the credentials are valid the server returns a new JWT token.
3. For authenticated requests include the token in the `Authorization` header using the `Bearer` scheme.
   - Example: `Authorization: Bearer <token>`
4. Use the token to fetch the current user by calling `GET /me` which responds with the user's id and username when the token is valid.

Tokens are signed with HS256 using a server-side secret and expire when the secret changes. Rate limiting limits repeated calls to `/signup` and `/login` from the same IP address.
