export * from "./src/types";
export * from "./src/classifier";
export { AnthropicClient } from "./src/anthropic-client";

// 편의 함수들
export { createClassifier } from "./src/classifier";

// Export convenience function
import { AnthropicClient } from "./src/anthropic-client";
import type { AIClassificationResult } from "./src/types";

export async function classifyComplaint(
  content: string,
  citizenName?: string
): Promise<AIClassificationResult> {
  const client = new AnthropicClient();
  return client.classifyComplaint(content, citizenName);
}