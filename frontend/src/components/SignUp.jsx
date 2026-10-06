import { useState } from "react";
import { API } from "../api/api";
import { toast } from "react-toastify";
import { FiCopy } from "react-icons/fi";
import Input from "./Input";

const Signup = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [generatedUserId, setGeneratedUserId] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("Please enter password");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(API.SIGNUP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Signup failed");
        return;
      }

      setGeneratedUserId(data.userId);
      setPassword("");
      setConfirmPassword("");

      toast.success("Signup successful");
    } catch (error) {
      console.error("SIGNUP ERROR:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (generatedUserId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
          <h2 className="mb-4 text-center text-2xl font-semibold text-gray-800">
            Your ID
          </h2>

          <div className="flex justify-between rounded-lg border border-blue-500 bg-blue-50 p-4 text-center">
            <p className="break-all text-xl font-semibold tracking-wider text-blue-600">
              {generatedUserId}
            </p>
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(generatedUserId);
                toast.success("User ID copied");
              }}
              className="bg-transparent rounded-md bg-gray-200 text-blue-700 cursor-pointer">
              <FiCopy size={18} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onSuccess(generatedUserId)}
            disabled={saving}
            className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700">
            {saving ? "Saving..." : "Continue"}
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 flex text-sm font-medium text-gray-700">
              Password
            </label>

            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your Password"
              required
            />
          </div>

          <div>
            <label className="mb-2 flex text-sm font-medium text-gray-700">
              Confirm Password
            </label>

              <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your Password"
              required
            />
          </div>

          <div className="flex gap-4 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg border border-gray-500 py-3 font-medium text-gray-700 hover:bg-gray-100">
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;