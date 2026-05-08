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
  type PromptInputMessage,
} from "../ai-elements/prompt-input";
import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "../ai-elements/attachments";
import { useAgentsContext } from "@/contexts/AgentsContext";
import type { AgentMessage } from "@earendil-works/pi-agent-core";
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
} from "@earendil-works/pi-ai";
import AgentChatMessage from "./agent-chat-message/AgentChatMessage";
import { TypographyP } from "../ui/typography/TypographyP";
import {
  AgentsSessionProvider,
  useAgentsSession,
} from "@/contexts/AgentsSessionContext";

const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments();
  if (attachments.files.length === 0) {
    return null;
  }

  console.log("attachments", attachments);

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

const AgentChat = ({ sessionId }: { sessionId: string }) => {
  const { promptSession } = useAgentsContext();
  const { session } = useAgentsSession();
  const { messages, tools, model, thinkingLevel } = session ?? {};
  const [text, setText] = useState<string>("");
  const [toolResults, setToolResults] = useState<
    Record<string, ToolResultMessage>
  >({});
  // const [model, setModel] = useState<string>(models[0].id);
  // const [messages, setMessages] = useState([]);
  // const [status, setStatus] = useState("idle");
  console.log("session", session);

  const handlePromptSession = async (message: PromptInputMessage) => {
    console.log("message123", message);
    if (session) {
      setText("");
      const images: ImageContent[] = [];
      message.files.forEach((file) => {
        console.log("file", file);
        if (file.mediaType.includes("image/")) {
          console.log("image file", file);
          images.push({
            type: "image",
            data: file.url.slice(file.url.indexOf(",") + 1),
            // data: file.url,
            mimeType: file.mediaType,
            // source: {
            //   type: "base64",
            // },
          });
        } else {
          console.log("other file", file);
        }
      });
      console.log("images", images);
      await promptSession(session.sessionId, text, { images });
    }
  };

  useEffect(() => {
    if (messages) {
      const newToolResults = {} as Record<string, ToolResultMessage>;
      messages.forEach((message) => {
        if (message.role === "toolResult") {
          newToolResults[message.toolCallId] = message;
        }
      });
      setToolResults(newToolResults);
    }
  }, [messages, session]);

  console.log("AgentChat - session", session);

  if (session === null) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <TypographyP text="Loading session..." />
      </div>
    );
  }

  // return <div>asdf</div>;

  return (
    <div id="AgentChat" className="w-full h-full flex flex-col">
      {/* <AgentChatTextBox /> */}
      <div className="mx-auto p-6 relative w-full rounded-lg grow-1 h-full">
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
                    {/* <PromptInputActionAddScreenshot /> */}
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

const AgentChatWrapper = ({ sessionId }: { sessionId: string }) => {
  console.log("AgentChatWrapper - sessionId", sessionId);
  return (
    <AgentsSessionProvider sessionId={sessionId}>
      <AgentChat sessionId={sessionId} />
    </AgentsSessionProvider>
  );
};

export default AgentChatWrapper;
