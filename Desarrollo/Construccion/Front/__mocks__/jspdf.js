// __mocks__/jspdf.js
const jsPDFMock = jest.fn().mockImplementation(() => ({
  save: jest.fn(),
}));

export default jsPDFMock;
