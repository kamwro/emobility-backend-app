export const authServiceMock = {
  sendConfirmationLink: jest.fn().mockResolvedValue({ message: 'confirmation link has been send' }),
  activateUser: jest.fn().mockResolvedValue({ message: 'user account activated' }),
};
