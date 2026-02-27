import { Response } from 'express';

export const responseMock = {
  status: jest.fn(),
  send: jest.fn((x) => x),
  json: jest.fn((x) => x),
} as unknown as Response;

// @ts-expect-error ignore type error for mocking response status
responseMock.status.mockImplementation(() => responseMock);
