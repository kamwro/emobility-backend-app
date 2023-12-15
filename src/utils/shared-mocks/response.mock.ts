import { Response } from 'express';

const statusResponseMock = {
  send: jest.fn((x) => x),
};

export const responseMock = {
  // @ts-ignore
  status: jest.fn((x) => statusResponseMock),
  send: jest.fn((x) => x),
} as unknown as Response;
