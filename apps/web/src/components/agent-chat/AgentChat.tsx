import { useEffect, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "../ai-elements/conversation";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
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

import type { ChatStatus } from "ai";
import type { ImageContent, ToolResultMessage } from "@earendil-works/pi-ai";
import AgentChatMessage from "./agent-chat-message/AgentChatMessage";
import { TypographyP } from "../ui/typography/TypographyP";

import "./AgentChat.module.css";
import { useAgentsWSContext } from "@/contexts/AgentsContextWS";
import type { AvailableModelsResponse } from "shared-types";
import {
  AgentsSessionWSProvider,
  useAgentsSessionWSContext,
} from "@/contexts/AgentsSessionWSContext";

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

// const models = [
//   { id: "gpt-4o", name: "GPT-4o" },
//   { id: "claude-opus-4-20250514", name: "Claude 4 Opus" },
// ];

const AgentChat = () => {
  const { getAvailableModels, promptSession, setModel, setThinkingLevel } =
    useAgentsWSContext();
  const { session } = useAgentsSessionWSContext();
  const { messages } = session ?? {};
  const [text, setText] = useState<string>("");
  const [toolResults, setToolResults] = useState<
    Record<string, ToolResultMessage>
  >({});
  const [availableModels, setAvailableModels] =
    useState<AvailableModelsResponse>({});
  const [selectedModelKey, setSelectedModelKey] = useState<string>("");
  const [selectedThinkingLevel, setSelectedThinkingLevel] =
    useState<string>("off");
  const status = "idle";
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
            mimeType: file.mediaType,
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

  useEffect(() => {
    if (!session) return;

    getAvailableModels().then((models) => {
      setAvailableModels(models);
    });
  }, [session?.sessionId]);

  useEffect(() => {
    if (session?.model) {
      setSelectedModelKey(`${session.model.provider}/${session.model.id}`);
      setSelectedThinkingLevel(session.thinkingLevel);
    }
  }, [session?.model, session?.thinkingLevel]);

  const modelOptions = Object.values(availableModels);
  const selectedModel = availableModels[selectedModelKey];
  const thinkingOptions = selectedModel?.thinkingLevels ?? [];

  const handleModelChange = async (modelKey: string) => {
    if (!session) return;
    const response = await setModel(session.sessionId, modelKey);
    if (response.model) {
      setSelectedModelKey(`${response.model.provider}/${response.model.id}`);
    }
    setSelectedThinkingLevel(response.thinkingLevel);
  };

  const handleThinkingLevelChange = async (thinkingLevel: string) => {
    if (!session) return;
    const response = await setThinkingLevel(session.sessionId, thinkingLevel);
    if (response.model) {
      setSelectedModelKey(`${response.model.provider}/${response.model.id}`);
    }
    setSelectedThinkingLevel(response.thinkingLevel);
  };

  console.log("AgentChat - session", session);

  if (session === null) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <TypographyP text="Loading session..." />
      </div>
    );
  }

  return (
    <div id="AgentChat" className={`w-full h-full flex flex-col`}>
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
                <PromptInputSelect
                  disabled={modelOptions.length === 0}
                  onValueChange={(value) => handleModelChange(String(value))}
                  value={selectedModelKey}
                >
                  <PromptInputSelectTrigger>
                    <PromptInputSelectValue placeholder="Model" />
                  </PromptInputSelectTrigger>
                  <PromptInputSelectContent>
                    {modelOptions.map((model) => (
                      <PromptInputSelectItem key={model.key} value={model.key}>
                        {model.name}
                      </PromptInputSelectItem>
                    ))}
                  </PromptInputSelectContent>
                </PromptInputSelect>
                <PromptInputSelect
                  disabled={thinkingOptions.length === 0}
                  onValueChange={(value) =>
                    handleThinkingLevelChange(String(value))
                  }
                  value={selectedThinkingLevel}
                >
                  <PromptInputSelectTrigger>
                    <PromptInputSelectValue placeholder="Thinking" />
                  </PromptInputSelectTrigger>
                  <PromptInputSelectContent>
                    {thinkingOptions.map((thinkingLevel) => (
                      <PromptInputSelectItem
                        key={thinkingLevel}
                        value={thinkingLevel}
                      >
                        {thinkingLevel}
                      </PromptInputSelectItem>
                    ))}
                  </PromptInputSelectContent>
                </PromptInputSelect>
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
    <AgentsSessionWSProvider sessionId={sessionId}>
      <AgentChat />
    </AgentsSessionWSProvider>
  );
};

export default AgentChatWrapper;
