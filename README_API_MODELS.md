# API Models and IO Guide

Tai lieu nay giup ban hoc nhanh phan API: model nao dung de lam gi, endpoint nhan gi (input), va tra gi (output).

## 1. Luu y ve cau truc source

- API server dang nam trong thu muc `frontend/`.
- File nay duoc dat trong `backend/` theo yeu cau de ban de theo doi.
- Base route trong API:
  - Public: `/api/auth/*`
  - Protected (can `Authorization: Bearer <accessToken>`):
    - `/api/user/*`
    - `/api/friend/*`
    - `/api/message/*`
    - `/api/conversation/*`

## 2. Response format chung

API thanh cong tra theo format tu `core/Success.js`:

```json
{
  "message": "ok",
  "status": 200,
  "metadata": {},
  "ResponseStatus": "OK"
}
```

Khi loi, middleware tra:

```json
{
  "status": "error",
  "code": 400,
  "message": "Error message"
}
```

## 3. Models trong API

### 3.1 User (`frontend/models/User.js`)
Muc dich: luu thong tin nguoi dung.

Field chinh:
- `userName`: String, unique, default `"User"`, trim, lowercase
- `email`: String, required, unique, lowercase, trim
- `passwordHash`: String, required
- `firstName`: String, required
- `lastName`: String, required
- `avatarUrl`: String, optional
- `verfify`: Boolean, default `false`
- `roles`: enum `"user" | "admin"`, default `"user"`
- `createdAt`, `updatedAt`: auto by timestamps

Input tao user (signup body):
```json
{
  "email": "demo@gmail.com",
  "password": "123456",
  "userName": "demo",
  "firstName": "A",
  "lastName": "B"
}
```

Output signup (`metadata`): user document vua tao.

### 3.2 Session (`frontend/models/Session.js`)
Muc dich: luu phien dang nhap va refresh token.

Field chinh:
- `user`: ObjectId -> User, required
- `refreshToken`: String, required, unique
- `accessToken`: String
- `userAgent`: String
- `ipAddress`: String
- `isValid`: Boolean, default `true`
- `expiresAt`: Date, required (co TTL index, het han se auto xoa)
- `createdAt`, `updatedAt`

Input tao session: duoc tao noi bo trong `signin`, client khong goi truc tiep model nay.

Output signin (`metadata.tokens`):
```json
{
  "accessToken": "jwt...",
  "refreshToken": "hex...",
  "expiresAt": "2026-03-20T12:00:00.000Z"
}
```

### 3.3 FriendRequest (`frontend/models/FriendRequest.js`)
Muc dich: luu loi moi ket ban.

Field chinh:
- `from`: ObjectId -> User, required
- `to`: ObjectId -> User, required
- `message`: String, required, max 200
- `createdAt`, `updatedAt`

Index:
- unique `(from, to)`
- index rieng cho `from`, `to`

Input gui loi moi (`POST /api/friend/requests`):
```json
{
  "to": "USER_ID_B",
  "message": "Hello, ket ban nhe"
}
```

Output (`metadata`): document FriendRequest vua tao.

### 3.4 Friend (`frontend/models/Friend.js`)
Muc dich: luu quan he ban be 2 chieu.

Field chinh:
- `userA`: ObjectId -> User, required
- `userB`: ObjectId -> User, required

Logic quan trong:
- Pre-save sap xep `userA < userB` de tranh trung cap.
- Unique index `(userA, userB)`.

Input tao Friend: duoc tao noi bo khi accept request.

Output khi accept request (`metadata`):
```json
{
  "newFriend": {
    "_id": "USER_ID",
    "userName": "demo",
    "avatarUrl": "..."
  }
}
```

### 3.5 Conversation (`frontend/models/Conversation.js`)
Muc dich: luu room chat direct/group.

Field chinh:
- `type`: `"direct" | "group"`, required
- `participants`: array participant, min 2
  - `userId`: ObjectId -> User
  - `role`: `"admin" | "member"`
  - `joinedAt`: Date
- `group`: object (chi dung cho group)
  - `name`: String
  - `createdBy`: ObjectId -> User
- `lastMessageAt`: Date | null
- `seenBy`: ObjectId[] -> User
- `lastMessage`: cache tin cuoi
  - `_id`, `content`, `senderId`, `createdAt`
- `unreadCounts`: Map<userId, number>
- `createdAt`, `updatedAt`

Input tao conversation (`POST /api/conversation`):
- Direct:
```json
{
  "type": "direct",
  "memberId": ["OTHER_USER_ID"]
}
```
- Group:
```json
{
  "type": "group",
  "name": "Team chat",
  "memberId": ["USER_ID_1", "USER_ID_2"]
}
```

Output (`metadata`): conversation vua tao.

### 3.6 Message (`frontend/models/message.js`)
Muc dich: luu tung tin nhan.

Field chinh:
- `conversation`: ObjectId -> Conversation, required
- `senderId`: ObjectId -> User, required
- `content`: String, optional (service dang bat buoc content khi gui)
- `imgUrl`: String, optional
- `createdAt`, `updatedAt`

