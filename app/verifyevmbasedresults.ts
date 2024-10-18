import Web3 from "web3";
const web3 = new Web3();
const EVMTaskAllocator = "0x19a567b3b212a5b35bA0E3B600FbEd5c2eE9083d";

interface VerifyEvmBasedResultParams {
  taskId: string;
  uHash: string;
  publicFieldsHash: string;
  validatorAddress: string;
  allocatorSignature: string | undefined; // Handle potential undefined values
  validatorSignature: string | undefined; // Handle potential undefined values
}

const verifyEvmBasedResult = async (res: VerifyEvmBasedResultParams, schemaId: string) => {
  try {
    const { taskId, uHash, publicFieldsHash, validatorAddress, allocatorSignature, validatorSignature } = res;

    // Ensure that both signatures are provided before proceeding
    if (!allocatorSignature || !validatorSignature) {
      throw new Error('Missing allocator or validator signature');
    }

    // Step 1: Verify Allocator Signature
    const taskIdHex = Web3.utils.stringToHex(taskId);
    const schemaIdHex = Web3.utils.stringToHex(schemaId);

    const allocatorParams = web3.eth.abi.encodeParameters(
      ["bytes32", "bytes32", "address"],
      [taskIdHex, schemaIdHex, validatorAddress]
    );
    const allocatorParamsHash = Web3.utils.soliditySha3(allocatorParams);
    
    // Recover and verify the allocator's address
    const signedAllocatorAddress = web3.eth.accounts.recover(allocatorParamsHash as string, allocatorSignature) ;
    const isAllocatorValid = signedAllocatorAddress === EVMTaskAllocator;
    console.log(`Allocator Signature Valid: ${isAllocatorValid}`);

    // Step 2: Verify Validator Signature
    const validatorParams = web3.eth.abi.encodeParameters(
      ["bytes32", "bytes32", "bytes32", "bytes32"],
      [taskIdHex, schemaIdHex, uHash, publicFieldsHash]
    );
    const validatorParamsHash = Web3.utils.soliditySha3(validatorParams);
    
    // Recover and verify the validator's address
    const signedValidatorAddress = web3.eth.accounts.recover(validatorParamsHash as string, validatorSignature);
    const isValidatorValid = signedValidatorAddress === validatorAddress;
    console.log(`Validator Signature Valid: ${isValidatorValid}`);

    return {
      isAllocatorValid,
      isValidatorValid,
    };
    
  } catch (error ) {
    console.error("Verification failed", error);
    return {
      isAllocatorValid: false,
      isValidatorValid: false,
      error: (error as any).message,
    };
  }
};

export default verifyEvmBasedResult;
