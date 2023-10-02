### Features:

- Browse & Filter Courses
- Purchase Courses using Stripe
- Mark Chapters as Completed or Uncompleted
- Progress Calculation of each Course
- Student Dashboard
- Teacher mode
- Create new Courses
- Create new Chapters
- Easily reorder chapter position with drag n’ drop
- Upload thumbnails, attachments and videos using UploadThing
- Video processing using Mux
- HLS Video player using Mux
- Rich text editor for chapter description
- Authentication using Clerk
- ORM using Prisma
- Postgresql database using [Railway](https://railway.app/)

### Prerequisites

**Node version 18.x.x**

### Install packages

```shell
npm i
```

### Setup .env file


```js
MUX_TOKEN_ID=
DATABASE_URL=
CLERK_SECRET_KEY=
MUX_TOKEN_SECRET=
STRIPE_SECRET_KEY=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
NEXT_PUBLIC_APP_URL=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_TEACHER_ID=
STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=
```

### Setup Prisma

Add Postgresql Database (I used [Railway](https://railway.app/))

```shell
npx prisma db push

```

### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command         | description                              |
| :-------------- | :--------------------------------------- |
| `dev`           | Starts a development instance of the app |
