import { User } from "@/lib/db/schema";

export const mockUsers: User[] = [
  {
    id: 1,
    email: "test@example.com",
    name: "Test User",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "member",
    passwordHash:
      "$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    deletedAt: null,
  },
];