Index:
- `{ conversation: 1, createdAt: -1 }`

Output gui tin nhan (`metadata`):
```json
{
  "message": {
    "_id": "...",
    "conversation": "...",
    "senderId": "...",
    "content": "hello",
    "createdAt": "..."
  }
}
```

## 4. Input/Output theo endpoint

### 4.1 Auth

#### POST `/api/auth/signup`
Input body:
```json
{
  "email": "demo@gmail.com",
  "password": "123456",
  "userName": "demo",
  "firstName": "A",
  "lastName": "B"
}
```
Output `metadata`: user moi.

#### POST `/api/auth/signin`
Input body:
```json
{
  "email": "demo@gmail.com",
  "password": "123456"
}
```
Output `metadata`:
```json
{
  "user": {
    "_id": "...",
    "email": "demo@gmail.com",
    "userName": "demo",
    "roles": "user"
  },
  "tokens": {
    "accessToken": "...",
    "refreshToken": "...",
    "expiresAt": "..."
  }
}
```
Ghi chu: refreshToken duoc set vao cookie `refreshToken`.

#### POST `/api/auth/logout`
Input: cookie `refreshToken` (hoac body co `refreshToken`).
Output `metadata`: `{}`.

#### POST `/api/auth/refreshToken`
Input: cookie `refreshToken`.
Output `metadata`:
```json
{
  "tokens": {
    "accessToken": "new_jwt"
  }
}
```

### 4.2 User

#### GET `/api/user/me` (protected)
Input header:
```http
Authorization: Bearer <accessToken>
```
Output `metadata`: thong tin user (bo `passwordHash`).

### 4.3 Friend

#### POST `/api/friend/requests` (protected)
Input body:
```json
{
  "to": "USER_ID_B",
  "message": "Xin chao"
}
```
Output `metadata`: FriendRequest vua tao.

#### POST `/api/friend/requests/:requestId/accept` (protected)
Input param: `requestId`.
Output `metadata`: thong tin ban moi (`newFriend`).

#### POST `/api/friend/requests/:requestId/decline` (protected)
Input param: `requestId`.
Output: khong co du lieu quan trong (service chi xoa request).

#### GET `/api/friend` (protected)
Output `metadata`: mang danh sach ban.

#### GET `/api/friend/requests` (protected)
Output mong doi: `{ sent, received }`.

## 5. Message APIs

### 5.1 POST `/api/message/direct` (protected)
Middleware `checkFriendship` chap nhan 1 trong 2 truong:
- `recipientId`
- hoac `memberId` (array)

Controller dang doc body:
```json
{
  "recipientId": "USER_ID_B",
  "content": "hello",
  "conversationId": "optional"
}
```
Output `metadata`: `{ "message": { ... } }`.

### 5.2 POST `/api/message/group` (protected)
Input body:
```json
{
  "conversationId": "GROUP_CONVERSATION_ID",
  "content": "hello group"
}
```
Output `metadata`: `{ "message": { ... } }`.

## 6. Conversation APIs

### 6.1 POST `/api/conversation` (protected)
Input body:
- Direct: `type = "direct"`, `memberId` co 1 phan tu.
- Group: `type = "group"`, co `name`, `memberId` >= 1.

Output `metadata`: conversation moi/da ton tai.

### 6.2 GET `/api/conversation` (protected)
Input: khong can body.
Output `metadata`:
```json
{
  "conversations": [
    {
      "_id": "...",
      "type": "direct",
      "name": null,
      "participants": [],
      "lastMessage": null,
      "seenBy": [],
      "updatedAt": "...",
      "createdAt": "..."
    }
  ],
  "total": 1
}
```

### 6.3 GET `/api/conversation/:conversationId/messages` (protected)
Query:
- `limit` (default 20)
- `cursor` (ISO time)

Output `metadata`:
```json
{
  "messages": [
    {
      "_id": "...",
      "conversation": "...",
      "senderId": "...",
      "content": "...",
      "createdAt": "..."
    }
  ],
  "nextCursor": "2026-03-09T10:10:10.000Z"
}
```

## 7. Hoc theo flow de nho nhanh

1. Signup -> tao `User`.
2. Signin -> tao `Session`, nhan accessToken + refreshToken.
3. Gui loi moi ket ban -> tao `FriendRequest`.
4. Accept -> tao `Friend`, xoa `FriendRequest`.
5. Tao direct/group chat -> tao `Conversation` (hoac tim direct cu).
6. Gui tin nhan -> tao `Message`, cap nhat `Conversation.lastMessage`.
7. Lay danh sach hoi thoai + pagination messages.

## 8. Ghi chu quan trong trong code hien tai

- Ten thu muc co the gay nham: API code dang o `frontend/`.
- Trong code co su khac nhau giua `recipientId` va `receiverId` (can thong nhat khi goi API).
- Service friend request dang import nham ten model o `getAllFriendRequest` (`FriendRequest` vs `FriendRequestModel`), ban nen sua de tranh runtime error.
