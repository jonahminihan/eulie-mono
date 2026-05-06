import { useEffect, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "../ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "../ai-elements/message";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "../ai-elements/prompt-input";
import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "../ai-elements/attachments";
import { useAgentsContext } from "@/contexts/AgentsContext";
import type { AgentMessage } from "@mariozechner/pi-agent-core";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "../ai-elements/tool";
import type { ChatStatus, ToolUIPart } from "ai";
import type {
  ImageContent,
  TextContent,
  ThinkingContent,
  ToolCall,
  ToolResultMessage,
} from "@mariozechner/pi-ai";
import AgentChatMessage from "./agent-chat-message/AgentChatMessage";
import { TypographyP } from "../ui/typography/TypographyP";

const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments();
  if (attachments.files.length === 0) {
    return null;
  }
  return (
    <Attachments variant="inline">
      {attachments.files.map((attachment) => (
        <Attachment
          data={attachment}
          key={attachment.id}
          onRemove={() => attachments.remove(attachment.id)}
        >
          <AttachmentPreview />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  );
};

const models = [
  { id: "gpt-4o", name: "GPT-4o" },
  { id: "claude-opus-4-20250514", name: "Claude 4 Opus" },
];

const AgentChat = () => {
  const { activeSession, promptSession } = useAgentsContext();
  const { messages, tools, model, thinkingLevel } = activeSession ?? {};
  const [text, setText] = useState<string>("");
  const [toolResults, setToolResults] = useState<
    Record<string, ToolResultMessage>
  >({});
  // const [model, setModel] = useState<string>(models[0].id);
  // const [messages, setMessages] = useState([]);
  // const [status, setStatus] = useState("idle");
  console.log("activeSession", activeSession);

  const handlePromptSession = async () => {
    if (activeSession) {
      setText("");
      await promptSession(activeSession.sessionId, text);
    }
  };

  useEffect(() => {
    console.log("messages", messages);
    if (messages) {
      const newToolResults = {} as Record<string, ToolResultMessage>;
      messages.forEach((message) => {
        if (message.role === "toolResult") {
          newToolResults[message.toolCallId] = message;
        }
      });
      setToolResults(newToolResults);
    }
  }, [messages, activeSession]);

  if (activeSession === null) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <TypographyP text="No session selected" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* <AgentChatTextBox /> */}
      <div className="mx-auto p-6 relative w-full rounded-lg border grow-1 h-full">
        <div className="flex flex-col h-full">
          <Conversation>
            <ConversationContent>
              {messages?.map((message, index) => (
                <AgentChatMessage
                  message={message}
                  index={index}
                  toolResults={toolResults}
                />
                // <Message
                //   from={getMessageFrom(message.role)}
                //   key={`${index}-${message.timestamp}`}
                //   className="text-left"
                // >
                //   <MessageContent>
                //     {typeof message.content === "string" ? (
                //       <MessageResponse
                //         key={`message-${index}-${message.timestamp}`}
                //       >
                //         {message.content}
                //       </MessageResponse>
                //     ) : (
                //       (
                //         message.content as (
                //           | TextContent
                //           | ImageContent
                //           | ThinkingContent
                //           | ToolCall
                //         )[]
                //       ).map((part, i) => {
                //         switch (part.type) {
                //           case "toolCall":
                //             return (
                //               <Tool>
                //                 <ToolHeader
                //                   state={
                //                     toolResults[part.id]
                //                       ? "output-available"
                //                       : "approval-responded"
                //                   }
                //                   title={part.name}
                //                   type={`tool-${part.name}`}
                //                 />
                //                 <ToolContent>
                //                   <ToolInput input={part.arguments} />
                //                   <ToolOutput
                //                     output={
                //                       toolResults[part.id]?.content.length > 0
                //                         ? (
                //                             toolResults[part.id]
                //                               ?.content[0] as TextContent
                //                           ).text
                //                         : ""
                //                     }
                //                     errorText={""}
                //                   />
                //                 </ToolContent>
                //               </Tool>
                //             );
                //           case "text":
                //           default:
                //             return (
                //               <MessageResponse
                //                 key={`message-${index}-${message.timestamp}-${i}`}
                //               >
                //                 {message.role !== "toolResult" && "text" in part
                //                   ? part.text
                //                   : ""}
                //               </MessageResponse>
                //             );
                //         }
                //       })
                //     )}
                //   </MessageContent>
                // </Message>
              ))}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
          <PromptInput
            onSubmit={handlePromptSession}
            className="mt-4"
            globalDrop
            multiple
          >
            <PromptInputHeader>
              <PromptInputAttachmentsDisplay />
            </PromptInputHeader>
            <PromptInputBody>
              <PromptInputTextarea
                onChange={(e) => setText(e.target.value)}
                value={text}
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools>
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger />
                  <PromptInputActionMenuContent>
                    <PromptInputActionAddAttachments />
                    <PromptInputActionAddScreenshot />
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>
                {/* <PromptInputButton
                onClick={() => setUseWebSearch(!useWebSearch)}
                tooltip={{ content: "Search the web", shortcut: "⌘K" }}
                variant={useWebSearch ? "default" : "ghost"}
              >
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton> */}
                {/* <PromptInputSelect
                  onValueChange={(value) => {
                    setModel(value);
                  }}
                  value={model}
                >
                  <PromptInputSelectTrigger>
                    <PromptInputSelectValue />
                  </PromptInputSelectTrigger>
                  <PromptInputSelectContent>
                    {models.map((model) => (
                      <PromptInputSelectItem key={model.id} value={model.id}>
                        {model.name}
                      </PromptInputSelectItem>
                    ))}
                  </PromptInputSelectContent>
                </PromptInputSelect> */}
              </PromptInputTools>
              <PromptInputSubmit
                disabled={!text && !status}
                status={status as ChatStatus}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
};

export default AgentChat;
