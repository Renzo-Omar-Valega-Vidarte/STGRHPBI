const mockCanvas = document.createElement('canvas');
export default jest.fn(() => Promise.resolve(mockCanvas));

