import React, { useState } from "react";
import { socket } from "../network/socket";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";
import { useAppContext } from "../context/AppContext";

export default function PrivatePhaseInfoPanel() {
  const { userState } = useAppContext();
  const { privatePhaseData } = userState;
  const { message } = privatePhaseData;

  return (
    <div className="mb-6 p-4 border border-indigo-500 rounded bg-indigo-50 shadow">
      <h2 className="text-xl font-bold mb-4 text-indigo-700">پیام مخفی شما</h2>

      {message && (
        <div className="mb-4 p-3 bg-white rounded border border-gray-300 text-gray-800 shadow-inner">
          {message}
        </div>
      )}
    </div>
  );
}
