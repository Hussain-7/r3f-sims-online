import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { io } from "socket.io-client";

export const socket = io("http://localhost:3001");
export const charactersAtom = atom([]);
export const mapAtom = atom([]);
export const userAtom = atom([]);

export const SocketManager = () => {
  const [_characters, setCharacters] = useAtom(charactersAtom);
  const [_map, setMap] = useAtom(mapAtom);
  const [_user, setUser] = useAtom(userAtom);
  useEffect(() => {
    function onConnect() {
      console.log("connected");
    }
    function onDisconnect() {
      console.log("disconnected");
    }
    function onHello(value) {
      console.log("hello", value);
      setMap(value.map);
      setCharacters(value.characters);
      setUser(value.id);
    }
    function onCharacters(value) {
      setCharacters(value);
    }

    socket.on("connect", onConnect);
    socket.on("hello", onHello);
    socket.on("disconnect", onDisconnect);
    socket.on("characters", onCharacters);
    return () => {
      socket.off("connect", onConnect);
      socket.off("hello", onHello);
      socket.off("disconnect", onDisconnect);
      socket.off("characters", onCharacters);
    };
  }, []);
};
