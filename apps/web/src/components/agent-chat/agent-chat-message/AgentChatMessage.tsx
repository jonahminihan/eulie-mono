import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import type { AgentMessage } from "@earendil-works/pi-agent-core";
import type {
  ImageContent,
  TextContent,
  ThinkingContent,
  ToolCall,
  ToolResultMessage,
} from "@earendil-works/pi-ai";

const getMessageFrom = (role: string) => {
  switch (role) {
    case "user":
      return "user";
    case "assistant":
      return "assistant";
    case "toolResult":
      return "system";
    default:
      console.error(
        `Unknown message role: ${role}. Falling back to assistant.`,
      );
      return "assistant";
  }
};

const createCustomToolHeaderMessage = (content: ToolCall) => {
  switch (content.name) {
    case "read":
      return `read - ${content.arguments.path}`;
    case "write":
      return `write - ${content.arguments.path}`;
    case "bash":
      return `bash - ${content.arguments.command}`;
    default:
      return content.name;
  }
};

const AgentChatMessage = ({
  message,
  index,
  toolResults,
}: {
  message: AgentMessage;
  index: number;
  toolResults: Record<string, ToolResultMessage>;
}) => {
  if (!("content" in message)) {
    console.error(`Missing content property on message: ${message}.`);
    return <div>Missing content property on message.</div>;
  }

  if (message.role === "toolResult") {
    return;
  }

  return (
    <Message
      from={getMessageFrom(message.role)}
      key={`${index}-${message.timestamp}`}
      className="text-left"
    >
      <MessageContent className="w-full">
        {typeof message.content === "string" ? (
          <MessageResponse key={`message-${index}-${message.timestamp}`}>
            {message.content}
          </MessageResponse>
        ) : (
          (
            message.content as (
              | TextContent
              | ImageContent
              | ThinkingContent
              | ToolCall
            )[]
          ).map((part, i) => {
            switch (part.type) {
              case "toolCall":
                return (
                  <Tool className="w-full">
                    <ToolHeader
                      state={
                        toolResults[part.id]
                          ? "output-available"
                          : "approval-responded"
                      }
                      title={createCustomToolHeaderMessage(part)}
                      type={`tool-${part.name}`}
                    />
                    <ToolContent>
                      <ToolInput input={part.arguments} />
                      <ToolOutput
                        output={
                          toolResults[part.id]?.content.length > 0
                            ? (toolResults[part.id]?.content[0] as TextContent)
                                .text
                            : ""
                        }
                        errorText={""}
                      />
                    </ToolContent>
                  </Tool>
                );
              case "thinking":
                return (
                  <Reasoning className="w-full">
                    <ReasoningTrigger />
                    <ReasoningContent>{part.thinking}</ReasoningContent>
                  </Reasoning>
                );
              case "text":
              default:
                return (
                  <MessageResponse
                    key={`message-${index}-${message.timestamp}-${i}`}
                  >
                    {"text" in part ? part.text : ""}
                  </MessageResponse>
                );
            }
          })
        )}
      </MessageContent>
    </Message>
  );
};

export default AgentChatMessage;
