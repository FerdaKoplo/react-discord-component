export interface DiscordClusterConfig {
  webhookUrl: string;
  botToken: string;
  channelId: string;
}

export interface DiscordGatewayPayload {
  op: number;
  t?: string | null;
  d?: unknown;
}

export interface HelloPayload {
  heartbeat_interval: number;
}

export interface MessageCreatePayload {
  channel_id: string;
  webhook_id?: string;
  content: string;
}

export interface DiscordStore<T> {
  state: T;
  setDiscordState: (newState: T) => Promise<void>;
}

export interface MyAppState {
  count: number;
  user: string;
}
