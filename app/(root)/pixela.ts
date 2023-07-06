export class PixelaClient {
  username: string;
  graphID: string;
  token: string;
  private baseUrl: string = "https://pixe.la";

  constructor(username: string, graphID: string, token: string) {
    if (!this.isValidUsername(username)) {
      throw new Error(
        `Invalid username. Username must match the pattern /^[a-z][a-z0-9-]{1,32}$/`
      );
    }

    if (!this.isValidGraphID(graphID)) {
      throw new Error(
        `Invalid graph ID. Graph ID must match the pattern /^[a-z][a-z0-9-]{1,16}$/`
      );
    }

    if (!this.isValidToken(token)) {
      throw new Error(
        `Invalid token. Token must match the pattern /^[ -~]{8,128}$/`
      );
    }

    this.username = username;
    this.graphID = graphID;
    this.token = token;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  isValidUsername(username: string): boolean {
    const regex = /^[a-z][a-z0-9-]{1,32}$/;
    return regex.test(username);
  }

  isValidGraphID(graphID: string): boolean {
    const regex = /^[a-z][a-z0-9-]{1,16}$/;
    return regex.test(graphID);
  }

  isValidToken(token: string): boolean {
    const regex = /^[ -~]{8,128}$/;
    return regex.test(token);
  }

  private async requestWithRetry<T>(
    url: string,
    options: RequestInit,
    retryCount: number = 0
  ): Promise<T> {
    const maxRetryCount = 5;

    try {
      const response = await fetch(`${this.baseUrl}${url}`, options);
      if (response.ok) {
        return response.json();
      }
      if (response.status === 503) {
        const responseData = await response.json();
        if (responseData.isRejected) {
          if (retryCount < maxRetryCount) {
            await this.delay(300);
            return this.requestWithRetry(url, options, retryCount + 1); // 再帰的にリクエストを行う
          }
          throw new Error("Exceeded maximum retry count");
        }
        throw new Error("Request failed");
      }
      throw new Error("Request failed");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Request failed: ${error.message}`);
      } else {
        throw new Error(`Request failed`);
      }
    }
  }

  async increment(): Promise<IncrementResponse> {
    const url = `/v1/users/${this.username}/graphs/${this.graphID}/increment`;

    const headers = new Headers();
    headers.append("X-USER-TOKEN", this.token);
    headers.append("Content-Length", "0");

    const options: RequestInit = {
      method: "PUT",
      headers,
      body: "",
    };

    try {
      return this.requestWithRetry<IncrementResponse>(url, options);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to increment: ${error.message}`);
      }
      throw new Error(`Failed to increment`);
    }
  }

  async getPixels(from?: string): Promise<Pixel[]> {
    const url = `/v1/users/${this.username}/graphs/${this.graphID}/pixels`;

    const params = new URLSearchParams();
    if (from) {
      params.append("from", from);
    }
    params.append("withBody", "true");

    const headers = new Headers();
    headers.append("X-USER-TOKEN", this.token);

    const options: RequestInit = {
      method: "GET",
      headers,
    };

    try {
      const response = await this.requestWithRetry<GetPixelsResponse>(
        `${url}?${params.toString()}`,
        options
      );
      return response.pixels;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to get pixels: ${error.message}`);
      }
      throw new Error(`Failed to get pixels`);
    }
  }
}

type IncrementResponse = {
  message: string;
  isSuccess: boolean;
};

type GetPixelsResponse = {
  pixels: Pixel[];
};

type Pixel = {
  date: string;
  quantity: string;
};
