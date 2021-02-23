import {
  PrismaClient,
  PostStatus as PostStatusFromPrisma,
} from '@prisma/client';
const prisma = new PrismaClient();

type PostStatusName = Omit<PostStatusFromPrisma, 'id'>;
const POST_STATUS_NAMES: PostStatusName[] = [
  { name: 'DRAFT' },
  { name: 'PUBLISHED' },
];

const main = async () => {
  const createPostStatus = POST_STATUS_NAMES.map(({ name }) =>
    prisma.postStatus.create({ data: { name } }),
  );

  await prisma.$transaction(createPostStatus);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
