import fetch from "node-fetch";
import { useEffect } from "react";

function getRewards() {
  return fetch("/api/rewards");
}

export default function Rewards() {
  useEffect(() => {
    getRewards().then((r) => {
      console.log(r);
    });
  });

  return <h1>Rewards</h1>;
}
