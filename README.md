# MystTxt

MystTxt is a fun and secure anonymous messaging platform built with Next.js. Create an account, share your unique link, and receive anonymous messages.

## Built With

![NextJs](https://img.shields.io/badge/Next.js-000000.svg?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=TypeScript&logoColor=white)
![Shadcn](https://img.shields.io/badge/shadcn/ui-000000.svg?style=for-the-badge&logo=shadcn/ui&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-EC5990.svg?style=for-the-badge&logo=React-Hook-Form&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1.svg?style=for-the-badge&logo=Zod&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-06B6D4.svg?style=for-the-badge&logo=Tailwind-CSS&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4.svg?style=for-the-badge&logo=Axios&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248.svg?style=for-the-badge&logo=MongoDB&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000.svg?style=for-the-badge&logo=Mongoose&logoColor=white)
![Upstash](https://img.shields.io/badge/Upstash-00E9A3.svg?style=for-the-badge&logo=Upstash&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-FF4438.svg?style=for-the-badge&logo=Redis&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-000000.svg?style=for-the-badge&logo=Resend&logoColor=white)
![Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2.svg?style=for-the-badge&logo=Google-Gemini&logoColor=white)

## Features

- **User Authentication**: Sign up and log in (**_NextAuth_**) to manage your anonymous messages.

- **Email Verification**: Users must verify their email through OTP before accessing their dashboard.

- **Unique Shareable Link**: Each user gets a unique link to receive anonymous messages.

- **Anonymous Messaging**: Visitors can send messages anonymously without signing in.

- **AI Message Suggestions**: Option to generate message suggestions using AI.

- **API Rate Limiting**: To prevent spam and abuse of API endpoints

- **Unique Pageview counter**: Tracks number of unique views (within 24hrs) to user's message page.

- **Language Profanity filter**: Prevents people from using profane language.

## API Documentation

### User Signup

- **URL:** `/api/sign-up`
- **Method:** `POST`
- **Body:**

```json
{
    username: string
    email: string
    password: string
}
```

### Check Username

- **URL:** `/api/check-username?username="string"`
- **Method:** `GET`

### Verify Code

- **URL:** `/api/verify-code`
- **Method:** `POST`
- **Body:**

```json
{
    username: string
    code: string
}
```

### User Login (handled by next-auth)

- **URL:** `/api/auth/[...nextauth]`
- **Method:** `POST`
- **Body:**

```json
{
    identifier: string (username or email)
    password: string
}
```

### Accept Messages (GET)

- **URL:** `/api/accept-messages`
- **Method:** `GET`

### Accept Messages (POST)

- **URL:** `/api/accept-messages`
- **Method:** `POST`
- **Body:**

```json
{
    acceptMessages: boolean
}
```

### Check Profanity (GET)

- **URL:** `/api/check-profanity`
- **Method:** `GET`

### Check Profanity (POST)

- **URL:** `/api/check-profanity`
- **Method:** `POST`
- **Body:**

```json
{
    checkProfanity: boolean
}
```

### Get Messages

- **URL:** `/api/get-messages?page="number"&limit="number"`
- **Method:** `GET`

### Delete Message

- **URL:** `/api/delete-message/:messageId`
- **Method:** `DELETE`

### Delete Account

- **URL:** `/api/delete-account`
- **Method:** `DELETE`

### Pageview (GET)

- **URL:** `/api/pageview`
- **Method:** `GET`

### Pageview (POST)

- **URL:** `/api/pageview`
- **Method:** `POST`
- **Body:**

```json
{
    username: string
}
```

### Suggest Messages

- **URL:** `/api/suggest-messages`
- **Method:** `POST`

### Send Message

- **URL:** `/api/send-message`
- **Method:** `POST`
- **Body:**

```json
{
    username: string
    content: string
}
```

## Credits

This project was built by following a YouTube tutorial by [Hitesh](https://github.com/hiteshchoudhary). You can check out the original tutorial here: [Chai aur full stack NextJS](https://youtube.com/playlist?list=PLu71SKxNbfoBAaWGtn9GA2PTw0HO0tXzq&si=4upjwfZxyC_2AOtL).
<br/>
I have completed the assignment & expanded on the project by making changes such as a revamped UI, responsive design, pagination, language profanity filter and more.
