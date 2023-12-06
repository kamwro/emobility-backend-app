export const emailServiceMock = {
  sendEmail: jest.fn().mockResolvedValue({ message: 'email has been sent' }),
};
