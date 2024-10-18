export interface VerifyEvmBasedResultParams {
  taskId: string;
  uHash: string;
  publicFieldsHash: string;
  validatorAddress: string;
  signature: string;
  message: string;
  allocatorSignature?: string;
  validatorSignature: string;
  // Add any other properties that the TransGate SDK returns
}
