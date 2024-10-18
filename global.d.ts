// global.d.ts
interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string }) => Promise<any>;
      // You can add other properties/methods you expect from the ethereum object
    };
  }
  