import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { CreateUserInput } from './dto/input/create-user.input';
import { User } from './model/user';
import { Token } from '../auth/model/token';
import { UsersService } from './users.service';
import * as bcrypt from 'bcryptjs';
import { LoginArgs } from './dto/args/login-by-email.args';
import { AuthService } from 'src/auth/auth.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Query(() => Token, { nullable: true })
  async loginByEmail(@Args() loginArgs: LoginArgs): Promise<Token> {
    const foundUser = await this.authService.validateUser(loginArgs);
    if (!foundUser) throw new BadRequestException();

    return this.authService.login(foundUser);
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserData') createUserData: CreateUserInput,
  ): Promise<User> {
    const { email, password } = createUserData;
    const foundUser = await this.usersService.getUserByEmail(email);
    if (foundUser) throw new ConflictException();

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.usersService.createUser({
      ...createUserData,
      password: hashedPassword,
    });
  }
}
