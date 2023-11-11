export interface ILogObject {
  ipAddress: string;
  remoteUser: string;
  authenticatedUser: string;
  timestamp: string;
  httpReq: { type: string; api: string; http: string };
  httpStatusCode: number;
  responseSize: number;
  referer: string;
  userAgent: string;
}

export type UniqueValuesObject = {
  uniqueVistorsRecord: Record<string, ILogObject[]>;
  uniqueFileRecord: Record<string, ILogObject[]>;
  uniqueReffersRecord: Record<string, ILogObject[]>;
  uniqueDateRecord: Record<string, ILogObject[]>;
};
