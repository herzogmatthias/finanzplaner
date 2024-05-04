// User Service as Singleton
export class UserService {
  private static instance: UserService;
  private constructor() {}

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }
  //login method post request to the server with error handling and return error message if login fails
  async login(username: string, password: string): Promise<string> {
    try {
      const response = await fetch("http://localhost:5200/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        return "";
      } else {
        return "Login failed";
      }
    } catch (error) {
      return "Login failed";
    }
  }

  //register method with email, password and username post request to the server with error handling and return error message if registration fails
  async register(
    email: string,
    username: string,
    password: string
  ): Promise<string> {
    try {
      const response = await fetch("http://localhost:5200/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });
      if (response.ok) {
        return "";
      } else {
        return "Registration failed";
      }
    } catch (error) {
      return "Registration failed";
    }
  }
}
