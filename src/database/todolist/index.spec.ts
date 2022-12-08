import { TestingModule } from '@nestjs/testing';
import { testHelper } from 'src/utils/testHelper';
import { TodolistService } from './index.service';
import { UserService } from '../user/index.service';
import { PoolService } from '../pool/index.service';
import { TaskService } from '../task/index.service';

describe('TodolistService', () => {
  let todolistService: TodolistService;
  let userService: UserService;
  let poolService: PoolService;
  let taskService: TaskService;

  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await testHelper();
    todolistService = moduleRef.get<TodolistService>(TodolistService);
    userService = moduleRef.get<UserService>(UserService);
    poolService = moduleRef.get<PoolService>(PoolService);
    taskService = moduleRef.get<TaskService>(TaskService);

    await poolService.generate(30);
  });
  afterEach(async () => {
    await moduleRef.close();
  });

  describe('Todolist Service Create', () => {
    it('Should return list and verify that list is own by this userId', async () => {
      const name = 'Linh bé nhỏ';
      const { id: userId } = await userService.create({ email: '', name: 'Linh' });
      const response = await todolistService.create({ name, userId });
      expect(response.name).toEqual(name);
      expect(response.userId).toEqual(userId);
    });

    it('Should return error when list name not type', async () => {
      const name = undefined;
      const { id: userId } = await userService.create({ email: '', name: 'Linh' });
      let response;
      try {
        response = await todolistService.create({ name, userId });
      } catch (err) {
        response = err.response;
      }
      expect(response.statusCode).toBeGreaterThanOrEqual(400);
    });

    it('Should return  errorr when list name when type space character only', async () => {
      const name = '     ';
      const { id: userId } = await userService.create({ email: '', name: 'Linh' });
      let response;
      try {
        response = await todolistService.create({ name, userId });
      } catch (err) {
        response = err.response;
      }
      expect(response.statusCode).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Todolist Service Update', () => {
    it('Create new list and then update list name', async () => {
      const { id: userId } = await userService.create({ email: undefined, name: 'Linh' });
      const { id: todolistId } = await todolistService.create({ name: 'List of Linh', userId });
      const favorite = true;
      const isActive = true;
      const newName = 'List of Linh Update';
      const visibility = 'READ_ONLY';
      const ids = [];

      const response = await todolistService.update({
        id: todolistId,
        favorite,
        name: newName,
        isActive,
        visibility,
        member: { ids },
        userId,
      });
      expect(response.name).toEqual(newName);
    });
  });

  describe('Todolist Service Delete', () => {
    it('Should delete list successful', async () => {
      const { id: userId } = await userService.create({ email: undefined, name: 'Linh' });
      const { id: todolistId } = await todolistService.create({ name: 'List of Linh', userId });
      const isActive = false;
      const visibility = 'READ_ONLY';
      const ids = [];

      const response = await todolistService.update({
        id: todolistId,
        isActive,
        visibility,
        member: { ids },
        userId,
      });
      expect(response.isActive).toEqual(isActive);
    });
  });

  describe('Todolist Seo cotent (title and description)', () => {
    it('Should return title and description on list that have exact 3 tasks', async () => {
      const { id: userId } = await userService.create({ email: undefined, name: 'Linh' });
      const { id: todolistId } = await todolistService.create({ name: 'List of Linh', userId });
      const task1st = await taskService.create({ name: 'Task of Linh 1st', todolistId, userId: userId });
      const task2rd = await taskService.create({ name: 'Task of Linh 2nd', todolistId, userId: userId });
      const task3th = await taskService.create({ name: 'Task of Linh 3rd', todolistId, userId: userId });

      const seo = await todolistService.seoOne({ id: todolistId });
      expect(seo.title).toEqual('List of Linh');
      expect(seo.description.includes(task1st.name)).toEqual(true);
      expect(seo.description.includes(task2rd.name)).toEqual(true);
      expect(seo.description.includes(task3th.name)).toEqual(true);
    });
  });
});
