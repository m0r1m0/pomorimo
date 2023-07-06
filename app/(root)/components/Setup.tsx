import { useState } from "react";
import { Button } from "../../components/Button";

export type Setting = {
  username: string;
  graphID: string;
  token: string;
};

type Props = {
  className?: string;
  onSetup: (setting: Setting) => void;
};

export function Setup({ onSetup }: Props) {
  const [username, setUsername] = useState("");
  const [graphID, setGraphID] = useState("");
  const [token, setToken] = useState("");

  return (
    <div className={`flex flex-col`}>
      <div className="flex flex-col">
        <label className="block text-sm font-bold mb-2" htmlFor="username">
          username
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          type="text"
          placeholder="username"
          onChange={(v) => {
            setUsername(v.target.value);
          }}
        />
      </div>
      <div className="flex flex-col mt-4">
        <label className="block text-sm font-bold mb-2" htmlFor="graphid">
          graphID
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="graphid"
          type="text"
          placeholder="graphID"
          onChange={(v) => {
            setGraphID(v.target.value);
          }}
        />
      </div>
      <div className="flex flex-col mt-4">
        <label className="block text-sm font-bold mb-2" htmlFor="token">
          token
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="token"
          type="password"
          placeholder="token"
          onChange={(v) => {
            setToken(v.target.value);
          }}
        />
      </div>
      <Button
        className="mt-8"
        size="lg"
        onClick={() => {
          onSetup({
            username,
            graphID,
            token,
          });
        }}
      >
        Initialize Pixela
      </Button>
    </div>
  );
}
