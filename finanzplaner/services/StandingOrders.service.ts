import { IStandingOrder } from "@/models/IStandingOrder";

export class StandingOrdersService {
  private static instance: StandingOrdersService;
  private static URL = "http://localhost:5200/StandingOrder/user/";
  private constructor() {}
  static getInstance(): StandingOrdersService {
    if (!StandingOrdersService.instance) {
      StandingOrdersService.instance = new StandingOrdersService();
    }
    return StandingOrdersService.instance;
  }

  fetchStandingOrders(): Promise<IStandingOrder[]> {
    return new Promise((resolve, reject) => {
      fetch(StandingOrdersService.URL + "allstandingOrders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Error fetching standing orders.");
          }
        })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject("Error fetching standing orders.");
        });
    });
  }
}
