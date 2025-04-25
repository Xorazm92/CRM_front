// Universal utility for extracting the correct entity ID from any object
export function getEntityId(entity: any): string | undefined {
  return (
    entity?.user_id ||
    entity?.group_id ||
    entity?.course_id ||
    entity?.teacher_id ||
    entity?.student_id ||
    entity?.id ||
    entity?._id
  );
}
