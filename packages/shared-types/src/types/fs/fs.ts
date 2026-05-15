export type FileSystemNodeType = "file" | "directory";

export type FileSystemNode = {
  name: string;
  path: string;
  type: FileSystemNodeType;
  size?: number;
  modifiedAt?: string;
};

export type ListDirectoryRequest = {
  path: string;
};

export type ListDirectoryResponse = {
  path: string;
  entries: FileSystemNode[];
};

export type FileSystemErrorResponse = {
  error: string;
  path?: string;
};
