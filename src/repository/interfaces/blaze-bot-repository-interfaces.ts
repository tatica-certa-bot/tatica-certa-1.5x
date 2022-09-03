export interface ICrashResultDto {
  crash_point: string;
  status: string;
  count: number;
  created_at: Date;
}

export interface IInserCrashResult {
  insertCrashResult(crashResult: ICrashResultDto): Promise<void>;
}
