export interface GenericScheduleEntity {
  title: string;
  timing: string;
}

export function createGenericScheduleEntity(title: string, timing: string): GenericScheduleEntity {
  return {
    title: title,
    timing: timing,
  };
}