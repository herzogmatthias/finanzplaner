// User Service as Singleton
export class UserService {
  private static instance: UserService;
  private static URL = "http://localhost:5200/Login";
  private constructor() {}

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }
  //login method post request to the server with error handling and return error message if login fails
  async login(
    username: string,
    password: string
  ): Promise<{ error: boolean; msg: string }> {
    try {
      const response = await fetch(`${UserService.URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const body = await response.json();
      if (response.ok) {
        localStorage.setItem("jwt", body.token);
        localStorage.setItem("currency", body.claims.CurrencyPreference);
        localStorage.setItem("UserId", body.claims.UserId);
        return { error: false, msg: "Login erfolgreich" };
      } else {
        return { error: true, msg: body.title };
      }
    } catch (error) {
      return { error: true, msg: "Login fehlgeschlagen" };
    }
  }

  async updatePersonalData(
    email: string,
    username: string,
    currency: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:5200/Person/UpdatePerson`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          personId: localStorage.getItem("UserId"),
          email,
          userName: username,
          currencyPreference: currency,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            reject("Error updating personal data.");
          }
          return response.json();
        })
        .then((data) => {
          resolve(data);
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("currency", currency);
        })
        .catch((error) => {
          reject("Error updating personal data.");
        });
    });
  }

  //register method with email, password and username post request to the server with error handling and return error message if registration fails
  async register(
    email: string,
    username: string,
    password: string
  ): Promise<string> {
    try {
      const response = await fetch(`${UserService.URL}/NewUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
          currencyPreference: "EUR",
        }),
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
  setJWT(jwt: string): void {
    localStorage.setItem("jwt", jwt);
  }
  getJWT(): string {
    return localStorage.getItem("jwt") || "";
  }

  getUserId(): string {
    return localStorage.getItem("UserId") || "";
  }

  logout(): void {
    localStorage.removeItem("jwt");
    localStorage.removeItem("currency");
    localStorage.removeItem("UserId");
  }
  async fetchDummyData(): Promise<void> {
    try {
      const response = await fetch(
        "http://localhost:5200/Person/CreateDummyData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.getJWT(),
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch dummy data");
      }
    } catch (error) {
      throw new Error("Failed to fetch dummy data");
    }
  }
}
