### All API list:

#### Auth

- POST /signup
- POST /login
- POST /logout

#### Profile

- GET /profile (view)
- PATCH /profile (update)
- PATCH /profile/password (edit password) (H.W)

#### Connection Request

- status: interested, ignore
- POST /request/send/:status/:userId

- status: accepted, rejected
- POST /request/review/:status/:requestId

#### User

- GET /user/requests/received (received connection)
- GET /user/connections (get all connection)
- GET /user/feed (get the others users)

#### Pagination

- /feed?page=1&limit=10

.skip() & .limit()
