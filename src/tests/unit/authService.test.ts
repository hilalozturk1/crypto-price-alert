import { registerUser, loginUser } from "../../services/authService";
import { User } from "../../models/user";

jest.mock("../../models/user");

describe("authService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should throw if email already exists", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ email: "test@test.com" });
      await expect(
        registerUser("test", "test@test.com", "password123")
      ).rejects.toThrow("Email already in use");
    });

    it("should create and return user if valid", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue({
        toObject: () => ({
          username: "test",
          email: "test@test.com",
          password: "hashed",
        }),
      });
      const user = await registerUser("test", "test@test.com", "password123");
      expect(user.email).toBe("test@test.com");
      expect(user.password).toBeUndefined();
    });
  });

  describe("loginUser", () => {
    it("should throw if user not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      await expect(
        loginUser("notfound@test.com", "password123")
      ).rejects.toThrow("Invalid credentials");
    });
  });
});