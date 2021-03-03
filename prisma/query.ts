import { PrismaClient, User, Post, Comment } from '@prisma/client';

const prisma = new PrismaClient();

// model User 의 모든 필드가 다 객체에 담김
const findUser = prisma.user.findUnique({
  where: { id: 'cklirmw6l0002jwoxwfohl4mj' },
});

// model User 안에 유저가 쓴 글 model Post 의 모든 필드가 다 객체에 담김
const findUserIncludingPosts = prisma.user.findUnique({
  where: { id: 'cklirmw6l0002jwoxwfohl4mj' },
  include: {
    posts: true,
  },
});

// model User => model Post => 포스트에 담긴 model Comment 의 모든 필드가 다 객체에 담김
const findUserIncludingPostsIncludingComments = prisma.user.findUnique({
  where: { id: 'cklirmw6l0002jwoxwfohl4mj' },
  include: {
    posts: {
      include: {
        comments: true,
      },
    },
  },
});

// model User => model Post 중에서 title 과 body 만 뽑아오고 싶을 떄
const findUserIncludingPostsWithSelectedFields = prisma.user.findUnique({
  where: { id: 'cklirmw6l0002jwoxwfohl4mj' },
  include: {
    posts: {
      select: {
        title: true,
        body: true,
      },
    },
  },
});

// 아예 처음부터 select 문을 사용해서 다음과 같은 객체를 만들어 낼 수 도 있음
interface MyCustomUser {
  id: string;
  email: string;
  posts: { title: string; body: string; comments: { content: string }[] }[];
}

// 아예 처음부터 select 문을 사용해서 다음과 위와 같은 인터페이스를 만족하도록 쿼리 할 수 있음
const findUserIncludingPostsIncludingCommentsWithSelectedFields: Promise<MyCustomUser> = prisma.user.findUnique(
  {
    where: { id: 'cklirmw6l0002jwoxwfohl4mj' },
    select: {
      id: true,
      email: true,
      posts: {
        select: {
          title: true,
          body: true,
          comments: {
            select: {
              content: true,
            },
          },
        },
      },
    },
  },
);

const main = async () => {
  try {
  } catch (e) {
    console.error(e);
    await prisma.$disconnect;
    process.exit(1);
  }
};

main();
