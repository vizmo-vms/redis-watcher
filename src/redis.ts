import Redis, { RedisOptions, ClusterNode, ClusterOptions, Cluster } from 'ioredis';

export interface Connection {
  close(): void;

  getRedisClient(): Promise<Redis | Cluster>;
}

export class RedisConnection implements Connection {
  private readonly options?: RedisOptions | string;
  private redisClient: Redis;

  constructor(options?: RedisOptions | string) {
    this.options = options;
    // @ts-ignore - it works fine.
    this.redisClient = new Redis(this.options);
  }

  public close() {
    this.redisClient.disconnect();
  }

  public async getRedisClient(): Promise<Redis> {
    return this.redisClient;
  }
}

export class RedisClusterConnection implements Connection {
  private readonly options?: ClusterOptions;
  public redisClient: Cluster;
  public nodes: ClusterNode[];

  constructor(nodes: ClusterNode[] = [], options: ClusterOptions = {}) {
    this.nodes = nodes;
    this.options = options;
    this.redisClient = new Redis.Cluster(this.nodes, this.options);
  }

  public close() {
    this.redisClient.disconnect();
  }

  public async getRedisClient(): Promise<Cluster> {
    return this.redisClient;
  }
}
